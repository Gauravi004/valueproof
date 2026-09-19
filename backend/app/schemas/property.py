from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class PropertyType(str, Enum):
    INDEPENDENT_HOUSE = "independent_house"
    RESIDENTIAL_PLOT = "residential_plot"
    APARTMENT = "apartment"
    VILLA = "villa"
    COMMERCIAL_PROPERTY = "commercial_property"


class PropertyCondition(str, Enum):
    NEW = "new"
    EXCELLENT = "excellent"
    GOOD = "good"
    FAIR = "fair"
    POOR = "poor"
    NEEDS_RENOVATION = "needs_renovation"


class IntentType(str, Enum):
    BUY = "buy"
    SELL = "sell"


class PropertyLocation(BaseModel):
    city: str = Field(..., min_length=2, description="City name e.g. Rajpura, Chandigarh, Mohali")
    locality: str = Field(..., min_length=2, description="Locality, sector, or colony name")
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0, description="Optional GPS latitude")
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0, description="Optional GPS longitude")
    pincode: Optional[str] = Field(None, description="Postal PIN code")

    @field_validator("city", "locality")
    @classmethod
    def strip_and_validate_non_empty(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Location fields (city, locality) cannot be blank or whitespace.")
        return cleaned


class PropertyInput(BaseModel):
    location: PropertyLocation
    property_type: PropertyType = Field(..., description="Type of property")
    area_sqft: float = Field(..., gt=0, description="Carpet or super area in square feet. Must be strictly positive.")
    age_years: float = Field(0.0, ge=0.0, description="Age of the property/construction in years (0 for brand new/plots)")
    road_width_ft: float = Field(20.0, ge=0.0, description="Width of the facing road in feet")
    bedrooms: Optional[int] = Field(None, ge=0, description="Number of bedrooms (optional, for residential)")
    bathrooms: Optional[int] = Field(None, ge=0, description="Number of bathrooms (optional)")
    corner_plot: bool = Field(False, description="Whether the plot or house is on a corner")
    floor: Optional[int] = Field(None, ge=0, description="Floor number if applicable (e.g. for apartments)")
    condition: PropertyCondition = Field(PropertyCondition.GOOD, description="Physical condition of the structure")
    intent: IntentType = Field(IntentType.SELL, description="User's intent: 'buy' or 'sell'")

    model_config = {
        "json_schema_extra": {
            "example": {
                "location": {
                    "city": "Rajpura",
                    "locality": "Focal Point Road",
                    "latitude": 30.4852,
                    "longitude": 76.5931
                },
                "property_type": "independent_house",
                "area_sqft": 1800,
                "age_years": 8,
                "road_width_ft": 30,
                "bedrooms": 3,
                "bathrooms": 2,
                "corner_plot": True,
                "floor": 1,
                "condition": "good",
                "intent": "sell"
            }
        }
    }
