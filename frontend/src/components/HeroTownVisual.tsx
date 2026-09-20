import React, { useState } from 'react';
import { Sparkles, Sun, Sunset, Moon, MapPin, CheckCircle2, Home, Landmark, Store, Building2, Eye } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useValuation } from '../context/ValuationContext';
import type { PropertyType } from '../types/valuation';

type TimeOfDay = 'day' | 'twilight' | 'night';

interface PropertyHotspot {
  id: PropertyType;
  titleKey: string;
  subKey: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  rateHint: string;
  leftPercent: string;
  topPercent: string;
}

export const HeroTownVisual: React.FC = () => {
  const { t } = useTranslation();
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const { updatePropertyInput, propertyInput } = useValuation();

  const handleSelectType = (type: PropertyType, title: string) => {
    updatePropertyInput({ propertyType: type });
    setActiveToast(`${t('hero_town.selected_toast')} ${title}`);
    setTimeout(() => setActiveToast(null), 3000);
  };

  // Real high-resolution authentic Indian village and small-town photography
  const lightingPhotos: Record<TimeOfDay, { url: string; alt: string; overlay: string; skyFilter: string }> = {
    day: {
      url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&auto=format&fit=crop&q=85',
      alt: 'Indian town residential street and traditional houses in bright daylight',
      overlay: 'from-black/60 via-black/20 to-black/75',
      skyFilter: 'brightness-100 contrast-105 saturate-110',
    },
    twilight: {
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1600&auto=format&fit=crop&q=85',
      alt: 'Golden sunset over Indian village fields and houses',
      overlay: 'from-amber-950/70 via-orange-950/30 to-black/80',
      skyFilter: 'brightness-95 contrast-110 saturate-125',
    },
    night: {
      url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=85',
      alt: 'Serene night sky with stars over rural Indian landscape',
      overlay: 'from-slate-950/85 via-indigo-950/50 to-black/90',
      skyFilter: 'brightness-75 contrast-120 saturate-90',
    },
  };

  const hotspots: PropertyHotspot[] = [
    {
      id: 'house',
      titleKey: 'hero_town.house_title',
      subKey: 'intake.types.house',
      icon: Home,
      tag: 'G+1 / G+2 Kothi',
      rateHint: 'Residential Colony Zone',
      leftPercent: '12%',
      topPercent: '38%',
    },
    {
      id: 'plot',
      titleKey: 'hero_town.plot_title',
      subKey: 'intake.types.plot',
      icon: Landmark,
      tag: '100–300 Gaj Freehold',
      rateHint: 'Clear Title Freehold',
      leftPercent: '38%',
      topPercent: '54%',
    },
    {
      id: 'shop',
      titleKey: 'hero_town.shop_title',
      subKey: 'intake.types.shop',
      icon: Store,
      tag: 'Main Road Frontage',
      rateHint: 'Commercial Footfall Node',
      leftPercent: '64%',
      topPercent: '42%',
    },
    {
      id: 'apartment',
      titleKey: 'hero_town.apartment_title',
      subKey: 'intake.types.apartment',
      icon: Building2,
      tag: 'Gated / Stilt+4',
      rateHint: 'Multi-Floor Living',
      leftPercent: '86%',
      topPercent: '34%',
    },
  ];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#072b17] via-[#0d3f24] to-[#041f12] text-white shadow-2xl border-2 border-emerald-800/80 p-5 sm:p-7 my-6 select-none transition-all duration-700">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/20 border border-saffron-400/40 text-saffron-300 text-xs font-extrabold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-saffron-400 animate-pulse" />
            <span>{t('hero_town.badge')}</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
            {t('hero_town.heading')}
          </h3>
          <p className="text-[11px] sm:text-xs text-emerald-200/80 font-medium">
            {t('hero_town.subheading')}
          </p>
        </div>

        {/* Lighting Switcher: Day / Twilight / Night */}
        <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shrink-0 self-start sm:self-auto shadow-inner">
          <span className="text-[10px] font-bold text-slate-300 px-2 uppercase tracking-wider">{t('hero_town.lighting')}</span>
          
          <button
            type="button"
            onClick={() => setTimeOfDay('day')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              timeOfDay === 'day'
                ? 'bg-amber-400 text-slate-950 shadow-lg font-black scale-105 ring-2 ring-amber-300/60'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sun className={`w-3.5 h-3.5 ${timeOfDay === 'day' ? 'text-slate-950 animate-spin-slow' : 'text-amber-400'}`} />
            <span>{t('hero_town.day')}</span>
          </button>

          <button
            type="button"
            onClick={() => setTimeOfDay('twilight')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              timeOfDay === 'twilight'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg font-black scale-105 ring-2 ring-orange-400/60'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sunset className="w-3.5 h-3.5 text-orange-200" />
            <span>{t('hero_town.twilight')}</span>
          </button>

          <button
            type="button"
            onClick={() => setTimeOfDay('night')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              timeOfDay === 'night'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg font-black scale-105 ring-2 ring-indigo-400/60'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-200" />
            <span>{t('hero_town.night')}</span>
          </button>
        </div>
      </div>

      {/* Active Toast Notification */}
      {activeToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-emerald-500 text-slate-950 font-black text-xs px-5 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce border-2 border-white">
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>{activeToast}</span>
        </div>
      )}

      {/* Real Village Photography Canvas with Interactive Hotspots */}
      <div className="relative w-full h-[280px] sm:h-[340px] md:h-[380px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl group">
        {/* Photographic Layers with Crossfade */}
        {(['day', 'twilight', 'night'] as TimeOfDay[]).map((mode) => (
          <div
            key={mode}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              timeOfDay === mode ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={lightingPhotos[mode].url}
              alt={lightingPhotos[mode].alt}
              className={`w-full h-full object-cover transform scale-105 transition-transform duration-10000 ease-out group-hover:scale-110 ${lightingPhotos[mode].skyFilter}`}
              loading="lazy"
            />
            {/* Cinematic Gradient Overlays */}
            <div className={`absolute inset-0 bg-gradient-to-t ${lightingPhotos[mode].overlay}`} />
          </div>
        ))}

        {/* Ambient Badge Overlay */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[11px] font-bold text-white shadow-lg">
          <Eye className="w-3.5 h-3.5 text-saffron-400" />
          <span>{t('hero_town.click_to_select')}</span>
        </div>

        {/* Interactive Property Hotspots Overlaid on the Real Photography */}
        <div className="absolute inset-0 z-20 pointer-events-auto">
          {hotspots.map((spot) => {
            const isSelected = propertyInput.propertyType === spot.id;
            const Icon = spot.icon;
            const title = t(spot.titleKey);

            return (
              <div
                key={spot.id}
                style={{ left: spot.leftPercent, top: spot.topPercent }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group/spot cursor-pointer"
                onClick={() => handleSelectType(spot.id, title)}
              >
                {/* Hotspot Radar Pulse Ring */}
                <div className="relative flex items-center justify-center">
                  <span
                    className={`absolute w-12 h-12 rounded-full animate-ping opacity-60 ${
                      isSelected ? 'bg-emerald-400' : 'bg-saffron-400 group-hover/spot:bg-emerald-400'
                    }`}
                  />
                  
                  {/* Central Action Pin */}
                  <button
                    type="button"
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 ring-4 ring-white scale-110 shadow-emerald-500/50'
                        : 'bg-slate-950/85 text-white border-2 border-saffron-400 group-hover/spot:border-emerald-400 group-hover/spot:scale-110 group-hover/spot:bg-emerald-600'
                    }`}
                    title={title}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                </div>

                {/* Property Details Floating Card */}
                <div
                  className={`mt-2 -translate-x-1/2 left-1/2 absolute w-36 sm:w-44 p-2 sm:p-2.5 rounded-xl backdrop-blur-xl border transition-all duration-300 shadow-2xl pointer-events-none text-center ${
                    isSelected
                      ? 'bg-emerald-950/90 border-emerald-400 text-white ring-2 ring-emerald-400/50 scale-105'
                      : 'bg-black/80 border-white/20 text-slate-200 group-hover/spot:scale-105 group-hover/spot:border-emerald-400 group-hover/spot:bg-slate-950/90'
                  }`}
                >
                  <p className="text-xs font-black truncate text-white leading-tight">
                    {title}
                  </p>
                  <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-white/10 text-saffron-300 border border-white/10">
                    {spot.tag}
                  </span>
                  <div className="mt-1 flex items-center justify-center gap-1 text-[9.5px] font-semibold text-emerald-300">
                    <span>{spot.rateHint}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Type Selection Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-white/10">
        {hotspots.map((spot) => {
          const isSelected = propertyInput.propertyType === spot.id;
          const Icon = spot.icon;
          const title = t(spot.titleKey);

          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => handleSelectType(spot.id, title)}
              className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-md ring-1 ring-emerald-400'
                  : 'bg-black/30 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-white/10 text-saffron-300'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black truncate leading-tight">{title}</p>
                <p className="text-[10px] text-emerald-300/80 truncate font-semibold">{spot.tag}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Street Footer Info Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-white/10 text-[11px] text-emerald-200">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-saffron-400 shrink-0" />
          <span>{t('hero_town.street_env_note')}</span>
        </div>
        <div className="flex items-center gap-3 font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {t('hero_town.verified_grid')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-saffron-400" />
            {t('hero_town.sub_registrar_linked')}
          </span>
        </div>
      </div>
    </div>
  );
};
