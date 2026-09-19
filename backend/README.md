# ValueProof Backend

ValueProof's backend is a high-performance Python FastAPI service providing deterministic property valuation, comparable property scoring, evidence passport compilation, location intelligence, negotiation analysis, renovation scenario modeling, and Gemini-based explanations with deterministic fallbacks.

## Features
- **Deterministic Valuation Engine**: 100% mathematical, auditable valuation logic that runs without external dependencies.
- **Comparable Scoring**: Multi-factor similarity scoring across distance, property type, area, age, road width, and recency.
- **Evidence Passport**: Produces calculation audit trails, data provenance, and a code-calculated evidence strength score.
- **Location Intelligence**: Modular provider structure demarcating direct valuation factors from contextual livability signals.
- **Decision Support**: Negotiation corridor analysis and Renovation ROI projections with explicit disclaimers.
- **AI Explanation Layer**: Google Gemini API integration constrained strictly by evidence payload, with zero-dependency deterministic fallback.

## Quick Start

### 1. Requirements
- Python 3.10+ (tested on Python 3.14)
- Pip

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Run Tests
```powershell
pytest tests -v
```

### 4. Start Development Server
```powershell
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be accessible at: `http://localhost:8000/docs`.
