# ValueProof Demonstration Guide

## Demo Scenario: Independent House in Rajpura, Punjab

This guide walks through demonstrating the core capabilities of **ValueProof** ("Evidence before price.").

---

### Step 1: Launch Backend & Frontend
1. **Start Backend**:
   ```powershell
   python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
2. **Start Frontend**:
   ```powershell
   cd frontend
   npm run dev
   ```
3. Open browser at `http://localhost:3000`.

---

### Step 2: Ingest Property Details
Use the one-click **"Load Rajpura House Demo"** or enter:
* **City**: Rajpura
* **Locality**: Focal Point Road
* **Property Type**: Independent House
* **Area**: 1,800 sq.ft
* **Age**: 8 years
* **Facing Road Width**: 30 ft
* **Corner Plot**: Yes (Checked)
* **Condition**: Good
* **Bedrooms / Bathrooms**: 3 Beds / 2 Baths
* **Intent**: Sell
* **Asking Price**: ₹75,00,000

---

### Step 3: Click "Analyze Property" & Inspect Results

Observe the following synchronized modules:

1. **Estimated Property Value**:
   - Primary figure: e.g. **₹72,43,000** (or exact calculated figure based on similarity weights).
   - Displayed with standard Indian currency formatting (`₹72.43 Lakh`).

2. **Empirical Evidence Range**:
   - Shows Low estimate (e.g. ₹68.8L), Mid estimate (₹72.4L), and High estimate (₹76.1L).
   - Shows the empirical dispersion margin and sample rationale.

3. **"Why This Price?" Waterfall Breakdown**:
   - **Base Comparable Value**: Derived from similarity-weighted comparable price per sq.ft (~₹4,000/sq.ft × 1,800 sq.ft = ₹72,00,000).
   - **+ Wide Road Access (+1.5%)**: Positive adjustment for 30ft road frontage.
   - **+ Corner Plot Premium (+4.0%)**: Positive adjustment for dual access and ventilation.
   - **- Construction Vintage (-4.0%)**: Depreciation for 8-year structure.
   - **= Final Estimated Value**.

4. **Evidence Passport Modal / Panel**:
   - Click "View Evidence Passport".
   - Review the deterministic **Evidence Strength Score** (e.g., 78/100, "Strong").
   - Review the complete 7-step mathematical audit trail.
   - Note the explicit disclosures: "DEMO / SYNTHETIC / ILLUSTRATIVE DATA".

5. **Comparable Properties Gallery**:
   - Inspect top ranked comparables with similarity percentages (e.g., 88% match).
   - Review the transparent "Why chosen" badges for each record (e.g., "Exact property type match", "Immediate radius").

6. **Location Intelligence Signals**:
   - Examine contextual infrastructure access: GT Road highway connectivity, Rajpura Junction access, hospitals, schools, and local grain mandi.
   - Note the clear demarcation between direct physical factors and contextual signals.

7. **Negotiation Lens**:
   - Asking price of ₹75,00,000 is compared to the evidence range.
   - Displays position ("Within Range" or variance) with evidence points for buyer/seller dialogue.

8. **Renovation ROI Simulator**:
   - Toggle renovation scopes (e.g., "Full Interior" vs "Kitchen & Bath").
   - Watch the dynamic recalculation of projected expenditure, potential value uplift, and estimated net gain.

9. **AI Explanation**:
   - Read the structured narrative adhering strictly to the evidence payload.
   - If `GEMINI_API_KEY` is not set, observe the seamless deterministic fallback engine in action.

10. **Multilingual Support & Voice Input**:
    - Switch language dropdown (Hindi, Punjabi, Marathi, Bengali, etc.).
    - Test the browser microphone voice input to dictate property descriptions.
