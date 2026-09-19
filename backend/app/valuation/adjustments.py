from typing import List
from app.core.config import settings
from app.schemas.property import PropertyInput, PropertyType
from app.schemas.valuation import ValuationAdjustment


class AdjustmentEngine:
    def __init__(self, rules=None):
        self.rules = rules or settings.ADJUSTMENTS

    def calculate_adjustments(self, subject: PropertyInput, base_value: float) -> List[ValuationAdjustment]:
        """
        Applies documented valuation adjustments based solely on subject property factors.
        Returns a list of structured ValuationAdjustment objects.
        """
        adjustments: List[ValuationAdjustment] = []

        # 1. Corner Plot Adjustment
        if subject.corner_plot:
            pct = self.rules.CORNER_PLOT_PREMIUM_PCT
            amount = base_value * pct
            adjustments.append(
                ValuationAdjustment(
                    category="Corner Plot Premium",
                    description=f"+{pct*100:.1f}% Dual road frontage, ventilation, and commercial/aesthetic prominence",
                    amount_inr=round(amount, 2),
                    percentage_impact=pct * 100.0,
                    is_positive=True
                )
            )

        # 2. Road Width Adjustment
        if subject.road_width_ft >= 30.0:
            extra_width = subject.road_width_ft - self.rules.ROAD_WIDTH_BASE_FT
            pct = min(0.045, (extra_width / 10.0) * self.rules.ROAD_WIDTH_PREMIUM_PER_10FT_PCT)
            amount = base_value * pct
            adjustments.append(
                ValuationAdjustment(
                    category="Wide Road Access",
                    description=f"+{pct*100:.1f}% Wide road frontage ({subject.road_width_ft:.0f} ft) improving vehicle turnaround and parking",
                    amount_inr=round(amount, 2),
                    percentage_impact=round(pct * 100.0, 2),
                    is_positive=True
                )
            )
        elif subject.road_width_ft < 20.0 and subject.road_width_ft > 0:
            pct = self.rules.ROAD_WIDTH_DISCOUNT_BELOW_20FT_PCT
            amount = base_value * pct
            adjustments.append(
                ValuationAdjustment(
                    category="Constrained Road Access",
                    description=f"{pct*100:.1f}% Narrow street passage (<20 ft) constraining emergency and multi-vehicle transit",
                    amount_inr=round(amount, 2),
                    percentage_impact=round(pct * 100.0, 2),
                    is_positive=False
                )
            )

        # 3. Structural Condition Adjustment
        cond_key = subject.condition.value if hasattr(subject.condition, "value") else str(subject.condition)
        cond_pct = self.rules.CONDITION_ADJUSTMENT_PCT.get(cond_key, 0.0)
        if cond_pct > 0:
            amount = base_value * cond_pct
            adjustments.append(
                ValuationAdjustment(
                    category="Property Condition",
                    description=f"+{cond_pct*100:.1f}% Well-maintained physical condition ({cond_key.capitalize()})",
                    amount_inr=round(amount, 2),
                    percentage_impact=cond_pct * 100.0,
                    is_positive=True
                )
            )
        elif cond_pct < 0:
            amount = base_value * cond_pct
            adjustments.append(
                ValuationAdjustment(
                    category="Physical Condition Discount",
                    description=f"{cond_pct*100:.1f}% Maintenance backlog / rehabilitation allowance ({cond_key.replace('_', ' ').capitalize()})",
                    amount_inr=round(amount, 2),
                    percentage_impact=cond_pct * 100.0,
                    is_positive=False
                )
            )

        # 4. Age Depreciation (Not applied to vacant plots)
        if subject.property_type != PropertyType.RESIDENTIAL_PLOT and subject.age_years > 0:
            dep_pct = min(
                self.rules.AGE_DEPRECIATION_CAP_PCT,
                subject.age_years * self.rules.AGE_DEPRECIATION_PER_YEAR_PCT
            )
            amount = -(base_value * dep_pct)
            adjustments.append(
                ValuationAdjustment(
                    category="Construction Vintage Depreciation",
                    description=f"-{dep_pct*100:.1f}% Structural depreciation for {subject.age_years:.0f} years vintage (-0.5%/yr)",
                    amount_inr=round(amount, 2),
                    percentage_impact=-(dep_pct * 100.0),
                    is_positive=False
                )
            )

        # 5. Floor Adjustment (Apartments only)
        if subject.property_type == PropertyType.APARTMENT and subject.floor is not None:
            floor_pct = self.rules.FLOOR_ADJUSTMENTS_PCT.get(subject.floor, 0.0)
            if floor_pct > 0:
                amount = base_value * floor_pct
                adjustments.append(
                    ValuationAdjustment(
                        category="Floor Preference",
                        description=f"+{floor_pct*100:.1f}% Floor {subject.floor} accessibility preference",
                        amount_inr=round(amount, 2),
                        percentage_impact=floor_pct * 100.0,
                        is_positive=True
                    )
                )

        return adjustments
