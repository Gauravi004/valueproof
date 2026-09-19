import React, { useState, useRef } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useValuation } from '../context/ValuationContext';
import {
  ArrowRight,
  MapPin,
  Play,
  Volume2,
  VolumeX,
  Compass,
  Award,
  ChevronDown,
  Camera,
} from 'lucide-react';
import { TownGallerySection } from './TownGallerySection';
import { BrandHouse3DIcon } from './BrandHouse3DIcon';

const VILLAGE_VIDEO_FEEDS = [
  {
    id: 'village_aerial',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-small-town-surrounded-by-nature-41556-large.mp4',
    poster: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&auto=format&fit=crop&q=85',
    tag: '🌾 Gaon & Khet Drone',
  },
  {
    id: 'village_mohalla',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-residential-suburb-with-houses-and-trees-41559-large.mp4',
    poster: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920&auto=format&fit=crop&q=85',
    tag: '🏡 Gramin Mohalla',
  },
  {
    id: 'village_road',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-highway-in-the-middle-of-a-rural-landscape-41554-large.mp4',
    poster: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&auto=format&fit=crop&q=85',
    tag: '🛣️ Chak Road & Mandi',
  },
];

export const CinematicLandingPage: React.FC = () => {
  const { currentLanguageOption, setIsLanguageModalOpen, t } = useTranslation();
  const { setStep, updatePropertyInput } = useValuation();
  const [activeFeed, setActiveFeed] = useState(VILLAGE_VIDEO_FEEDS[0]);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedMapNode, setSelectedMapNode] = useState<{
    title: string;
    category: string;
    distance: string;
    detail: string;
    vibeTag: string;
  }>({
    title: t('landing_map.center_title'),
    category: t('landing_map.center_cat'),
    distance: t('landing_map.center_dist'),
    detail: t('landing_map.center_desc'),
    vibeTag: '🏡 ' + t('landing_map.center_title'),
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const switchFeed = (feed: typeof VILLAGE_VIDEO_FEEDS[0]) => {
    setActiveFeed(feed);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  const handleStartValuation = (intent: 'sell' | 'buy' = 'sell') => {
    updatePropertyInput({ intent });
    setStep('intake');
  };

  return (
    <div className="w-full bg-[#faf7f2] text-slate-900 overflow-x-hidden selection:bg-brand-800 selection:text-white">
      {/* =========================================================================
          SCREEN 1: FULL-SCREEN RUSTIC VILLAGE HD CINEMATIC HERO (100vh)
      ========================================================================== */}
      <div className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#041a0e] text-white">
        {/* Full-Bleed 1080p Drone Video of Indian Countryside, Village & Farmlands */}
        <video
          key={activeFeed.src}
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster={activeFeed.poster}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.58] contrast-[1.12] transition-all duration-1000"
        >
          <source src={activeFeed.src} type="video/mp4" />
        </video>

        {/* Deep Royal Forest Green, Terracotta & Mitti-Gold Ambient Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#072b17]/92 via-[#072b17]/65 to-[#072b17]/95 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,119,6,0.18),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(20,83,45,0.3),transparent_60%)] pointer-events-none" />

        {/* ================= TRANSPARENT TOP NAVIGATION ================= */}
        <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between">
          {/* MoolyaSetu Logo with Minimal Bridge Icon */}
          <div
            onClick={() => setStep('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* 3D House Brand Logo */}
            <BrandHouse3DIcon size="lg" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center">
                  Moolya<span className="text-emerald-400">Setu</span>
                </span>
                <span className="text-xs font-serif text-amber-300 font-bold hidden sm:inline">
                  (मूल्यसेतु)
                </span>
              </div>
              <span className="text-[11px] text-amber-300 font-extrabold uppercase tracking-wider block -mt-0.5">
                {t('tagline')}
              </span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-cream-100">
            <button
              type="button"
              onClick={() => setStep('home')}
              className="text-white hover:text-amber-300 transition-colors cursor-pointer"
            >
              {t('nav.home')}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection(howItWorksRef)}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              {t('nav.how_it_works')}
            </button>
            <button
              type="button"
              onClick={() => handleStartValuation('buy')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              {t('nav.buy')}
            </button>
            <button
              type="button"
              onClick={() => handleStartValuation('sell')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              {t('nav.sell')}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection(mapSectionRef)}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              {t('nav.map')}
            </button>
          </nav>

          {/* Right Action: Language Selector & Get Started CTA */}
          <div className="flex items-center gap-3">
            {/* Language Dropdown Trigger */}
            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-cream-100 hover:text-white hover:bg-black/60 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <span>🌐 {currentLanguageOption.nativeName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-saffron-400" />
            </button>

            {/* Get Started Button */}
            <button
              type="button"
              onClick={() => handleStartValuation('sell')}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-saffron-500 via-amber-400 to-emerald-400 hover:from-saffron-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-saffron-500/25 transition-all transform active:scale-95 shrink-0 cursor-pointer"
            >
              {t('hero.check_value_btn')}
            </button>
          </div>
        </header>

        {/* ================= HERO CENTER CONTENT WITH AUTHENTIC VILLAGE VIBES ================= */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center my-auto py-10 sm:py-16 space-y-6 sm:space-y-7">
          {/* Rustic Village Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/50 text-amber-300 text-xs sm:text-sm font-black shadow-2xl">
            <span className="text-base">🌾</span>
            <span>{t('hero.badge')}</span>
          </div>

          {/* Large Rustic & Elegant Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.12] drop-shadow-2xl">
            {t('hero.title_p1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-saffron-300 to-emerald-300 font-serif">
              {t('hero.title_p2')}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-cream-100/90 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            {t('hero.subtitle')}
          </p>

          {/* Two Premium Rustic CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => handleStartValuation('sell')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-saffron-500 via-amber-500 to-emerald-400 hover:from-saffron-400 hover:to-amber-400 text-slate-950 font-black text-base sm:text-lg shadow-2xl shadow-saffron-500/30 hover:shadow-saffron-500/40 transition-all transform active:scale-95 flex items-center justify-center gap-3 group cursor-pointer"
            >
              <span>{t('hero.check_value_btn')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection(howItWorksRef)}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/25 text-white font-bold text-base transition-all hover:border-amber-400 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{t('hero.how_it_works_btn')}</span>
            </button>
          </div>

          {/* Village Trust Elements Line */}
          <div className="pt-3 text-xs sm:text-sm text-cream-200/90 font-bold tracking-wide flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <span className="flex items-center gap-1.5 text-amber-300">
              <span>🌾</span> {t('hero.trust_evidence')}
            </span>
            <span className="text-amber-400">•</span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span>🏡</span> {t('hero.trust_comps')}
            </span>
            <span className="text-amber-400">•</span>
            <span className="flex items-center gap-1.5 text-sky-300">
              <span>📍</span> {t('hero.trust_location')}
            </span>
            <span className="text-amber-400">•</span>
            <span className="flex items-center gap-1.5 text-orange-300">
              <span>📜</span> {t('hero.trust_gazette')}
            </span>
          </div>
        </div>

        {/* Bottom Village Drone Feed Switcher & Sound Bar */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-8 pb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream-200">
          {/* Camera Feed Switcher */}
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/15">
            <span className="text-[10px] font-bold text-amber-300 px-2 flex items-center gap-1">
              <Camera className="w-3 h-3" />
              <span>{t('hero.feed_label')}</span>
            </span>
            {VILLAGE_VIDEO_FEEDS.map((feed) => (
              <button
                key={feed.id}
                type="button"
                onClick={() => switchFeed(feed)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFeed.id === feed.id
                    ? 'bg-amber-500 text-slate-950 font-black shadow'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {feed.tag}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-white transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{isMuted ? t('hero.unmute') : t('hero.mute')}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: “गाँव से कस्बे तक — सही मूल्य का सेतु” (From Your Town to Its True Value)
      ========================================================================== */}
      <section ref={mapSectionRef} className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-100 border border-brand-300 text-brand-950 text-xs font-black uppercase tracking-wider">
            <Compass className="w-4 h-4 text-brand-700 animate-spin-slow" />
            <span>{t('landing_map.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            {t('landing_map.heading')}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            {t('landing_map.subheading')}
          </p>
        </div>

        {/* Interactive Village & Town Map Canvas */}
        <div className="bg-white rounded-3xl border-2 border-cream-300 shadow-passport p-6 sm:p-8 space-y-6">
          {/* Map Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-4">
            <div>
              <span className="text-xs font-black text-brand-900 uppercase tracking-wider block">
                🌾 {t('landing_map.canvas_title')}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {t('landing_map.canvas_subtitle')}
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1.5 rounded-full border border-amber-300 self-start sm:self-auto">
              🚜 {t('landing_map.units_supported')}
            </span>
          </div>

          {/* SVG Map Layout */}
          <div className="relative w-full h-[350px] sm:h-[420px] bg-[#f5efe3] rounded-2xl border-2 border-cream-300 overflow-hidden shadow-inner select-none">
            <div className="absolute inset-0 bg-mandala-subtle opacity-50" />

            <svg className="w-full h-full" viewBox="0 0 500 360" xmlns="http://www.w3.org/2000/svg">
              {/* Green Agricultural Farmland Zones */}
              <rect x="10" y="10" width="180" height="130" rx="8" fill="#dcfce7" opacity="0.6" stroke="#86efac" strokeWidth="1" strokeDasharray="4 4" />
              <text x="100" y="40" fill="#15803d" fontSize="9" fontWeight="bold" textAnchor="middle">🌾 {t('landing_map.farmland_label')}</text>

              <rect x="310" y="220" width="180" height="130" rx="8" fill="#fef3c7" opacity="0.6" stroke="#fde68a" strokeWidth="1" strokeDasharray="4 4" />
              <text x="400" y="340" fill="#b45309" fontSize="9" fontWeight="bold" textAnchor="middle">🏡 {t('landing_map.abadi_label')}</text>

              {/* Paved 30ft Sector Main Road */}
              <line x1="0" y1="180" x2="500" y2="180" stroke="#cbd5e1" strokeWidth="28" />
              <line x1="0" y1="180" x2="500" y2="180" stroke="#94a3b8" strokeWidth="2" strokeDasharray="8 6" />

              {/* 20ft Paved Chak Road */}
              <line x1="250" y1="0" x2="250" y2="360" stroke="#d7c7af" strokeWidth="22" />
              <line x1="250" y1="0" x2="250" y2="360" stroke="#a89a85" strokeWidth="2" strokeDasharray="6 6" />

              {/* Diagonal Link to Tehsil Artery */}
              <line x1="40" y1="30" x2="460" y2="330" stroke="#e2e8f0" strokeWidth="12" />

              {/* Connecting Pulse Lines from Center (250, 180) */}
              <line x1="250" y1="180" x2="110" y2="80" stroke="#16a34a" strokeWidth="2.5" className="map-line-dash" opacity="0.9" />
              <line x1="250" y1="180" x2="400" y2="90" stroke="#f59e0b" strokeWidth="2.5" className="map-line-dash" opacity="0.9" />
              <line x1="250" y1="180" x2="380" y2="280" stroke="#0284c7" strokeWidth="2.5" className="map-line-dash" opacity="0.9" />
              <line x1="250" y1="180" x2="120" y2="270" stroke="#9333ea" strokeWidth="2.5" className="map-line-dash" opacity="0.9" />

              {/* Radiating Radar Waves */}
              <circle cx="250" cy="180" r="45" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.5" className="animate-ping" style={{ animationDuration: '3.5s' }} />
              <circle cx="250" cy="180" r="95" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
              <circle cx="250" cy="180" r="145" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 4" opacity="0.25" />

              {/* 1. Gramin Vidyalaya / Senior School (110, 80) */}
              <g
                transform="translate(110, 80)"
                className="cursor-pointer group"
                onClick={() =>
                  setSelectedMapNode({
                    title: t('landing_map.school_title'),
                    category: t('landing_map.school_cat'),
                    distance: t('landing_map.school_dist'),
                    detail: t('landing_map.school_desc'),
                    vibeTag: '🎓 ' + t('landing_map.school_dist'),
                  })
                }
              >
                <circle cx="0" cy="0" r="18" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.5" className="group-hover:scale-110 transition-transform" />
                <text x="0" y="5" fill="#15803d" fontSize="13" textAnchor="middle">🎓</text>
                <rect x="-38" y="22" width="76" height="15" fill="#ffffff" rx="4" stroke="#cbd5e1" strokeWidth="1" />
                <text x="0" y="33" fill="#0f172a" fontSize="7" fontWeight="bold" textAnchor="middle">{t('landing_map.school_dist')}</text>
              </g>

              {/* 2. Kasba Weekly Haat / Mandi (400, 90) */}
              <g
                transform="translate(400, 90)"
                className="cursor-pointer group"
                onClick={() =>
                  setSelectedMapNode({
                    title: t('landing_map.mandi_title'),
                    category: t('landing_map.mandi_cat'),
                    distance: t('landing_map.mandi_dist'),
                    detail: t('landing_map.mandi_desc'),
                    vibeTag: '🛍️ ' + t('landing_map.mandi_dist'),
                  })
                }
              >
                <circle cx="0" cy="0" r="18" fill="#fef3c7" stroke="#d97706" strokeWidth="2.5" className="group-hover:scale-110 transition-transform" />
                <text x="0" y="5" fill="#b45309" fontSize="13" textAnchor="middle">🌾</text>
                <rect x="-38" y="22" width="76" height="15" fill="#ffffff" rx="4" stroke="#cbd5e1" strokeWidth="1" />
                <text x="0" y="33" fill="#0f172a" fontSize="7" fontWeight="bold" textAnchor="middle">{t('landing_map.mandi_dist')}</text>
              </g>

              {/* 3. Tehsil & Panchayat Kendra (380, 280) */}
              <g
                transform="translate(380, 280)"
                className="cursor-pointer group"
                onClick={() =>
                  setSelectedMapNode({
                    title: t('landing_map.tehsil_title'),
                    category: t('landing_map.tehsil_cat'),
                    distance: t('landing_map.tehsil_dist'),
                    detail: t('landing_map.tehsil_desc'),
                    vibeTag: '🏛️ ' + t('landing_map.tehsil_dist'),
                  })
                }
              >
                <circle cx="0" cy="0" r="18" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" className="group-hover:scale-110 transition-transform" />
                <text x="0" y="5" fill="#0369a1" fontSize="13" textAnchor="middle">🏛️</text>
                <rect x="-42" y="22" width="84" height="15" fill="#ffffff" rx="4" stroke="#cbd5e1" strokeWidth="1" />
                <text x="0" y="33" fill="#0f172a" fontSize="7" fontWeight="bold" textAnchor="middle">{t('landing_map.tehsil_dist')}</text>
              </g>

              {/* 4. Sub-Registrar Registered Deed Comp (120, 270) */}
              <g
                transform="translate(120, 270)"
                className="cursor-pointer group"
                onClick={() =>
                  setSelectedMapNode({
                    title: t('landing_map.deed_title'),
                    category: t('landing_map.deed_cat'),
                    distance: t('landing_map.deed_dist'),
                    detail: t('landing_map.deed_desc'),
                    vibeTag: '📜 ' + t('landing_map.deed_dist'),
                  })
                }
              >
                <circle cx="0" cy="0" r="18" fill="#f3e8ff" stroke="#9333ea" strokeWidth="2.5" className="group-hover:scale-110 transition-transform" />
                <text x="0" y="5" fill="#7e22ce" fontSize="12" textAnchor="middle">📜</text>
                <rect x="-44" y="22" width="88" height="15" fill="#ffffff" rx="4" stroke="#cbd5e1" strokeWidth="1" />
                <text x="0" y="33" fill="#6b21a8" fontSize="7" fontWeight="bold" textAnchor="middle">{t('landing_map.deed_dist')}</text>
              </g>

              {/* CENTER: User's Property Target Node */}
              <g
                transform="translate(250, 180)"
                className="cursor-pointer"
                onClick={() =>
                  setSelectedMapNode({
                    title: t('landing_map.center_title'),
                    category: t('landing_map.center_cat'),
                    distance: t('landing_map.center_dist'),
                    detail: t('landing_map.center_desc'),
                    vibeTag: '🏡 ' + t('landing_map.center_title'),
                  })
                }
              >
                <circle cx="0" cy="0" r="26" fill="#072b17" stroke="#fbbf24" strokeWidth="3.5" className="drop-shadow-2xl" />
                <text x="0" y="7" fill="#ffffff" fontSize="16" textAnchor="middle">📍</text>
                <rect x="-56" y="-38" width="112" height="20" fill="#072b17" rx="6" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="0" y="-25" fill="#fef08a" fontSize="8.5" fontWeight="black" textAnchor="middle">{t('landing_map.center_title')}</text>
              </g>
            </svg>

            {/* Map Legend */}
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-cream-300 shadow-md text-[10px] space-y-1.5">
              <div className="font-black text-slate-800 border-b border-slate-100 pb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-800" />
                <span>{t('landing_map.legend_title')}</span>
              </div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> <span className="font-bold">{t('landing_map.legend_your_loc')}</span></div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> <span className="font-bold">{t('landing_map.legend_deed')}</span></div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> <span className="font-bold">{t('landing_map.legend_civic')}</span></div>
            </div>
          </div>

          {/* Selected Node Details Card */}
          <div className="p-4 rounded-2xl bg-cream-50 border border-cream-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-sm sm:text-base">{selectedMapNode.title}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                  {selectedMapNode.vibeTag}
                </span>
              </div>
              <p className="text-slate-600">{selectedMapNode.detail}</p>
            </div>

            <button
              type="button"
              onClick={() => handleStartValuation('sell')}
              className="px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-950 text-white font-bold text-xs shadow-md transition-colors shrink-0 self-start sm:self-auto flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t('landing_map.check_rate_cta')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: HOW MOOLYASETU WORKS (3 Pillars of Rural & Town Valuation)
      ========================================================================== */}
      <section ref={howItWorksRef} className="py-16 sm:py-20 bg-cream-100 border-y border-cream-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black text-brand-800 uppercase tracking-widest">
              {t('landing_pillars.tag')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t('landing_pillars.heading')}
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              {t('landing_pillars.subheading')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-cream-300 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-xl">
                📜
              </div>
              <h3 className="text-xl font-black text-slate-900">{t('landing_pillars.pillar1_title')}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('landing_pillars.pillar1_desc')}
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-cream-300 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-xl">
                🚜
              </div>
              <h3 className="text-xl font-black text-slate-900">{t('landing_pillars.pillar2_title')}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('landing_pillars.pillar2_desc')}
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-cream-300 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-900 flex items-center justify-center font-black text-xl">
                🛡️
              </div>
              <h3 className="text-xl font-black text-slate-900">{t('landing_pillars.pillar3_title')}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('landing_pillars.pillar3_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: REAL INDIAN SMALL-TOWN & VILLAGE PROPERTY DIRECTORY GALLERY
      ========================================================================== */}
      <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <TownGallerySection />
      </section>

      {/* =========================================================================
          SECTION 5: BOTTOM CALL TO ACTION
      ========================================================================== */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#072b17] via-[#0d3f24] to-[#14532d] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{t('landing_cta.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {t('landing_cta.heading')}
          </h2>

          <p className="text-sm sm:text-base text-cream-200/90 max-w-xl mx-auto font-medium">
            {t('landing_cta.subheading')}
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleStartValuation('sell')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-saffron-500 via-amber-400 to-emerald-400 hover:from-saffron-400 hover:to-amber-300 text-slate-950 font-black text-base sm:text-lg shadow-2xl shadow-saffron-500/30 transition-all transform active:scale-95 inline-flex items-center gap-3 cursor-pointer"
            >
              <span>{t('landing_cta.btn')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER WITH MOOLYASETU BRANDING
      ========================================================================== */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-base">
              M
            </div>
            <div>
              <span className="font-bold text-white text-base">{t('landing_footer.title')}</span>
              <p className="text-[10px] text-slate-500">{t('landing_footer.tagline')}</p>
            </div>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <p className="text-slate-500">
              {t('landing_footer.desc')}
            </p>
            <p className="text-[11px] text-slate-600">
              © {new Date().getFullYear()} MoolyaSetu. {t('landing_footer.rights')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
