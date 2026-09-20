import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import type { PropertyType, RoadWidth, AreaUnit } from '../types/valuation';
import { convertAreaToSqFt } from '../api/mockData';
import { Eye, Layers, Compass, Sparkles } from 'lucide-react';

interface BlueprintVisualizerProps {
  propertyType: PropertyType;
  area: number;
  areaUnit: AreaUnit;
  roadWidth: RoadWidth;
  isCornerPlot: boolean;
  bedrooms: number;
  location: string;
}

export const BlueprintVisualizer: React.FC<BlueprintVisualizerProps> = ({
  propertyType,
  area,
  areaUnit,
  roadWidth,
  isCornerPlot,
  bedrooms,
  location,
}) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'2d' | 'elevation'>('2d');
  const sqFt = convertAreaToSqFt(area || 100, areaUnit);

  // Approximate front width vs depth aspect ratio (typical Indian plot ~ 1:2 or 1:2.5)
  const approxFrontage = Math.round(Math.sqrt(sqFt / 2));
  const approxDepth = Math.round(sqFt / approxFrontage);

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border-2 border-brand-800 shadow-xl space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center text-white shadow-md">
            <Compass className="w-4 h-4 text-emerald-300 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                {t('blueprint.title')}
              </span>
              <span className="text-[10px] bg-brand-900/80 text-brand-300 px-2 py-0.5 rounded-full border border-brand-700">
                {t('blueprint.updating')}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-200">
              {propertyType === 'house'
                ? `${bedrooms} BHK Independent Model`
                : propertyType === 'plot'
                ? 'Freehold Residential Plot Boundary'
                : propertyType === 'shop'
                ? 'Commercial Retail Shopfront'
                : `${bedrooms} BHK Builder Floor Layout`}
            </h4>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setViewMode('2d')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === '2d'
                ? 'bg-brand-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('blueprint.mode_2d')}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('elevation')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'elevation'
                ? 'bg-brand-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t('blueprint.mode_elevation')}</span>
          </button>
        </div>
      </div>

      {/* Visual Canvas */}
      <div className="relative w-full h-[220px] sm:h-[250px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center select-none p-4">
        {/* Blueprint Grid Lines */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'linear-gradient(to right, #22c55e 1px, transparent 1px), linear-gradient(to bottom, #22c55e 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {viewMode === '2d' ? (
          /* 2D Plan View */
          <div className="relative w-full max-w-sm h-full flex items-center justify-center">
            {/* Front Approach Road */}
            <div className="absolute bottom-1 inset-x-0 h-9 bg-slate-800/90 border-t-2 border-dashed border-amber-400/80 rounded-b-xl flex items-center justify-center text-[10px] font-black text-amber-300 tracking-wider">
              🛣️ {roadWidth.toUpperCase()} FRONT ROAD ({roadWidth === '40ft' ? 'Wide Sector Main' : 'Colony Approach'})
            </div>

            {/* Corner Road (if active) */}
            {isCornerPlot && (
              <div className="absolute top-0 bottom-10 right-0 w-8 bg-slate-800/90 border-l-2 border-dashed border-amber-400/80 rounded-r-xl flex items-center justify-center text-[8px] font-black text-amber-300 [writing-mode:vertical-lr] tracking-widest">
                2ND SIDE ROAD (CORNER)
              </div>
            )}

            {/* Main Plot Box */}
            <div
              className={`relative border-2 rounded-xl transition-all duration-300 shadow-2xl p-2.5 flex flex-col justify-between ${
                isCornerPlot
                  ? 'border-emerald-400 bg-emerald-950/40 mr-7'
                  : 'border-cyan-400 bg-cyan-950/40'
              }`}
              style={{
                width: `${Math.min(260, Math.max(160, approxFrontage * 6.5))}px`,
                height: `${Math.min(150, Math.max(110, approxDepth * 3))}px`,
                marginBottom: '38px',
              }}
            >
              {/* Plot Dimension Tags */}
              <div className="flex justify-between items-center text-[9px] font-mono text-emerald-300 border-b border-emerald-800/50 pb-1">
                <span>Front: ~{approxFrontage} ft</span>
                <span className="font-bold text-white bg-emerald-900/80 px-1.5 py-0.5 rounded">
                  {area} {areaUnit.toUpperCase()} ({sqFt.toLocaleString()} sq.ft)
                </span>
                <span>Depth: ~{approxDepth} ft</span>
              </div>

              {/* Internal Rooms Partition / Plot Land preview */}
              {propertyType === 'house' ? (
                <div className="grid grid-cols-3 gap-1.5 flex-1 my-1.5 text-center">
                  <div className="bg-slate-800/80 rounded border border-slate-700/80 p-1 flex flex-col justify-center">
                    <span className="text-[8px] font-bold text-slate-300">Living / Hall</span>
                    <span className="text-[7px] text-emerald-400">बैठक</span>
                  </div>
                  <div className="bg-slate-800/80 rounded border border-slate-700/80 p-1 flex flex-col justify-center">
                    <span className="text-[8px] font-bold text-slate-300">{bedrooms} Bed Rooms</span>
                    <span className="text-[7px] text-emerald-400">शयन कक्ष</span>
                  </div>
                  <div className="bg-slate-800/80 rounded border border-slate-700/80 p-1 flex flex-col justify-center">
                    <span className="text-[8px] font-bold text-slate-300">Kitchen & Bath</span>
                    <span className="text-[7px] text-emerald-400">रसोई/स्नान</span>
                  </div>
                </div>
              ) : propertyType === 'plot' ? (
                <div className="flex-1 my-2 flex items-center justify-center border border-dashed border-emerald-500/40 rounded bg-emerald-900/20 text-center p-2">
                  <span className="text-[10px] font-black text-emerald-300">
                    🟢 100% Freehold Open Land Area • Immediate Registry & Possession
                  </span>
                </div>
              ) : propertyType === 'shop' ? (
                <div className="flex-1 my-2 flex items-center justify-center border border-amber-500/40 rounded bg-amber-950/30 text-center p-2">
                  <span className="text-[10px] font-black text-amber-300">
                    🏪 High Footfall Frontage • Double Shutter Retail Display
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-1.5 flex-1 my-1.5 text-center">
                  <div className="bg-slate-800/80 rounded p-1 flex items-center justify-center text-[8px] text-slate-300">
                    {bedrooms} BHK Master Suite
                  </div>
                  <div className="bg-slate-800/80 rounded p-1 flex items-center justify-center text-[8px] text-slate-300">
                    Drawing & Balcony
                  </div>
                </div>
              )}

              {/* Entrance Gate */}
              <div className="flex items-center justify-between text-[8px] font-bold text-slate-400 border-t border-slate-800 pt-1">
                <span className="flex items-center gap-1 text-amber-400 font-extrabold">
                  🚪 Main Gate ({roadWidth} entry)
                </span>
                {isCornerPlot && (
                  <span className="text-emerald-400 font-extrabold">
                    ✨ +8% Corner Advantage
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* 3D Architectural Elevation Frontage View */
          <div className="relative w-full h-full flex flex-col items-center justify-center text-center space-y-2">
            <div className="relative bg-gradient-to-b from-amber-100 to-amber-200 text-slate-900 border-2 border-amber-400 rounded-2xl p-4 shadow-2xl max-w-xs w-full">
              {/* Rooftop Water Tank & Solar */}
              <div className="absolute -top-3 left-6 flex items-center gap-1.5">
                <span className="bg-blue-600 text-white text-[7px] font-bold px-1.5 py-0.5 rounded shadow">
                  💧 1000L Sintex
                </span>
                <span className="bg-emerald-700 text-white text-[7px] font-bold px-1.5 py-0.5 rounded shadow">
                  ☀️ Solar Ready
                </span>
              </div>

              {/* Building Facade */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[9px] font-black text-slate-800 border-b border-amber-300 pb-1">
                  <span>{propertyType.toUpperCase()} ELEVATION</span>
                  <span className="text-emerald-800 font-bold">{location || 'Local Town'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 py-1">
                  <div className="h-10 bg-amber-300/80 rounded border border-amber-400 flex items-center justify-center text-[8px] font-bold">
                    Balcony / Jaali
                  </div>
                  <div className="h-10 bg-amber-300/80 rounded border border-amber-400 flex items-center justify-center text-[8px] font-bold">
                    Upper Floor
                  </div>
                  <div className="h-10 bg-amber-300/80 rounded border border-amber-400 flex items-center justify-center text-[8px] font-bold">
                    Terrace Glass
                  </div>
                </div>
                <div className="h-7 bg-amber-400/90 rounded border border-amber-500 flex items-center justify-between px-2 text-[8px] font-black text-slate-900">
                  <span>Car Parking Porch</span>
                  <span>{roadWidth} Approach</span>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-slate-400">
              Realistic small-town independent elevation profile based on your dimensions
            </div>
          </div>
        )}

        {/* Interactive Layout Status Badge */}
        <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/50 flex items-center gap-2 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <div className="text-right">
            <div className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">
              Architectural Grid
            </div>
            <div className="text-xs font-black text-emerald-300">
              {approxFrontage} ft × {approxDepth} ft
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Ticker Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
          <span className="text-[10px] text-slate-400 block">{t('blueprint.total_area')}</span>
          <span className="font-bold text-white">
            {area} {areaUnit} ({sqFt.toLocaleString()} sq.ft)
          </span>
        </div>
        <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
          <span className="text-[10px] text-slate-400 block">{t('blueprint.road_frontage')}</span>
          <span className="font-bold text-amber-300">{roadWidth}</span>
        </div>
        <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
          <span className="text-[10px] text-slate-400 block">{t('blueprint.depth')}</span>
          <span
            className={`font-bold ${
              isCornerPlot ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            {isCornerPlot ? '✓ Corner' : 'Standard'}
          </span>
        </div>
        <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
          <span className="text-[10px] text-slate-400 block">{t('blueprint.structure')}</span>
          <span className="font-bold text-emerald-300">
            {propertyType === 'plot'
              ? 'Plot'
              : propertyType === 'shop'
              ? 'Shop'
              : `${bedrooms} BHK`}
          </span>
        </div>
      </div>
    </div>
  );
};
