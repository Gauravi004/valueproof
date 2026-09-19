from app.schemas.negotiation import (
    NegotiationAnalysisRequest,
    NegotiationAnalysisResponse,
    NegotiationPosition
)


class NegotiationLens:
    def analyze(self, req: NegotiationAnalysisRequest) -> NegotiationAnalysisResponse:
        asking = req.asking_price
        low = req.range_low
        mid = req.estimated_mid
        high = req.range_high

        diff_from_mid = asking - mid
        pct_variance_from_mid = round((diff_from_mid / mid) * 100.0, 1)

        evidence_points = []

        if asking > high:
            position = NegotiationPosition.ABOVE_RANGE
            diff_from_bound = asking - high
            summary = (
                f"The asking price of ₹{asking:,.0f} is positioned above the current evidence ceiling "
                f"(₹{high:,.0f}) by ₹{diff_from_bound:,.0f} (+{pct_variance_from_mid}% vs mid estimate)."
            )
            evidence_points = [
                f"Market Cluster: Local comparable properties consistently cluster between ₹{low:,.0f} and ₹{high:,.0f}.",
                f"Premium Gap: The ₹{diff_from_bound:,.0f} premium exceeds documented adjustment factors for this micro-market.",
                "Subjective Features: Premium may reflect custom ultra-luxury interiors, brand goodwill, or seller aspirational margin not captured in registered deeds.",
                "Negotiation Leverage: Buyers can point to recent comparable transaction benchmarks to anchor conversations closer to the evidence corridor."
            ]
        elif asking < low:
            position = NegotiationPosition.BELOW_RANGE
            diff_from_bound = low - asking
            summary = (
                f"The asking price of ₹{asking:,.0f} sits below the evidence floor (₹{low:,.0f}) "
                f"by ₹{diff_from_bound:,.0f} ({pct_variance_from_mid}% vs mid estimate)."
            )
            evidence_points = [
                f"Discount Margin: Offered at ₹{diff_from_bound:,.0f} below comparable floor rates in {req.locality or 'this area'}.",
                "Liquidity Motivation: Often indicative of an urgent distress sale, fast-settlement requirement, or unlisted structural maintenance backlog.",
                "Title & Verification: Prospective buyers should exercise rigorous due diligence on encumbrances, pending utility dues, and land title clearances.",
                "Seller Realization: Sellers pricing at this level are leaving substantial value on the table relative to recent registered benchmarks."
            ]
        else:
            position = NegotiationPosition.WITHIN_RANGE
            diff_from_bound = 0.0
            summary = (
                f"The asking price of ₹{asking:,.0f} is firmly positioned within the empirical evidence range "
                f"(₹{low:,.0f} – ₹{high:,.0f}), representing a {pct_variance_from_mid:+.1f}% variance from the mid-point estimate."
            )
            evidence_points = [
                "Empirical Alignment: The price directly aligns with the interquartile band of recent comparable transactions.",
                "Fair Market Positioning: Both buyers and sellers are negotiating within standard liquidity parameters.",
                "Closing Terms: Final transaction closing will likely depend on payment milestones, possession timeline, and included fixtures."
            ]

        return NegotiationAnalysisResponse(
            asking_price=asking,
            range_low=low,
            estimated_mid=mid,
            range_high=high,
            position=position,
            difference_from_mid=round(diff_from_mid, 2),
            difference_from_bound=round(diff_from_bound, 2),
            percent_variance_from_mid=pct_variance_from_mid,
            summary=summary,
            evidence_points=evidence_points
        )


negotiation_lens = NegotiationLens()
