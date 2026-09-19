import pandas as pd

features = pd.read_csv("output/location_features.csv")
amenities = pd.read_csv("output/amenities_with_distance.csv")


def distance_score(distance):
    if pd.isna(distance):
        return None
    elif distance <= 0.5:
        return 5
    elif distance <= 1:
        return 4
    elif distance <= 2:
        return 3
    elif distance <= 5:
        return 2
    else:
        return 1


def create_evidence(amenity_type, property_id):
    data = amenities[
        (amenities["property_id"] == property_id)
        & (amenities["type"] == amenity_type)
    ]

    if data.empty:
        return "No verified data available"

    count = len(data)
    nearest = data["distance_km"].min()

    if nearest <= 3:
        return f"{count} {amenity_type}(s) within 3 km"
    else:
        return f"{count} {amenity_type}(s); nearest is {nearest:.2f} km"


results = []

for _, row in features.iterrows():

    property_id = row["property_id"]

    education_score = distance_score(row["school_km"])
    healthcare_score = distance_score(row["hospital_km"])
    market_score = distance_score(row["market_km"])

    # Transport
    transport_distances = [
        row["highway_km"],
        row["railway_km"],
        row["main_road_km"]
    ]

    available_transport = [
        distance
        for distance in transport_distances
        if pd.notna(distance)
    ]

    if available_transport:
        transport_score = distance_score(min(available_transport))
    else:
        transport_score = None

    # Food and retail
    food_retail_distances = [
        row["food_km"],
        row["retail_km"]
    ]

    available_food_retail = [
        distance
        for distance in food_retail_distances
        if pd.notna(distance)
    ]

    if available_food_retail:
        food_retail_score = distance_score(
            min(available_food_retail)
        )
    else:
        food_retail_score = None

    results.append({

        "property_id": property_id,

        "education_accessibility": education_score,
        "education_evidence": create_evidence(
            "school",
            property_id
        ),

        "healthcare_accessibility": healthcare_score,
        "healthcare_evidence": create_evidence(
            "hospital",
            property_id
        ),

        "market_accessibility": market_score,
        "market_evidence": create_evidence(
            "market",
            property_id
        ),

        "transport_connectivity": transport_score,
        "transport_evidence": (
            "Verified transport data available"
            if available_transport
            else "No verified transport data available"
        ),

        "food_retail_availability": food_retail_score,
        "food_retail_evidence": (
            "Verified food/retail data available"
            if available_food_retail
            else "No verified food/retail data available"
        ),

        "pollution": None,
        "pollution_evidence": "No verified pollution data available"
    })


result = pd.DataFrame(results)

result.to_csv(
    "output/location_signals.csv",
    index=False
)

print("Location signals created!")

print("\nLocation Signals:")
print(result)