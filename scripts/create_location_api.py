import pandas as pd
import json


features = pd.read_csv("output/location_features.csv")
signals = pd.read_csv("output/location_signals.csv")
snapshots = pd.read_csv("output/locality_snapshot.csv")

def clean_value(value):
    if pd.isna(value):
        return None

    if hasattr(value, "item"):
        return value.item()

    return value


results = []


for _, row in features.iterrows():

    property_id = row["property_id"]

    signal_row = signals[
        signals["property_id"] == property_id
    ].iloc[0]

    snapshot_row = snapshots[
        snapshots["property_id"] == property_id
    ].iloc[0]

    property_data = {
        "property_id": property_id,

        "location": {
            "source": "DEMO",
            "school_km": clean_value(row["school_km"]),
            "hospital_km": clean_value(row["hospital_km"]),
            "market_km": clean_value(row["market_km"]),
            "highway_km": clean_value(row["highway_km"]),
            "railway_km": clean_value(row["railway_km"]),
            "bank_km": clean_value(row["bank_km"]),
            "park_km": clean_value(row["park_km"]),
            "food_km": clean_value(row["food_km"]),
            "retail_km": clean_value(row["retail_km"]),
            "main_road_km": clean_value(row["main_road_km"])
        },

       "location_signals": {
    "education_accessibility":
        clean_value(signal_row["education_accessibility"]),

    "education_evidence":
        clean_value(signal_row["education_evidence"]),

    "healthcare_accessibility":
        clean_value(signal_row["healthcare_accessibility"]),

    "healthcare_evidence":
        clean_value(signal_row["healthcare_evidence"]),

    "market_accessibility":
        clean_value(signal_row["market_accessibility"]),

    "market_evidence":
        clean_value(signal_row["market_evidence"]),

    "transport_connectivity":
        clean_value(signal_row["transport_connectivity"]),

    "transport_evidence":
        clean_value(signal_row["transport_evidence"]),

    "food_retail_availability":
        clean_value(signal_row["food_retail_availability"]),

    "food_retail_evidence":
        clean_value(signal_row["food_retail_evidence"]),

    "pollution":
        clean_value(signal_row["pollution"]),

    "pollution_evidence":
        clean_value(signal_row["pollution_evidence"])
},

        "locality_snapshot": {
            "education":
                clean_value(snapshot_row["education"]),

            "healthcare":
                clean_value(snapshot_row["healthcare"]),

            "markets":
                clean_value(snapshot_row["markets"]),

            "connectivity":
                clean_value(snapshot_row["connectivity"]),

            "food_retail":
                clean_value(snapshot_row["food_retail"]),

            "pollution":
                clean_value(snapshot_row["pollution"])
        },

        "data_quality": "DEMO"
    }

    results.append(property_data)


with open("output/location_api.json", "w") as file:

    json.dump(
        results,
        file,
        indent=4,
        allow_nan=False
    )


print("Location API data created!")

print(
    json.dumps(
        results,
        indent=4
    )
)