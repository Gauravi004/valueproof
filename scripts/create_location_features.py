import pandas as pd

df = pd.read_csv("output/amenities_with_distance.csv")

expected_types = [
    "school",
    "hospital",
    "market",
    "highway",
    "railway",
    "bank",
    "park",
    "food",
    "retail",
    "main_road"
]

results = []

for property_id in df["property_id"].unique():

    property_data = df[df["property_id"] == property_id]

    features = {}

    for place_type in expected_types:

        places = property_data[
            property_data["type"] == place_type
        ]

        if len(places) > 0:
            features[place_type] = places["distance_km"].min()
        else:
            features[place_type] = None

    results.append({
        "property_id": property_id,

        "school_km": features["school"],
        "hospital_km": features["hospital"],
        "market_km": features["market"],

        "highway_km": features["highway"],
        "railway_km": features["railway"],

        "bank_km": features["bank"],
        "park_km": features["park"],

        "food_km": features["food"],
        "retail_km": features["retail"],

        "main_road_km": features["main_road"]
    })

result = pd.DataFrame(results)

result.to_csv(
    "output/location_features.csv",
    index=False
)

print("Location features created!")

print("\nLocation features:")
print(result)