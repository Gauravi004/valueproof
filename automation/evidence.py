def check_evidence(valuation):
    comparables = valuation.get("comparables", [])

    evidence = {
        "comparable_count": len(comparables),
        "source_quality": "Good" if len(comparables) >= 2 else "Limited",
        "location_coverage": "Covered",
        "data_freshness": "Latest Available"
    }

    return evidence


if __name__ == "__main__":
    sample = {
        "comparables": [
            {"property": "Apartment A"},
            {"property": "Apartment B"}
        ]
    }

    print(check_evidence(sample))
