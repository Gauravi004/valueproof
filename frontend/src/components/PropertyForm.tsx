'use client';

import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Compass,
  ArrowRight,
  Sparkles,
  Maximize2,
  Calendar,
  Layers,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { PropertyInput, PropertyType, PropertyCondition, IntentType } from '@/types/valuation';
import { SupportedLanguage, TRANSLATIONS } from '@/lib/i18n';
import { VoiceInputButton } from './VoiceInputButton';

interface PropertyFormProps {
  initialValues: PropertyInput;
  initialAskingPrice?: number | null;
  onSubmit: (property: PropertyInput, askingPrice: number | null) => void;
  isLoading: boolean;
  currentLang: SupportedLanguage;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  initialValues,
  initialAskingPrice,
  onSubmit,
  isLoading,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const [formData, setFormData] = useState<PropertyInput>(initialValues);
  const [askingPrice, setAskingPrice] = useState<string>(
    initialAskingPrice ? initialAskingPrice.toString() : ''
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync when initialValues change (e.g. from preset loader)
  React.useEffect(() => {
    setFormData(initialValues);
    if (initialAskingPrice) {
      setAskingPrice(initialAskingPrice.toString());
    }
  }, [initialValues, initialAskingPrice]);

  const handleVoiceTranscript = (text: string) => {
    // Attempt basic natural-language extraction
    const lower = text.toLowerCase();
    const updated = { ...formData };

    const areaMatch = lower.match(/(\d+)\s*(sqft|square feet|gaj|sq ft)/);
    if (areaMatch && parseInt(areaMatch[1], 10) > 0) {
      updated.area_sqft = parseInt(areaMatch[1], 10);
    }

    if (lower.includes('corner')) {
      updated.corner_plot = true;
    }
    if (lower.includes('rajpura')) {
      updated.location.city = 'Rajpura';
    } else if (lower.includes('mohali')) {
      updated.location.city = 'Mohali';
    } else if (lower.includes('chandigarh')) {
      updated.location.city = 'Chandigarh';
    }

    if (lower.includes('flat') || lower.includes('apartment')) {
      updated.property_type = 'apartment';
    } else if (lower.includes('plot')) {
      updated.property_type = 'residential_plot';
    } else if (lower.includes('villa')) {
      updated.property_type = 'villa';
    } else if (lower.includes('commercial') || lower.includes('shop') || lower.includes('office')) {
      updated.property_type = 'commercial_property';
    } else if (lower.includes('house') || lower.includes('kothi')) {
      updated.property_type = 'independent_house';
    }

    setFormData(updated);
  };

  const handlePresetSelect = (preset: 'rajpura' | 'mohali' | 'chandigarh') => {
    if (preset === 'rajpura') {
      setFormData({
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
      });
      setAskingPrice('7500000');
    } else if (preset === 'mohali') {
      setFormData({
        location: {
          city: 'Mohali',
          locality: 'Sector 68',
          latitude: 30.703,
          longitude: 76.713,
        },
        property_type: 'independent_house',
        area_sqft: 2100,
        age_years: 6,
        road_width_ft: 40,
        bedrooms: 4,
        bathrooms: 3,
        corner_plot: true,
        floor: 1,
        condition: 'excellent',
        intent: 'sell',
      });
      setAskingPrice('15500000');
    } else if (preset === 'chandigarh') {
      setFormData({
        location: {
          city: 'Chandigarh',
          locality: 'Sector 34',
          latitude: 30.722,
          longitude: 76.768,
        },
        property_type: 'independent_house',
        area_sqft: 2700,
        age_years: 14,
        road_width_ft: 40,
        bedrooms: 4,
        bathrooms: 4,
        corner_plot: true,
        floor: 1,
        condition: 'good',
        intent: 'sell',
      });
      setAskingPrice('32000000');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate area
    if (!formData.area_sqft || formData.area_sqft <= 0) {
      setValidationError('Area must be strictly greater than 0 sq.ft.');
      return;
    }
    // Validate location
    if (!formData.location.city.trim() || !formData.location.locality.trim()) {
      setValidationError('City and Locality must be provided.');
      return;
    }

    const numAsking = askingPrice ? parseFloat(askingPrice.replace(/,/g, '')) : null;
    onSubmit(formData, numAsking);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      {/* Header & Preset Shortcuts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>{t.propertyDetails}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Inputs feed directly into the deterministic comparable matching engine.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <VoiceInputButton onTranscript={handleVoiceTranscript} language={currentLang} />
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => handlePresetSelect('rajpura')}
              className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
            >
              Rajpura
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('mohali')}
              className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
            >
              Mohali
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('chandigarh')}
              className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
            >
              Chandigarh
            </button>
          </div>
        </div>
      </div>

      {validationError && (
        <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs font-medium">
          {validationError}
        </div>
      )}

      {/* Grid Inputs */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* City */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.city}</span>
          </label>
          <input
            type="text"
            value={formData.location.city}
            onChange={(e) =>
              setFormData({
                ...formData,
                location: { ...formData.location, city: e.target.value },
              })
            }
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            placeholder="e.g. Rajpura, Mohali, Chandigarh"
          />
        </div>

        {/* Locality */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1">
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.locality}</span>
          </label>
          <input
            type="text"
            value={formData.location.locality}
            onChange={(e) =>
              setFormData({
                ...formData,
                location: { ...formData.location, locality: e.target.value },
              })
            }
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            placeholder="e.g. Focal Point Road, Sector 68"
          />
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.propertyType}</span>
          </label>
          <select
            value={formData.property_type}
            onChange={(e) =>
              setFormData({ ...formData, property_type: e.target.value as PropertyType })
            }
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="independent_house">Independent House / Kothi</option>
            <option value="residential_plot">Residential Plot</option>
            <option value="apartment">Apartment / Flat</option>
            <option value="villa">Villa / Gated Bungalow</option>
            <option value="commercial_property">Commercial Property</option>
          </select>
        </div>

        {/* Area sqft */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1">
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.area}</span>
          </label>
          <input
            type="number"
            min="1"
            value={formData.area_sqft || ''}
            onChange={(e) =>
              setFormData({ ...formData, area_sqft: parseFloat(e.target.value) || 0 })
            }
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            placeholder="1800"
          />
        </div>

        {/* Construction Age */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.age}</span>
          </label>
          <input
            type="number"
            min="0"
            value={formData.age_years}
            onChange={(e) =>
              setFormData({ ...formData, age_years: parseFloat(e.target.value) || 0 })
            }
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            placeholder="8"
          />
        </div>

        {/* Road Width */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.roadWidth}</span>
          </label>
          <input
            type="number"
            min="0"
            value={formData.road_width_ft}
            onChange={(e) =>
              setFormData({ ...formData, road_width_ft: parseFloat(e.target.value) || 0 })
            }
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            placeholder="30"
          />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            {t.condition}
          </label>
          <select
            value={formData.condition}
            onChange={(e) =>
              setFormData({ ...formData, condition: e.target.value as PropertyCondition })
            }
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="new">New Construction (+5% Premium)</option>
            <option value="excellent">Excellent Maintenance (+4% Premium)</option>
            <option value="good">Good / Standard (Baseline)</option>
            <option value="fair">Fair (-5% Maintenance Allowance)</option>
            <option value="poor">Poor (-12% Rehabilitation)</option>
            <option value="needs_renovation">Needs Full Renovation (-15%)</option>
          </select>
        </div>

        {/* Corner Plot Toggle */}
        <div className="flex items-center space-x-3 pt-6">
          <input
            type="checkbox"
            id="corner_plot"
            checked={formData.corner_plot}
            onChange={(e) => setFormData({ ...formData, corner_plot: e.target.checked })}
            className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-700 focus:ring-emerald-500 cursor-pointer"
          />
          <label htmlFor="corner_plot" className="text-xs font-medium text-slate-200 cursor-pointer">
            {t.cornerPlot} <span className="text-emerald-400 text-[11px]">(+4% Premium)</span>
          </label>
        </div>

        {/* Intent (Buy / Sell) */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            {t.intent}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, intent: 'sell' })}
              className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                formData.intent === 'sell'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.sell}
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, intent: 'buy' })}
              className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                formData.intent === 'buy'
                  ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.buy}
            </button>
          </div>
        </div>

        {/* Optional Asking Price */}
        <div className="md:col-span-2 lg:col-span-3 pt-2">
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.askingPrice}</span>
          </label>
          <input
            type="number"
            value={askingPrice}
            onChange={(e) => setAskingPrice(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder-slate-600"
            placeholder="e.g. 7500000 (INR)"
          />
        </div>
      </div>

      {/* Submit CTA */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>{t.analyzing}</span>
            </>
          ) : (
            <>
              <span>{t.analyzeBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
