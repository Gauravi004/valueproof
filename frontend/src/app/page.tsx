'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, AlertCircle, ArrowDown } from 'lucide-react';
import { PropertyInput, ValuationResult } from '@/types/valuation';
import { SupportedLanguage, TRANSLATIONS } from '@/lib/i18n';
import { checkBackendHealth, valuateProperty } from '@/lib/api';
import { Header } from '@/components/Header';
import { PropertyForm } from '@/components/PropertyForm';
import { ValueHero } from '@/components/ValueHero';
import { RangeIndicator } from '@/components/RangeIndicator';
import { PriceBreakdownWaterfall } from '@/components/PriceBreakdownWaterfall';
import { ComparablesList } from '@/components/ComparablesList';
import { LocationIntelligenceGrid } from '@/components/LocationIntelligenceGrid';
import { NegotiationLensCard } from '@/components/NegotiationLensCard';
import { RenovationSimulator } from '@/components/RenovationSimulator';
import { AIExplanationCard } from '@/components/AIExplanationCard';
import { EvidencePassportModal } from '@/components/EvidencePassportModal';
import { Footer } from '@/components/Footer';

const DEFAULT_DEMO_PROPERTY: PropertyInput = {
  location: {
    city: 'Rajpura',
    locality: 'Focal Point Road',
    latitude: 30.4852,
    longitude: 76.5931,
  },
  property_type: 'independent_house',
  area_sqft: 1800,
  age_years: 8,
  road_width_ft: 30,
  bedrooms: 3,
  bathrooms: 2,
  corner_plot: true,
  floor: 1,
  condition: 'good',
  intent: 'sell',
};

const DEFAULT_ASKING_PRICE = 7500000;

export default function Home() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const [backendOnline, setBackendOnline] = useState(false);
  const [propertyInput, setPropertyInput] = useState<PropertyInput>(DEFAULT_DEMO_PROPERTY);
  const [askingPrice, setAskingPrice] = useState<number | null>(DEFAULT_ASKING_PRICE);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPassportOpen, setIsPassportOpen] = useState(false);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Run initial health check and preload demo valuation on mount
  useEffect(() => {
    async function init() {
      const health = await checkBackendHealth();
      if (health) {
        setBackendOnline(true);
      }
      // Trigger initial valuation for immediate demonstration
      handleAnalyze(DEFAULT_DEMO_PROPERTY, DEFAULT_ASKING_PRICE);
    }
    init();
  }, []);

  const handleAnalyze = async (property: PropertyInput, asking: number | null) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await valuateProperty(property, asking, true);
      setValuationResult(result);
      setPropertyInput(property);
      setAskingPrice(asking);
    } catch (err: any) {
      console.error('Valuation error:', err);
      setErrorMessage(
        err?.message || 'Could not connect to ValueProof backend engine. Ensure backend is running on port 8000.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDemo = () => {
    setPropertyInput(DEFAULT_DEMO_PROPERTY);
    setAskingPrice(DEFAULT_ASKING_PRICE);
    handleAnalyze(DEFAULT_DEMO_PROPERTY, DEFAULT_ASKING_PRICE);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        backendOnline={backendOnline}
        onLoadDemo={handleLoadDemo}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Pitch Banner */}
        <section className="text-center max-w-3xl mx-auto pt-4 pb-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fintech × Property Intelligence Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Evidence Before Price.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            {t.subtitle} Every rupee is deterministically calculated from local comparable transactions and documented physical factors.
          </p>
        </section>

        {/* Global Error Notice if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
            <div>
              <strong className="font-semibold block text-sm">Engine Communication Notice</strong>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Input Card Form */}
        <section>
          <PropertyForm
            initialValues={propertyInput}
            initialAskingPrice={askingPrice}
            onSubmit={handleAnalyze}
            isLoading={isLoading}
            currentLang={currentLang}
          />
        </section>

        {/* Results Section */}
        {valuationResult && (
          <div className="space-y-8 animate-fade-in pt-4">
            {/* Section Divider Anchor */}
            <div className="flex items-center justify-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <ArrowDown className="w-4 h-4 animate-bounce" />
              <span>Valuation Results & Audited Intelligence</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </div>

            {/* 1. Value Hero */}
            <section>
              <ValueHero
                result={valuationResult}
                onOpenPassport={() => setIsPassportOpen(true)}
              />
            </section>

            {/* 2. Range Indicator (Corridor) */}
            <section>
              <RangeIndicator range={valuationResult.valuation_range} />
            </section>

            {/* 3. Mathematical Waterfall Breakdown */}
            <section>
              <PriceBreakdownWaterfall
                baseValue={valuationResult.base_comparable_value}
                repPriceSqft={valuationResult.representative_price_per_sqft}
                areaSqft={valuationResult.property_input.area_sqft}
                breakdown={valuationResult.price_breakdown}
                estimatedValue={valuationResult.estimated_value}
              />
            </section>

            {/* 4. Comparables & Location Intelligence Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ComparablesList
                comparables={valuationResult.selected_comparables}
                totalAnalyzed={valuationResult.total_records_analyzed}
              />
              <LocationIntelligenceGrid
                intelligence={valuationResult.location_intelligence}
              />
            </section>

            {/* 5. Negotiation Lens & Renovation Simulator */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <NegotiationLensCard
                initialAnalysis={valuationResult.negotiation_lens}
                range={valuationResult.valuation_range}
                locality={valuationResult.property_input.location.locality}
              />
              <RenovationSimulator
                initialScenario={valuationResult.renovation_preview}
                currentEstimatedValue={valuationResult.estimated_value}
                areaSqft={valuationResult.property_input.area_sqft}
                currentCondition={valuationResult.property_input.condition}
              />
            </section>

            {/* 6. AI Explanation Card */}
            <section>
              <AIExplanationCard
                explanation={valuationResult.ai_explanation}
                source={valuationResult.explanation_source}
              />
            </section>
          </div>
        )}
      </main>

      {/* Slide-over Evidence Passport Modal */}
      {valuationResult && (
        <EvidencePassportModal
          passport={valuationResult.evidence_passport}
          isOpen={isPassportOpen}
          onClose={() => setIsPassportOpen(false)}
        />
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
