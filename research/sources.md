# ValueMap AI — Research Sources

| # | Topic | Claim / Evidence | Source | Date | URL | Used For |
|---|---|---|---|---|---|---|
| 1 | Indian real estate market | India real estate market was about US$650 billion in 2025 according to IBEF. | IBEF | 2025 | https://www.ibef.org/industry/real-estate-india | Business plan / pitch |
| 2 | Tier-II housing | Housing sales in 15 major Tier-II cities increased 20% in value terms in 2024. | IBEF / PropEquity | 2024 | https://www.ibef.org/industry/real-estate-india | Problem validation |
| 3 | Property market | Residential market trends and infrastructure/location factors are relevant to understanding property markets. | ANAROCK | — | — | Location intelligence |
| 4 | Existing solutions | Housing.com provides property listings and property-related market information. | Housing.com | — | https://housing.com/ | Competitor research |
| 5 | Existing solutions | Magicbricks provides property listings and market/property information. | Magicbricks | — | https://www.magicbricks.com/ | Competitor research |
| 6 | Existing solutions | PropWorth provides property valuation / price-estimation functionality. | PropWorth | — | — | Competitor research |
| 7 | Location data | OpenStreetMap data can be queried using the Overpass API. | OpenStreetMap Wiki | — | https://wiki.openstreetmap.org/wiki/Overpass_API | Technical architecture |

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

`survey/survey_results.csv`

Only actual responses will be included.

The current survey evidence should be described as preliminary because the number of responses is limited.

---

## Prototype Data

The current files in:

`data/`

contain demo/test data used to verify the location-intelligence pipeline.

They should NOT be described as:

- real property transactions
- official government records
- official circle rates
- official registry data
- real market prices

The prototype data is used only to demonstrate that the technical pipeline works.

---

## Technical Sources

### OpenStreetMap

https://www.openstreetmap.org/

OpenStreetMap provides geographic/map data that can be used as a location-data source.

### Overpass API

https://wiki.openstreetmap.org/wiki/Overpass_API

The Overpass API can be used to query selected OpenStreetMap data.

### Python Pandas

https://pandas.pydata.org/

Pandas is used in the prototype for reading, transforming, filtering and preparing tabular location data.

---

## Source Classification

For the ValueMap AI prototype, sources should be classified clearly:

| Source Type | Example | How We Present It |
|---|---|---|
| Official / authoritative source | Government land or registry data | Verified evidence |
| Established research/data source | IBEF, PropEquity, ANAROCK | Research evidence |
| Mapping/location source | OpenStreetMap | Location evidence |
| Property portal | Housing.com, Magicbricks | Market/listing evidence |
| User survey | `survey/survey_results.csv` | User-reported evidence |
| Prototype/demo data | Current files in `data/` | Demo/test data only |
| Product assumption | Internal ValueMap AI assumption | Clearly labelled assumption |

---

## Data Integrity Rules

1. Do not present demo data as real-world data.
2. Do not claim that a facility exists unless it is supported by a data source.
3. Do not invent distances to schools, hospitals, markets, railways, highways, food or retail locations.
4. If a required location category has no verified data, return `null` or `N/A`.
5. Location indicators should provide context and evidence.
6. Location indicators should not automatically become rupee adjustments unless the valuation methodology explicitly defines that relationship.
7. Research claims should be linked to their source whenever possible.
8. Survey findings should include the number of respondents.
9. Competitor descriptions should describe documented functionality rather than claiming that competitors do not provide valuation.
10. Prototype limitations should be disclosed during the hackathon presentation.

---

## Current Prototype Limitation

The current location dataset contains synthetic/demo records used to test the pipeline.

The architecture is designed so that these records can later be replaced or supplemented with verified location data.

The current prototype therefore demonstrates:

Property Coordinates  
↓  
Location Data  
↓  
Distance Calculation  
↓  
Location Features  
↓  
Accessibility Signals  
↓  
Locality Snapshot  
↓  
Location Evidence for Valuation

It does not claim that the current demo records represent actual facilities or actual property-market conditions.

---

## P4 Research Output

The P4 module answers:

> **“Where is this property, what surrounds it, and what evidence supports the location context?”**

It does not determine the final property price.

The final valuation is handled separately by the valuation engine.