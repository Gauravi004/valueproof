import pandas as pd
import json

# Load generated location data
features = pd.read_csv("output/location_features.csv")
signals = pd.read_csv("output/location_signals.csv")
snapshots = pd.read_csv("output/locality_snapshot.csv")


def clean_value(value):
    """
    Convert pandas/NumPy values into JSON-safe values.
    Missing values become None.
    """
    if pd.isna(value):
        return None

    if hasattr(value, "item"):
        return value.item()

    return value


results = []


for _, row in features.iterrows():

    property_id = row["property_id"]

    # Find matching signal data
    signal_data = signals[
        signals["property_id"] == property_id
    ]

    # Find matching locality snapshot
    snapshot_data = snapshots[
        snapshots["property_id"] == property_id
    ]

    # Safety check
    if signal_data.empty or snapshot_data.empty:
        continue

    signal_row = signal_data.iloc[0]
    snapshot_row = snapshot_data.iloc[0]

    property_data = {

        # Property ID
        "property_id": property_id,

        # Location information
        "location": {

            # Data comes from demo amenities + OpenStreetMap
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

        # Explainable location signals
        "location_signals": {

            "education_accessibility":
                clean_value(
                    signal_row[
                        "education_accessibility"
                    ]
                ),

            "education_evidence":
                clean_value(
                    signal_row[
                        "education_evidence"
                    ]
                ),

            "healthcare_accessibility":
                clean_value(
                    signal_row[
                        "healthcare_accessibility"
                    ]
                ),

            "healthcare_evidence":
                clean_value(
                    signal_row[
                        "healthcare_evidence"
                    ]
                ),

            "market_accessibility":
                clean_value(
                    signal_row[
                        "market_accessibility"
                    ]
                ),

            "market_evidence":
                clean_value(
                    signal_row[
                        "market_evidence"
                    ]
                ),

            "transport_connectivity":
                clean_value(
                    signal_row[
                        "transport_connectivity"
                    ]
                ),

            "transport_evidence":
                clean_value(
                    signal_row[
                        "transport_evidence"
                    ]
                ),

            "food_retail_availability":
                clean_value(
                    signal_row[
                        "food_retail_availability"
                    ]
                ),

            "food_retail_evidence":
                clean_value(
                    signal_row[
                        "food_retail_evidence"
                    ]
                ),

            # Pollution data is not currently available
            "pollution": None,

            "pollution_evidence":
                "No verified pollution data available"
        },

        # Locality snapshot for frontend
        "locality_snapshot": {

            "education":
                clean_value(
                    snapshot_row["education"]
                ),

            "healthcare":
                clean_value(
                    snapshot_row["healthcare"]
                ),

            "markets":
                clean_value(
                    snapshot_row["markets"]
                ),

            "connectivity":
                clean_value(
                    snapshot_row["connectivity"]
                ),

            "food_retail":
                clean_value(
                    snapshot_row["food_retail"]
                ),

            "pollution":
                clean_value(
                    snapshot_row["pollution"]
                )
        },

        # Important: this is mixed data,
        # not entirely official/real market data.
        "data_quality": "MIXED"
    }

    results.append(property_data)


# Save JSON
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