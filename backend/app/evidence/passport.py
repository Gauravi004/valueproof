from datetime import datetime, timezone
from typing import List, Tuple
from app.schemas.property import PropertyInput
from app.schemas.comparable import ScoredComparable
from app.schemas.valuation import (
    EvidencePassport,
    EvidenceStrength,
    EvidenceStrengthLevel,
    ValuationAdjustment,
    ValuationRange
)


class EvidencePassportBuilder:
    def calculate_evidence_strength(
        self,
        comparables: List[ScoredComparable],
        total_analyzed: int
    ) -> EvidenceStrength:
        """
        Calculates code-governed evidence strength score (0-100), label, and explicit reasons.
        Deterministic and completely independent of LLMs.
        """
        reasons: List[str] = []
        score = 0.0

        count = len(comparables)
        # 1. Sample size component (up to 35 points)
        if count >= 6:
            score += 35.0
            reasons.append(f"Robust comparable density: {count} verified/modeled records in cluster")
        elif count >= 3:
            score += 25.0
            reasons.append(f"Adequate comparable pool: {count} localized records utilized")
        elif count > 0:
            score += 15.0
            reasons.append(f"Sparse sample size: only {count} matching record(s) found")
        else:
            score += 0.0
            reasons.append("Zero localized comparables available; relying on baseline municipal bounds")

        # 2. Similarity quality component (up to 35 points)
        if comparables:
            avg_sim = sum(c.similarity_score for c in comparables) / count
            sim_score = (avg_sim / 100.0) * 35.0
            score += sim_score
            if avg_sim >= 80.0:
                reasons.append(f"High property alignment: average similarity {avg_sim:.1f}%")
            elif avg_sim >= 65.0:
                reasons.append(f"Moderate property alignment: average similarity {avg_sim:.1f}%")
            else:
                reasons.append(f"Broad parameter matching: average similarity {avg_sim:.1f}%")
        else:
            reasons.append("No direct similarity matches discovered")

        # 3. Geographic proximity component (up to 20 points)
        close_comps = [c for c in comparables if c.distance_km is not None and c.distance_km <= 3.0]
        if len(close_comps) >= 3:
            score += 20.0
            reasons.append(f"Immediate radius verification: {len(close_comps)} comparables within 3 km")
        elif comparables:
            score += 12.0
            reasons.append("Comparables span wider municipal micro-market cluster")
        else:
            score += 0.0

        # 4. Source credibility (up to 10 points)
        gov_records = [c for c in comparables if "registry" in c.source_type.lower()]
        if len(gov_records) >= 2:
            score += 10.0
            reasons.append(f"Government sub-registrar registry anchor ({len(gov_records)} records)")
        elif comparables:
            score += 7.0
            reasons.append("Multi-channel broker and market index aggregated records")

        final_score = round(min(100.0, max(0.0, score)), 1)

        if final_score >= 75.0:
            label = EvidenceStrengthLevel.STRONG
        elif final_score >= 55.0:
            label = EvidenceStrengthLevel.MODERATE
        elif final_score >= 35.0:
            label = EvidenceStrengthLevel.LIMITED
        else:
            label = EvidenceStrengthLevel.INSUFFICIENT

        return EvidenceStrength(
            score=final_score,
            label=label,
            reasons=reasons
        )

    def build_passport(
        self,
        subject: PropertyInput,
        comparables: List[ScoredComparable],
        total_analyzed: int,
        base_value: float,
        rep_price_sqft: float,
        adjustments: List[ValuationAdjustment],
        estimated_value: float,
        val_range: ValuationRange
    ) -> EvidencePassport:
        """Constructs an auditable, transparent Evidence Passport."""
        strength = self.calculate_evidence_strength(comparables, total_analyzed)

        # Sources summary
        unique_sources = list({c.source for c in comparables})
        if not unique_sources:
            unique_sources = ["Municipal benchmark floor index (Demo fallback)"]

        # Calculation steps audit trail
        calc_steps = [
            f"Step 1: Ingested subject property ({subject.property_type.value}, {subject.area_sqft:.0f} sqft, "
            f"condition '{subject.condition.value}', age {subject.age_years:.0f} yrs) in {subject.location.locality}, {subject.location.city}.",
            f"Step 2: Scored {total_analyzed} repository records; identified {len(comparables)} top comparables with composite similarity weights.",
            f"Step 3: Derived representative unit rate: ₹{rep_price_sqft:,.2f}/sqft via similarity-weighted composite mean.",
            f"Step 4: Computed Base Comparable Value = ₹{rep_price_sqft:,.2f}/sqft × {subject.area_sqft:.0f} sqft = ₹{base_value:,.2f}.",
        ]

        if adjustments:
            for adj in adjustments:
                sign = "+" if adj.is_positive else "-"
                calc_steps.append(
                    f"Step 5 (Adjustment): {adj.category} ({adj.description}) -> {sign}₹{abs(adj.amount_inr):,.2f} ({adj.percentage_impact:+.1f}%)."
                )
        else:
            calc_steps.append("Step 5: Zero documented property adjustments applied.")

        calc_steps.append(
            f"Step 6: Reconciled Estimated Value = Base Value + Documented Adjustments = ₹{estimated_value:,.0f}."
        )
        calc_steps.append(
            f"Step 7: Established Evidence Valuation Range [Low: ₹{val_range.low:,.0f} — High: ₹{val_range.high:,.0f}] "
            f"with {val_range.spread_percentage}% margin based on data dispersion."
        )

        # Explicit limitations
        limitations = [
            "DEMO / SYNTHETIC / ILLUSTRATIVE DATA: Transaction records in this demonstration are synthetic approximations and not verified registrar deeds.",
            f"Locality density: Valuation relied on a sample of {len(comparables)} comparables from {subject.location.city}.",
            "Macroeconomic timing: Real-world stamp duty adjustments and inflation indexation are modeled statically.",
            "Locality signals (amenities, air quality, transit) are contextual decision-support indicators and do not inject arbitrary rupee adjustments."
        ]

        return EvidencePassport(
            sources_summary=unique_sources,
            total_records_analyzed=total_analyzed,
            records_used_in_valuation=len(comparables),
            calculation_steps=calc_steps,
            limitations=limitations,
            evidence_strength=strength,
            generated_at=datetime.now(timezone.utc).isoformat(),
            is_synthetic_dataset=True
        )


passport_builder = EvidencePassportBuilder()
