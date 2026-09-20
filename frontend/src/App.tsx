import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ValuationProvider, useValuation } from './context/ValuationContext';
import { Header } from './components/Header';
import { LanguageModal } from './components/LanguageModal';
import { LanguageSelectScreen } from './components/LanguageSelectScreen';
import { IntentSelectScreen } from './components/IntentSelectScreen';
import { StepNavigation } from './components/StepNavigation';
import { PropertyIntakeForm } from './components/PropertyIntakeForm';
import { VoiceInputModal } from './components/VoiceInputModal';
import { AnalysisLoadingScreen } from './components/AnalysisLoadingScreen';
import { ValuationResultCard } from './components/ValuationResultCard';
import { PriceBreakdown } from './components/PriceBreakdown';
import { EvidencePassport } from './components/EvidencePassport';
import { NegotiationLens } from './components/NegotiationLens';
import { RenovationCalculator } from './components/RenovationCalculator';
import { CinematicLandingPage } from './components/CinematicLandingPage';
import { CinematicIntroScreen } from './components/CinematicIntroScreen';

const MainContent: React.FC = () => {
  const { currentStep } = useValuation();

  // 1. Cinematic Intro Screen (First Screen)
  if (currentStep === 'intro') {
    return (
      <main className="min-h-screen">
        <CinematicIntroScreen />
      </main>
    );
  }

  // 2. Language Selection Screen (With Full-Screen Video Background)
  if (currentStep === 'language') {
    return (
      <main className="min-h-screen">
        <LanguageSelectScreen />
        <LanguageModal />
      </main>
    );
  }

  // 3. Existing ValueProof Home Page (CinematicLandingPage)
  if (currentStep === 'home') {
    return (
      <main className="min-h-screen">
        <CinematicLandingPage />
        <VoiceInputModal />
        <LanguageModal />
      </main>
    );
  }

  // 3. Workflow Steps (Intent, Intake, Valuation, Passport, etc.)
  return (
    <div className="relative min-h-screen bg-[#f4eee1] text-slate-900 font-sans flex flex-col selection:bg-brand-700 selection:text-white overflow-x-hidden">
      {/* ================= CRISP & HIGHLY VISIBLE INDIAN VILLAGE & TOWN BACKDROP ================= */}
      {/* Primary High-Resolution Authentic Indian Village & Heritage Town Architecture */}
      <div
        className="fixed inset-0 pointer-events-none bg-cover bg-center opacity-[0.32] filter contrast-105 saturate-115 brightness-98 transition-opacity duration-700 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1920&auto=format&fit=crop&q=95')`,
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Secondary Rural Farmland & Village Chak Road Landscape Overlay */}
      <div
        className="fixed inset-0 pointer-events-none bg-cover bg-bottom opacity-[0.16] mix-blend-multiply transition-opacity duration-700 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&auto=format&fit=crop&q=90')`,
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Warm Mitti, Saffron & Forest Emerald Ambient Lighting */}
      <div className="fixed top-0 right-0 w-[650px] h-[650px] bg-amber-400/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-[650px] h-[650px] bg-emerald-700/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-b from-[#f4eee1]/35 via-transparent to-[#f4eee1]/45 pointer-events-none z-0" />

      <Header />
      <main className="relative z-10 min-h-[calc(100vh-4rem)] pb-20 lg:pb-12">
        {/* Desktop & Mobile Steppers */}
        <StepNavigation />

        {/* Intent Selection: Sell vs Buy */}
        {currentStep === 'intent' && <IntentSelectScreen />}

        {/* Property Intake (+ Voice UI & Blueprint visualizer) */}
        {currentStep === 'intake' && <PropertyIntakeForm />}

        {/* Progressive Analysis Screen */}
        {currentStep === 'analysis' && <AnalysisLoadingScreen />}

        {/* Valuation Result Screen (Digital Property Passport) */}
        {currentStep === 'valuation' && <ValuationResultCard />}

        {/* Why This Price Breakdown */}
        {currentStep === 'why_price' && <PriceBreakdown />}

        {/* Evidence Passport Dossier */}
        {currentStep === 'evidence_passport' && <EvidencePassport />}

        {/* Negotiation Lens */}
        {currentStep === 'negotiation' && <NegotiationLens />}

        {/* Renovation Calculator */}
        {currentStep === 'renovation' && <RenovationCalculator />}

        {/* Floating Modals */}
        <VoiceInputModal />
        <LanguageModal />
      </main>
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <ValuationProvider>
        <MainContent />
      </ValuationProvider>
    </LanguageProvider>
  );
}

export default App;
