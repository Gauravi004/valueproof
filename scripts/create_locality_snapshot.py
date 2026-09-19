import pandas as pd

df = pd.read_csv("output/location_signals.csv")


def make_dots(score):
    if pd.isna(score):
        return "N/A"

    score = int(score)

    filled = "●" * score
    empty = "○" * (5 - score)

    return filled + empty


results = []

for _, row in df.iterrows():

    results.append({
        "property_id": row["property_id"],

        "education": make_dots(
            row["education_accessibility"]
        ),

        "healthcare": make_dots(
            row["healthcare_accessibility"]
        ),

        "markets": make_dots(
            row["market_accessibility"]
        ),

        "connectivity": make_dots(
            row["transport_connectivity"]
        ),

        "food_retail": make_dots(
            row["food_retail_availability"]
        ),

        "pollution": make_dots(
            row["pollution"]
        )
    })


result = pd.DataFrame(results)

result.to_csv(
    "output/locality_snapshot.csv",
    index=False
)

print("Locality snapshots created!")

for _, row in result.iterrows():

    print("\n==============================")
    print("LOCALITY SNAPSHOT")
    print("==============================")

    print("Property      :", row["property_id"])
    print("Education     :", row["education"])
    print("Healthcare    :", row["healthcare"])
    print("Markets       :", row["markets"])
    print("Connectivity  :", row["connectivity"])
    print("Food & Retail :", row["food_retail"])
    print("Pollution     :", row["pollution"])