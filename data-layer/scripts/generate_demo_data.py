"""Deterministic demo data generator for MoolyaSetu Evidence Layer.

Seed: 42
Generates:
1. data/transactions.csv (180 rows, TX001-TX180, dates 2023-01-01 to 2026-09-01)
2. data/listings.csv (140 rows, LS001-LS140, asking prices above sales)
3. data/amenities.csv (50 rows, 9 types, plausible names)
4. data/locality_features.csv (6 rows, counts strictly match amenities.csv)

CRITICAL DATA-INTEGRITY RULE:
All rows have source = 'DEMO'.
"""

import math
import random
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Tuple
import pandas as pd

# Fix seed for strict determinism
RANDOM_SEED = 42
random.seed(RANDOM_SEED)

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# Localities and their canonical coordinates (within lat 30.40–30.56, lon 76.50–76.72)
LOCALITIES: Dict[str, Tuple[float, float]] = {
    "Rajpura": (30.4841, 76.5942),
    "Banur": (30.5400, 76.7100),
    "Ghanaur": (30.4100, 76.6200),
    "Sarai Banjara": (30.4550, 76.5300),
    "Shambhu": (30.4400, 76.6900),
    "Patiala Road": (30.4700, 76.5600),
}

# Pollution levels for each locality
LOCALITY_POLLUTION = {
    "Rajpura": "moderate",
    "Banur": "moderate",
    "Ghanaur": "low",
    "Sarai Banjara": "low",
    "Shambhu": "moderate",
    "Patiala Road": "high",
}

# Base rates (per sqft in early 2023) by locality & property type
BASE_RATES = {
    "Rajpura": {
        "independent_house": 2350,
        "plot": 2100,
        "flat": 2150,
        "shop": 4800,
        "agricultural_land": 450,
    },
    "Patiala Road": {
        "independent_house": 2400,
        "plot": 2200,
        "flat": 2250,
        "shop": 5000,
        "agricultural_land": 480,
    },
    "Banur": {
        "independent_house": 2150,
        "plot": 1900,
        "flat": 1950,
        "shop": 4200,
        "agricultural_land": 420,
    },
    "Shambhu": {
        "independent_house": 1850,
        "plot": 1600,
        "flat": 1700,
        "shop": 3600,
        "agricultural_land": 380,
    },
    "Ghanaur": {
        "independent_house": 1700,
        "plot": 1450,
        "flat": 1550,
        "shop": 3300,
        "agricultural_land": 350,
    },
    "Sarai Banjara": {
        "independent_house": 1750,
        "plot": 1500,
        "flat": 1600,
        "shop": 3400,
        "agricultural_land": 360,
    },
}

START_DATE = datetime(2023, 1, 1)
END_DATE = datetime(2026, 9, 1)
TOTAL_DAYS = (END_DATE - START_DATE).days


def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371.0088
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2.0) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(r * c, 3)


def random_date(start: datetime, end: datetime) -> str:
    delta_days = (end - start).days
    chosen = start + timedelta(days=random.randint(0, delta_days))
    return chosen.strftime("%Y-%m-%d")


def perturb_coords(lat: float, lon: float, max_offset: float = 0.012) -> Tuple[float, float]:
    plat = round(lat + random.uniform(-max_offset, max_offset), 4)
    plon = round(lon + random.uniform(-max_offset, max_offset), 4)
    # Clamp to Punjab bounding box: 30.40–30.56, 76.50–76.72
    plat = max(30.4001, min(30.5599, plat))
    plon = max(76.5001, min(76.7199, plon))
    return plat, plon


# ==============================================================================
# 1. GENERATE AMENITIES & LOCALITY FEATURES
# ==============================================================================

