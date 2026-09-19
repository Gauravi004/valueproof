"""Data loader and startup validation for MoolyaSetu CSV evidence files."""

import os
from pathlib import Path
from typing import Dict, List, Set
import pandas as pd

VALID_LOCALITIES: Set[str] = {
    "Rajpura",
    "Banur",
    "Ghanaur",
    "Sarai Banjara",
    "Shambhu",
    "Patiala Road",
}

VALID_PROPERTY_TYPES: Set[str] = {
    "plot",
    "flat",
    "independent_house",
    "shop",
    "agricultural_land",
}

VALID_AMENITY_TYPES: Set[str] = {
    "school",
    "hospital",
    "market",
    "highway",
    "railway",
    "bank",
    "park",
    "food",
    "retail",
}

VALID_POLLUTION_LEVELS: Set[str] = {"low", "moderate", "high"}

EXPECTED_SCHEMAS: Dict[str, List[str]] = {
    "transactions.csv": [
        "transaction_id",
        "date",
        "locality",
        "property_type",
        "area_sqft",
        "sale_price",
        "latitude",
        "longitude",
        "source",
    ],
    "listings.csv": [
        "listing_id",
        "date",
        "locality",
        "property_type",
        "area_sqft",
        "asking_price",
        "age_years",
        "road_width_ft",
        "latitude",
        "longitude",
        "source",
    ],
    "amenities.csv": [
        "name",
        "type",
        "latitude",
        "longitude",
        "distance_km",
        "source",
    ],
    "locality_features.csv": [
        "locality",
        "schools_count",
        "hospitals_count",
        "markets_count",
        "food_places_count",
        "highway_distance_km",
        "railway_distance_km",
        "pollution_level",
        "source",
    ],
}


class DataStore:
    """In-memory holder for validated DataFrames."""

    def __init__(self):
        self.transactions: pd.DataFrame = pd.DataFrame()
        self.listings: pd.DataFrame = pd.DataFrame()
        self.amenities: pd.DataFrame = pd.DataFrame()
        self.locality_features: pd.DataFrame = pd.DataFrame()
        self._data_dir: Path = Path(__file__).resolve().parent.parent / "data"

    def set_data_dir(self, path: Path):
        self._data_dir = path

    def load_and_validate_all(self):
        """Loads and validates all 4 CSV files at startup. Fails loudly on any integrity error."""
        tx_path = self._data_dir / "transactions.csv"
        ls_path = self._data_dir / "listings.csv"
        am_path = self._data_dir / "amenities.csv"
        lf_path = self._data_dir / "locality_features.csv"

        for p in (tx_path, ls_path, am_path, lf_path):
            if not p.exists():
                raise FileNotFoundError(f"Required CSV file missing: {p.resolve()}")

        # Load CSVs
        self.transactions = pd.read_csv(tx_path)
        self.listings = pd.read_csv(ls_path)
        self.amenities = pd.read_csv(am_path)
        self.locality_features = pd.read_csv(lf_path)

        # 1. Validate transactions
        self._validate_schema("transactions.csv", self.transactions)
        self._validate_dates(self.transactions, "date", "transactions.csv")
        self._validate_enum(
            self.transactions, "locality", VALID_LOCALITIES, "transactions.csv"
        )
        self._validate_enum(
            self.transactions,
            "property_type",
            VALID_PROPERTY_TYPES,
            "transactions.csv",
        )
        if (self.transactions["sale_price"] <= 0).any():
            raise ValueError("transactions.csv contains non-positive sale_price")
        if (self.transactions["area_sqft"] <= 0).any():
            raise ValueError("transactions.csv contains non-positive area_sqft")

        # 2. Validate listings
        self._validate_schema("listings.csv", self.listings)
        self._validate_dates(self.listings, "date", "listings.csv")
        self._validate_enum(
            self.listings, "locality", VALID_LOCALITIES, "listings.csv"
        )
        self._validate_enum(
            self.listings, "property_type", VALID_PROPERTY_TYPES, "listings.csv"
        )
        if (self.listings["asking_price"] <= 0).any():
            raise ValueError("listings.csv contains non-positive asking_price")
        if (self.listings["area_sqft"] <= 0).any():
            raise ValueError("listings.csv contains non-positive area_sqft")

        # 3. Validate amenities
        self._validate_schema("amenities.csv", self.amenities)
        self._validate_enum(
            self.amenities, "type", VALID_AMENITY_TYPES, "amenities.csv"
        )

        # 4. Validate locality_features
        self._validate_schema("locality_features.csv", self.locality_features)
        self._validate_enum(
            self.locality_features,
            "locality",
            VALID_LOCALITIES,
            "locality_features.csv",
        )
        self._validate_enum(
            self.locality_features,
            "pollution_level",
            VALID_POLLUTION_LEVELS,
            "locality_features.csv",
        )

    def _validate_schema(self, filename: str, df: pd.DataFrame):
        expected = EXPECTED_SCHEMAS[filename]
        actual = list(df.columns)
        if actual != expected:
            raise ValueError(
                f"Schema mismatch in {filename}.\n"
                f"Expected exact order: {expected}\n"
                f"Actual columns: {actual}"
            )
        if "source" not in df.columns or df["source"].isnull().any():
            raise ValueError(f"Every row in {filename} must have a non-null 'source'")

    def _validate_dates(self, df: pd.DataFrame, col: str, filename: str):
        try:
            pd.to_datetime(df[col], format="%Y-%m-%d", errors="raise")
        except Exception as e:
            raise ValueError(f"Invalid date format in {filename}, column '{col}': {e}")

    def _validate_enum(
        self, df: pd.DataFrame, col: str, valid_values: Set[str], filename: str
    ):
        invalid = set(df[col].dropna().unique()) - valid_values
        if invalid:
            raise ValueError(
                f"Invalid values in {filename} column '{col}': {invalid}. "
                f"Must be one of {valid_values}"
            )


# Global singleton store
data_store = DataStore()
