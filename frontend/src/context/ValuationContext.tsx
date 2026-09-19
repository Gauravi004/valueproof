import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  AppStep,
  PropertyInputState,
  ValuationResponse,
  RenovationRequest,
  RenovationResponse,
} from '../types/valuation';
import { valuationApi } from '../api/valuationApi';

const DEFAULT_INPUT: PropertyInputState = {
  intent: 'sell',
  location: 'Alwar, Rajasthan',
  localityPincode: 'Sector 4, Near Bypass',
  propertyType: 'house',
  area: 1500,
  areaUnit: 'sqft',
  age: '1_5',
  roadWidth: '30ft',
  bedrooms: 3,
  isCornerPlot: true,
};

interface ValuationContextType {
  currentStep: AppStep;
  setStep: (step: AppStep) => void;
  propertyInput: PropertyInputState;
  updatePropertyInput: (data: Partial<PropertyInputState>) => void;
  valuationResult: ValuationResponse | null;
  isLoading: boolean;
  error: string | null;
  submitValuation: () => Promise<void>;
  askingPrice: number;
  setAskingPrice: (price: number) => void;
  renovationState: RenovationRequest;
  renovationResult: RenovationResponse | null;
  calculateRenovationROI: (req: Partial<RenovationRequest>) => Promise<void>;
  resetToNewIntake: () => void;
  loadPreset: (presetKey: string) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
}

const ValuationContext = createContext<ValuationContextType | undefined>(undefined);

export const ValuationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start on the Language Selection Screen First with Background Video
  const [currentStep, setCurrentStep] = useState<AppStep>('language');
  const [propertyInput, setPropertyInput] = useState<PropertyInputState>(DEFAULT_INPUT);
  const [valuationResult, setValuationResult] = useState<ValuationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Negotiation state
  const [askingPrice, setAskingPrice] = useState<number>(8200000);

  // Renovation state
  const [renovationState, setRenovationState] = useState<RenovationRequest>({
    currentValue: 7500000,
    renovationCost: 300000,
    renovationType: 'kitchen_bath',
  });
  const [renovationResult, setRenovationResult] = useState<RenovationResponse | null>(null);

  const updatePropertyInput = (data: Partial<PropertyInputState>) => {
    setPropertyInput((prev) => ({ ...prev, ...data }));
  };

  const submitValuation = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentStep('analysis');

    try {
      const result = await valuationApi.calculateValuation(propertyInput);
      setValuationResult(result);
      setAskingPrice(result.estimatedValueMax + 400000);
      setRenovationState((prev) => ({
        ...prev,
        currentValue: result.estimatedValueMid,
      }));
    } catch (err: any) {
      setError(err?.message || 'Failed to analyze property valuation');
    }
  };

  const calculateRenovationROI = async (partialReq: Partial<RenovationRequest>) => {
    const updatedReq: RenovationRequest = {
      ...renovationState,
      ...partialReq,
      currentValue: valuationResult ? valuationResult.estimatedValueMid : renovationState.currentValue,
    };
    setRenovationState(updatedReq);

    try {
      const res = await valuationApi.calculateRenovation(updatedReq);
      setRenovationResult(res);
    } catch (err) {
      console.error('Error calculating renovation ROI:', err);
    }
  };

  useEffect(() => {
    if (valuationResult) {
      calculateRenovationROI({ currentValue: valuationResult.estimatedValueMid });
    }
  }, [valuationResult]);

  const resetToNewIntake = () => {
    setPropertyInput(DEFAULT_INPUT);
    setValuationResult(null);
    setCurrentStep('intent');
  };

  const loadPreset = (presetKey: string) => {
    switch (presetKey) {
      case 'alwar_house':
        setPropertyInput({
          intent: 'sell',
          location: 'Alwar, Rajasthan',
          localityPincode: 'Shanti Nagar, Sector 4',
          propertyType: 'house',
          area: 1500,
          areaUnit: 'sqft',
          age: '1_5',
          roadWidth: '30ft',
          bedrooms: 3,
          isCornerPlot: true,
        });
        break;
      case 'jhansi_shop':
        setPropertyInput({
          intent: 'sell',
          location: 'Jhansi, Uttar Pradesh',
          localityPincode: 'Sadar Bazar Main Market',
          propertyType: 'shop',
          area: 450,
          areaUnit: 'sqft',
          age: '5_10',
          roadWidth: '40ft',
          bedrooms: 0,
          isCornerPlot: true,
        });
        break;
      case 'karnal_plot':
        setPropertyInput({
          intent: 'buy',
          location: 'Karnal, Haryana',
          localityPincode: 'Sector 32 Urban Estate',
          propertyType: 'plot',
          area: 200,
          areaUnit: 'gaj',
          age: 'new',
          roadWidth: '30ft',
          bedrooms: 0,
          isCornerPlot: false,
        });
        break;
      case 'kolhapur_flat':
        setPropertyInput({
          intent: 'buy',
          location: 'Kolhapur, Maharashtra',
          localityPincode: 'Tarabai Park',
          propertyType: 'apartment',
          area: 1100,
          areaUnit: 'sqft',
          age: '1_5',
          roadWidth: '30ft',
          bedrooms: 2,
          isCornerPlot: false,
        });
        break;
    }
  };

  return (
    <ValuationContext.Provider
      value={{
        currentStep,
        setStep: setCurrentStep,
        propertyInput,
        updatePropertyInput,
        valuationResult,
        isLoading,
        error,
        submitValuation,
        askingPrice,
        setAskingPrice,
        renovationState,
        renovationResult,
        calculateRenovationROI,
        resetToNewIntake,
        loadPreset,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
      }}
    >
      {children}
    </ValuationContext.Provider>
  );
};

export const useValuation = () => {
  const context = useContext(ValuationContext);
  if (!context) {
    throw new Error('useValuation must be used within a ValuationProvider');
  }
  return context;
};
