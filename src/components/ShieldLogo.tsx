import React from 'react';

interface ShieldLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const ShieldLogo: React.FC<ShieldLogoProps> = ({ className = '', size = 36, showText = true }) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        aria-label="SURAKSHA Shield Protection Mark"
      >
        <defs>
          <linearGradient id="shieldGradNatural" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4A373" />
            <stop offset="100%" stopColor="#B37D4E" />
          </linearGradient>
        </defs>
        {/* Outer Sturdy Sage Shield */}
        <path d="M60 10 L98 26 C98 64 78 94 60 108 C42 94 22 64 22 26 Z" fill="#3D3E2F" />
        {/* Clean Inner Shield Plate */}
        <path d="M60 18 L90 32 C90 62 73 87 60 98 C47 87 30 62 30 32 Z" fill="#FDFBF7" />
        {/* Warm Terracotta Arch representing Protection */}
        <path d="M60 22 L86 34 C86 50 76 65 60 72 C44 65 34 50 34 34 Z" fill="url(#shieldGradNatural)" />
        {/* Deep Sage Olive Base Ribbon */}
        <path d="M60 76 C69 70 78 58 80 46 L80 52 C78 70 68 82 60 88 C52 82 42 70 40 52 L40 46 C42 58 51 70 60 76 Z" fill="#5A5A40" />
        {/* Central Protective Beacon */}
        <circle cx="60" cy="48" r="6" fill="#FDFBF7" />
        <circle cx="60" cy="48" r="3" fill="#3D3E2F" />
      </svg>
      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <span className="text-xl font-bold tracking-tight text-[#434338] font-serif" style={{ fontFamily: 'Georgia, serif' }}>
            SURAKSHA
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#8c8c73] font-semibold mt-0.5">
            Disaster Safety Platform
          </span>
        </div>
      )}
    </div>
  );
};
