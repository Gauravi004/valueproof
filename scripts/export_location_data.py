import pandas as pd
import json

# Read our location score data
df = pd.read_csv("output/location_score.csv")

# Take the first property
row = df.iloc[0]

# Create data for P1
location_data = {
    "property_id": row["property_id"],
    "location_features": {
        "school_km": row["school_km"],
        "hospital_km": row["hospital_km"],
        "market_km": row["market_km"],
        "bank_km": row["bank_km"],
        "park_km": row["park_km"],
        "main_road_km": row["main_road_km"]
    },
    "location_score": row["location_score"]
}

# Save as JSON
with open("output/location_data.json", "w") as file:
    json.dump(location_data, file, indent=4)

print("Location data exported successfully!")

print(json.dumps(location_data, indent=4))