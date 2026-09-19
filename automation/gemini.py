import google.generativeai as genai
from config import GEMINI_API_KEY

# Connect Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Load Gemini model
model = genai.GenerativeModel("gemini-3.6-flash")

# Property details (sample input from P1)
price = "₹46,20,000"

property_details = """
Location: Zirakpur, Punjab
BHK: 3 BHK
Area: 1450 sq ft
Parking: Available
Nearby: School, Hospital, Market
House Age: 8 years
Locality Score: 8.5/10
"""

prompt = f"""
You are an AI real estate valuation assistant.

Property Price: {price}

Property Details:
{property_details}

Explain in simple English:
1. Why is this property priced at this value?
2. What increases its value?
3. What slightly decreases its value?
4. Give one investment suggestion.

Keep it under 150 words.
"""

response = model.generate_content(prompt)

print("\n AI PROPERTY EXPLANATION\n")
print(response.text)