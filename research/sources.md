# ValueMap AI — Research Sources

| # | Topic | Claim / Evidence | Source | Used For |
|---|---|---|---|---|
| 1 | Indian real estate market | India real estate market was about US$650 billion in 2025 according to IBEF | IBEF | Business plan / pitch |
| 2 | Tier-II housing | Housing sales in 15 major Tier-II cities increased 20% in value terms in 2024 | IBEF / PropEquity | Problem validation |
| 3 | Property market | Residential market trends and infrastructure/location factors | ANAROCK | Location intelligence |
| 4 | Existing solutions | Property listings and property-related market information | Housing.com | Competitor research |
| 5 | Existing solutions | Property listings and market/property information | Magicbricks | Competitor research |
| 6 | Existing solutions | Property valuation / price estimation | PropWorth | Competitor research |
| 7 | Location data | OpenStreetMap data can be queried using Overpass API | OpenStreetMap Wiki | Technical architecture |

---

## Important Rule

We should distinguish between:

- Directly sourced facts
- Our own observations
- User survey results
- Product assumptions
- Prototype/demo data

We should never present prototype data as real market data.

---

## Survey Evidence

Survey responses will be collected separately.

File:

survey/survey_results.csv

Only actual responses will be included.

---

## Prototype Data

The current files in:

data/

contain demo/test data used to verify the location-intelligence pipeline.

They should NOT be described as real property transactions or official market data.

---

## Technical Sources

OpenStreetMap:
https://www.openstreetmap.org/

Overpass API documentation:
https://wiki.openstreetmap.org/wiki/Overpass_API

Python Pandas:
https://pandas.pydata.org/