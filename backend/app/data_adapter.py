import math
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
import pandas as pd
from app.core.logging import logger

DATA_LAYER_DIR = Path(__file__).resolve().parent.parent.parent / "data-layer"
DATA_DIR = DATA_LAYER_DIR / "data"

# Known locality centroid coordinates (from data-layer geo.py)
LOCALITY_COORDINATES: Dict[str, Tuple[float, float]] = {
    "rajpura": (30.4841, 76.5942),
    "banur": (30.5400, 76.7100),
    "ghanaur": (30.4100, 76.6200),
    "sarai banjara": (30.4550, 76.5300),
    "shambhu": (30.4400, 76.6900),
    "patiala road": (30.4700, 76.5600),
    "mohali": (30.7046, 76.7179),
    "chandigarh": (30.7333, 76.7794),
    "alwar": (27.5530, 76.6346),
}


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0088
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 2)


class DataLayerAdapter:
    def __init__(self):
        self.transactions: pd.DataFrame = pd.DataFrame()
        self.listings: pd.DataFrame = pd.DataFrame()
        self.amenities: pd.DataFrame = pd.DataFrame()
        self.locality_features: pd.DataFrame = pd.DataFrame()
        self.is_loaded = False
        self.load_data()

    def load_data(self):
        try:
            tx_p = DATA_DIR / "transactions.csv"
            ls_p = DATA_DIR / "listings.csv"
            am_p = DATA_DIR / "amenities.csv"
            lf_p = DATA_DIR / "locality_features.csv"

            if tx_p.exists():
                self.transactions = pd.read_csv(tx_p)
            if ls_p.exists():
                self.listings = pd.read_csv(ls_p)
            if am_p.exists():
                self.amenities = pd.read_csv(am_p)
            if lf_p.exists():
                self.locality_features = pd.read_csv(lf_p)

            self.is_loaded = True
            logger.info(
                f"DataLayerAdapter loaded {len(self.transactions)} transactions, "
                f"{len(self.listings)} listings, {len(self.amenities)} amenities, "
                f"{len(self.locality_features)} localities."
            )
        except Exception as e:
            logger.warning(f"DataLayerAdapter could not load data-layer files: {e}")
            self.is_loaded = False

    def resolve_coords(self, loc_str: str) -> Tuple[float, float]:
        cleaned = loc_str.strip().lower()
        for k, coords in LOCALITY_COORDINATES.items():
            if k in cleaned or cleaned in k:
                return coords
        # Default fallback coords for Rajpura
        return (30.4841, 76.5942)

    def get_comparables(
        self,
        location: str,
        property_type: str,
        target_area: float,
        limit: int = 6
    ) -> List[Dict[str, Any]]:
        """
        Retrieves matching comparables from transactions.csv and listings.csv
        using the data-layer dataset.
        """
        results: List[Dict[str, Any]] = []
        if not self.is_loaded or self.transactions.empty:
            return results

        ref_lat, ref_lon = self.resolve_coords(location)
        clean_loc = location.strip().lower()

        # Map frontend types to data-layer types
        type_map = {
            "house": "independent_house",
            "independent_house": "independent_house",
            "plot": "plot",
            "residential_plot": "plot",
            "flat": "flat",
            "apartment": "flat",
            "shop": "shop",
            "commercial_property": "shop",
        }
        mapped_ptype = type_map.get(property_type.lower(), "independent_house")

        # 1. Evaluate transactions
        for _, row in self.transactions.iterrows():
            row_ptype = str(row.get("property_type", "")).lower()
            row_loc = str(row.get("locality", "")).lower()
            sqft = float(row.get("area_sqft", 1000))
            price = float(row.get("sale_price", 0))

            # Match property type or residential category
            type_match = (row_ptype == mapped_ptype) or (
                row_ptype in ["independent_house", "flat"] and mapped_ptype in ["independent_house", "flat"]
            )
            if not type_match:
                continue

            lat = float(row.get("latitude", ref_lat))
            lon = float(row.get("longitude", ref_lon))
            dist = haversine_km(ref_lat, ref_lon, lat, lon)

            # Area closeness
            area_ratio = min(sqft, target_area) / max(sqft, target_area)
            if area_ratio < 0.35:
                continue

            # Locality closeness
            loc_score = 1.0 if clean_loc in row_loc or row_loc in clean_loc else max(0.2, 1.0 - (dist / 20.0))

            sim_score = round(((area_ratio * 0.40) + (loc_score * 0.40) + 0.20) * 100, 1)

            results.append({
                "id": str(row.get("transaction_id", f"TX-{len(results)+1}")),
                "title": f"Verified Registered Deed ({row.get('locality')})",
                "locality": str(row.get("locality")),
                "distanceKm": dist,
                "areaSqFt": round(sqft),
                "propertyType": property_type,
                "salePrice": round(price),
                "ratePerSqFt": round(price / sqft),
                "registrationDate": str(row.get("date", "2026-03-15")),
                "source": str(row.get("source", "Sub-Registrar Registry")),
                "similarityScore": sim_score,
                "keyFeatures": [
                    f"{round(sqft)} sq.ft",
                    f"Verified ₹{round(price/sqft):,}/sq.ft",
                    "Registered Sale"
                ]
            })

        # 2. Evaluate listings
        if not self.listings.empty:
            for _, row in self.listings.iterrows():
                row_ptype = str(row.get("property_type", "")).lower()
                row_loc = str(row.get("locality", "")).lower()
                sqft = float(row.get("area_sqft", 1000))
                price = float(row.get("asking_price", 0))

                type_match = (row_ptype == mapped_ptype) or (
                    row_ptype in ["independent_house", "flat"] and mapped_ptype in ["independent_house", "flat"]
                )
                if not type_match:
                    continue

                lat = float(row.get("latitude", ref_lat))
                lon = float(row.get("longitude", ref_lon))
                dist = haversine_km(ref_lat, ref_lon, lat, lon)

                area_ratio = min(sqft, target_area) / max(sqft, target_area)
                if area_ratio < 0.35:
                    continue

                loc_score = 1.0 if clean_loc in row_loc or row_loc in clean_loc else max(0.2, 1.0 - (dist / 20.0))
                sim_score = round(((area_ratio * 0.38) + (loc_score * 0.38) + 0.18) * 100, 1)

                age_val = row.get("age_years")
                road_val = row.get("road_width_ft")
                features = [f"{round(sqft)} sq.ft", f"Asking ₹{round(price/sqft):,}/sq.ft"]
                if pd.notnull(road_val) and road_val > 0:
                    features.append(f"{int(road_val)}ft Road")
                if pd.notnull(age_val):
                    features.append(f"{int(age_val)} yrs age")

                results.append({
                    "id": str(row.get("listing_id", f"LS-{len(results)+1}")),
                    "title": f"Active Market Listing ({row.get('locality')})",
                    "locality": str(row.get("locality")),
                    "distanceKm": dist,
                    "areaSqFt": round(sqft),
                    "propertyType": property_type,
                    "salePrice": round(price),
                    "ratePerSqFt": round(price / sqft),
                    "registrationDate": str(row.get("date", "2026-05-10")),
                    "source": str(row.get("source", "Market Listing")),
                    "similarityScore": sim_score,
                    "keyFeatures": features
                })

        # Sort descending by similarityScore
        results.sort(key=lambda x: x["similarityScore"], reverse=True)
        return results[:limit]

    def get_amenities(self, location: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieves closest civic amenities from amenities.csv in data-layer.
        """
        out: List[Dict[str, Any]] = []
        if not self.is_loaded or self.amenities.empty:
            return out

        ref_lat, ref_lon = self.resolve_coords(location)

        for _, row in self.amenities.iterrows():
            lat = float(row.get("latitude", ref_lat))
            lon = float(row.get("longitude", ref_lon))
            dist = haversine_km(ref_lat, ref_lon, lat, lon)
            cat = str(row.get("type", "Civic")).title()
            name = str(row.get("name", "Local Amenity"))

            if dist < 1.0:
                score = "High Proximity Boost (< 1 km)"
            elif dist < 3.0:
                score = "Convenient Sector Access"
            else:
                score = "Regional Transit Node"

            out.append({
                "name": name,
                "category": cat,
                "distance": f"{dist:.1f} km ({max(2, int(dist * 3))} mins)",
                "impactScore": score,
                "_dist": dist,
            })

        out.sort(key=lambda x: x["_dist"])
        for item in out:
            del item["_dist"]
        return out[:limit]

    def get_location_signals(self, location: str) -> List[str]:
        """
        Retrieves structured location signals from locality_features.csv in data-layer.
        """
        signals = []
        if not self.is_loaded or self.locality_features.empty:
            return [
                "Proximity to established arterial transit network",
                "Municipal basic civic amenities and market access",
                "Standard suburban air quality and livability",
            ]

        clean_loc = location.strip().lower()
        matched = None

        for _, row in self.locality_features.iterrows():
            loc_name = str(row["locality"]).lower()
            if loc_name in clean_loc or clean_loc in loc_name:
                matched = row
                break

        if matched is None and not self.locality_features.empty:
            matched = self.locality_features.iloc[0]  # default to Rajpura

        if matched is not None:
            hw = matched.get("highway_distance_km", 2.5)
            rw = matched.get("railway_distance_km", 3.0)
            schools = matched.get("schools_count", 6)
            hospitals = matched.get("hospitals_count", 4)
            markets = matched.get("markets_count", 5)
            pollution = str(matched.get("pollution_level", "moderate")).title()

            signals.append(f"National Highway & Expressway Access ({hw} km)")
            signals.append(f"Railway Junction & Transit Node ({rw} km)")
            signals.append(f"{schools} Primary & Senior Secondary Schools within sector radius")
            signals.append(f"{hospitals} Multi-specialty Healthcare & Clinic nodes")
            signals.append(f"{markets} Local Mandis & Commercial Retail Centers")
            signals.append(f"Ambient Air Quality Level: {pollution}")

        return signals


data_layer_adapter = DataLayerAdapter()
