import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import type { ValuationResponse } from '../types/valuation';
import { Compass, Sparkles, MapPin } from 'lucide-react';

interface InteractiveTownMapProps {
  valuation: ValuationResponse;
}

export const InteractiveTownMap: React.FC<InteractiveTownMapProps> = ({ valuation }) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<'all' | 'amenities' | 'comps'>('all');
  const [selectedNodeKey, setSelectedNodeKey] = useState<string>('target');

  // Node definitions with localized dynamic lookups
  const getNodeData = (key: string) => {
    switch (key) {
      case 'school':
        return {
          title: t('map.school_title'),
          category: t('map.school_cat'),
          distance: t('map.school_dist'),
          detail: t('map.school_detail'),
          driverBadge: t('map.school_badge'),
        };
      case 'mandi':
        return {
          title: t('map.mandi_title'),
          category: t('map.mandi_cat'),
          distance: t('map.mandi_dist'),
          detail: t('map.mandi_detail'),
          driverBadge: t('map.mandi_badge'),
        };
      case 'hospital':
        return {
          title: t('map.hospital_title'),
          category: t('map.hospital_cat'),
          distance: t('map.hospital_dist'),
          detail: t('map.hospital_detail'),
          driverBadge: t('map.hospital_badge'),
        };
      case 'comp1':
        return {
          title: t('map.comp1_title'),
          category: t('map.comp1_cat'),
          distance: t('map.comp1_dist'),
          detail: t('map.comp1_detail'),
          driverBadge: t('map.comp1_badge'),
        };
      case 'comp2':
        return {
          title: t('map.comp2_title'),
          category: t('map.comp2_cat'),
          distance: t('map.comp2_dist'),
          detail: t('map.comp2_detail'),
          driverBadge: t('map.comp2_badge'),
        };
      case 'target':
      default:
        return {
          title: t('map.target_title'),
          category: t('map.target_cat'),
          distance: t('map.target_dist'),
          detail: `${valuation.propertySummary.areaOriginal} • ${valuation.propertySummary.roadWidth} Approach Road • ${valuation.propertySummary.isCornerPlot ? t('result.corner_applied') : t('result.standard_plot')}`,
          driverBadge: t('map.target_badge'),
        };
    }
  };

  const selectedNode = getNodeData(selectedNodeKey);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-cream-300 shadow-xl space-y-4 overflow-hidden">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-3.5">
        <div>
          <div className="flex items-center gap-2 text-brand-900 text-xs font-black uppercase tracking-wider">
            <Compass className="w-4 h-4 text-emerald-600 animate-spin-slow" />
            <span>{t('map.tag')}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            {t('map.heading')}
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            {t('map.subheading')}
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 bg-cream-100 p-1.5 rounded-2xl border border-cream-300 self-start sm:self-auto shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all' ? 'bg-brand-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('map.all_pins')}
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('amenities')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'amenities' ? 'bg-brand-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('map.amenities')}
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('comps')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'comps' ? 'bg-brand-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('map.comps')}
          </button>
        </div>
      </div>

      {/* Visual Map Canvas (SVG Interactive Layout with animated connecting paths) */}
      <div className="relative w-full h-[320px] sm:h-[370px] bg-[#f7f4ec] rounded-2xl border-2 border-cream-300 overflow-hidden shadow-inner select-none">
        {/* Subtle Town Grid Pattern */}
        <div className="absolute inset-0 bg-mandala-subtle opacity-35" />

        <svg className="w-full h-full" viewBox="0 0 500 360" xmlns="http://www.w3.org/2000/svg">
          {/* Colony Road Infrastructure Grid */}
          {/* 40ft Main Sector Artery Road */}
          <line x1="0" y1="180" x2="500" y2="180" stroke="#cbd5e1" strokeWidth="28" />
          <line x1="0" y1="180" x2="500" y2="180" stroke="#94a3b8" strokeWidth="2" strokeDasharray="8 6" />

          {/* 30ft Colony Cross Road */}
          <line x1="250" y1="0" x2="250" y2="360" stroke="#cbd5e1" strokeWidth="22" />
          <line x1="250" y1="0" x2="250" y2="360" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 6" />

          {/* Diagonal Town Link Artery */}
          <line x1="40" y1="30" x2="460" y2="330" stroke="#e2e8f0" strokeWidth="14" />

          {/* Animated Connecting Radar Lines from User's House (250, 180) */}
          {(activeFilter === 'all' || activeFilter === 'amenities') && (
            <>
              {/* Line to School (120, 80) */}
              <line x1="250" y1="180" x2="120" y2="80" stroke="#16a34a" strokeWidth="2.5" className="map-line-dash" opacity="0.85" />
              {/* Line to Mandi / Market (390, 95) */}
              <line x1="250" y1="180" x2="390" y2="95" stroke="#f59e0b" strokeWidth="2.5" className="map-line-dash" opacity="0.85" />
              {/* Line to Civil Hospital (375, 275) */}
              <line x1="250" y1="180" x2="375" y2="275" stroke="#0284c7" strokeWidth="2.5" className="map-line-dash" opacity="0.85" />
            </>
          )}

          {(activeFilter === 'all' || activeFilter === 'comps') && (
            <>
              {/* Line to Comp #1 (130, 260) */}
              <line x1="250" y1="180" x2="130" y2="260" stroke="#8b5cf6" strokeWidth="2.5" className="map-line-dash" opacity="0.85" />
              {/* Line to Comp #2 (250, 45) */}
              <line x1="250" y1="180" x2="250" y2="45" stroke="#8b5cf6" strokeWidth="2.5" className="map-line-dash" opacity="0.85" />
            </>
          )}

          {/* Radiating Radar Wave Circles from User's House */}
          <circle cx="250" cy="180" r="45" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.5" className="animate-ping" style={{ animationDuration: '3.5s' }} />
          <circle cx="250" cy="180" r="95" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
          <circle cx="250" cy="180" r="145" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 4" opacity="0.25" />

          {/* ================= LANDMARK NODES ================= */}

          {/* 1. MODEL SCHOOL NODE (120, 80) */}
          {(activeFilter === 'all' || activeFilter === 'amenities') && (
            <g
              transform="translate(120, 80)"
              className="cursor-pointer group"
              onClick={() => setSelectedNodeKey('school')}
            >
              <circle cx="0" cy="0" r="18" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.5" className="group-hover:scale-110 transition-transform" />
              <text x="0" y="5" fill="#15803d" fontSize="13" textAnchor="middle">🎓</text>
              <rect x="-34" y="22" width="68" height="15" fill="#ffffff" rx="4" stroke="#cbd5e1" strokeWidth="1" />
              <text x="0" y="33" fill="#0f172a" fontSize="7.5" fontWeight="bold" textAnchor="middle">{t('map.school_title').slice(0, 14)}...</text>
            </g>
          )}

          {/* 2. MAIN MANDI / MARKET NODE (390, 95) */}
          {(activeFilter === 'all' || activeFilter === 'amenities') && (
            <g
              transform="translate(390, 95)"
              className="cursor-pointer group"
              onClick={() => setSelectedNodeKey('mandi')}
            >
              <circle cx="0" cy="0" r="18" fill="#fef3c7" stroke="#d97706" strokeWidth="2.5" className="group-hover:scale-110 transition-transform" />
              <text x="0" y="5" fill="#b45309" fontSize="13" textAnchor="middle">🛍️</text>
              <rect x="-34" y="22" width="68" height="15" fill="#ffffff" rx="4" stroke="#cbd5e1" strokeWidth="1" />
              <text x="0" y="33" fill="#0f172a" fontSize="7.5" fontWeight="bold" textAnchor="middle">{t('map.mandi_title').slice(0, 14)}...</text>
            </g>
          )}

          {/* 3. CIVIL HOSPITAL NODE (375, 275) */}
          {(activeFilter === 'all' || activeFilter === 'amenities') && (
            <g
              transform="translate(375, 275)"
              className="cursor-pointer group"
              onClick={() => setSelectedNodeKey('hospital')}
            >
              <circle cx="0" cy="0" r="18" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" className="group-hover:scale-110 transition-transform" />
              <text x="0" y="5" fill="#0369a1" fontSize="13" textAnchor="middle">🏥</text>
              <rect x="-36" y="22" width="72" height="15" fill="#ffffff" rx="4" stroke="#cbd5e1" strokeWidth="1" />
              <text x="0" y="33" fill="#0f172a" fontSize="7.5" fontWeight="bold" textAnchor="middle">{t('map.hospital_title').slice(0, 14)}...</text>
            </g>
          )}

          {/* 4. SUB-REGISTRAR COMP #1 (130, 260) */}
          {(activeFilter === 'all' || activeFilter === 'comps') && (
            <g
              transform="translate(130, 260)"
              className="cursor-pointer group"
              onClick={() => setSelectedNodeKey('comp1')}
            >
              <circle cx="0" cy="0" r="18" fill="#f3e8ff" stroke="#9333ea" strokeWidth="2.5" className="group-hover:scale-110 transition-transform" />
              <text x="0" y="5" fill="#7e22ce" fontSize="12" textAnchor="middle">🏡</text>
              <rect x="-38" y="22" width="76" height="15" fill="#ffffff" rx="4" stroke="#cbd5e1" strokeWidth="1" />
              <text x="0" y="33" fill="#6b21a8" fontSize="7.5" fontWeight="bold" textAnchor="middle">Deed Comp (350m)</text>
            </g>
          )}

          {/* 5. SUB-REGISTRAR COMP #2 (250, 45) */}
          {(activeFilter === 'all' || activeFilter === 'comps') && (
            <g
              transform="translate(250, 45)"
              className="cursor-pointer group"
              onClick={() => setSelectedNodeKey('comp2')}
            >
              <circle cx="0" cy="0" r="18" fill="#f3e8ff" stroke="#9333ea" strokeWidth="2.5" className="group-hover:scale-110 transition-transform" />
              <text x="0" y="5" fill="#7e22ce" fontSize="12" textAnchor="middle">📐</text>
              <rect x="-38" y="22" width="76" height="15" fill="#ffffff" rx="4" stroke="#cbd5e1" strokeWidth="1" />
              <text x="0" y="33" fill="#6b21a8" fontSize="7.5" fontWeight="bold" textAnchor="middle">Deed Comp (520m)</text>
            </g>
          )}

          {/* ================= CENTER: USER'S HOUSE TARGET NODE (250, 180) ================= */}
          <g
            transform="translate(250, 180)"
            className="cursor-pointer"
            onClick={() => setSelectedNodeKey('target')}
          >
            {/* Glowing Center Badge */}
            <circle cx="0" cy="0" r="24" fill="#072b17" stroke="#4ade80" strokeWidth="3.5" className="drop-shadow-xl" />
            <text x="0" y="6" fill="#ffffff" fontSize="16" textAnchor="middle">📍</text>
            <rect x="-50" y="-38" width="100" height="20" fill="#072b17" rx="6" stroke="#22c55e" strokeWidth="1.5" />
            <text x="0" y="-25" fill="#4ade80" fontSize="8.5" fontWeight="black" textAnchor="middle">{t('map.your_house')}</text>
          </g>
        </svg>

        {/* Legend Overlay at Top Right */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-cream-300 shadow-md text-[10px] space-y-1.5">
          <div className="font-black text-slate-800 border-b border-slate-100 pb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-brand-700" />
            <span>{t('map.legend_title')}</span>
          </div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-brand-800" /> <span className="font-bold">{t('map.legend_target')}</span></div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> <span className="font-bold">{t('map.legend_comps')}</span></div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> <span className="font-bold">{t('map.legend_amenities')}</span></div>
        </div>
      </div>

      {/* Selected Marker Detail Card */}
      {selectedNode && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cream-50 via-amber-50/30 to-cream-50 border-2 border-cream-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 text-sm sm:text-base">{selectedNode.title}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-950 text-amber-300 font-black text-[10px] border border-amber-400/30">
                {selectedNode.distance}
              </span>
            </div>
            <p className="text-slate-700 font-medium">{selectedNode.detail}</p>
          </div>

          <div className="shrink-0 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-950 font-black text-xs border border-emerald-300 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              {selectedNode.driverBadge}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