def generate_amenities() -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Generates 50 amenities and strictly synchronizes counts into locality_features.csv."""
    # List of 50 amenities with their home locality, type, name, and relative offset
    amenities_plan = [
        # --- Rajpura (17 amenities) ---
        ("Rajpura", "school", "Govt Senior Secondary School, Rajpura", -0.003, 0.002),
        ("Rajpura", "school", "Patel Public School, Rajpura", 0.004, -0.003),
        ("Rajpura", "school", "Scholars Public School, Rajpura", -0.005, -0.004),
        ("Rajpura", "school", "Mukat Public School, Rajpura", 0.006, 0.005),
        ("Rajpura", "hospital", "AP Jain Civil Hospital, Rajpura", -0.002, 0.004),
        ("Rajpura", "hospital", "Neelam Hospital, Rajpura", 0.005, 0.003),
        ("Rajpura", "market", "Kasturba Main Market, Rajpura", -0.001, -0.001),
        ("Rajpura", "market", "Old Grain Market (Anaj Mandi), Rajpura", -0.004, 0.006),
        ("Rajpura", "market", "Focal Point Market, Rajpura", 0.007, -0.002),
        ("Rajpura", "food", "Haveli Traditional Dhaba, Rajpura", 0.008, 0.006),
        ("Rajpura", "food", "Amritsari Kulcha Junction, Rajpura", -0.002, -0.003),
        ("Rajpura", "food", "Sindhi Sweet & Restaurant, Rajpura", 0.001, 0.002),
        ("Rajpura", "food", "Verka Milk Bar & Fast Food, Rajpura", -0.004, 0.001),
        ("Rajpura", "highway", "NH-44 (GT Road) Junction, Rajpura", 0.010, 0.005),
        ("Rajpura", "railway", "Rajpura Junction Railway Station, Rajpura", -0.006, -0.005),
        ("Rajpura", "bank", "State Bank of India Main Branch, Rajpura", 0.002, -0.002),
        ("Rajpura", "retail", "Reliance Trends Rajpura Mall, Rajpura", 0.003, 0.004),

        # --- Patiala Road (10 amenities) ---
        ("Patiala Road", "school", "DAV Public School, Patiala Road", 0.003, -0.002),
        ("Patiala Road", "school", "Heritage Public School, Patiala Road", -0.004, 0.003),
        ("Patiala Road", "hospital", "Prime Hospital, Patiala Road", 0.002, 0.004),
        ("Patiala Road", "hospital", "Amar Hospital, Patiala Road", -0.003, -0.003),
        ("Patiala Road", "market", "Patiala Road Commercial Complex, Patiala Road", 0.001, 0.001),
        ("Patiala Road", "food", "Urban Tandoor, Patiala Road", 0.004, 0.002),
        ("Patiala Road", "food", "Chai Shai Cafe, Patiala Road", -0.002, -0.002),
        ("Patiala Road", "bank", "Punjab & Sind Bank, Patiala Road", 0.001, -0.003),
        ("Patiala Road", "park", "Patiala Road Walkers Park, Patiala Road", -0.005, 0.004),
        ("Patiala Road", "retail", "Easyday Club Retail, Patiala Road", 0.002, -0.001),

        # --- Banur (9 amenities) ---
        ("Banur", "school", "Govt High School, Banur", 0.002, -0.003),
        ("Banur", "school", "Holy Mary International School, Banur", -0.003, 0.004),
        ("Banur", "hospital", "Community Health Centre, Banur", 0.001, 0.002),
        ("Banur", "market", "Town Centre Sabzi Mandi, Banur", -0.002, -0.001),
        ("Banur", "food", "Royal Food Plaza, Banur", 0.005, 0.003),
        ("Banur", "highway", "NH-7 (Zirakpur-Patiala Highway), Banur", 0.008, -0.004),
        ("Banur", "bank", "Punjab National Bank, Banur", 0.002, 0.001),
        ("Banur", "park", "Town Green Ecological Park, Banur", -0.004, -0.002),
        ("Banur", "retail", "Banur Mega Mart, Banur", 0.003, 0.002),

        # --- Shambhu (8 amenities) ---
        ("Shambhu", "school", "Saraswati Vidya Mandir, Shambhu", 0.002, -0.002),
        ("Shambhu", "hospital", "Rural Health Sub-Centre, Shambhu", -0.003, 0.003),
        ("Shambhu", "market", "Highway Retail Mandi, Shambhu", 0.004, 0.002),
        ("Shambhu", "food", "Highway King Dhaba, Shambhu", 0.006, 0.005),
        ("Shambhu", "food", "Kalsi Punjabi Rasoi, Shambhu", -0.002, -0.003),
        ("Shambhu", "highway", "NH-44 Border Toll Plaza, Shambhu", 0.007, 0.001),
        ("Shambhu", "railway", "Shambhu Halt Railway Station, Shambhu", -0.005, -0.004),
        ("Shambhu", "bank", "Canara Bank Rural Branch, Shambhu", 0.001, -0.001),

        # --- Ghanaur (4 amenities) ---
        ("Ghanaur", "school", "Govt Girls High School, Ghanaur", 0.002, 0.001),
        ("Ghanaur", "hospital", "Civil Dispensary, Ghanaur", -0.002, 0.002),
        ("Ghanaur", "market", "Local Bazaar, Ghanaur", 0.001, -0.002),
        ("Ghanaur", "food", "Bishan Dhaba & Bakers, Ghanaur", 0.003, 0.004),

        # --- Sarai Banjara (2 amenities) ---
        ("Sarai Banjara", "railway", "Sarai Banjara Railway Station, Sarai Banjara", -0.002, -0.001),
        ("Sarai Banjara", "school", "Govt Primary School, Sarai Banjara", 0.003, 0.002),
    ]

    assert len(amenities_plan) == 50, f"Expected exactly 50 amenities, got {len(amenities_plan)}"

    rajpura_center = LOCALITIES["Rajpura"]
    amenity_rows = []
    locality_counts = {
        loc: {"school": 0, "hospital": 0, "market": 0, "food": 0} for loc in LOCALITIES
    }

    for loc, atype, aname, dlat, dlon in amenities_plan:
        clat, clon = LOCALITIES[loc]
        alat = round(clat + dlat, 4)
        alon = round(clon + dlon, 4)
        dist_to_rajpura = haversine(rajpura_center[0], rajpura_center[1], alat, alon)

        amenity_rows.append({
            "name": aname,
            "type": atype,
            "latitude": alat,
            "longitude": alon,
            "distance_km": dist_to_rajpura,
            "source": "DEMO",
            "_home_loc": loc,
        })

        if atype in locality_counts[loc]:
            locality_counts[loc][atype] += 1

    amenities_df = pd.DataFrame(amenity_rows)

    # Calculate exact highway and railway distances for each locality from amenities
    highways = [(row["latitude"], row["longitude"]) for _, row in amenities_df.iterrows() if row["type"] == "highway"]
    railways = [(row["latitude"], row["longitude"]) for _, row in amenities_df.iterrows() if row["type"] == "railway"]

    features_rows = []
    for loc, (lat, lon) in LOCALITIES.items():
        min_hw = min(haversine(lat, lon, hlat, hlon) for hlat, hlon in highways)
        min_rw = min(haversine(lat, lon, rlat, rlon) for rlat, rlon in railways)

        features_rows.append({
            "locality": loc,
            "schools_count": locality_counts[loc]["school"],
            "hospitals_count": locality_counts[loc]["hospital"],
            "markets_count": locality_counts[loc]["market"],
            "food_places_count": locality_counts[loc]["food"],
            "highway_distance_km": round(min_hw, 1),
            "railway_distance_km": round(min_rw, 1),
            "pollution_level": LOCALITY_POLLUTION[loc],
            "source": "DEMO",
        })

    locality_features_df = pd.DataFrame(features_rows)

    # Drop internal helper column
    clean_amenities_df = amenities_df.drop(columns=["_home_loc"])

    # Enforce exact column order
    clean_amenities_df = clean_amenities_df[[
        "name", "type", "latitude", "longitude", "distance_km", "source"
    ]]
    locality_features_df = locality_features_df[[
        "locality",
        "schools_count",
        "hospitals_count",
        "markets_count",
        "food_places_count",
        "highway_distance_km",
        "railway_distance_km",
        "pollution_level",
        "source",
    ]]

    return clean_amenities_df, locality_features_df


# ==============================================================================
# 2. GENERATE TRANSACTIONS (180 rows, TX001-TX180)
# ==============================================================================

def generate_transactions() -> pd.DataFrame:
    """Generates 180 transaction rows.

    Anchors Rajpura independent_house (1500-2100 sqft) with >=14 transactions
    clustering squarely in the ₹47L–₹55L band.
    Sarai Banjara has exactly 2 transactions.
    """
    rows = []
    tx_idx = 1

    # --- Hero Demo Anchor: 14 transactions for Rajpura independent_house (1500–2100 sqft) ---
    # Prices strictly in ₹47L - ₹55L, dates spanning recent 24 months
    hero_anchor_specs = [
        (1700, 2800, "2026-07-10"),  # 47.60 L
        (1750, 2780, "2026-06-15"),  # 48.65 L
        (1800, 2750, "2026-05-20"),  # 49.50 L
        (1800, 2850, "2026-04-12"),  # 51.30 L
        (1800, 2920, "2026-03-05"),  # 52.56 L
        (1850, 2800, "2026-01-22"),  # 51.80 L
        (1900, 2750, "2025-11-18"),  # 52.25 L
        (1950, 2700, "2025-09-30"),  # 52.65 L
        (1650, 2950, "2025-08-14"),  # 48.68 L
        (1800, 2980, "2025-07-02"),  # 53.64 L
        (1750, 2900, "2025-05-19"),  # 50.75 L
        (1820, 2860, "2025-04-10"),  # 52.05 L
        (1880, 2780, "2025-02-28"),  # 52.26 L
        (1720, 2880, "2024-12-05"),  # 49.54 L
    ]

    r_lat, r_lon = LOCALITIES["Rajpura"]
    for area, rate, d_str in hero_anchor_specs:
        price = int(round(area * rate, -3))  # Round to nearest thousand
        assert 4700000 <= price <= 5500000, f"Anchor price {price} out of 47L-55L band!"
        plat, plon = perturb_coords(r_lat, r_lon, max_offset=0.008)
        rows.append({
            "transaction_id": f"TX{tx_idx:03d}",
            "date": d_str,
            "locality": "Rajpura",
            "property_type": "independent_house",
            "area_sqft": area,
            "sale_price": price,
            "latitude": plat,
            "longitude": plon,
            "source": "DEMO",
        })
        tx_idx += 1

    # Locality distribution for remaining (180 - 14 = 166 transactions):
    # Rajpura: 36 more (total 50)
    # Patiala Road: 35
    # Banur: 35
    # Shambhu: 30
    # Ghanaur: 28
    # Sarai Banjara: 2
    # Sum: 14 + 36 + 35 + 35 + 30 + 28 + 2 = 180
    loc_targets = [
        ("Rajpura", 36),
        ("Patiala Road", 35),
        ("Banur", 35),
        ("Shambhu", 30),
        ("Ghanaur", 28),
        ("Sarai Banjara", 2),
    ]

    property_types = ["plot", "flat", "independent_house", "shop", "agricultural_land"]
    area_ranges = {
        "plot": (900, 3600),
        "flat": (850, 1850),
        "independent_house": (1200, 3000),
        "shop": (200, 1000),
        "agricultural_land": (4000, 20000),
    }

    for loc, count in loc_targets:
        clat, clon = LOCALITIES[loc]
        for _ in range(count):
            ptype = random.choice(property_types)
            min_a, max_a = area_ranges[ptype]
            area = random.randint(min_a // 50, max_a // 50) * 50

            # Transaction date between 2023-01-01 and 2026-09-01
            d_str = random_date(START_DATE, END_DATE)
            dt = datetime.strptime(d_str, "%Y-%m-%d")
            years_elapsed = (dt - START_DATE).days / 365.25

            # Growth rate ~8-11% per year + random noise
            growth = (1.095) ** years_elapsed
            base_rate = BASE_RATES[loc][ptype]
            noise = random.uniform(0.94, 1.06)
            effective_rate = base_rate * growth * noise

            price = int(round(area * effective_rate, -3))
            plat, plon = perturb_coords(clat, clon, max_offset=0.010)

            rows.append({
                "transaction_id": f"TX{tx_idx:03d}",
                "date": d_str,
                "locality": loc,
                "property_type": ptype,
                "area_sqft": area,
                "sale_price": price,
                "latitude": plat,
                "longitude": plon,
                "source": "DEMO",
            })
            tx_idx += 1

    df = pd.DataFrame(rows)
    assert len(df) == 180, f"Expected 180 transactions, got {len(df)}"

    # Sort deterministically by date descending, then id
    df = df.sort_values(by=["date", "transaction_id"], ascending=[False, True]).reset_index(drop=True)
    # Re-assign sequential IDs TX001..TX180
    df["transaction_id"] = [f"TX{i+1:03d}" for i in range(len(df))]

    # Enforce exact column order
    return df[[
        "transaction_id",
        "date",
        "locality",
        "property_type",
        "area_sqft",
        "sale_price",
        "latitude",
        "longitude",
        "source",
    ]]


# ==============================================================================
# 3. GENERATE LISTINGS (140 rows, LS001-LS140)
# ==============================================================================

def generate_listings() -> pd.DataFrame:
    """Generates 140 listing rows.

    Asking prices are modestly ABOVE comparable sale rates.
    age_years = 0 for plot/agricultural_land.
    Anchors Rajpura independent_house (1500-2100 sqft) with >=20 listings
    clustering in ₹48L–₹56L.
    Sarai Banjara has exactly 1 listing.
    """
    rows = []
    ls_idx = 1

    # --- Hero Demo Anchor: 20 listings in Rajpura for independent_house (1500–2100 sqft) ---
    hero_listing_specs = [
        (1650, 2980, 7, 25, "2026-08-20"),  # 49.17 L
        (1700, 2950, 8, 30, "2026-08-14"),  # 50.15 L
        (1750, 2920, 6, 20, "2026-08-01"),  # 51.10 L
        (1800, 2900, 8, 30, "2026-07-28"),  # 52.20 L
        (1800, 2980, 5, 25, "2026-07-15"),  # 53.64 L
        (1800, 3040, 9, 20, "2026-07-05"),  # 54.72 L
        (1850, 2880, 8, 25, "2026-06-25"),  # 53.28 L
        (1900, 2850, 10, 30, "2026-06-18"), # 54.15 L
        (1750, 3020, 4, 30, "2026-06-02"),  # 52.85 L
        (1800, 2950, 8, 25, "2026-05-24"),  # 53.10 L
        (1780, 2960, 7, 20, "2026-05-10"),  # 52.69 L
        (1820, 2940, 6, 30, "2026-04-29"),  # 53.51 L
        (1680, 3050, 5, 25, "2026-04-14"),  # 51.24 L
        (1720, 3020, 9, 20, "2026-03-30"),  # 51.94 L
        (1760, 2970, 8, 25, "2026-03-18"),  # 52.27 L
        (1840, 2920, 7, 30, "2026-02-25"),  # 53.73 L
        (1860, 2890, 8, 25, "2026-02-10"),  # 53.75 L
        (1880, 2860, 9, 20, "2026-01-28"),  # 53.77 L
        (1700, 3080, 4, 30, "2026-01-15"),  # 52.36 L
        (1800, 3020, 8, 25, "2025-12-20"),  # 54.36 L
    ]

    r_lat, r_lon = LOCALITIES["Rajpura"]
    for area, ask_rate, age, road, d_str in hero_listing_specs:
        price = int(round(area * ask_rate, -3))
        assert 4800000 <= price <= 5600000, f"Hero listing price {price} out of range!"
        plat, plon = perturb_coords(r_lat, r_lon, max_offset=0.008)
        rows.append({
            "listing_id": f"LS{ls_idx:03d}",
            "date": d_str,
            "locality": "Rajpura",
            "property_type": "independent_house",
            "area_sqft": area,
            "asking_price": price,
            "age_years": age,
            "road_width_ft": road,
            "latitude": plat,
            "longitude": plon,
            "source": "DEMO",
        })
        ls_idx += 1

    # Remaining 140 - 20 = 120 listings:
    # Rajpura: 20 more (total 40)
    # Patiala Road: 28
    # Banur: 26
    # Shambhu: 24
    # Ghanaur: 21
    # Sarai Banjara: 1
    # Sum: 20 + 20 + 28 + 26 + 24 + 21 + 1 = 140
    listing_targets = [
        ("Rajpura", 20),
        ("Patiala Road", 28),
        ("Banur", 26),
        ("Shambhu", 24),
        ("Ghanaur", 21),
        ("Sarai Banjara", 1),
    ]

    property_types = ["plot", "flat", "independent_house", "shop", "agricultural_land"]
    area_ranges = {
        "plot": (900, 3600),
        "flat": (850, 1850),
        "independent_house": (1200, 3000),
        "shop": (200, 1000),
        "agricultural_land": (4000, 20000),
    }

    road_widths = [18, 20, 25, 30, 40, 60]

    for loc, count in listing_targets:
        clat, clon = LOCALITIES[loc]
        for _ in range(count):
            ptype = random.choice(property_types)
            min_a, max_a = area_ranges[ptype]
            area = random.randint(min_a // 50, max_a // 50) * 50

            d_str = random_date(datetime(2025, 1, 1), END_DATE)  # Listings skewed towards recency
            dt = datetime.strptime(d_str, "%Y-%m-%d")
            years_elapsed = (dt - START_DATE).days / 365.25

            # Growth + ask markup (listings ask 6-12% above base sales rate)
            growth = (1.095) ** years_elapsed
            ask_markup = random.uniform(1.06, 1.12)
            base_rate = BASE_RATES[loc][ptype]
            noise = random.uniform(0.96, 1.05)
            effective_rate = base_rate * growth * ask_markup * noise

            price = int(round(area * effective_rate, -3))

            # age_years must be 0 for plot and agricultural_land
            if ptype in ("plot", "agricultural_land"):
                age = 0
            else:
                age = random.randint(1, 18)

            road = random.choice(road_widths)
            plat, plon = perturb_coords(clat, clon, max_offset=0.010)

            rows.append({
                "listing_id": f"LS{ls_idx:03d}",
                "date": d_str,
                "locality": loc,
                "property_type": ptype,
                "area_sqft": area,
                "asking_price": price,
                "age_years": age,
                "road_width_ft": road,
                "latitude": plat,
                "longitude": plon,
                "source": "DEMO",
            })
            ls_idx += 1

    df = pd.DataFrame(rows)
    assert len(df) == 140, f"Expected 140 listings, got {len(df)}"

    df = df.sort_values(by=["date", "listing_id"], ascending=[False, True]).reset_index(drop=True)
    df["listing_id"] = [f"LS{i+1:03d}" for i in range(len(df))]

    # Enforce exact column order
    return df[[
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
    ]]


def main():
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    print("Generating demo datasets with random.seed(42)...")
    amenities_df, locality_features_df = generate_amenities()
    transactions_df = generate_transactions()
    listings_df = generate_listings()

    # Save to CSV
    tx_file = DATA_DIR / "transactions.csv"
    ls_file = DATA_DIR / "listings.csv"
    am_file = DATA_DIR / "amenities.csv"
    lf_file = DATA_DIR / "locality_features.csv"

    transactions_df.to_csv(tx_file, index=False)
    listings_df.to_csv(ls_file, index=False)
    amenities_df.to_csv(am_file, index=False)
    locality_features_df.to_csv(lf_file, index=False)

    print(f"Generated {len(transactions_df)} rows in {tx_file.name}")
    print(f"Generated {len(listings_df)} rows in {ls_file.name}")
    print(f"Generated {len(amenities_df)} rows in {am_file.name}")
    print(f"Generated {len(locality_features_df)} rows in {lf_file.name}")
    print("Done! All demo data generated deterministically.")


if __name__ == "__main__":
    main()
