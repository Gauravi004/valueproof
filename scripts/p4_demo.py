import json

with open("output/location_api.json", "r") as file:
    locations = json.load(file)

property_id = input("Enter property ID (P001/P002/P003): ").strip()

property_data = None

for item in locations:
    if item["property_id"] == property_id:
        property_data = item
        break

if property_data is None:
    print("Property not found.")
else:
    location = property_data["location"]

    print("\n======================================")
    print("      VALUE MAP AI")
    print("   LOCATION INTELLIGENCE")
    print("======================================")

    print("\nProperty ID:", property_id)

    print("\n--- Nearby Facilities ---")
    print("School     :", round(location["school_km"], 2), "km")
    print("Hospital   :", round(location["hospital_km"], 2), "km")
    print("Market     :", round(location["market_km"], 2), "km")
    print("Bank       :", round(location["bank_km"], 2), "km")
    print("Park       :", round(location["park_km"], 2), "km")
    print("Main Road  :", round(location["main_road_km"], 2), "km")

    score = property_data["location_score"]
    quality = property_data["data_quality"]

    print("\n--- Location Assessment ---")
    print("Location Score :", round(score, 2), "/ 10")
    print("Data Quality   :", quality)

    if score >= 8:
        print("Insight        : Strong location accessibility.")
    elif score >= 6:
        print("Insight        : Good location accessibility.")
    elif score >= 4:
        print("Insight        : Moderate location accessibility.")
    else:
        print("Insight        : Limited accessibility based on available data.")

    print("\n--- Valuation Connection ---")
    print("Location evidence is ready for the valuation engine.")