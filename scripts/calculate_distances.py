import pandas as pd
import math


PROPERTY_FILE = "data/property_location.csv"
DEMO_FILE = "data/amenities.csv"
OSM_FILE = "output/osm_location_data.csv"
OUTPUT_FILE = "output/amenities_with_distance.csv"


def haversine_distance(lat1, lon1, lat2, lon2):

    R = 6371

    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)

    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        math.sin(dlat / 2) ** 2
        +
        math.cos(lat1)
        * math.cos(lat2)
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )

    return R * c


# Load property locations

properties = pd.read_csv(
    PROPERTY_FILE
)


# Load original demo amenities

demo = pd.read_csv(
    DEMO_FILE
)


# The existing demo amenities belong to P001

demo["property_id"] = "P001"


# Load property-specific OSM data

osm = pd.read_csv(
    OSM_FILE
)


# Keep only required columns

osm = osm[
    [
        "property_id",
        "name",
        "type",
        "latitude",
        "longitude",
        "source"
    ]
]


# Add source to demo data if needed

if "source" not in demo.columns:

    demo["source"] = "DEMO"


demo = demo[
    [
        "property_id",
        "name",
        "type",
        "latitude",
        "longitude",
        "source"
    ]
]


# Combine demo + OSM data

amenities = pd.concat(
    [demo, osm],
    ignore_index=True
)


results = []


for _, property_row in properties.iterrows():

    property_id = property_row["property_id"]

    property_lat = property_row["latitude"]

    property_lon = property_row["longitude"]


    # Only use amenities belonging to this property

    property_amenities = amenities[
        amenities["property_id"] == property_id
    ]


    for _, amenity in property_amenities.iterrows():

        distance = haversine_distance(
            property_lat,
            property_lon,
            amenity["latitude"],
            amenity["longitude"]
        )


        results.append({

            "property_id": property_id,

            "name": amenity["name"],

            "type": amenity["type"],

            "distance_km": round(
                distance,
                3
            ),

            "source": amenity["source"]

        })


result = pd.DataFrame(
    results
)


# Save result

result.to_csv(
    OUTPUT_FILE,
    index=False
)


print("Distance calculation completed!")

print(
    "\nRecords by property:"
)

print(
    result["property_id"].value_counts()
)


print(
    "\nRecords by source:"
)

print(
    result["source"].value_counts()
)


print(
    "\nNearest place for each property:"
)


for property_id in properties["property_id"]:

    data = result[
        result["property_id"] == property_id
    ]

    if not data.empty:

        nearest = data.loc[
            data["distance_km"].idxmin()
        ]

        print(
            property_id,
            "->",
            nearest["name"],
            "|",
            nearest["type"],
            "|",
            nearest["distance_km"],
            "km",
            "|",
            nearest["source"]
        )