import requests
import pandas as pd
import time


PROPERTY_FILE = "data/property_location.csv"
OUTPUT_FILE = "output/osm_location_data.csv"

RADIUS = 10000

properties = pd.read_csv(PROPERTY_FILE)

all_records = []


for _, property_row in properties.iterrows():

    property_id = property_row["property_id"]
    lat = property_row["latitude"]
    lon = property_row["longitude"]

    print("\n--------------------------------")
    print("Property:", property_id)
    print("Latitude:", lat)
    print("Longitude:", lon)
    print("--------------------------------")

    query = f"""
    [out:json][timeout:60];

    (
      nwr["railway"="station"](around:{RADIUS},{lat},{lon});
      nwr["railway"="halt"](around:{RADIUS},{lat},{lon});

      nwr["amenity"="restaurant"](around:{RADIUS},{lat},{lon});
      nwr["amenity"="cafe"](around:{RADIUS},{lat},{lon});
      nwr["amenity"="fast_food"](around:{RADIUS},{lat},{lon});

      nwr["shop"](around:{RADIUS},{lat},{lon});

      nwr["highway"="primary"](around:{RADIUS},{lat},{lon});
      nwr["highway"="secondary"](around:{RADIUS},{lat},{lon});
      nwr["highway"="trunk"](around:{RADIUS},{lat},{lon});
    );

    out center;
    """

    url = "https://overpass-api.de/api/interpreter"

    headers = {
        "User-Agent": "ValueMapAI-Hackathon/1.0"
    }

    try:

        response = requests.post(
            url,
            data={"data": query},
            headers=headers,
            timeout=90
        )

        print("Status:", response.status_code)

        if response.status_code != 200:

            print(
                "OSM request failed for",
                property_id
            )

            print(
                "Response:",
                response.text[:200]
            )

            continue


        data = response.json()

        count = 0


        for element in data.get("elements", []):

            tags = element.get("tags", {})

            center = element.get("center", {})

            latitude = element.get(
                "lat",
                center.get("lat")
            )

            longitude = element.get(
                "lon",
                center.get("lon")
            )


            if latitude is None or longitude is None:
                continue


            # Determine the type

            if "railway" in tags:

                amenity_type = "railway"


            elif tags.get("amenity") in [
                "restaurant",
                "cafe",
                "fast_food"
            ]:

                amenity_type = "food"


            elif "shop" in tags:

                amenity_type = "retail"


            elif "highway" in tags:

                amenity_type = "highway"


            else:

                continue


            name = tags.get(
                "name",
                "Unnamed"
            )


            all_records.append({

                "property_id": property_id,

                "name": name,

                "type": amenity_type,

                "latitude": latitude,

                "longitude": longitude,

                "source": "OpenStreetMap"

            })


            count += 1


        print(
            "Records found:",
            count
        )


    except requests.exceptions.Timeout:

        print(
            "Request timed out for",
            property_id
        )


    except requests.exceptions.RequestException as error:

        print(
            "Request error for",
            property_id,
            ":",
            error
        )


    except Exception as error:

        print(
            "Unexpected error for",
            property_id,
            ":",
            error
        )


    # Small delay between requests

    time.sleep(3)


# Create output dataframe

result = pd.DataFrame(all_records)


# Save output

result.to_csv(
    OUTPUT_FILE,
    index=False
)


print("\n================================")
print("OSM COLLECTION COMPLETE")
print("================================")

print(
    "Total records:",
    len(result)
)


if not result.empty:

    print("\nRecords by property:")

    print(
        result[
            "property_id"
        ].value_counts()
    )


    print("\nRecords by type:")

    print(
        result[
            "type"
        ].value_counts()
    )


print(
    "\nSaved to:",
    OUTPUT_FILE
)