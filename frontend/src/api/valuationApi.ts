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

/**
 * =========================================================================
 * 🔌 MOOLYASETEU - FRONTEND INTEGRATION INTERFACE
 * =========================================================================
 * 
 * This service currently provides local frontend state for UI demonstration.
 * 
 * WHEN YOU ARE READY TO CONNECT YOUR BACKEND:
 * Replace the functions below with your actual API endpoint calls (fetch / axios).
 * The input and output TypeScript interfaces are already typed for you!
 * =========================================================================
 */
export const valuationApi = {
  /**
   * 1. Property Valuation API Hook
   * @param input Property details entered in frontend
   * @returns ValuationResponse structure for Result, Breakdown, Passport, and Negotiation screens
   */
  async calculateValuation(input: PropertyInputState): Promise<ValuationResponse> {
    // -----------------------------------------------------------------------
    // 👉 YOUR BACKEND CALL GOES HERE:
    // const response = await fetch('YOUR_BACKEND_URL/api/valuation', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(input),
    // });
    // return await response.json();
    // -----------------------------------------------------------------------

    // Pure frontend simulation (Instant response for UI testing):
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateMockValuationResponse(input));
      }, 300);
    });
  },

  /**
   * 2. Renovation Scenario Calculator API Hook
   * @param req Renovation budget and type selected in frontend
   * @returns RenovationResponse structure with value boost & ROI
   */
  async calculateRenovation(req: RenovationRequest): Promise<RenovationResponse> {
    // -----------------------------------------------------------------------
    // 👉 YOUR BACKEND CALL GOES HERE:
    // const response = await fetch('YOUR_BACKEND_URL/api/renovation', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(req),
    // });
    // return await response.json();
    // -----------------------------------------------------------------------

    // Pure frontend simulation (Instant response for UI testing):
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateMockRenovationResponse(req));
      }, 150);
    });
  },
};
