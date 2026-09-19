from typing import List
from app.schemas.renovation import (
    RenovationScenarioRequest,
    RenovationScenarioResponse,
    RenovationScope,
    BreakdownFactor
)


class RenovationCalculator:
    # Scope benchmarks: cost per sqft (INR) and typical uplift multiplier
    SCOPE_BENCHMARKS = {
        RenovationScope.KITCHEN_BATH: {
            "name": "Modular Kitchen & Premium Bathrooms Upgrade",
            "cost_per_sqft": 250.0,
            "uplift_multiplier": 1.75,
            "description": "High-impact wet area overhaul: modular quartz/granite counters, branded sanitary fittings, and concealed plumbing."
        },
        RenovationScope.KITCHEN_AND_BATH: {
            "name": "Modular Kitchen & Premium Bathrooms Upgrade",
            "cost_per_sqft": 250.0,
            "uplift_multiplier": 1.75,
            "description": "High-impact wet area overhaul: modular quartz/granite counters, branded sanitary fittings, and concealed plumbing."
        },
        RenovationScope.PAINT_FLOORING: {
            "name": "Paint & Vitrified Flooring Refresh",
            "cost_per_sqft": 180.0,
            "uplift_multiplier": 1.55,
            "description": "Aesthetic modernization with premium anti-skid vitrified tiles and washable emulsion coating."
        },
        RenovationScope.EXTRA_ROOM: {
            "name": "Additional Room / Floor Extension",
            "cost_per_sqft": 800.0,
            "uplift_multiplier": 2.10,
            "description": "Direct usable carpet expansion and structural space addition."
        },
        RenovationScope.FACADE: {
            "name": "Exterior Elevation & Modern Facade",
            "cost_per_sqft": 220.0,
            "uplift_multiplier": 1.65,
            "description": "Curb appeal elevation with modern exterior louvers, glass railings, and texture paints."
        },
        RenovationScope.FULL_MAKEOVER: {
            "name": "Comprehensive Turnkey Makeover",
            "cost_per_sqft": 550.0,
            "uplift_multiplier": 1.85,
            "description": "End-to-end electrical, plumbing, carpentry, and aesthetic overhaul."
        },
        RenovationScope.FULL_INTERIOR: {
            "name": "Full Interior Renovation",
            "cost_per_sqft": 450.0,
            "uplift_multiplier": 1.85,
            "description": "Complete turnaround: vitrified/wooden flooring, false ceilings, electrical overhaul, modular carpentry, and fresh architectural paint."
        },
        RenovationScope.EXTERIOR_PAINT: {
            "name": "Exterior Elevation & Weather-proof Paint",
            "cost_per_sqft": 150.0,
            "uplift_multiplier": 1.50,
            "description": "Curb appeal enhancement: texture coating, elevation stone cladding highlights, waterproof exterior paint, and parapet repairs."
        },
        RenovationScope.DEEP_STRUCTURAL: {
            "name": "Structural Modernization & Civil Overhaul",
            "cost_per_sqft": 700.0,
            "uplift_multiplier": 1.30,
            "description": "Civil rehabilitation: waterproofing, lintel reinforcements, rewiring, replacement of old joinery, and floor-plan optimization."
        },
        RenovationScope.CUSTOM: {
            "name": "Customized Renovation Scope",
            "cost_per_sqft": 300.0,
            "uplift_multiplier": 1.45,
            "description": "User-defined capital expenditure and customized refurbishment scope."
        }
    }

    def simulate(self, req: RenovationScenarioRequest) -> RenovationScenarioResponse:
        current_val = req.currentValue or req.current_estimated_value or 5000000.0
        area = req.area_sqft or 1500.0

        # Match scope
        scope_key = None
        if req.scope:
            scope_key = req.scope
        elif req.renovationType:
            try:
                scope_key = RenovationScope(req.renovationType)
            except ValueError:
                scope_key = RenovationScope.KITCHEN_BATH

        scope_info = self.SCOPE_BENCHMARKS.get(scope_key, self.SCOPE_BENCHMARKS[RenovationScope.FULL_INTERIOR])
        renov_type_str = scope_key.value if scope_key else "kitchen_bath"

        # Determine renovation cost
        if req.renovationCost is not None and req.renovationCost > 0:
            renovation_cost = round(req.renovationCost)
        elif req.custom_cost is not None and req.custom_cost > 0:
            renovation_cost = round(req.custom_cost)
        else:
            renovation_cost = round(area * scope_info["cost_per_sqft"])

        # Cap renovation expenditure rationally relative to property value (max 35% of base value)
        renovation_cost = min(renovation_cost, round(current_val * 0.35))

        # Calculate potential uplift
        multiplier = scope_info["uplift_multiplier"]
        potential_uplift = round(renovation_cost * multiplier)
        potential_post_val = round(current_val + potential_uplift)
        potential_net_gain = round(potential_uplift - renovation_cost)
        roi_pct = round((potential_net_gain / renovation_cost) * 100.0, 1) if renovation_cost > 0 else 0.0

        factors = [
            BreakdownFactor(factor="Immediate aesthetic and modern living curb appeal", boost=65.0),
            BreakdownFactor(factor="Eliminates buyer maintenance discount and accelerates liquidity", boost=35.0)
        ]

        notes: List[str] = [
            f"Scope modeled: {scope_info['name']}.",
            f"Projected expenditure: ₹{renovation_cost:,.0f} (~₹{renovation_cost/area:.0f}/sqft).",
            f"Potential gross value uplift: +₹{potential_uplift:,.0f} (~{multiplier:.2f}x capital recovery ratio).",
            f"Projected net equity gain: +₹{potential_net_gain:,.0f} (Potential ROI: {roi_pct}%).",
            "Property condition projection assumes step up to 'Excellent' physical maintenance grade upon completion."
        ]

        return RenovationScenarioResponse(
            currentValue=current_val,
            renovationCost=renovation_cost,
            renovationType=renov_type_str,
            potentialValueChange=potential_uplift,
            potentialPostRenovationValue=potential_post_val,
            potentialNetDifference=potential_net_gain,
            roiPercentage=roi_pct,
            disclaimer="Scenario estimate — not a guaranteed return.",
            breakdownFactors=factors,
            current_estimated_value=current_val,
            renovation_cost=renovation_cost,
            potential_value_uplift=potential_uplift,
            potential_post_renovation_value=potential_post_val,
            potential_net_gain=potential_net_gain,
            roi_percentage=roi_pct,
            scope_description=scope_info["description"],
            calculation_notes=notes
        )


renovation_calculator = RenovationCalculator()
