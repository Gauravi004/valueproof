import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useValuation } from '../context/ValuationContext';
import type {
  PropertyType,
  AreaUnit,
  PropertyAge,
  RoadWidth,
} from '../types/valuation';
import { convertAreaToSqFt } from '../api/mockData';
import { getLocalizedTownName } from '../utils/townHelper';
import { HeroTownVisual } from './HeroTownVisual';
import { BlueprintVisualizer } from './BlueprintVisualizer';
import { TownGallerySection } from './TownGallerySection';
import {
  Home,
  MapPin,
  Building,
  Store,
  ArrowRight,
  Mic,
  Maximize2,
  CheckCircle2,
  Tag,
  ShoppingCart,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

const PROPERTY_TYPES: {
  id: PropertyType;
  labelKey: string;
  desc: string;
  icon: any;
  imgUrl: string;
}[] = [
  {
    id: 'house',
    labelKey: 'intake.property_types.house',
    desc: 'Independent 1-3 story kothi',
    icon: Home,
    imgUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'plot',
    labelKey: 'intake.property_types.plot',
    desc: 'Freehold land parcel (Gaj/Bigha)',
    icon: Maximize2,
    imgUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'apartment',
    labelKey: 'intake.property_types.apartment',
    desc: 'Colony society or builder floor',
    icon: Building,
    imgUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'shop',
    labelKey: 'intake.property_types.shop',
    desc: 'Main market / mandi commercial shop',
    icon: Store,
    imgUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80',
  },
];

const ROAD_WIDTHS: { id: RoadWidth; labelKey: string; category: string }[] = [
  { id: '15ft', labelKey: '15 ft', category: 'Colony Lane' },
  { id: '20ft', labelKey: '20 ft', category: 'Standard Road' },
  { id: '30ft', labelKey: '30 ft', category: 'Wide 2-Way Road' },
  { id: '40ft', labelKey: '40 ft', category: 'Sector Main Road' },
  { id: '60ft', labelKey: '60+ ft', category: 'Highway Corridor' },
];

const AGE_OPTIONS: { id: PropertyAge; labelKey: string }[] = [
  { id: 'new', labelKey: 'intake.age_options.new' },
  { id: '1_5', labelKey: 'intake.age_options.1_5' },
  { id: '5_10', labelKey: 'intake.age_options.5_10' },
  { id: '10_20', labelKey: 'intake.age_options.10_20' },
  { id: '20_plus', labelKey: 'intake.age_options.20_plus' },
];

const POPULAR_TOWNS = [
  { key: 'alwar', trendKey: 'fast_growing' },
  { key: 'meerut', trendKey: 'high_demand' },
  { key: 'karnal', trendKey: 'prime_sector' },
  { key: 'jhansi', trendKey: 'steady' },
  { key: 'gorakhpur', trendKey: 'commercial_boom' },
  { key: 'kolhapur', trendKey: 'high_liquidity' },
  { key: 'warangal', trendKey: 'new_bypass' },
  { key: 'bathinda', trendKey: 'steady' },
];

export const PropertyIntakeForm: React.FC = () => {
  const { t, language } = useTranslation();
  const {
    propertyInput,
    updatePropertyInput,
    submitValuation,
    setIsVoiceModalOpen,
    setStep,
  } = useValuation();

  const [showTownSuggestions, setShowTownSuggestions] = useState(false);

  // Automatically synchronize location name when language changes
  useEffect(() => {
    if (propertyInput.location) {
      const localized = getLocalizedTownName(propertyInput.location, t);
      if (localized && localized !== propertyInput.location) {
        updatePropertyInput({ location: localized });
      }
    } else {
      updatePropertyInput({ location: t('towns.alwar') });
    }
  }, [language]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitValuation();
  };

  const handleLoadPreset = (key: 'alwar_house' | 'karnal_plot' | 'jhansi_shop' | 'kolhapur_flat') => {
    if (key === 'alwar_house') {
      updatePropertyInput({
        intent: 'sell',
        location: t('towns.alwar'),
        localityPincode: 'Shanti Nagar, Sector 4',
        propertyType: 'house',
        area: 1500,
        areaUnit: 'sqft',
        age: '1_5',
        roadWidth: '30ft',
        bedrooms: 3,
        isCornerPlot: true,
      });
    } else if (key === 'karnal_plot') {
      updatePropertyInput({
        intent: 'buy',
        location: t('towns.karnal'),
        localityPincode: 'Sector 32 Urban Estate',
        propertyType: 'plot',
        area: 200,
        areaUnit: 'gaj',
        age: 'new',
        roadWidth: '40ft',
        bedrooms: 0,
        isCornerPlot: false,
      });
    } else if (key === 'jhansi_shop') {
      updatePropertyInput({
        intent: 'sell',
        location: t('towns.jhansi'),
        localityPincode: 'Sadar Bazar Main Market',
        propertyType: 'shop',
        area: 450,
        areaUnit: 'sqft',
        age: '5_10',
        roadWidth: '40ft',
        bedrooms: 0,
        isCornerPlot: true,
      });
    } else if (key === 'kolhapur_flat') {
      updatePropertyInput({
        intent: 'buy',
        location: t('towns.kolhapur'),
        localityPincode: 'Tarabai Park Colony',
        propertyType: 'apartment',
        area: 1200,
        areaUnit: 'sqft',
        age: '1_5',
        roadWidth: '30ft',
        bedrooms: 2,
        isCornerPlot: false,
      });
    }
  };

  const calculatedSqFt = convertAreaToSqFt(propertyInput.area, propertyInput.areaUnit);
  const isSeller = propertyInput.intent === 'sell';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 animate-in fade-in duration-300 space-y-6">
      {/* Intent Mode Indicator & Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep('intent')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 px-3.5 py-1.5 rounded-xl bg-white hover:bg-cream-100 transition-all border border-cream-300 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('intake.change_mode')}</span>
        </button>

        <div
          className={`px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm ${
            isSeller
              ? 'bg-brand-950 text-amber-300 border border-amber-400/40'
              : 'bg-blue-950 text-sky-300 border border-sky-400/40'
          }`}
        >
          {isSeller ? <Tag className="w-3.5 h-3.5 text-amber-400" /> : <ShoppingCart className="w-3.5 h-3.5 text-sky-400" />}
          <span>{isSeller ? t('intent_select.seller_tag') : t('intent_select.buyer_tag')}</span>
        </div>
      </div>

      {/* Realistic Indian Small Town Hero Visual with Clickable Buildings */}
      <HeroTownVisual />

      {/* Main Intake Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-xl shadow-brand-950/5 border-2 border-cream-300 p-6 sm:p-8 lg:p-10 space-y-8"
      >
        {/* Form Title & Voice Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-brand-100 text-brand-950 text-[10px] font-black uppercase tracking-wider border border-brand-200">
                {t('result.badge')}
              </span>
              <span className="text-xs text-slate-500 font-semibold">• MoolyaSetu Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
              {isSeller ? t('intake.heading') : t('intent_select.buyer_title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              {isSeller
                ? t('intent_select.seller_desc')
                : t('intent_select.buyer_desc')}
            </p>
          </div>

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={() => setIsVoiceModalOpen(true)}
            className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-saffron-600 to-terracotta-600 hover:from-amber-700 hover:to-terracotta-700 text-white font-black text-xs sm:text-sm shadow-md shadow-amber-900/20 transition-all transform active:scale-95 group shrink-0 cursor-pointer"
          >
            <Mic className="w-4 h-4 text-white animate-pulse" />
            <span>{t('intake.voice_button')}</span>
          </button>
        </div>

        {/* Quick Demo Presets (Fully Localized) */}
        <div className="flex flex-wrap items-center gap-2 bg-gradient-to-r from-cream-100 via-amber-50/50 to-cream-100 p-3.5 rounded-2xl border border-cream-300 shadow-2xs">
          <span className="text-xs font-black text-slate-800 flex items-center gap-1.5 pr-1">
            <Sparkles className="w-4 h-4 text-amber-600" />
            {t('intake.sample_presets')}
          </span>
          <button
            type="button"
            onClick={() => handleLoadPreset('alwar_house')}
            className="text-xs px-3 py-1.5 rounded-xl bg-white hover:bg-brand-900 hover:text-white border border-cream-300 text-slate-800 font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            {t('presets.alwar_house')}
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset('karnal_plot')}
            className="text-xs px-3 py-1.5 rounded-xl bg-white hover:bg-brand-900 hover:text-white border border-cream-300 text-slate-800 font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            {t('presets.karnal_plot')}
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset('jhansi_shop')}
            className="text-xs px-3 py-1.5 rounded-xl bg-white hover:bg-brand-900 hover:text-white border border-cream-300 text-slate-800 font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            {t('presets.jhansi_shop')}
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset('kolhapur_flat')}
            className="text-xs px-3 py-1.5 rounded-xl bg-white hover:bg-brand-900 hover:text-white border border-cream-300 text-slate-800 font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            {t('presets.kolhapur_flat')}
          </button>
        </div>

        {/* Property Type Selector with Realistic Visual Cards */}
        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2.5">
            {t('intake.fields.property_type')} <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {PROPERTY_TYPES.map((type) => {
              const isSelected = propertyInput.propertyType === type.id;
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => updatePropertyInput({ propertyType: type.id })}
                  className={`relative overflow-hidden rounded-2xl border-2 transition-all flex flex-col text-left group cursor-pointer ${
                    isSelected
                      ? 'border-brand-700 bg-brand-50/80 shadow-lg shadow-brand-700/15 ring-2 ring-brand-600/30'
                      : 'border-cream-300 hover:border-cream-400 bg-white hover:shadow-md'
                  }`}
                >
                  {/* Property Card Thumbnail Image */}
                  <div className="h-24 sm:h-28 w-full relative overflow-hidden bg-slate-200">
                    <img
                      src={type.imgUrl}
                      alt={t(type.labelKey)}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-xl bg-white/95 backdrop-blur-xs flex items-center justify-center text-brand-950 shadow">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="absolute bottom-2 left-2.5 right-2 text-white font-black text-xs sm:text-sm drop-shadow line-clamp-1">
                      {t(type.labelKey)}
                    </div>
                  </div>

                  <div className="p-3 bg-white flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      {type.id === 'house' ? '1-3 Floors' : type.id === 'plot' ? 'Freehold' : type.id === 'apartment' ? 'Society' : 'Mandi/Market'}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location & Locality Auto-Suggest with Verified Registry Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              {t('intake.fields.location')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-700">
                <MapPin className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                value={propertyInput.location}
                onFocus={() => setShowTownSuggestions(true)}
                onChange={(e) => {
                  updatePropertyInput({ location: e.target.value });
                  setShowTownSuggestions(true);
                }}
                placeholder={t('intake.fields.location_placeholder')}
                className="w-full pl-11 pr-4 py-3.5 bg-cream-50/70 border-2 border-cream-300 rounded-2xl text-slate-900 text-sm font-bold focus:ring-2 focus:ring-brand-700 focus:bg-white focus:outline-none transition-all shadow-inner"
              />
            </div>

            {/* Quick Town Suggestions Dropdown */}
            {showTownSuggestions && (
              <div className="absolute z-20 top-full mt-1.5 inset-x-0 bg-white rounded-2xl border-2 border-cream-300 shadow-2xl p-2.5 space-y-1.5">
                <div className="flex justify-between items-center px-2 py-1 text-[11px] font-black text-slate-600 uppercase border-b border-cream-200">
                  <span>📍 {t('intake.popular_towns_title')}</span>
                  <button
                    type="button"
                    onClick={() => setShowTownSuggestions(false)}
                    className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
                  >
                    ✕ {t('common.close')}
                  </button>
                </div>
                {POPULAR_TOWNS.map((twn) => {
                  const localizedTownName = t(`towns.${twn.key}`);
                  const localizedTrendName = t(`trends.${twn.trendKey}`);
                  return (
                    <button
                      key={twn.key}
                      type="button"
                      onClick={() => {
                        updatePropertyInput({ location: localizedTownName });
                        setShowTownSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-brand-50 flex items-center justify-between text-xs transition-colors cursor-pointer"
                    >
                      <div className="font-bold text-slate-900">📍 {localizedTownName}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-brand-900 font-bold bg-brand-100 px-2 py-0.5 rounded-md border border-brand-200">
                          🏛️ Sub-Registrar Linked
                        </span>
                        <span className="text-[10px] text-amber-800 font-bold">
                          {localizedTrendName}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              {t('intake.fields.locality')}
            </label>
            <input
              type="text"
              value={propertyInput.localityPincode || ''}
              onChange={(e) => updatePropertyInput({ localityPincode: e.target.value })}
              placeholder={t('intake.fields.locality_placeholder')}
              className="w-full px-4 py-3.5 bg-cream-50/70 border-2 border-cream-300 rounded-2xl text-slate-900 text-sm font-bold focus:ring-2 focus:ring-brand-700 focus:bg-white focus:outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Area & Unit Selector with Live Standardized Conversion */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              {t('intake.fields.area')} <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="10"
                required
                value={propertyInput.area || ''}
                onChange={(e) =>
                  updatePropertyInput({ area: Math.max(0, parseInt(e.target.value) || 0) })
                }
                placeholder={t('intake.fields.area_placeholder')}
                className="flex-1 px-4 py-3.5 bg-cream-50/70 border-2 border-cream-300 rounded-2xl text-slate-900 font-black text-base focus:ring-2 focus:ring-brand-700 focus:bg-white focus:outline-none transition-all shadow-inner"
              />
              <select
                value={propertyInput.areaUnit}
                onChange={(e) => updatePropertyInput({ areaUnit: e.target.value as AreaUnit })}
                className="px-4 py-3.5 bg-cream-200 border-2 border-cream-300 rounded-2xl text-slate-900 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-brand-700 focus:outline-none cursor-pointer"
              >
                <option value="sqft">{t('intake.units.sqft')}</option>
                <option value="gaj">{t('intake.units.gaj')}</option>
                <option value="guntha">{t('intake.units.guntha')}</option>
                <option value="bigha">{t('intake.units.bigha')}</option>
              </select>
            </div>
            {propertyInput.areaUnit !== 'sqft' && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-brand-900 font-bold bg-brand-50 px-3 py-1 rounded-xl border border-brand-200 w-fit">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-700" />
                <span>Standardized: {calculatedSqFt.toLocaleString('en-IN')} Sq. Ft</span>
              </div>
            )}
          </div>

          {/* Bedrooms (BHK) */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              {t('intake.fields.bedrooms')}
            </label>
            <select
              value={propertyInput.bedrooms || 2}
              onChange={(e) =>
                updatePropertyInput({ bedrooms: parseInt(e.target.value, 10) })
              }
              className="w-full px-4 py-3.5 bg-cream-50/70 border-2 border-cream-300 rounded-2xl text-slate-900 text-sm font-bold focus:ring-2 focus:ring-brand-700 focus:outline-none cursor-pointer shadow-inner"
            >
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4 BHK</option>
              <option value="5">5+ BHK</option>
            </select>
          </div>
        </div>

        {/* Construction Age & Road Width */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              {t('intake.fields.age')}
            </label>
            <select
              value={propertyInput.age}
              onChange={(e) => updatePropertyInput({ age: e.target.value as PropertyAge })}
              className="w-full px-4 py-3.5 bg-cream-50/70 border-2 border-cream-300 rounded-2xl text-slate-900 text-sm font-bold focus:ring-2 focus:ring-brand-700 focus:outline-none cursor-pointer shadow-inner"
            >
              {AGE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              {t('intake.fields.road_width')}
            </label>
            <select
              value={propertyInput.roadWidth}
              onChange={(e) => updatePropertyInput({ roadWidth: e.target.value as RoadWidth })}
              className="w-full px-4 py-3.5 bg-cream-50/70 border-2 border-cream-300 rounded-2xl text-slate-900 text-sm font-bold focus:ring-2 focus:ring-brand-700 focus:outline-none cursor-pointer shadow-inner"
            >
              {ROAD_WIDTHS.map((r) => (
                <option key={r.id} value={r.id}>
                  {t(`intake.road_widths.${r.id}`)} ({r.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Corner Plot Option */}
        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
            {t('intake.fields.corner_plot')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updatePropertyInput({ isCornerPlot: true })}
              className={`p-4 rounded-2xl border-2 text-left font-bold text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${
                propertyInput.isCornerPlot
                  ? 'border-brand-700 bg-brand-50 text-brand-950 shadow-md ring-2 ring-brand-700/20'
                  : 'border-cream-300 hover:border-cream-400 bg-white text-slate-700'
              }`}
            >
              <span>{t('intake.corner_options.yes')} ({t('result.corner_applied')})</span>
              {propertyInput.isCornerPlot && <CheckCircle2 className="w-5 h-5 text-brand-700" />}
            </button>

            <button
              type="button"
              onClick={() => updatePropertyInput({ isCornerPlot: false })}
              className={`p-4 rounded-2xl border-2 text-left font-bold text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${
                !propertyInput.isCornerPlot
                  ? 'border-brand-700 bg-brand-50 text-brand-950 shadow-md ring-2 ring-brand-700/20'
                  : 'border-cream-300 hover:border-cream-400 bg-white text-slate-700'
              }`}
            >
              <span>{t('intake.corner_options.no')}</span>
              {!propertyInput.isCornerPlot && <CheckCircle2 className="w-5 h-5 text-brand-700" />}
            </button>
          </div>
        </div>

        {/* Live Architectural Blueprint Visualizer */}
        <BlueprintVisualizer {...propertyInput} />

        {/* Submit Valuation CTA */}
        <div className="pt-4 border-t border-cream-200">
          <button
            type="submit"
            className="w-full py-4.5 px-6 rounded-2xl bg-gradient-to-r from-brand-900 via-brand-800 to-emerald-800 hover:from-brand-950 hover:to-emerald-900 text-white font-black text-base sm:text-lg shadow-xl shadow-brand-950/20 hover:shadow-brand-950/30 transition-all transform active:scale-98 flex items-center justify-center gap-3 group cursor-pointer"
          >
            <span>{t('intake.submit_button')}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </form>

      {/* Real Indian Small-Town Property Directory Gallery */}
      <TownGallerySection />
    </div>
  );
};
