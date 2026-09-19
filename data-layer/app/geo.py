"""Geographic calculations and locality centroid coordinates for MoolyaSetu."""

import math
from typing import Optional, Tuple, Dict

# Canonical centroid coordinates for the demo region (Punjab)
LOCALITY_CENTROIDS: Dict[str, Tuple[float, float]] = {
    "Rajpura": (30.4841, 76.5942),
    "Banur": (30.5400, 76.7100),
    "Ghanaur": (30.4100, 76.6200),
    "Sarai Banjara": (30.4550, 76.5300),
    "Shambhu": (30.4400, 76.6900),
    "Patiala Road": (30.4700, 76.5600),
}


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate geodesic distance in kilometers between two points using Haversine formula.

    Returns distance in kilometers rounded to 3 decimal places.
    """
    earth_radius_km = 6371.0088

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(earth_radius_km * c, 3)


def find_canonical_locality(name: str) -> Optional[str]:
    """Case-insensitive lookup of canonical locality name."""
    cleaned = name.strip().lower()
    for canonical in LOCALITY_CENTROIDS:
        if canonical.lower() == cleaned:
            return canonical
    return None


def resolve_coordinates(
    location: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
) -> Tuple[float, float, str]:
    """Resolve reference coordinates from either locality name, coordinate string, or lat/lon floats.

    Returns (latitude, longitude, resolved_name).
    Raises ValueError if resolution fails.
    """
    if latitude is not None and longitude is not None:
        loc_name = location.strip() if location else f"{latitude:.4f},{longitude:.4f}"
        canonical = find_canonical_locality(loc_name)
        return (latitude, longitude, canonical or loc_name)

    if location:
        # Check canonical localities
        canonical = find_canonical_locality(location)
        if canonical:
            lat, lon = LOCALITY_CENTROIDS[canonical]
            return (lat, lon, canonical)

        # Check if coordinates given as comma-separated string: "lat,lon"
        if "," in location:
            parts = location.split(",")
            if len(parts) == 2:
                try:
                    lat = float(parts[0].strip())
                    lon = float(parts[1].strip())
                    return (lat, lon, location.strip())
                except ValueError:
                    pass

    raise ValueError(
        f"Unable to resolve location '{location}'. Must be a known locality or valid coordinates."
    )
