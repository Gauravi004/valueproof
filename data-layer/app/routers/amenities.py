"""Router for amenities search, distances, and nearby infrastructure counts."""

from typing import List, Optional, Dict
import pandas as pd
from fastapi import APIRouter, Query, HTTPException

from app.geo import haversine_distance, resolve_coordinates
from app.loader import data_store, VALID_AMENITY_TYPES
from app.models import (
    AmenitiesResponse,
    AmenityItem,
    NearestAmenityInfo,
    ReferencePoint,
    derive_source_type,
    DISCLAIMER_TEXT,
)

router = APIRouter(prefix="/api", tags=["amenities"])


@router.get("/amenities", response_model=AmenitiesResponse)
def get_amenities(
    location: Optional[str] = Query(None, description="Locality name or coordinates string 'lat,lon'"),
    latitude: Optional[float] = Query(None, description="Reference latitude"),
    longitude: Optional[float] = Query(None, description="Reference longitude"),
    type: Optional[List[str]] = Query(None, description="Filter by amenity type (repeatable, e.g. ?type=school&type=hospital)"),
    radius_km: float = Query(5.0, ge=0.1, le=50.0, description="Max radius in km (default 5.0)"),
    limit: int = Query(25, ge=1, le=100, description="Max amenities to return (default 25)"),
):
    """Search nearby amenities from a reference location or coordinates.

    Requires either 'location' or both 'latitude' and 'longitude'.
    Amenities are sorted by real geodesic distance ascending.
    """
    # 1. Validation of location / coords
    if not location and (latitude is None or longitude is None):
        raise HTTPException(
            status_code=400,
            detail="Either 'location' or both 'latitude' and 'longitude' must be provided.",
        )

    try:
        ref_lat, ref_lon, ref_name = resolve_coordinates(
            location=location, latitude=latitude, longitude=longitude
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Validate type filter if provided
    clean_types = None
    if type:
        clean_types = set()
        for t in type:
            low = t.strip().lower()
            if low not in VALID_AMENITY_TYPES:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid amenity type '{t}'. Valid types: {sorted(list(VALID_AMENITY_TYPES))}",
                )
            clean_types.add(low)

    amenities_df = data_store.amenities
    if amenities_df.empty:
        return AmenitiesResponse(
            reference_point=ReferencePoint(
                latitude=ref_lat, longitude=ref_lon, location_name=ref_name
            ),
            count=0,
            source_type="demo",
            disclaimer=DISCLAIMER_TEXT,
            counts_by_type={},
            nearest_by_type={},
            amenities=[],
        )

    candidates = []
    counts_by_type: Dict[str, int] = {}
    nearest_by_type: Dict[str, NearestAmenityInfo] = {}

    for _, row in amenities_df.iterrows():
        atype = str(row["type"]).lower()
        if clean_types and atype not in clean_types:
            continue

        alat = float(row["latitude"])
        alon = float(row["longitude"])
        dist = haversine_distance(ref_lat, ref_lon, alat, alon)

        if dist <= radius_km:
            item = AmenityItem(
                name=str(row["name"]),
                type=atype,
                latitude=alat,
                longitude=alon,
                distance_km=dist,
                source=str(row["source"]),
            )
            candidates.append(item)

            # Track counts by type
            counts_by_type[atype] = counts_by_type.get(atype, 0) + 1

            # Track nearest by type
            if atype not in nearest_by_type or dist < nearest_by_type[atype].distance_km:
                nearest_by_type[atype] = NearestAmenityInfo(
                    name=str(row["name"]), distance_km=dist
                )

    # Sort candidates by distance_km ASCENDING
    candidates.sort(key=lambda a: a.distance_km)
    sliced = candidates[:limit]

    # Derive dynamic source_type
    sources = [a.source for a in sliced]
    source_type = derive_source_type(sources)

    return AmenitiesResponse(
        reference_point=ReferencePoint(
            latitude=ref_lat, longitude=ref_lon, location_name=ref_name
        ),
        count=len(sliced),
        source_type=source_type,
        disclaimer=DISCLAIMER_TEXT,
        counts_by_type=counts_by_type,
        nearest_by_type=nearest_by_type,
        amenities=sliced,
    )
