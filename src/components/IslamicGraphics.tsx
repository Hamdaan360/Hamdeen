import React from 'react';

export const MosqueSilhouette: React.FC<{ className?: string }> = ({ className = 'w-full h-32' }) => (
  <svg
    viewBox="0 0 600 240"
    fill="currentColor"
    preserveAspectRatio="none"
    className={className}
    aria-hidden="true"
  >
    {/* Background mosque silhouette with minarets and domes */}
    <path
      d="M0,240 L0,200 L40,200 L40,120 L48,110 L56,120 L56,200 L90,200 
         C90,160 110,130 140,130 C170,130 190,160 190,200 
         L230,200 L230,80 L240,65 L250,80 L250,200 L280,200 
         C280,140 310,100 350,100 C390,100 420,140 420,200 
         L460,200 L460,110 L470,95 L480,110 L480,200 L510,200 
         C510,165 530,140 555,140 C580,140 600,165 600,200 
         L600,240 Z"
      opacity="0.25"
    />
    {/* Foreground layered minarets and central grand dome */}
    <path
      d="M0,240 L0,210 L30,210 L30,160 L38,150 L46,160 L46,210 L120,210 
         C120,175 145,150 175,150 C205,150 230,175 230,210 
         L270,210 L270,100 L280,85 L290,100 L290,210 L300,210
         C300,150 340,115 390,115 C440,115 480,150 480,210
         L520,210 L520,130 L530,115 L540,130 L540,210 L600,210 L600,240 Z"
      opacity="0.4"
    />
    {/* Crescent on main dome */}
    <path
      d="M390,108 C392,106 394,103 394,99 C394,94 390,90 385,90 C382,90 380,91 378,93 C381,95 383,98 383,101 C383,105 380,108 376,109 C380,111 386,111 390,108 Z"
      fill="#d4af37"
      opacity="0.9"
    />
  </svg>
);

export const CrescentStarIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8A9.006 9.006 0 0 0 12 3z"
      fill="currentColor"
    />
    <polygon
      points="17.5,6.5 18.2,8 19.8,8.2 18.6,9.3 19,10.9 17.5,10 16,10.9 16.4,9.3 15.2,8.2 16.8,8"
      fill="#f3c669"
    />
  </svg>
);

export const KaabaIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <rect x="6" y="8" width="20" height="20" rx="2" fill="#1e293b" stroke="#d4af37" strokeWidth="1.5" />
    <path d="M6 13h20" stroke="#f3c669" strokeWidth="2" strokeDasharray="3 1.5" />
    <rect x="13" y="18" width="6" height="10" rx="1" fill="#d4af37" />
    <circle cx="16" cy="23" r="1" fill="#0f172a" />
  </svg>
);
