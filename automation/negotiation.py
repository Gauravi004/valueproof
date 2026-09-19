import google.generativeai as genai
from config import GEMINI_API_KEY

# Connect Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Load model
model = genai.GenerativeModel("gemini-3.6-flash")

estimated_price = "₹46,20,000"
seller_price = "₹52,00,000"

prompt = f"""
You are a property negotiation expert.

Estimated Value: {estimated_price}
Seller Asking Price: {seller_price}

Tell me:
1. Is the property overpriced or fairly priced?
2. Suggested negotiation range.
3. Three polite negotiation points.

Keep the answer under 120 words.
"""

response = model.generate_content(prompt)

print("\n🏠 AI NEGOTIATION ADVICE\n")
print(response.text)