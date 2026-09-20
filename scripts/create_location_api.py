import pandas as pd
import json

# Load location coordinates for each property
property_locations = pd.read_csv("data/property_location.csv")

# Load P4 location data
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

    # Find coordinates for this property
    property_location = property_locations[
        property_locations["property_id"] == property_id
    ]

    # Skip property if coordinates are not available
    if property_location.empty:
        continue

    property_location = property_location.iloc[0]

    # Find location signals
    signal_data = signals[
        signals["property_id"] == property_id
    ]

    # Find locality snapshot
    snapshot_data = snapshots[
        snapshots["property_id"] == property_id
    ]

    # Skip if required data is missing
    if signal_data.empty or snapshot_data.empty:
        continue

    signal_row = signal_data.iloc[0]
    snapshot_row = snapshot_data.iloc[0]

    # Create property location data
    property_data = {

        "property_id": property_id,

        "location": {

            # NEW: Property coordinates
            "latitude": clean_value(
                property_location["latitude"]
            ),

            "longitude": clean_value(
                property_location["longitude"]
            ),

            "source": "DEMO + OpenStreetMap",

            "school_km": clean_value(
                row["school_km"]
            ),

            "hospital_km": clean_value(
                row["hospital_km"]
            ),

            "market_km": clean_value(
                row["market_km"]
            ),

            "highway_km": clean_value(
                row["highway_km"]
            ),

            "railway_km": clean_value(
                row["railway_km"]
            ),

            "bank_km": clean_value(
                row["bank_km"]
            ),

            "park_km": clean_value(
                row["park_km"]
            ),

            "food_km": clean_value(
                row["food_km"]
            ),

            "retail_km": clean_value(
                row["retail_km"]
            ),

            "main_road_km": clean_value(
                row["main_road_km"]
            )
        },

        "location_signals": {

            "education_accessibility": clean_value(
                signal_row["education_accessibility"]
            ),

            "education_evidence": clean_value(
                signal_row["education_evidence"]
            ),

            "healthcare_accessibility": clean_value(
                signal_row["healthcare_accessibility"]
            ),

            "healthcare_evidence": clean_value(
                signal_row["healthcare_evidence"]
            ),

            "market_accessibility": clean_value(
                signal_row["market_accessibility"]
            ),

            "market_evidence": clean_value(
                signal_row["market_evidence"]
            ),

            "transport_connectivity": clean_value(
                signal_row["transport_connectivity"]
            ),

            "transport_evidence": clean_value(
                signal_row["transport_evidence"]
            ),

            "food_retail_availability": clean_value(
                signal_row["food_retail_availability"]
            ),

            "food_retail_evidence": clean_value(
                signal_row["food_retail_evidence"]
            ),

            "pollution": None,

            "pollution_evidence":
                "No verified pollution data available"
        },

        "locality_snapshot": {

            "education": clean_value(
                snapshot_row["education"]
            ),

            "healthcare": clean_value(
                snapshot_row["healthcare"]
            ),

            "markets": clean_value(
                snapshot_row["markets"]
            ),

            "connectivity": clean_value(
                snapshot_row["connectivity"]
            ),

            "food_retail": clean_value(
                snapshot_row["food_retail"]
            ),

            "pollution": clean_value(
                snapshot_row["pollution"]
            )
        },

        "data_quality": "MIXED"
    }

    results.append(property_data)


# Save final API-ready JSON
with open(
    "output/location_api.json",
    "w"
) as file:

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