import pandas as pd

features = pd.read_csv("output/location_features.csv")
scores = pd.read_csv("output/location_score.csv")
quality = pd.read_csv("output/location_quality.csv")

property_id = input("Enter property ID (P001/P002/P003): ").strip()

property_features = features[
    features["property_id"] == property_id
]

property_score = scores[
    scores["property_id"] == property_id
]

property_quality = quality[
    quality["property_id"] == property_id
]

if property_features.empty:
    print("Property not found.")
else:
    row = property_features.iloc[0]

    score = property_score.iloc[0]["location_score"]
    quality_level = property_quality.iloc[0]["data_quality"]

    print("\n======================================")
    print("      VALUE MAP AI")
    print("   LOCATION INTELLIGENCE")
    print("======================================")

    print("\nProperty ID:", property_id)

    print("\n--- Nearby Facilities ---")
    print("School     :", round(row["school_km"], 2), "km")
    print("Hospital   :", round(row["hospital_km"], 2), "km")
    print("Market     :", round(row["market_km"], 2), "km")
    print("Bank       :", round(row["bank_km"], 2), "km")
    print("Park       :", round(row["park_km"], 2), "km")
    print("Main Road  :", round(row["main_road_km"], 2), "km")

    print("\n--- Location Assessment ---")
    print("Location Score :", round(score, 2), "/ 10")
    print("Data Quality   :", quality_level)

    if score >= 8:
        print("Insight        : Strong location accessibility.")
    elif score >= 6:
        print("Insight        : Good location accessibility.")
    elif score >= 4:
        print("Insight        : Moderate location accessibility.")
    else:
        print("Insight        : Limited accessibility based on available data.")

    print("\n--- Valuation Connection ---")
    print("These location features can be supplied")
    print("to the ValueMap AI valuation engine.")