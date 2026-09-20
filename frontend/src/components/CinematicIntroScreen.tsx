import React, { useRef, useEffect } from 'react';
import { useValuation } from '../context/ValuationContext';
import { ArrowRight } from 'lucide-react';

export const CinematicIntroScreen: React.FC = () => {
  const { setStep } = useValuation();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Attempt automatic playback on mount; ensure muted autoplay compliance across all browsers
    if (videoRef.current) {
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay prevented by browser policy; user interaction will allow playback:', err);
        });
      }
    }
  }, []);

  const handleProceed = () => {
    setStep('language');
  };

  return (
    <div
      className="relative w-full h-screen min-h-screen overflow-hidden bg-black text-white flex flex-col justify-end items-center select-none"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleProceed();
        }
      }}
    >
      {/* ================= FULL-SCREEN 16:9 CINEMATIC VIDEO ================= */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      >
        <source src="/intro2.mp4" type="video/mp4" />
      </video>

      {/* ================= CLICKABLE ARROW OVERLAY ================= */}
      {/* Positioned at bottom center so it does not obstruct the video's internal branding */}
      <div className="relative z-30 pb-10 sm:pb-14 flex flex-col items-center">
        <button
          type="button"
          onClick={handleProceed}
          aria-label="Enter ValueProof"
          className="group relative inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/40 hover:bg-emerald-600/30 active:bg-emerald-600/50 text-white border border-white/40 hover:border-emerald-400 backdrop-blur-md shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
        >
          {/* Subtle luminous breathing halo */}
          <span className="absolute -inset-1 rounded-full bg-emerald-400/20 blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none animate-pulse" />
          <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:text-emerald-300 group-hover:translate-x-1 transition-all duration-300" />
        </button>
      </div>
    </div>
  );
};

