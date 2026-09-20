"""Routers for price trends, data quality panel, metadata, and health check."""

from datetime import datetime
from typing import Optional, List, Dict
import pandas as pd
from fastapi import APIRouter, Query, HTTPException

from app.geo import find_canonical_locality, resolve_coordinates, haversine_distance
from app.loader import (
    data_store,
    VALID_LOCALITIES,
    VALID_PROPERTY_TYPES,
    VALID_AMENITY_TYPES,
    VALID_POLLUTION_LEVELS,
)
from app.models import (
    PriceTrendResponse,
    YearTrendItem,
    DataQualityResponse,
    MetaResponse,
    HealthResponse,
    derive_source_type,
    DISCLAIMER_TEXT,
)

router = APIRouter(prefix="", tags=["trends_and_meta"])


@router.get("/api/price-trend", response_model=PriceTrendResponse)
def get_price_trend(
    locality: str = Query(..., description="Locality name"),
    property_type: Optional[str] = Query(None, description="Optional property type filter"),
    years: int = Query(4, ge=1, le=10, description="Number of historical years (default 4)"),
):
    """Returns observed yearly average price_per_sqft from transactions only.

    NOTE: Descriptive historical averages. Years with <3 transactions are flagged 'sparse'.
    """
    canonical = find_canonical_locality(locality)
    if not canonical:
        raise HTTPException(
            status_code=404,
            detail={
                "message": f"Locality '{locality}' not found.",
                "known_localities": sorted(list(VALID_LOCALITIES)),
            },
        )

    clean_ptype = None
    if property_type:
        clean_ptype = property_type.strip().lower()
        if clean_ptype not in VALID_PROPERTY_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid property_type '{property_type}'. Valid: {sorted(list(VALID_PROPERTY_TYPES))}",
            )

    tx_df = data_store.transactions
    matched = tx_df[tx_df["locality"].str.lower() == canonical.lower()].copy()

    if clean_ptype:
        matched = matched[matched["property_type"] == clean_ptype]

    # Reference year
    curr_year = 2026
    start_year = curr_year - years + 1
    year_range = list(range(start_year, curr_year + 1))

    matched["year"] = pd.to_datetime(matched["date"]).dt.year
    matched["rate"] = matched["sale_price"] / matched["area_sqft"]

    trend_items: List[YearTrendItem] = []
    for yr in year_range:
        yr_df = matched[matched["year"] == yr]
        count = len(yr_df)
        avg_rate = round(float(yr_df["rate"].mean()), 1) if count > 0 else None
        is_sparse = count < 3

        trend_items.append(
            YearTrendItem(
                year=yr,
                avg_price_per_sqft=avg_rate,
                transaction_count=count,
                sparse=is_sparse,
            )
        )

    sources = matched["source"].tolist() if not matched.empty else ["DEMO"]
    source_type = derive_source_type(sources)

    return PriceTrendResponse(
        locality=canonical,
        property_type=clean_ptype,
        source_type=source_type,
        disclaimer=DISCLAIMER_TEXT,
        trend=trend_items,
    )


