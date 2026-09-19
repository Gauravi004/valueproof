"""Router for comparables search and transparent similarity ranking."""

from datetime import datetime, timedelta
from typing import List, Optional, Tuple, Dict, Any
import numpy as np
import pandas as pd
from fastapi import APIRouter, Query, HTTPException

from app.geo import haversine_distance, resolve_coordinates
from app.loader import data_store, VALID_PROPERTY_TYPES
from app.models import (
    ComparablesResponse,
    ComparableItem,
    ScoreComponents,
    EvidenceSummary,
    ObservedPricePerSqft,
    derive_source_type,
    DISCLAIMER_TEXT,
)

router = APIRouter(prefix="/api", tags=["comparables"])


def _calculate_scores(
    area_sqft: float,
    subject_area: float,
    distance_km: float,
    date_str: str,
    ref_date: datetime,
    max_radius_km: float,
    max_months: int,
) -> Tuple[float, ScoreComponents]:
    """Calculates transparent similarity score and individual score components.

    Weights: Area: 40%, Distance: 35%, Recency: 25%.
    All components normalized in [0.0, 1.0].
    """
    # 1. Area Closeness: 1.0 when exact match, drops as area deviates
    area_ratio = abs(area_sqft - subject_area) / max(1.0, subject_area)
    area_score = round(max(0.0, 1.0 - (area_ratio / 0.5)), 3)

    # 2. Distance Proximity: 1.0 at 0 km, drops smoothly
    effective_max_dist = max(10.0, max_radius_km * 1.5)
    dist_score = round(max(0.0, 1.0 - (distance_km / effective_max_dist)), 3)

    # 3. Recency: relative to reference date (latest date or 2026-09-01)
    rec_date = datetime.strptime(date_str, "%Y-%m-%d")
    days_old = max(0, (ref_date - rec_date).days)
    max_days = max(365, int(max_months * 30.5 * 1.5))
    recency_score = round(max(0.0, 1.0 - (days_old / max_days)), 3)

    # Weighted blend
    overall = round(
        0.40 * area_score + 0.35 * dist_score + 0.25 * recency_score, 3
    )
    return overall, ScoreComponents(
        area=area_score, distance=dist_score, recency=recency_score
    )


