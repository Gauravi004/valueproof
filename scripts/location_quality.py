import pandas as pd

df = pd.read_csv("output/location_features.csv")


feature_columns = [
    "school_km",
    "hospital_km",
    "market_km",
    "bank_km",
    "park_km",
    "main_road_km"
]


def quality_level(row):
    available = row[feature_columns].notna().sum()

    if available >= 5:
        return "HIGH"
    elif available >= 3:
        return "MEDIUM"
    else:
        return "LOW"


df["data_quality"] = df.apply(quality_level, axis=1)

df.to_csv(
    "output/location_quality.csv",
    index=False
)

print("Location data quality calculated!")

print(
    df[
        [
            "property_id",
            "data_quality"
        ]
    ]
)