@router.get("/api/data-quality", response_model=DataQualityResponse)
def get_data_quality(
    location: str = Query(..., description="Locality name or coordinates"),
    property_type: str = Query(..., description="Property type"),
    area: float = Query(..., gt=0, description="Subject property area in sqft"),
):
    """Calculates data availability metrics and heuristic quality indicator.

    Thresholds:
    - Limited: < 5 total comparables
    - Moderate: 5–9 total comparables
    - Good: >= 10 total comparables
    """
    clean_ptype = property_type.strip().lower()
    if clean_ptype not in VALID_PROPERTY_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid property_type '{property_type}'. Valid: {sorted(list(VALID_PROPERTY_TYPES))}",
        )

    try:
        ref_lat, ref_lon, ref_name = resolve_coordinates(location=location)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Standard tolerance 0.25 and 5 km radius
    min_area = area * 0.75
    max_area = area * 1.25
    rad = 5.0

    # Count matching transactions
    tx_df = data_store.transactions
    matching_tx = 0
    tx_sources = []
    if not tx_df.empty:
        for _, row in tx_df.iterrows():
            if row["property_type"] != clean_ptype:
                continue
            if not (min_area <= row["area_sqft"] <= max_area):
                continue
            dist = haversine_distance(ref_lat, ref_lon, row["latitude"], row["longitude"])
            if dist <= rad or str(row["locality"]).lower() == ref_name.lower():
                matching_tx += 1
                tx_sources.append(row["source"])

    # Count matching listings
    ls_df = data_store.listings
    matching_ls = 0
    ls_sources = []
    if not ls_df.empty:
        for _, row in ls_df.iterrows():
            if row["property_type"] != clean_ptype:
                continue
            if not (min_area <= row["area_sqft"] <= max_area):
                continue
            dist = haversine_distance(ref_lat, ref_lon, row["latitude"], row["longitude"])
            if dist <= rad or str(row["locality"]).lower() == ref_name.lower():
                matching_ls += 1
                ls_sources.append(row["source"])

    # Count nearby amenities within 5km
    am_df = data_store.amenities
    nearby_amenities = 0
    if not am_df.empty:
        for _, row in am_df.iterrows():
            dist = haversine_distance(ref_lat, ref_lon, row["latitude"], row["longitude"])
            if dist <= rad:
                nearby_amenities += 1

    total_comps = matching_tx + matching_ls

    if total_comps < 5:
        quality = "limited"
        reason = f"Only {total_comps} comparable properties found within {rad:.0f} km. Evidence is thin."
    elif total_comps < 10:
        quality = "moderate"
        reason = f"{total_comps} comparable properties found within {rad:.0f} km. Moderate statistical support."
    else:
        quality = "good"
        reason = f"{total_comps} comparable properties found within {rad:.0f} km. Robust evidence support."

    source_type = derive_source_type(tx_sources + ls_sources)

    return DataQualityResponse(
        location=location,
        property_type=clean_ptype,
        area_sqft=area,
        comparable_transactions=matching_tx,
        local_listings=matching_ls,
        nearby_amenities=nearby_amenities,
        total_comparables=total_comps,
        quality=quality,
        quality_reason=reason,
        source_type=source_type,
        disclaimer=DISCLAIMER_TEXT,
    )


@router.get("/api/meta", response_model=MetaResponse)
def get_meta():
    """Returns available localities, property types, amenity types, date coverage, and sources."""
    tx_df = data_store.transactions
    min_date = str(tx_df["date"].min()) if not tx_df.empty else "2023-01-01"
    max_date = str(tx_df["date"].max()) if not tx_df.empty else "2026-09-01"

    # Source breakdown across all datasets
    source_counts: Dict[str, int] = {}
    for df in (data_store.transactions, data_store.listings, data_store.amenities, data_store.locality_features):
        if not df.empty and "source" in df.columns:
            for s, c in df["source"].value_counts().items():
                source_counts[str(s)] = source_counts.get(str(s), 0) + int(c)

    return MetaResponse(
        localities=sorted(list(VALID_LOCALITIES)),
        property_types=sorted(list(VALID_PROPERTY_TYPES)),
        amenity_types=sorted(list(VALID_AMENITY_TYPES)),
        pollution_levels=sorted(list(VALID_POLLUTION_LEVELS)),
        date_coverage={"start": min_date, "end": max_date},
        source_type_breakdown=source_counts,
        source_type=derive_source_type(list(source_counts.keys())),
        disclaimer=DISCLAIMER_TEXT,
    )


@router.get("/health", response_model=HealthResponse)
def get_health():
    """Health check returning status and loaded dataset row counts."""
    return HealthResponse(
        status="ok",
        rows={
            "transactions": len(data_store.transactions),
            "listings": len(data_store.listings),
            "amenities": len(data_store.amenities),
            "locality_features": len(data_store.locality_features),
        },
        source_type="demo",
        disclaimer=DISCLAIMER_TEXT,
    )
