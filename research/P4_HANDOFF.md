\# P4 → P1/P2 Handoff



\## Location Intelligence Output



P4 provides location evidence for the valuation engine.



Main output:



`output/location\_api.json`



\## Available Fields



For each property:



\- property\_id

\- school\_km

\- hospital\_km

\- market\_km

\- bank\_km

\- park\_km

\- main\_road\_km

\- location\_score

\- data\_quality



\## Example



```json

{

&#x20;   "property\_id": "P001",

&#x20;   "location": {

&#x20;       "school\_km": 0.53,

&#x20;       "hospital\_km": 0.89,

&#x20;       "market\_km": 0.59,

&#x20;       "bank\_km": 0.78,

&#x20;       "park\_km": 0.74,

&#x20;       "main\_road\_km": 1.02

&#x20;   },

&#x20;   "location\_score": 7.67,

&#x20;   "data\_quality": "HIGH"

}

