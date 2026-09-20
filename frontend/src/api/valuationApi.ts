import type {
  PropertyInputState,
  ValuationResponse,
  RenovationRequest,
  RenovationResponse,
} from '../types/valuation';
import {
  generateMockValuationResponse,
  generateMockRenovationResponse,
} from './mockData';

const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:8000';

/**
 * =========================================================================
 * 🔌 MOOLYASETEU - FRONTEND INTEGRATION INTERFACE
 * =========================================================================
 * 
 * Connects frontend client to backend deterministic valuation engine
 * with local simulation fallback for offline/development resilience.
 * =========================================================================
 */
export const valuationApi = {
  /**
   * 1. Property Valuation API Hook
   * Calls POST /api/v1/valuate with subject property input
   */
  async calculateValuation(input: PropertyInputState): Promise<ValuationResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/valuate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Valuation API HTTP error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as ValuationResponse;
    } catch (error) {
      console.warn('Backend API connection unavailable, falling back to local engine simulation:', error);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(generateMockValuationResponse(input));
        }, 300);
      });
    }
  },

  /**
   * 2. Renovation Scenario Calculator API Hook
   * Calls POST /api/v1/renovation-scenario
   */
  async calculateRenovation(req: RenovationRequest): Promise<RenovationResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/renovation-scenario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(req),
      });

      if (!response.ok) {
        throw new Error(`Renovation API HTTP error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as RenovationResponse;
    } catch (error) {
      console.warn('Backend Renovation API unavailable, falling back to local scenario simulation:', error);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(generateMockRenovationResponse(req));
        }, 150);
      });
    }
  },
};
