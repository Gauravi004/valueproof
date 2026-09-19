# ValueMap AI — Market & Problem Research

## 1. Problem

Property buyers and sellers need to decide what a property is reasonably worth.

The difficulty is that a property's value can depend on multiple factors:

- Property size
- Property type
- Location
- Nearby amenities
- Road and transport connectivity
- Condition of the property
- Comparable property prices
- Local market conditions

In smaller and emerging markets, obtaining a transparent, data-backed reference price can be more difficult when transaction data and comparable-property information are less standardized or less easily accessible.

ValueMap AI addresses this problem by combining comparable properties with location intelligence and presenting the resulting estimate with supporting evidence.

---

## 2. Why This Market Matters

India has a large and active residential property market.

According to IBEF, India's real estate market was valued at approximately
US$650 billion in 2025 and is projected to reach US$5.80 trillion by 2047.

Source:
https://www.ibef.org/industry/real-estate-india

---

## 3. Tier-II Market Opportunity

Tier-II cities are becoming increasingly important in India's residential
real estate market.

ANAROCK's 2025 residential market outlook identified Tier-II cities as
important growth drivers, citing factors such as infrastructure improvement,
job creation and affordability.

Source:
ANAROCK Indian Residential Market Annual Update 2024

---

## 4. Evidence of Tier-II Housing Activity

According to PropEquity data reported by IBEF, housing sales in 15 major
Tier-II cities increased by 20% in value terms in 2024, reaching approximately
₹1,52,552 crore.

The number of units sold increased by 4%, from 1,71,903 in 2023 to 1,78,771
in 2024.

Source:
https://www.ibef.org/news/housing-sales-in-top-15-tier-ii-cities-rise-20-to-rs-1-52-552-crore-us-17.56-billion-propequity

---

## 5. Why Location Matters

Property prices are influenced by local conditions and accessibility.

ANAROCK's 2025 market analysis noted that properties near transportation
hubs and infrastructure can command different valuations, while integrated
developments and amenities can influence buyer preferences.

This supports ValueMap AI's decision to include location intelligence as an
input rather than relying only on property size and historical prices.

Source:
ANAROCK Q1 2025 Pan-India Residential Market Viewpoints

---

## 6. Our Research Hypothesis

Our hypothesis is:

"Buyers and sellers would find a property valuation more useful when the
estimated price is accompanied by understandable evidence showing comparable
properties and relevant location factors."

We will validate this through user interviews/surveys with:

- Property buyers
- Property sellers
- Homeowners
- Local brokers/agents

---

## 7. Questions for User Validation

1. How do you currently estimate a property's price?

2. Have you ever received different price estimates for the same property?

3. Which factors do you consider when deciding whether a property is fairly
   priced?

4. Would you use a tool that estimates property value automatically?

5. Would you trust an estimate more if the tool showed comparable properties?

6. Would nearby schools, hospitals, markets and transport information be
   useful to you?

7. Which would be more useful:
   - Estimated price
   - Price range
   - Comparable properties
   - Location analysis
   - Negotiation guidance
   - All of the above

---

## 8. Validation Rule

We will report only actual responses.

We will NOT invent survey results.

Survey results will be stored separately in:

survey/survey_results.csv

---
## 8A. Preliminary User Validation

A Google Form was created to collect initial feedback from potential property buyers and sellers.

### Response count

**Responses collected: 1 (n=1)**

Because only one response has been collected, these findings are treated as preliminary qualitative validation and are not considered statistically representative.

### Respondent profile

The respondent identified as:

* Both a property buyer and seller
* Primarily dealing with a Tier-II city

### Key observations

The respondent reported using:

* Friends/family
* Government records
* Recent nearby property deals

when trying to understand property prices.

The respondent indicated that the following information would be useful:

* Recent transaction prices
* Distance from schools
* Distance from hospitals
* Distance from markets

For an online valuation to be trustworthy, the respondent selected:

* Location factors
* Nearby amenities
* Explanation of how the estimate was calculated
* Confidence/data-quality information

The respondent preferred a **price range** rather than only a single estimated price.

The respondent also considered the proposed ValueMap AI concept useful and indicated that they would probably use such a tool before buying or selling property.

The most valuable proposed feature selected by the respondent was:

**Location/amenity analysis**

### Initial validation insight

The initial response supports the product hypothesis that property valuation can be more useful when an estimated price is accompanied by understandable evidence.

In particular, the response supports exploring:

* Comparable-property evidence
* Recent transaction information
* Location intelligence
* Nearby amenities
* Price ranges
* Explainable valuation
* Data-quality indicators

### Limitation

This is an initial response from **one respondent (n=1)**.

It cannot be used to claim that these preferences represent the wider population of property buyers or sellers.

Further responses would be required for quantitative validation.


## 9. Product Hypothesis

ValueMap AI combines:

Property details
        +
Comparable properties
        +
Location intelligence
        +
Valuation engine
        ↓
Estimated value range
        +
Evidence
        +
Confidence
        +
AI explanation

The AI explanation layer explains the result.

The numerical valuation should be produced by the valuation/statistical
engine rather than by the language model itself.

---

## 10. Important Limitation

The quality of the valuation depends on the availability and quality of
comparable-property and location data.

Therefore, the system should communicate data availability and confidence
rather than presenting every estimate as equally certain.

---

## Sources

1. IBEF — Indian Real Estate Industry
   https://www.ibef.org/industry/real-estate-india

2. IBEF — Housing sales in top 15 Tier-II cities
   https://www.ibef.org/news/housing-sales-in-top-15-tier-ii-cities-rise-20-to-rs-1-52-552-crore-us-17.56-billion-propequity

3. ANAROCK — Indian Residential Market Annual Update 2024
   https://websitemedia.anarock.com/media/ANAROCK_Indian_Residential_Market_Annual_Update_2024_Beyond_the_Growth_Trajectory_5370415779.pdf

4. ANAROCK — Q1 2025 Pan-India Residential Market Viewpoints
   https://websitemedia.anarock.com/media/Q1_2025_Pan_India_Residential_Market_Viewpoints_d53ed5e813.pdf

# Market & Problem Research

## 1. Property Information and Transparency

### Evidence from NITI Aayog

NITI Aayog has documented challenges in India's real-estate sector including lack of transparency and a high number of informal transactions.

NITI Aayog has also described challenges related to land and property records, including records being maintained across different departments and cases where older records are manual or difficult to access.

### Why this matters for ValueMap AI

Property valuation requires reliable evidence.

A buyer or seller may need to consider:

- Comparable properties
- Location
- Property characteristics
- Nearby amenities
- Market trends
- Property records and available information

When information is fragmented, understanding whether an asking price is reasonable can become difficult.

### Our problem statement

Existing platforms provide property listings, locality trends and valuation tools.

ValueMap AI focuses on bringing multiple evidence sources together and explaining the estimated value of an individual property.

The system can show:

- Comparable properties
- Location intelligence
- Nearby amenities
- Observed market evidence
- Price breakdown
- Data quality
- Estimated value range
- Explanation of the factors affecting the estimate

### Important limitation

The ValueMap AI prototype uses synthetic/demo data for demonstration.

The prototype does not claim to provide official government valuation, circle rates, registry values or guaranteed market prices.

### Sources

NITI Aayog - Real Estate Sector:
https://www.niti.gov.in/node/339

NITI Aayog - Land Records and Titles:
https://www.niti.gov.in/node/296

Ministry of Housing & Urban Affairs - Implementation of RERA:
https://www.pib.gov.in/PressReleasePage.aspx?PRID=2291961

