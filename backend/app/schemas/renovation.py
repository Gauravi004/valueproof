from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class RenovationScope(str, Enum):
    KITCHEN_BATH = "kitchen_and_bath"
    FULL_INTERIOR = "full_interior"
    EXTERIOR_PAINT = "exterior_and_paint"
    DEEP_STRUCTURAL = "structural_overhaul"
    CUSTOM = "custom"


class RenovationScenarioRequest(BaseModel):
    current_estimated_value: float = Field(..., gt=0)
    area_sqft: float = Field(..., gt=0)
    scope: RenovationScope = Field(RenovationScope.FULL_INTERIOR)
    custom_cost: Optional[float] = Field(None, ge=0)
    current_condition: str = "good"
    target_condition: Optional[str] = "excellent"


class RenovationScenarioResponse(BaseModel):
    current_estimated_value: float
    renovation_cost: float
    potential_value_uplift: float
    potential_post_renovation_value: float
    potential_net_gain: float
    roi_percentage: float
    scope_description: str
    calculation_notes: List[str]
    disclaimer: str = (
        "Illustrative scenario and projection only. Renovation uplift depends on contractor execution, "
        "material choices, and prevailing local micro-market demand. Returns are not guaranteed."
    )
