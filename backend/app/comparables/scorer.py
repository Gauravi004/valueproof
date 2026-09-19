import math
from datetime import datetime, timezone
from typing import List, Tuple, Optional
from app.core.config import settings
from app.schemas.property import PropertyInput
from app.schemas.comparable import ComparableProperty, ScoredComparable


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two GPS coordinates in kilometers."""
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


class ComparableScorer:
    def __init__(self, weights=None):
        self.weights = weights or settings.VALUATION_WEIGHTS

    def score(self, subject: PropertyInput, comp: ComparableProperty) -> Tuple[float, List[str], Optional[float]]:
        """
        Computes transparent multi-factor similarity score (0-100)
        and returns (score, selection_reasons, distance_km).
        """
        reasons: List[str] = []

        # 1. Geographic distance score
        dist_km: Optional[float] = None
        if (subject.location.latitude is not None and subject.location.longitude is not None and
                comp.latitude is not None and comp.longitude is not None):
            dist_km = haversine_distance_km(
                subject.location.latitude, subject.location.longitude,
                comp.latitude, comp.longitude
            )
            # 0 km = 1.0, 15 km or more = 0.0
            dist_score = max(0.0, 1.0 - (dist_km / 15.0))
            if dist_km < 2.0:
                reasons.append(f"Immediate proximity ({dist_km:.1f} km)")
            elif dist_km < 6.0:
                reasons.append(f"Micro-market cluster ({dist_km:.1f} km)")
        else:
            # Locality and city textual fallback
            if comp.locality.strip().lower() == subject.location.locality.strip().lower():
                dist_score = 1.0
                reasons.append(f"Same locality match ({comp.locality})")
            elif comp.city.strip().lower() == subject.location.city.strip().lower():
                dist_score = 0.70
                reasons.append(f"Same city cluster ({comp.city})")
            else:
                dist_score = 0.20

        # 2. Property Type Match
        if comp.property_type.lower() == subject.property_type.value.lower():
            type_score = 1.0
            reasons.append(f"Exact property type match ({comp.property_type.replace('_', ' ').title()})")
        elif {comp.property_type.lower(), subject.property_type.value.lower()}.issubset({"independent_house", "villa"}):
            type_score = 0.75
            reasons.append("Comparable residential category (House / Villa)")
        elif {comp.property_type.lower(), subject.property_type.value.lower()}.issubset({"apartment", "independent_house"}):
            type_score = 0.40
        else:
            type_score = 0.10

        # 3. Area Similarity (Ratio difference)
        area_ratio = min(comp.area_sqft, subject.area_sqft) / max(comp.area_sqft, subject.area_sqft)
        area_score = area_ratio
        area_diff_pct = abs(comp.area_sqft - subject.area_sqft) / subject.area_sqft * 100.0
        if area_diff_pct <= 10.0:
            reasons.append(f"Virtually identical size footprint (±{area_diff_pct:.0f}%)")
        elif area_diff_pct <= 25.0:
            reasons.append(f"Comparable size band ({comp.area_sqft:.0f} sqft vs {subject.area_sqft:.0f} sqft)")

        # 4. Age Similarity
        age_diff = abs(comp.age_years - subject.age_years)
        age_score = max(0.0, 1.0 - (age_diff / 25.0))
        if age_diff <= 3.0:
            reasons.append(f"Similar construction vintage (±{age_diff:.0f} yrs)")

        # 5. Road Width Similarity
        road_diff = abs(comp.road_width_ft - subject.road_width_ft)
        road_score = max(0.0, 1.0 - (road_diff / 30.0))
        if road_diff <= 5.0:
            reasons.append(f"Similar road frontage access ({comp.road_width_ft:.0f} ft)")

        # 6. Recency
        recency_score = 0.85
        try:
            comp_date = datetime.strptime(comp.date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
            days_old = max(0, (datetime.now(timezone.utc) - comp_date).days)
            recency_score = max(0.2, 1.0 - (days_old / 365.0))
            if days_old <= 90:
                reasons.append(f"Fresh market observation ({days_old} days old)")
        except Exception:
            recency_score = 0.80

        # 7. Source Quality
        source_quality_map = {
            "government_registry_mock": 1.0,
            "verified_listing_mock": 0.85,
            "market_index_mock": 0.70,
        }
        source_score = source_quality_map.get(comp.source_type, 0.75)

        # 8. Data Completeness
        completeness_checks = [
            comp.price > 0,
            comp.area_sqft > 0,
            bool(comp.locality),
            bool(comp.city),
            comp.road_width_ft > 0,
            comp.condition is not None
        ]
        completeness_score = sum(completeness_checks) / len(completeness_checks)

        # Composite weighted score (0 to 100)
        total_score = (
            (dist_score * self.weights.DISTANCE) +
            (type_score * self.weights.PROPERTY_TYPE) +
            (area_score * self.weights.AREA_SIMILARITY) +
            (age_score * self.weights.AGE_SIMILARITY) +
            (road_score * self.weights.ROAD_WIDTH) +
            (recency_score * self.weights.RECENCY) +
            (source_score * self.weights.SOURCE_QUALITY) +
            (completeness_score * self.weights.DATA_COMPLETENESS)
        ) * 100.0

        normalized_score = round(max(0.0, min(100.0, total_score)), 1)
        return normalized_score, reasons, dist_km
