def validate_input(data):
    errors = []

    if not data.get("location"):
        errors.append("Location is required.")

    if not data.get("property_type"):
        errors.append("Property type is required.")

    if data.get("area_sqft", 0) <= 0:
        errors.append("Area must be greater than 0.")

    if data.get("intent") not in ["buy", "sell"]:
        errors.append("Intent must be either 'buy' or 'sell'.")

    return {
        "valid": len(errors) == 0,
        "errors": errors
    }


if __name__ == "__main__":
    sample = {
        "location": "Zirakpur",
        "property_type": "Apartment",
        "area_sqft": 1450,
        "intent": "sell"
    }

    print(validate_input(sample))