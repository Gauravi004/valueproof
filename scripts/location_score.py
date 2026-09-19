import pandas as pd

# Read the location features
df = pd.read_csv("output/location_features.csv")


# Convert distance into a score
def distance_score(distance):
    if distance <= 0.5:
        return 10
    elif distance <= 1:
        return 8
    elif distance <= 2:
        return 6
    elif distance <= 5:
        return 4
    else:
        return 2


# Calculate individual scores
df["school_score"] = df["school_km"].apply(distance_score)
df["hospital_score"] = df["hospital_km"].apply(distance_score)
df["market_score"] = df["market_km"].apply(distance_score)
df["bank_score"] = df["bank_km"].apply(distance_score)
df["park_score"] = df["park_km"].apply(distance_score)
df["main_road_score"] = df["main_road_km"].apply(distance_score)


# Calculate overall location score
df["location_score"] = (
    df["school_score"]
    + df["hospital_score"]
    + df["market_score"]
    + df["bank_score"]
    + df["park_score"]
    + df["main_road_score"]
) / 6


# Save the result
df.to_csv(
    "output/location_score.csv",
    index=False
)

print("Location score created!")

print(
    df[
        [
            "property_id",
            "school_score",
            "hospital_score",
            "market_score",
            "bank_score",
            "park_score",
            "main_road_score",
            "location_score"
        ]
    ]
)