@router.get("/comparables", response_model=ComparablesResponse)
def get_comparables(
    location: str = Query(..., description="Locality name (e.g. 'Rajpura') or coordinates 'lat,lon'"),
    property_type: str = Query(..., description="plot, flat, independent_house, shop, agricultural_land"),
    area: float = Query(..., description="Subject property area in sqft"),
    area_tolerance: float = Query(0.25, ge=0.01, le=1.0, description="Area tolerance fraction (default 0.25)"),
    radius_km: float = Query(5.0, ge=0.5, le=50.0, description="Search radius in km (default 5.0)"),
    months: int = Query(24, ge=1, le=60, description="Recency window in months (default 24)"),
    limit: int = Query(10, ge=1, le=50, description="Max comparables to return (default 10, max 50)"),
    include_listings: bool = Query(True, description="Whether to include active listings alongside sales"),
):
    """Retrieve filtered and similarity-ranked comparables.

    NOTE: Computes observed statistics only; no valuation or price prediction is performed.
    """
    # 1. Parameter Validation
    clean_ptype = property_type.strip().lower()
    if clean_ptype not in VALID_PROPERTY_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid property_type '{property_type}'. Must be one of {sorted(list(VALID_PROPERTY_TYPES))}",
        )
    if area <= 0:
        raise HTTPException(status_code=400, detail="Area must be greater than 0.")

    # 2. Resolve coordinates
    try:
        ref_lat, ref_lon, ref_name = resolve_coordinates(location=location)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Reference date is the latest date in dataset or 2026-09-01
    ref_date = datetime(2026, 9, 1)

    # 3. Progressive Filtering & Relaxation
    curr_area_tol = area_tolerance
    curr_radius_km = radius_km
    curr_months = months
    relaxations_applied: List[str] = []

    def run_filter(tol: float, rad: float, mths: int):
        cutoff_date = (ref_date - timedelta(days=int(mths * 30.5))).strftime("%Y-%m-%d")
        min_area = area * (1.0 - tol)
        max_area = area * (1.0 + tol)

        candidates = []

        # Filter Transactions
        tx_df = data_store.transactions
        if not tx_df.empty:
            for _, row in tx_df.iterrows():
                if row["property_type"] != clean_ptype:
                    continue
                if not (min_area <= row["area_sqft"] <= max_area):
                    continue
                if row["date"] < cutoff_date:
                    continue

                dist = haversine_distance(ref_lat, ref_lon, row["latitude"], row["longitude"])
                # Match if inside radius or exactly same locality
                if dist > rad and str(row["locality"]).lower() != ref_name.lower():
                    continue

                sim_score, components = _calculate_scores(
                    row["area_sqft"], area, dist, row["date"], ref_date, rad, mths
                )
                price = float(row["sale_price"])
                sqft = float(row["area_sqft"])

                candidates.append({
                    "id": row["transaction_id"],
                    "record_type": "transaction",
                    "date": str(row["date"]),
                    "locality": str(row["locality"]),
                    "property_type": str(row["property_type"]),
                    "area_sqft": sqft,
                    "price": price,
                    "price_per_sqft": round(price / sqft, 1),
                    "latitude": float(row["latitude"]),
                    "longitude": float(row["longitude"]),
                    "distance_km": dist,
                    "age_years": None,
                    "road_width_ft": None,
                    "similarity_score": sim_score,
                    "score_components": components,
                    "source": str(row["source"]),
                })

        # Filter Listings if requested
        if include_listings:
            ls_df = data_store.listings
            if not ls_df.empty:
                for _, row in ls_df.iterrows():
                    if row["property_type"] != clean_ptype:
                        continue
                    if not (min_area <= row["area_sqft"] <= max_area):
                        continue
                    if row["date"] < cutoff_date:
                        continue

                    dist = haversine_distance(ref_lat, ref_lon, row["latitude"], row["longitude"])
                    if dist > rad and str(row["locality"]).lower() != ref_name.lower():
                        continue

                    sim_score, components = _calculate_scores(
                        row["area_sqft"], area, dist, row["date"], ref_date, rad, mths
                    )
                    price = float(row["asking_price"])
                    sqft = float(row["area_sqft"])
                    age = int(row["age_years"]) if pd.notnull(row.get("age_years")) else None
                    road = int(row["road_width_ft"]) if pd.notnull(row.get("road_width_ft")) else None

                    candidates.append({
                        "id": row["listing_id"],
                        "record_type": "listing",
                        "date": str(row["date"]),
                        "locality": str(row["locality"]),
                        "property_type": str(row["property_type"]),
                        "area_sqft": sqft,
                        "price": price,
                        "price_per_sqft": round(price / sqft, 1),
                        "latitude": float(row["latitude"]),
                        "longitude": float(row["longitude"]),
                        "distance_km": dist,
                        "age_years": age,
                        "road_width_ft": road,
                        "similarity_score": sim_score,
                        "score_components": components,
                        "source": str(row["source"]),
                    })

        return candidates

    matches = run_filter(curr_area_tol, curr_radius_km, curr_months)

    # Progressive relaxation loop if < 3 matches
    if len(matches) < 3:
        # Step 1: Relax area_tolerance
        new_tol = round(min(0.40, curr_area_tol + 0.15), 2)
        if new_tol > curr_area_tol:
            relaxations_applied.append(f"area_tolerance: {curr_area_tol} -> {new_tol}")
            curr_area_tol = new_tol
            matches = run_filter(curr_area_tol, curr_radius_km, curr_months)

    if len(matches) < 3:
        # Step 2: Relax radius
        new_rad = round(curr_radius_km * 2.0, 1)
        relaxations_applied.append(f"radius_km: {curr_radius_km} -> {new_rad}")
        curr_radius_km = new_rad
        matches = run_filter(curr_area_tol, curr_radius_km, curr_months)

    if len(matches) < 3:
        # Step 3: Relax area_tolerance further
        new_tol = round(min(0.50, curr_area_tol + 0.10), 2)
        if new_tol > curr_area_tol:
            relaxations_applied.append(f"area_tolerance: {curr_area_tol} -> {new_tol}")
            curr_area_tol = new_tol
            matches = run_filter(curr_area_tol, curr_radius_km, curr_months)

    if len(matches) < 3:
        # Step 4: Relax radius further
        new_rad = round(curr_radius_km + 5.0, 1)
        relaxations_applied.append(f"radius_km: {curr_radius_km} -> {new_rad}")
        curr_radius_km = new_rad
        matches = run_filter(curr_area_tol, curr_radius_km, curr_months)

    # Sort candidates by similarity_score DESCENDING, then recency DESCENDING
    matches.sort(key=lambda x: (x["similarity_score"], x["date"]), reverse=True)

    # Limit results
    sliced_matches = matches[:limit]

    # Convert to Pydantic items
    comparable_items = [ComparableItem(**m) for m in sliced_matches]

    # Evidence Summary Stats
    tx_count = sum(1 for m in sliced_matches if m["record_type"] == "transaction")
    ls_count = sum(1 for m in sliced_matches if m["record_type"] == "listing")

    prices_per_sqft = [m["price_per_sqft"] for m in sliced_matches]
    if prices_per_sqft:
        obs_stats = ObservedPricePerSqft(
            min=round(float(np.min(prices_per_sqft)), 1),
            median=round(float(np.median(prices_per_sqft)), 1),
            max=round(float(np.max(prices_per_sqft)), 1),
        )
    else:
        obs_stats = None

    summary = EvidenceSummary(
        transactions=tx_count,
        listings=ls_count,
        observed_price_per_sqft=obs_stats,
    )

    # Determine dynamic source_type
    all_sources = [m["source"] for m in sliced_matches]
    source_type = derive_source_type(all_sources)

    return ComparablesResponse(
        subject={
            "location": location,
            "resolved_name": ref_name,
            "property_type": clean_ptype,
            "area_sqft": area,
            "area_tolerance": area_tolerance,
            "radius_km": radius_km,
            "months": months,
            "limit": limit,
            "include_listings": include_listings,
        },
        count=len(comparable_items),
        source_type=source_type,
        disclaimer=DISCLAIMER_TEXT,
        relaxations_applied=relaxations_applied,
        evidence_summary=summary,
        comparables=comparable_items,
    )
