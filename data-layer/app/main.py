"""Main FastAPI application for MoolyaSetu Evidence Layer."""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.loader import data_store
from app.routers import comparables, amenities, locality, trends


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup & shutdown events: load and validate CSV evidence datasets."""
    print("MoolyaSetu Evidence Layer starting up: Loading CSV datasets...")
    data_store.load_and_validate_all()
    print(
        f"Data loaded successfully:\n"
        f"  - Transactions: {len(data_store.transactions)} rows\n"
        f"  - Listings:     {len(data_store.listings)} rows\n"
        f"  - Amenities:    {len(data_store.amenities)} rows\n"
        f"  - Localities:   {len(data_store.locality_features)} rows"
    )
    yield
    print("MoolyaSetu Evidence Layer shutting down.")


app = FastAPI(
    title="MoolyaSetu Evidence & Comparables Layer",
    version="1.0.0",
    description=(
        "Evidence and comparables data service for MoolyaSetu real estate fair-value discovery.\n\n"
        "**CRITICAL NOTICE: DEMO DATA ONLY**\n"
        "All property transaction and listing records provided by this API are strictly synthetic "
        "and generated for hackathon prototyping purposes. They are NOT sourced from any government registry, "
        "NGDRS, or official registrar record."
    ),
    lifespan=lifespan,
)

# Open CORS for teammate's frontend and microservices
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(comparables.router)
app.include_router(amenities.router)
app.include_router(locality.router)
app.include_router(trends.router)


@app.get("/", tags=["root"])
def root():
    return {
        "service": "MoolyaSetu Evidence Layer",
        "status": "online",
        "docs_url": "/docs",
        "disclaimer": (
            "Illustrative demo data generated for prototype purposes. "
            "Not sourced from any government registry or transaction record."
        ),
    }
