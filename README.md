# ValueProof
Evidence-backed property valuation for small towns

> **Evidence before price.**

ValueProof is an India-first property valuation and decision-support platform. Unlike generic real-estate portals or speculative chatbots, ValueProof operates on an evidence-first principle: every estimated price is mathematically derived from local comparable transactions and documented physical adjustments, backed by an auditable **Evidence Passport**.

---

## 🏛️ Architecture Overview

```
[ Frontend: Next.js 15 + React + TS + Tailwind ]
                       |
               HTTP REST /api/v1
                       v
[ Backend: FastAPI + Pydantic V2 ]
  ├── Comparables Engine (Multi-Factor Scoring, Haversine, Punjab/Tricity Demo Records)
  ├── Deterministic Valuation Engine (Similarity-Weighted Unit Rate + Documented Adjustments)
  ├── Location Intelligence (Modular Provider: Schools, Hospitals, Transit, Air Quality)
  ├── Evidence Passport (Deterministic Strength Score, Audit Trail, Limitations)
  ├── Negotiation Lens (Asking Price vs Empirical Evidence Corridor)
  ├── Renovation Scenario Simulator (Scope Expenditure vs Potential Equity Gain)
  └── AI Explanation Layer (Google Gemini API with Graceful Deterministic Fallback)
```

### Core Product Principle
1. **The core valuation engine is 100% deterministic**: It functions completely without Google Gemini and without n8n.
2. **Gemini is strictly an explanation layer**: It receives structured calculation outputs and explains them without modifying numbers or inventing unverified facts.
3. **n8n is strictly an orchestration layer**: It coordinates external webhooks and pipelines without containing core valuation formulas.
4. **Contextual amenities vs Direct factors**: Proximity to amenities provides contextual buyer confidence and liveability scores; only documented physical parameters (e.g. road width, corner plot, condition, age) adjust property prices directly.

---

## 🚀 Quick Start

### Prerequisites
* **Node.js**: v18+ (tested on Node v24)
* **Python**: 3.10+ (tested on Python 3.14)
* **npm** or **pnpm**

### 1. Backend Setup
```powershell
# Navigate to repository root
cd c:\Users\USER\OneDrive\Desktop\codekalesh\valueproof

# Install Python requirements
pip install -r backend/requirements.txt

# Run backend automated test suite
python -m pytest backend/tests -v

# Start FastAPI server
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
Backend API will be running at `http://localhost:8000`.
Interactive Swagger API documentation: `http://localhost:8000/docs`.

### 2. Frontend Setup
```powershell
# In a separate terminal, navigate to frontend
cd frontend

# Install frontend dependencies
npm install

# Start Next.js development server
npm run dev
```
Frontend web application will be accessible at `http://localhost:3000`.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:
```env
# Backend Settings
ENVIRONMENT=development
LOG_LEVEL=INFO
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Google Gemini API Key (Optional)
# If omitted or invalid, the backend automatically uses the built-in deterministic explanation engine.
GEMINI_API_KEY=

# Location Provider (Options: 'demo', 'external')
LOCATION_PROVIDER=demo
LOCATION_API_KEY=

# Database URL (For future PostgreSQL persistence; defaults to JSON/CSV in demo mode)
DATABASE_URL=

# Frontend Next.js Public API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🧪 Automated Testing

The backend includes a comprehensive pytest suite covering all 23 verification scenarios:
```powershell
python -m pytest backend/tests -v
```

Verified test coverage includes:
- Property input validation (zero area, negative age, invalid types, blank location)
- Comparable property loading, filtering, multi-factor scoring, and ranking
- Deterministic unit rate derivation and base value calculation
- Positive and negative physical adjustments (corner plot, road width, condition, vintage)
- Fallback handling for zero comparable records
- Evidence strength scoring and mathematical audit trail generation
- Negotiation corridor analysis (above range, within range, below range)
- Renovation scenario calculations and net gain formulas
- Full REST API integration suite (health, valuate, comparables, location, renovate, negotiate, explain)

---

## 📊 Valuation Methodology

1. **Representative Rate**: Calculated via similarity-weighted composite average of top ranked comparables:
   $$\text{Price/Sqft}_{\text{rep}} = \frac{\sum (c_i.\text{price\_per\_sqft} \times w_i)}{\sum w_i}$$
2. **Base Comparable Value**: $\text{Price/Sqft}_{\text{rep}} \times \text{Subject Area (sqft)}$
3. **Documented Adjustments**:
   - Corner plot: $+4.0\%$
   - Wide road ($>25\text{ ft}$): $+1.5\%$ per $10\text{ ft}$ above $25\text{ ft}$ (capped at $+4.5\%$)
   - Narrow road ($<20\text{ ft}$): $-2.5\%$
   - Physical condition: `New` ($+5\%$), `Excellent` ($+4\%$), `Good` ($0\%$), `Fair` ($-5\%$), `Poor` ($-12\%$), `Needs Renovation` ($-15\%$)
   - Construction vintage: $-0.5\%$ per year of structure age (capped at $-20\%$)
4. **Range Dispersion**: Low and High bounds are determined from the standard deviation dispersion of comparable rates and calibrated based on sample density and average similarity.

---

## 🔄 n8n Workflow Automation

An importable n8n workflow is provided at [`n8n/valueproof-workflow.json`](n8n/valueproof-workflow.json).
- Pipeline: `Webhook Ingestion` -> `Input Validation` -> `POST /api/v1/valuate` -> `Gemini Explanation` -> `Formatted Response`.
- The workflow delegates all numerical valuation to ValueProof's deterministic API, ensuring consistency across automated pipelines.

---

## ⚠️ Demo Dataset Disclaimer

> **DEMO / SYNTHETIC / ILLUSTRATIVE DATA**
> All property records included in `data/demo/comparables.json` and `data/demo/comparables.csv` represent synthetic, modeled approximations for Punjab and the Tricity region (Rajpura, Mohali, Chandigarh). They do not represent executed deed contracts or legal commitments. ValueProof is designed to ingest verified sub-registrar and land records datasets in production deployments.

---

## 📖 Extended Documentation

- [System Architecture](docs/architecture.md)
- [Valuation Methodology](docs/valuation-methodology.md)
- [REST API Reference](docs/api.md)
- [Data Model & Schemas](docs/data-model.md)
- [Demonstration Walkthrough Guide](docs/demo-guide.md)
>>>>>>> backend
