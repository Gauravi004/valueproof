import pandas as pd

# Read the amenities with calculated distances
df = pd.read_csv("output/amenities_with_distance.csv")

# Create a dictionary to store the nearest distance
features = {}

# Check each type of location
for place_type in df["type"].unique():

    places = df[df["type"] == place_type]

    # Find the nearest place of this type
    nearest_distance = places["distance_km"].min()

    features[place_type] = nearest_distance


# Create one row for the property
result = pd.DataFrame([{
    "property_id": "P001",
    "school_km": features.get("school"),
    "hospital_km": features.get("hospital"),
    "market_km": features.get("market"),
    "bank_km": features.get("bank"),
    "park_km": features.get("park"),
    "main_road_km": features.get("main_road")
}])

# Save the location features
result.to_csv(
    "output/location_features.csv",
    index=False
)

print("Location features created!")

print("\nLocation features:")
print(result)