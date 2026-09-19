import json
from pathlib import Path
from typing import List, Optional
import pandas as pd
from app.core.config import settings
from app.core.logging import logger
from app.schemas.comparable import ComparableProperty, ScoredComparable
from app.schemas.property import PropertyInput
from app.comparables.scorer import ComparableScorer


class ComparableService:
    def __init__(self, data_path: Optional[Path] = None):
        self.data_path = data_path or settings.DEMO_COMPARABLES_FILE
        self.scorer = ComparableScorer()
        self._comparables: List[ComparableProperty] = []
        self._load_data()

    def _load_data(self) -> None:
        """Loads comparables from JSON or CSV with error resilience."""
        if not self.data_path.exists():
            csv_path = self.data_path.with_suffix(".csv")
            if csv_path.exists():
                self._load_from_csv(csv_path)
                return
            logger.warning(f"Comparables file not found at {self.data_path}. Initializing empty store.")
            self._comparables = []
            return

        try:
            with open(self.data_path, "r", encoding="utf-8") as f:
                records = json.load(f)
            self._comparables = [ComparableProperty(**rec) for rec in records]
            logger.info(f"Loaded {len(self._comparables)} comparable records from {self.data_path.name}")
        except Exception as e:
            logger.error(f"Failed to load JSON comparables: {e}. Attempting CSV fallback...")
            csv_path = self.data_path.with_suffix(".csv")
            if csv_path.exists():
                self._load_from_csv(csv_path)
            else:
                self._comparables = []

    def _load_from_csv(self, csv_path: Path) -> None:
        try:
            df = pd.read_csv(csv_path)
            records = df.to_dict(orient="records")
            self._comparables = [ComparableProperty(**rec) for rec in records]
            logger.info(f"Loaded {len(self._comparables)} records from CSV fallback: {csv_path.name}")
        except Exception as e:
            logger.error(f"Failed to load CSV comparables: {e}")
            self._comparables = []

    def get_all(self, city: Optional[str] = None, property_type: Optional[str] = None) -> List[ComparableProperty]:
        results = self._comparables
        if city:
            results = [c for c in results if c.city.lower() == city.strip().lower()]
        if property_type:
            results = [c for c in results if c.property_type.lower() == property_type.strip().lower()]
        return results

    def find_and_score(self, subject: PropertyInput, max_results: int = 6) -> List[ScoredComparable]:
        """
        Ranks all available records against subject property using multi-factor transparent scoring.
        Returns top `max_results` matching records.
        """
        if not self._comparables:
            return []

        scored_items: List[ScoredComparable] = []

        for comp in self._comparables:
            similarity, reasons, dist_km = self.scorer.score(subject, comp)
            scored = ScoredComparable(
                id=comp.id,
                source=comp.source,
                source_type=comp.source_type,
                date=comp.date,
                locality=comp.locality,
                city=comp.city,
                property_type=comp.property_type,
                area_sqft=comp.area_sqft,
                price=comp.price,
                price_per_sqft=comp.price_per_sqft,
                latitude=comp.latitude,
                longitude=comp.longitude,
                age_years=comp.age_years,
                road_width_ft=comp.road_width_ft,
                corner_plot=comp.corner_plot,
                condition=comp.condition,
                similarity_score=similarity,
                distance_km=round(dist_km, 2) if dist_km is not None else None,
                selection_reasons=reasons,
                is_synthetic=comp.is_synthetic
            )
            scored_items.append(scored)

        # Sort descending by similarity score
        scored_items.sort(key=lambda x: x.similarity_score, reverse=True)
        return scored_items[:max_results]


comparable_service = ComparableService()
