"""Router for locality features and 12-month observed market context."""

from datetime import datetime, timedelta
from typing import Optional, Dict
import numpy as np
import pandas as pd
from fastapi import APIRouter, Query, HTTPException

from app.geo import find_canonical_locality
from app.loader import data_store, VALID_LOCALITIES
from app.models import (
    LocalityResponse,
    LocalityItem,
    LocalityMarketContext,
    ObservedPropertyTypeStats,
    derive_source_type,
    DISCLAIMER_TEXT,
)

router = APIRouter(prefix="/api", tags=["locality"])


def _compute_market_context(locality_name: str, ref_date: datetime) -> LocalityMarketContext:
    """Computes descriptive 12-month transaction and listing statistics per property type.

    NOTE: Purely descriptive observations; not a valuation model.
    """
    cutoff_date = (ref_date - timedelta(days=365)).strftime("%Y-%m-%d")

    tx_df = data_store.transactions
    ls_df = data_store.listings

    # Filter for locality
    loc_tx = tx_df[(tx_df["locality"].str.lower() == locality_name.lower()) & (tx_df["date"] >= cutoff_date)]
    loc_ls = ls_df[(ls_df["locality"].str.lower() == locality_name.lower()) & (ls_df["date"] >= cutoff_date)]

    tx_count = len(loc_tx)
    ls_count = len(loc_ls)

    by_prop: Dict[str, ObservedPropertyTypeStats] = {}

    # Unique property types across the 12-month period in this locality
    all_props = set(loc_tx["property_type"].unique()) | set(loc_ls["property_type"].unique())

    for pt in sorted(all_props):
        sub_tx = loc_tx[loc_tx["property_type"] == pt]
        sub_ls = loc_ls[loc_ls["property_type"] == pt]

        # Combine rates to compute observed price per sqft
        rates = []
        if not sub_tx.empty:
            rates.extend((sub_tx["sale_price"] / sub_tx["area_sqft"]).tolist())
        if not sub_ls.empty:
            rates.extend((sub_ls["asking_price"] / sub_ls["area_sqft"]).tolist())

        total_records = len(sub_tx) + len(sub_ls)
        if rates:
            by_prop[pt] = ObservedPropertyTypeStats(
                count=total_records,
                min_price_per_sqft=round(float(np.min(rates)), 1),
                median_price_per_sqft=round(float(np.median(rates)), 1),
                max_price_per_sqft=round(float(np.max(rates)), 1),
            )
        else:
            by_prop[pt] = ObservedPropertyTypeStats(count=0)

    return LocalityMarketContext(
        transaction_count=tx_count,
        listing_count=ls_count,
        by_property_type=by_prop,
    )


@router.get("/locality", response_model=LocalityResponse)
def get_locality(
    locality: Optional[str] = Query(None, description="Locality name (omit for all known localities)"),
):
    """Retrieve locality infrastructure features and recent 12-month observed market context.

    Returns 404 with list of known localities if an unknown locality is requested.
    """
    sorted_known = sorted(list(VALID_LOCALITIES))
    lf_df = data_store.locality_features

    ref_date = datetime(2026, 9, 1)

    if locality is not None and locality.strip():
        canonical = find_canonical_locality(locality)
        if not canonical:
            raise HTTPException(
                status_code=404,
                detail={
                    "message": f"Locality '{locality}' not found.",
                    "known_localities": sorted_known,
                },
            )
        matched_df = lf_df[lf_df["locality"].str.lower() == canonical.lower()]
    else:
        matched_df = lf_df

    locality_items = []
    for _, row in matched_df.iterrows():
        loc_name = str(row["locality"])
        market_ctx = _compute_market_context(loc_name, ref_date)

        locality_items.append(
            LocalityItem(
                locality=loc_name,
                schools_count=int(row["schools_count"]),
                hospitals_count=int(row["hospitals_count"]),
                markets_count=int(row["markets_count"]),
                food_places_count=int(row["food_places_count"]),
                highway_distance_km=float(row["highway_distance_km"]),
                railway_distance_km=float(row["railway_distance_km"]),
                pollution_level=str(row["pollution_level"]),
                source=str(row["source"]),
                market_context=market_ctx,
            )
        )

    sources = [item.source for item in locality_items]
    source_type = derive_source_type(sources)

    return LocalityResponse(
        count=len(locality_items),
        source_type=source_type,
        disclaimer=DISCLAIMER_TEXT,
        localities=locality_items,
    )
