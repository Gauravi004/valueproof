import requests

latitude = 30.12
longitude = 76.46

query = f"""
[out:json][timeout:25];

(
  node["amenity"="school"](around:5000,{latitude},{longitude});
  node["amenity"="hospital"](around:5000,{latitude},{longitude});
  node["amenity"="marketplace"](around:5000,{latitude},{longitude});
);

out;
"""
url = "https://overpass.private.coffee/api/interpreter"

try:
    response = requests.post(
        url,
        data={"data": query},
        timeout=40
    )

    response.raise_for_status()

    data = response.json()

    print("Number of places found:", len(data["elements"]))

    for place in data["elements"][:10]:
        name = place.get("tags", {}).get("name", "Unnamed place")
        print(name)

except requests.exceptions.Timeout:
    print("The OpenStreetMap server took too long to respond.")

except requests.exceptions.RequestException as e:
    print("Connection error:", e)