from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.core.logging import logger
from app.schemas.location import LocationIntelligenceResponse, LocationSignal


class BaseLocationProvider(ABC):
    @abstractmethod
    def get_location_intelligence(self, city: str, locality: str, lat: Optional[float] = None, lon: Optional[float] = None) -> LocationIntelligenceResponse:
        pass


class DemoLocationProvider(BaseLocationProvider):
    """
    Modular location provider supplying contextual location intelligence for
    Indian cities (Rajpura, Mohali, Chandigarh, and nationwide fallback).
    Clearly demarcates contextual signals from direct price factors.
    """

    # Locality profiles for Rajpura, Mohali, Chandigarh
    LOCALITY_PROFILES: Dict[str, Dict[str, Any]] = {
        "rajpura": {
            "default": {
                "liveability_score": 76.0,
                "summary": "Emerging industrial and logistics hub along the NH-44 corridor with growing residential colonies, established grain markets, and proximity to Patiala.",
                "signals": [
                    LocationSignal(
                        category="transport",
                        title="Highway & Road Connectivity",
                        rating="Strong",
                        score=8.8,
                        distance_km=1.2,
                        detail="Direct access to NH-44 (GT Road) and Patiala-Rajpura Bypass; high freight and commuter connectivity.",
                        is_direct_price_factor=False
                    ),
                    LocationSignal(
                        category="transport",
                        title="Railway Junction Access",
                        rating="Moderate",
                        score=7.4,
                        distance_km=2.8,
                        detail="Rajpura Railway Junction is a major Northern Railway transit hub with frequent intercity links.",
                        is_direct_price_factor=False
                    ),
                    LocationSignal(
                        category="schools",
                        title="Educational Institutions",
                        rating="Moderate",
                        score=7.1,
                        distance_km=1.8,
                        detail="Established CBSE schools nearby (Patel Public School, Scholar Fields) and proximity to Chitkara University.",
                        is_direct_price_factor=False
                    ),
                    LocationSignal(
                        category="healthcare",
                        title="Healthcare & Hospitals",
                        rating="Moderate",
                        score=6.9,
                        distance_km=2.2,
                        detail="Civil Hospital Rajpura and multi-specialty private clinics accessible within a 10-minute drive.",
                        is_direct_price_factor=False
                    ),
                    LocationSignal(
                        category="markets",
                        title="Retail & Daily Markets",
                        rating="High",
                        score=8.2,
                        distance_km=0.8,
                        detail="Vibrant Kasturba Road market and local grain mandi within walking/short transit distance.",
                        is_direct_price_factor=False
                    ),
                    LocationSignal(
                        category="pollution",
                        title="Air Quality & Industrial Proximity",
                        rating="Moderate",
                        score=6.0,
                        distance_km=3.5,
                        detail="Moderate AQI; Focal Point industrial area situated eastward, buffered by green belts.",
                        is_direct_price_factor=False
                    ),
                ]
            }
        },
        "mohali": {
            "default": {
                "liveability_score": 86.5,
                "summary": "High-growth Tricity IT and commercial hub with planned GMADA sectors, wide avenues, premier sports infrastructure, and international airport proximity.",
                "signals": [
                    LocationSignal(
                        category="transport",
                        title="International Airport Access",
                        rating="Strong",
                        score=9.2,
                        distance_km=7.5,
                        detail="Shaheed Bhagat Singh International Airport reachable within 15-20 minutes via Airport Road.",
                        is_direct_price_factor=False
                    ),
                    LocationSignal(
                        category="schools",
                        title="Premier Schools & Colleges",
                        rating="Strong",
                        score=9.0,
                        distance_km=1.5,
                        detail="Top institutions (DPS, Manav Rachna, ISB Mohali, IISER) in immediate sector radius.",
                        is_direct_price_factor=False
                    ),
                    LocationSignal(
                        category="healthcare",
                        title="Super-Specialty Healthcare",
                        rating="Strong",
                        score=9.4,
                        distance_km=3.0,
                        detail="Fortis Hospital, Max Healthcare, and Ivy Hospital deliver world-class medical coverage.",
                        is_direct_price_factor=False
                    ),
                    LocationSignal(
                        category="retail",
                        title="Organized Retail & Malls",
                        rating="High",
                        score=8.7,
                        distance_km=2.1,
                        detail="VR Punjab Mall, Sector 70 commercial markets, and bustling high-street dining corridors.",
                        is_direct_price_factor=False
                    ),
                    LocationSignal(
                        category="pollution",
                        title="Green Coverage & Air Quality",
                        rating="Moderate",
                        score=7.2,
                        distance_km=0.5,
                        detail="Well-maintained sector green belts and parks; seasonal post-harvest smoke elevates AQI in Oct-Nov.",
                        is_direct_price_factor=False
                    ),
                ]
            }
        },
        "chandigarh": {
            "default": {
                "liveability_score": 92.0,
                "summary": "Master-planned union territory known for Le Corbusier sector architecture, stringent zoning regulations, high green index, and top civic services.",
                "signals": [
                    LocationSignal(
                        category="infrastructure",
                        title="Sector Grid Planning",
                        rating="Strong",
                        score=9.8,
                        distance_km=0.2,
                        detail="Self-contained sector grid with dedicated commercial centres, green lungs, and underground utilities.",
                        is_direct_price_factor=False
                    ),
                    LocationSignal(
                        category="healthcare",
                        title="Tertiary Healthcare Facilities",
                        rating="Strong",
                        score=9.6,
                        distance_km=4.0,
                        detail="PGIMER Chandigarh, GMCH Sector 32 provide premier regional medical care.",
                        is_direct_price_factor=False
                    ),
                    LocationSignal(
                        category="schools",
                        title="Elite Educational Ecosystem",
                        rating="Strong",
                        score=9.5,
                        distance_km=1.0,
                        detail="St. John's, Carmel Convent, Sacred Heart, and Panjab University within central proximity.",
                        is_direct_price_factor=False
                    ),
                    LocationSignal(
                        category="pollution",
                        title="Air Quality & Tree Canopy",
                        rating="High",
                        score=8.5,
                        distance_km=0.1,
                        detail="Highest urban green canopy ratio in India; superior year-round ambient air quality.",
                        is_direct_price_factor=False
                    ),
                    LocationSignal(
                        category="transport",
                        title="Urban Transit & Highway Connect",
                        rating="Strong",
                        score=8.9,
                        distance_km=2.5,
                        detail="Himalayan Expressway and Madhya Marg corridors with dedicated CTU bus rapid lines.",
                        is_direct_price_factor=False
                    )
                ]
            }
        }
    }

    def get_location_intelligence(
        self,
        city: str,
        locality: str,
        lat: Optional[float] = None,
        lon: Optional[float] = None
    ) -> LocationIntelligenceResponse:
        city_clean = city.strip().lower()

        city_data = self.LOCALITY_PROFILES.get(city_clean)
        if not city_data:
            # Nationwide Indian Urban generic fallback profile
            score = 72.0
            summary = (
                f"Urban micro-market in {city.title()}. Local amenities feature municipal schools, "
                f"district health facilities, and active neighbourhood bazaars."
            )
            signals = [
                LocationSignal(
                    category="transport",
                    title="Road & Public Transit",
                    rating="Moderate",
                    score=7.0,
                    distance_km=1.5,
                    detail=f"Connected to {city.title()} municipal arterial network; auto-rickshaw and bus access.",
                    is_direct_price_factor=False
                ),
                LocationSignal(
                    category="schools",
                    title="Local Schooling",
                    rating="Moderate",
                    score=7.2,
                    distance_km=2.0,
                    detail="Primary and secondary educational institutes available within municipal limits.",
                    is_direct_price_factor=False
                ),
                LocationSignal(
                    category="healthcare",
                    title="Community Healthcare",
                    rating="Moderate",
                    score=6.8,
                    distance_km=3.0,
                    detail="Local clinics and sub-divisional hospital accessible.",
                    is_direct_price_factor=False
                ),
                LocationSignal(
                    category="markets",
                    title="Neighbourhood Retail",
                    rating="High",
                    score=8.0,
                    distance_km=0.7,
                    detail="Local kirana stores, grocery bazaars, and service shops nearby.",
                    is_direct_price_factor=False
                ),
            ]
        else:
            profile = city_data["default"]
            score = profile["liveability_score"]
            summary = profile["summary"]
            signals = profile["signals"]

        limitations = [
            "DEMO LOCATION SIGNALS: Derived from synthetic locality profiles for demonstration purposes.",
            "Signals are contextual and inform buyer/seller sentiment rather than applying direct mechanistic rupee price multipliers."
        ]

        return LocationIntelligenceResponse(
            city=city,
            locality=locality,
            provider="DemoLocationProvider",
            is_demo=True,
            overall_liveability_score=score,
            signals=signals,
            contextual_summary=summary,
            direct_valuation_notes=[
                "Standard road width and access adjustments applied in core valuation engine; contextual amenities provide buyer confidence."
            ],
            limitations=limitations
        )


class ExternalLocationProvider(BaseLocationProvider):
    """Pluggable provider for external map / POI services (e.g. Google Places / Mapbox / OpenStreetMap)."""
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.fallback = DemoLocationProvider()

    def get_location_intelligence(
        self,
        city: str,
        locality: str,
        lat: Optional[float] = None,
        lon: Optional[float] = None
    ) -> LocationIntelligenceResponse:
        # In this demo or if API key is not configured, safely fall back to DemoLocationProvider
        if not self.api_key:
            logger.info("External location API key missing; gracefully falling back to DemoLocationProvider.")
            return self.fallback.get_location_intelligence(city, locality, lat, lon)

        try:
            # Here real external API calls would occur; in case of any network or API issue, fallback
            return self.fallback.get_location_intelligence(city, locality, lat, lon)
        except Exception as e:
            logger.warning(f"External location provider error: {e}. Falling back to demo provider.")
            return self.fallback.get_location_intelligence(city, locality, lat, lon)


def get_location_provider() -> BaseLocationProvider:
    if settings.LOCATION_PROVIDER == "external" and settings.LOCATION_API_KEY:
        return ExternalLocationProvider(settings.LOCATION_API_KEY)
    return DemoLocationProvider()


location_provider = get_location_provider()
