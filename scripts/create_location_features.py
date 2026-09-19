import pandas as pd

df = pd.read_csv("output/amenities_with_distance.csv")

results = []

for property_id in df["property_id"].unique():

    property_data = df[df["property_id"] == property_id]

    features = {}

    for place_type in property_data["type"].unique():

        places = property_data[
            property_data["type"] == place_type
        ]

        features[place_type] = places["distance_km"].min()

    results.append({
        "property_id": property_id,
        "school_km": features.get("school"),
        "hospital_km": features.get("hospital"),
        "market_km": features.get("market"),
        "bank_km": features.get("bank"),
        "park_km": features.get("park"),
        "main_road_km": features.get("main_road")
    })


result = pd.DataFrame(results)

result.to_csv(
    "output/location_features.csv",
    index=False
)

print("Location features created!")

print("\nLocation features:")
print(result)