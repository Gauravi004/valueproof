import pandas as pd


demo_file = "data/amenities.csv"
osm_file = "output/osm_missing_location_data.csv"
output_file = "data/amenities.csv"


demo = pd.read_csv(demo_file)
osm = pd.read_csv(osm_file)


# Keep only useful OSM columns
osm = osm[
    [
        "name",
        "type",
        "latitude",
        "longitude",
        "source"
    ]
]


# Combine existing demo data with OSM data
combined = pd.concat(
    [demo, osm],
    ignore_index=True
)


# Remove exact duplicates
combined = combined.drop_duplicates(
    subset=[
        "name",
        "type",
        "latitude",
        "longitude"
    ]
)


combined.to_csv(
    output_file,
    index=False
)


print("Location data merged successfully!")

print("\nRecords by source:")
print(combined["source"].value_counts())

print("\nRecords by type:")
print(combined["type"].value_counts())

print("\nTotal records:", len(combined))