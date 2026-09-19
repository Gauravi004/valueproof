import pandas as pd
import json

features = pd.read_csv("output/location_features.csv")
scores = pd.read_csv("output/location_score.csv")
quality = pd.read_csv("output/location_quality.csv")

result = []

for _, row in features.iterrows():
    property_id = row["property_id"]

    score_row = scores[
        scores["property_id"] == property_id
    ]

    quality_row = quality[
        quality["property_id"] == property_id
    ]

    location_score = score_row["location_score"].iloc[0]
    data_quality = quality_row["data_quality"].iloc[0]

    property_data = {
        "property_id": property_id,
        "location": {
            "school_km": row["school_km"],
            "hospital_km": row["hospital_km"],
            "market_km": row["market_km"],
            "bank_km": row["bank_km"],
            "park_km": row["park_km"],
            "main_road_km": row["main_road_km"]
        },
        "location_score": location_score,
        "data_quality": data_quality
    }

    result.append(property_data)

with open("output/location_api.json", "w") as file:
    json.dump(result, file, indent=4)

print("Location API data created!")
print(json.dumps(result, indent=4))