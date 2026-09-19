import React from 'react';

interface BrandHouse3DIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandHouse3DIcon: React.FC<BrandHouse3DIconProps> = ({
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
    xl: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 via-emerald-500/30 to-teal-400/10 p-1.5 backdrop-blur-xs border border-amber-300/40 shadow-lg shadow-emerald-950/40 group-hover:scale-105 group-hover:border-amber-300/70 transition-all duration-300 select-none shrink-0 ${sizeClasses[size]} ${className}`}
    >
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Roof Gradients */}
          <linearGradient id="roofLeftGrad" x1="16" y1="12" x2="32" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          <linearGradient id="roofRightGrad" x1="32" y1="12" x2="52" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          {/* Wall Gradients */}
          <linearGradient id="wallFrontGrad" x1="16" y1="28" x2="32" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          <linearGradient id="wallSideGrad" x1="32" y1="28" x2="50" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>

          {/* Door / Window Warm Light Glow */}
          <linearGradient id="doorLightGrad" x1="21" y1="38" x2="27" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Pedestal Base */}
          <linearGradient id="baseGrad" x1="10" y1="50" x2="54" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#065f46" />
            <stop offset="50%" stopColor="#047857" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>

          {/* 3D Chimney */}
          <linearGradient id="chimneyGrad" x1="38" y1="10" x2="44" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Ambient Shadow */}
          <radialGradient id="houseShadow" cx="32" cy="56" r="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(0,0,0,0.5)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="32" cy="56" rx="22" ry="5" fill="url(#houseShadow)" />

        {/* 3D Foundation Pedestal / Setu Base */}
        <path
          d="M10 52 L32 59 L54 52 L32 46 Z"
          fill="url(#baseGrad)"
          stroke="#10b981"
          strokeWidth="0.8"
        />

        {/* 3D Chimney on Right */}
        <path
          d="M40 14 L45 12 L45 22 L40 24 Z"
          fill="url(#chimneyGrad)"
        />
        <ellipse cx="42.5" cy="13" rx="2.5" ry="1.2" fill="#fde047" />

        {/* 3D Left Main Wall (Front) */}
        <path
          d="M16 30 L32 37 L32 53 L16 46 Z"
          fill="url(#wallFrontGrad)"
          stroke="#6ee7b7"
          strokeWidth="0.6"
        />

        {/* 3D Right Main Wall (Perspective Side) */}
        <path
          d="M32 37 L48 30 L48 46 L32 53 Z"
          fill="url(#wallSideGrad)"
          stroke="#059669"
          strokeWidth="0.6"
        />

        {/* 3D Left Roof (Sunlit Facet) */}
        <path
          d="M32 10 L12 28 L17 31 L32 17 L32 10 Z"
          fill="url(#roofLeftGrad)"
          filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.25))"
        />
        <path
          d="M32 10 L12 28 L32 36 Z"
          fill="url(#roofLeftGrad)"
        />

        {/* 3D Right Roof (Shaded Facet) */}
        <path
          d="M32 10 L32 36 L52 28 Z"
          fill="url(#roofRightGrad)"
        />
        <path
          d="M32 10 L47 24 L52 28 L32 36 Z"
          fill="url(#roofRightGrad)"
        />

        {/* Roof Ridge Highlight Line */}
        <path
          d="M32 10 L32 36"
          stroke="#fef08a"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Front Arched Door with Glowing Light */}
        <path
          d="M21 44 Q24 41 27 44 L27 50 L21 47 Z"
          fill="url(#doorLightGrad)"
          stroke="#fde047"
          strokeWidth="0.7"
        />

        {/* Side Perspective Window with 3D Sill */}
        <path
          d="M37 38 L43 35 L43 42 L37 45 Z"
          fill="#fef08a"
          stroke="#f59e0b"
          strokeWidth="0.6"
        />
        {/* Window Crossbar */}
        <path d="M40 36.5 L40 43.5" stroke="#78350f" strokeWidth="0.6" />
        <path d="M37 41.5 L43 38.5" stroke="#78350f" strokeWidth="0.6" />

        {/* Golden Setu Arch Badge Accent under house */}
        <path
          d="M22 55 Q32 51 42 55"
          stroke="#fbbf24"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* Sparkle on Top Peak */}
        <circle cx="32" cy="9" r="1.5" fill="#ffffff" className="animate-ping" style={{ animationDuration: '3s' }} />
        <circle cx="32" cy="9" r="1.2" fill="#fef08a" />
      </svg>
    </div>
  );
};
