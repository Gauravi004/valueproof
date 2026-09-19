import pandas as pd
import math

# Read property locations
properties = pd.read_csv("data/property_location.csv")

# Read nearby amenities
amenities = pd.read_csv("data/amenities.csv")


def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371

    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)
    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1)
        * math.cos(lat2)
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


results = []

# Calculate distances for every property
for _, property_row in properties.iterrows():

    property_id = property_row["property_id"]
    property_lat = property_row["latitude"]
    property_lon = property_row["longitude"]

    for _, amenity in amenities.iterrows():

        distance = calculate_distance(
            property_lat,
            property_lon,
            amenity["latitude"],
            amenity["longitude"]
        )

        results.append({
            "property_id": property_id,
            "name": amenity["name"],
            "type": amenity["type"],
            "distance_km": distance
        })


result_df = pd.DataFrame(results)

result_df.to_csv(
    "output/amenities_with_distance.csv",
    index=False
)

print("Distance calculation completed!")

print("\nNearest places:")

print(
    result_df
    .sort_values(["property_id", "distance_km"])
    .groupby("property_id")
    .head(5)
)