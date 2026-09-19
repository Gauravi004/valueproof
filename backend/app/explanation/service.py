import os
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.core.logging import logger

# System instruction as demanded in Section 16 of specifications
GEMINI_SYSTEM_INSTRUCTION = """
You are the AI Explanation Layer for ValueProof ("Evidence before price"), an India-first property valuation platform.
Your ONLY role is to explain the provided deterministic valuation using STRICTLY the provided structured evidence.

MANDATORY RULES:
1. Do NOT modify or recalculate any numbers. Use exact figures from the input.
2. Do NOT invent facts, amenities, developments, or comparables not present in the payload.
3. Do NOT invent unsupported valuation factors or adjustments.
4. Do NOT give financial, legal, or investment advice (do NOT say 'Buy', 'Sell', 'Hold', 'Invest').
5. Clearly articulate the evidence strength, methodology, and limitations.
6. If evidence strength is 'Limited' or 'Insufficient', explicitly state that caution is warranted.
7. Format clearly with concise sections: Summary, Comparable Rationale, Adjustments Breakdown, and Key Limitations.
"""


class ExplanationService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                logger.info("Google Gemini client initialized successfully.")
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini client: {e}. Deterministic engine will be used.")

    def generate_deterministic_explanation(self, data: Dict[str, Any], language: str = "en") -> str:
        """
        Pure deterministic structured natural-language generator.
        Guaranteed to work 100% offline without Gemini, never failing.
        """
        est_val = data.get("estimated_value", 0)
        low_val = data.get("range_low", 0)
        high_val = data.get("range_high", 0)
        rate = data.get("representative_price_per_sqft", 0)
        prop_type = str(data.get("property_type", "property")).replace("_", " ").title()
        locality = data.get("locality", "Local Area")
        city = data.get("city", "Punjab")
        area = data.get("area_sqft", 0)

        breakdown = data.get("price_breakdown", [])
        comparables = data.get("comparables", [])
        evidence_strength = data.get("evidence_strength", {})
        score = evidence_strength.get("score", 70)
        label = evidence_strength.get("label", "Moderate")
        reasons = evidence_strength.get("reasons", [])
        limitations = data.get("limitations", [])

        # Build positive and negative adjustment summaries
        pos_adjs = [a for a in breakdown if a.get("is_positive")]
        neg_adjs = [a for a in breakdown if not a.get("is_positive")]

        pos_str = ""
        if pos_adjs:
            pos_str = " Value accretions include " + ", ".join(
                [f"{a.get('category')} (+₹{abs(a.get('amount_inr', 0)):,.0f})" for a in pos_adjs]
            ) + "."

        neg_str = ""
        if neg_adjs:
            neg_str = " Offset discounts include " + ", ".join(
                [f"{a.get('category')} (-₹{abs(a.get('amount_inr', 0)):,.0f})" for a in neg_adjs]
            ) + "."

        top_comps_str = ""
        if comparables:
            comp_summaries = []
            for c in comparables[:3]:
                comp_summaries.append(
                    f"{c.get('locality', 'Area')} ({c.get('property_type', '').replace('_', ' ')}, "
                    f"₹{c.get('price_per_sqft', 0):,.0f}/sqft, {c.get('similarity_score', 0)}% similarity)"
                )
            top_comps_str = " The benchmark rate was anchored by: " + "; ".join(comp_summaries) + "."

        reasons_summary = " ".join(reasons[:2]) if reasons else "Based on standard proximity and category matching."

        explanation = (
            f"### Evidence-Based Valuation Summary\n\n"
            f"The subject {prop_type} ({area:,.0f} sqft) located in **{locality}, {city}** has been appraised at an "
            f"estimated value of **₹{est_val:,.0f}**, with an empirical evidence band spanning from **₹{low_val:,.0f}** "
            f"to **₹{high_val:,.0f}**.\n\n"
            f"#### 1. Comparable Baseline\n"
            f"The underlying unit benchmark is calculated at **₹{rate:,.0f}/sqft**, derived through similarity-weighted analysis "
            f"across {len(comparables)} ranked transactions in the micro-market.{top_comps_str}\n\n"
            f"#### 2. Documented Property Adjustments\n"
            f"Starting from a comparable base value of **₹{rate * area:,.0f}**, mathematical adjustments were applied "
            f"strictly according to verified physical attributes.{pos_str}{neg_str}\n\n"
            f"#### 3. Evidence Strength ({label} — {score}/100)\n"
            f"{reasons_summary}\n\n"
            f"#### 4. Audit & Limitations\n"
            f"This estimate represents objective decision support. {limitations[0] if limitations else 'Demonstration dataset applied.'} "
            f"All parties are advised to verify independent deed registries and structural inspections."
        )

        return explanation

    def explain(self, payload: Dict[str, Any], language: str = "en") -> Tuple[str, str]:
        """
        Attempts to generate explanation using Gemini with strict system instruction.
        Falls back to deterministic engine gracefully if Gemini is unavailable or fails.
        Returns: (explanation_markdown, source_label)
        """
        if not self.client or not settings.GEMINI_API_KEY:
            logger.info("Gemini API key not provided. Utilizing deterministic explanation engine.")
            return self.generate_deterministic_explanation(payload, language), "deterministic_engine"

        try:
            prompt = (
                f"Explain the following property valuation strictly adhering to the provided evidence.\n"
                f"Structured Evidence Payload:\n{payload}\n"
                f"Output Language: {language}\n"
            )
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={
                    "system_instruction": GEMINI_SYSTEM_INSTRUCTION,
                    "temperature": 0.2,
                }
            )
            if response and response.text:
                logger.info("Successfully generated explanation via Google Gemini.")
                return response.text, "gemini"
            else:
                logger.warning("Gemini returned empty response. Falling back to deterministic engine.")
                return self.generate_deterministic_explanation(payload, language), "deterministic_engine"

        except Exception as e:
            logger.warning(f"Gemini generation error: {e}. Gracefully falling back to deterministic engine.")
            return self.generate_deterministic_explanation(payload, language), "deterministic_engine"


explanation_service = ExplanationService()
