import numpy as np
from typing import List, Tuple
from app.core.config import settings
from app.core.logging import logger
from app.schemas.property import PropertyInput
from app.schemas.comparable import ScoredComparable
from app.schemas.valuation import ValuationAdjustment, ValuationRange
from app.valuation.adjustments import AdjustmentEngine


class DeterministicValuationEngine:
    def __init__(self):
        self.adjustment_engine = AdjustmentEngine()

    def derive_representative_price_per_sqft(
        self, comparables: List[ScoredComparable]
    ) -> Tuple[float, float, str]:
        """
        Derives representative price per sqft using similarity-weighted average.
        Returns: (representative_price_sqft, dispersion_std_pct, calculation_rationale)
        """
        if not comparables:
            # Fallback baseline rate for unrecorded areas
            default_rate = 3500.0
            return default_rate, 0.15, "Baseline default rate applied: zero matching comparables discovered."

        prices = np.array([c.price_per_sqft for c in comparables], dtype=float)
        # Weights normalized from similarity scores (minimum weight 1.0)
        raw_weights = np.array([max(1.0, c.similarity_score) for c in comparables], dtype=float)
        weights = raw_weights / np.sum(raw_weights)

        weighted_mean = float(np.sum(prices * weights))

        # Standard deviation dispersion relative to mean
        if len(prices) > 1:
            variance = np.sum(weights * ((prices - weighted_mean) ** 2))
            std_dev = float(np.sqrt(variance))
            dispersion_pct = min(0.20, max(0.04, std_dev / weighted_mean))
        else:
            dispersion_pct = 0.08

        rationale = (
            f"Derived from {len(comparables)} ranked comparables using similarity-weighted composite average "
            f"(sample rate range: ₹{int(np.min(prices)):,} - ₹{int(np.max(prices)):,}/sqft)."
        )

        return round(weighted_mean, 2), dispersion_pct, rationale

    def calculate_valuation_range(
        self,
        estimated_value: float,
        dispersion_pct: float,
        comparables_count: int,
        avg_similarity: float
    ) -> ValuationRange:
        """
        Calculates Low, Mid, High valuation range.
        Spreads reflect both empirical price dispersion and data confidence.
        """
        # Base spread begins with empirical dispersion
        spread_pct = dispersion_pct

        # Penalty for limited sample size
        if comparables_count < 3:
            spread_pct += 0.05
        elif comparables_count < 5:
            spread_pct += 0.02

        # Penalty for low similarity
        if avg_similarity < 60.0:
            spread_pct += 0.04
        elif avg_similarity < 75.0:
            spread_pct += 0.02

        # Enforce minimum spread
        spread_pct = max(settings.ADJUSTMENTS.MIN_RANGE_SPREAD_PCT, spread_pct)
        spread_pct = min(0.25, spread_pct)  # Cap spread at 25%

        low_bound = round(estimated_value * (1.0 - spread_pct))
        mid_bound = round(estimated_value)
        high_bound = round(estimated_value * (1.0 + spread_pct))

        rationale = (
            f"Spread of ±{spread_pct*100:.1f}% established based on comparable sample size "
            f"({comparables_count} records), average similarity ({avg_similarity:.1f}%), "
            f"and local micro-market rate dispersion ({dispersion_pct*100:.1f}%)."
        )

        return ValuationRange(
            low=low_bound,
            mid=mid_bound,
            high=high_bound,
            spread_percentage=round(spread_pct * 100.0, 1),
            spread_rationale=rationale
        )

    def evaluate(
        self,
        subject: PropertyInput,
        comparables: List[ScoredComparable]
    ) -> Tuple[float, ValuationRange, float, float, List[ValuationAdjustment], float, float]:
        """
        Executes the deterministic valuation.
        Returns:
            (estimated_value, range, rep_price_per_sqft, base_comparable_value, adjustments, total_pos, total_neg)
        """
        # 1. Representative price per sqft
        rep_price_sqft, dispersion_pct, _ = self.derive_representative_price_per_sqft(comparables)

        # 2. Base value
        base_value = round(rep_price_sqft * subject.area_sqft, 2)

        # 3. Documented adjustments
        adjustments = self.adjustment_engine.calculate_adjustments(subject, base_value)

        total_pos = sum(adj.amount_inr for adj in adjustments if adj.is_positive)
        total_neg = sum(adj.amount_inr for adj in adjustments if not adj.is_positive)

        # 4. Final Estimated Value
        estimated_val = round(base_value + total_pos + total_neg)

        # 5. Valuation Range
        avg_sim = float(np.mean([c.similarity_score for c in comparables])) if comparables else 40.0
        val_range = self.calculate_valuation_range(
            estimated_value=estimated_val,
            dispersion_pct=dispersion_pct,
            comparables_count=len(comparables),
            avg_similarity=avg_sim
        )

        logger.info(
            f"Deterministic valuation complete for {subject.location.locality}, {subject.location.city}: "
            f"Base=₹{base_value:,.0f}, Est=₹{estimated_val:,.0f}, Range=[₹{val_range.low:,.0f} - ₹{val_range.high:,.0f}]"
        )

        return (
            estimated_val,
            val_range,
            rep_price_sqft,
            base_value,
            adjustments,
            total_pos,
            total_neg
        )


valuation_engine = DeterministicValuationEngine()
