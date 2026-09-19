from pathlib import Path
from typing import List, Dict, Any, Union
import os
from pydantic import field_validator
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DATA_DIR = BASE_DIR / "data"
DEMO_DATA_PATH = DATA_DIR / "demo" / "comparables.json"


class ValuationWeights:
    """Explicit scoring weights for selecting comparable properties."""
    DISTANCE: float = 0.25
    PROPERTY_TYPE: float = 0.25
    AREA_SIMILARITY: float = 0.15
    AGE_SIMILARITY: float = 0.10
    ROAD_WIDTH: float = 0.10
    RECENCY: float = 0.05
    SOURCE_QUALITY: float = 0.05
    DATA_COMPLETENESS: float = 0.05


class DocumentedAdjustmentRules:
    """Documented rules for adjustments. All adjustments are calculated as explicit percentage or sqft factors."""
    # Corner Plot: +4% base value
    CORNER_PLOT_PREMIUM_PCT: float = 0.04

    # Road Width: Properties on roads >= 30ft get premium, roads < 20ft get discount
    ROAD_WIDTH_BASE_FT: float = 25.0
    ROAD_WIDTH_PREMIUM_PER_10FT_PCT: float = 0.015  # 1.5% per 10ft above base (max +4.5%)
    ROAD_WIDTH_DISCOUNT_BELOW_20FT_PCT: float = -0.025

    # Condition Factors: multiplier relative to 'good' (base 0)
    CONDITION_ADJUSTMENT_PCT: Dict[str, float] = {
        "new": 0.05,
        "excellent": 0.04,
        "good": 0.00,
        "fair": -0.05,
        "poor": -0.12,
        "needs_renovation": -0.15,
    }

    # Age Depreciation: 0.5% per year of age, capped at -20%
    AGE_DEPRECIATION_PER_YEAR_PCT: float = 0.005
    AGE_DEPRECIATION_CAP_PCT: float = 0.20

    # Floor adjustments (for apartments):
    FLOOR_ADJUSTMENTS_PCT: Dict[int, float] = {
        0: 0.01,  # Ground floor slight garden/accessibility preference in certain micro-markets
        1: 0.02,
        2: 0.02,
        3: 0.01,
        4: 0.00,
    }

    # Uncertainty / Range Dispersion
    MIN_RANGE_SPREAD_PCT: float = 0.05  # minimum +/- 5% spread
    LOW_CONFIDENCE_SPREAD_PCT: float = 0.10  # spread when evidence is weak (+/- 10%)


class Settings(BaseSettings):
    PROJECT_NAME: str = "ValueProof"
    TAGLINE: str = "Evidence before price."
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")

    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["*"]

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    LOCATION_PROVIDER: str = os.getenv("LOCATION_PROVIDER", "demo")
    LOCATION_API_KEY: str = os.getenv("LOCATION_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    # Valuation weights and rules
    VALUATION_WEIGHTS: ValuationWeights = ValuationWeights()
    ADJUSTMENTS: DocumentedAdjustmentRules = DocumentedAdjustmentRules()

    # Paths
    DEMO_COMPARABLES_FILE: Path = DEMO_DATA_PATH

    model_config = {
        "case_sensitive": True,
        "env_file": ".env",
        "extra": "allow"
    }


settings = Settings()
