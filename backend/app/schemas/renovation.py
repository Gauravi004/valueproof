from enum import Enum
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


class RenovationScope(str, Enum):
    KITCHEN_BATH = "kitchen_bath"
    PAINT_FLOORING = "paint_flooring"
    EXTRA_ROOM = "extra_room"
    FACADE = "facade"
    FULL_MAKEOVER = "full_makeover"
    # Legacy alias
    KITCHEN_AND_BATH = "kitchen_and_bath"
    FULL_INTERIOR = "full_interior"
    EXTERIOR_PAINT = "exterior_and_paint"
    DEEP_STRUCTURAL = "structural_overhaul"
    CUSTOM = "custom"


class BreakdownFactor(BaseModel):
    factor: str
    boost: float


class RenovationScenarioRequest(BaseModel):
    currentValue: Optional[float] = Field(None, description="Current estimated property value (frontend format)")
    renovationCost: Optional[float] = Field(None, description="Proposed renovation budget (frontend format)")
    renovationType: Optional[str] = Field("kitchen_bath", description="Type/package of renovation (frontend format)")

    # Backward compatibility fields
    current_estimated_value: Optional[float] = Field(None, gt=0)
    area_sqft: Optional[float] = Field(None, gt=0)
    scope: Optional[RenovationScope] = Field(None)
    custom_cost: Optional[float] = Field(None, ge=0)
    current_condition: Optional[str] = "good"
    target_condition: Optional[str] = "excellent"


class RenovationScenarioResponse(BaseModel):
    # Frontend expected format
    currentValue: float = 0.0
    renovationCost: float = 0.0
    renovationType: str = "kitchen_bath"
    potentialValueChange: float = 0.0
    potentialPostRenovationValue: float = 0.0
    potentialNetDifference: float = 0.0
    roiPercentage: float = 0.0
    disclaimer: str = "Scenario estimate — not a guaranteed return."
    breakdownFactors: List[BreakdownFactor] = Field(default_factory=list)

    # Backward compatibility fields
    current_estimated_value: float = 0.0
    renovation_cost: float = 0.0
    potential_value_uplift: float = 0.0
    potential_post_renovation_value: float = 0.0
    potential_net_gain: float = 0.0
    roi_percentage: float = 0.0
    scope_description: str = ""
    calculation_notes: List[str] = Field(default_factory=list)
