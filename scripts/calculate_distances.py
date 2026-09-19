import pandas as pd
import math

# Read our demo amenities data
df = pd.read_csv("data/amenities.csv")

# Property location
property_lat = 30.12
property_lon = 76.46


# Function to calculate distance
def calculate_distance(lat1, lon1, lat2, lon2):

    R = 6371  # Earth's radius in kilometres

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


# Calculate distance for every place
df["distance_km"] = df.apply(
    lambda row: calculate_distance(
        property_lat,
        property_lon,
        row["latitude"],
        row["longitude"]
    ),
    axis=1
)

# Save result
df.to_csv("output/amenities_with_distance.csv", index=False)

print("Distance calculation completed!")

print("\nNearest places:")

print(
    df.sort_values("distance_km")[
        ["name", "type", "distance_km"]
    ].head(10)
)