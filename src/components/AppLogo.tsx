import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number;
  rounded?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = 'w-10 h-10',
  size,
  rounded = true,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <defs>
        {/* Rich Green Gradient matching user logo */}
        <linearGradient id="logo-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="50%" stopColor="#166534" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>

        {/* Soft upper shine */}
        <linearGradient id="logo-shine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background Rounded Square / Squircle */}
      {rounded && (
        <>
          <rect width="512" height="512" rx="120" fill="url(#logo-bg-grad)" />
          <rect width="512" height="512" rx="120" fill="url(#logo-shine)" />
          {/* Subtle inner border */}
          <rect
            x="4"
            y="4"
            width="504"
            height="504"
            rx="116"
            stroke="#22c55e"
            strokeWidth="3"
            strokeOpacity="0.25"
          />
        </>
      )}

      {/* White Icon Elements Group */}
      <g
        stroke="#ffffff"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* ================= 1. SPROUTING LEAVES (TOP) ================= */}
        {/* Left Leaf */}
        <path
          d="M246 175 C230 140, 205 130, 185 140 C175 160, 185 185, 246 175 Z"
          fill="#ffffff"
        />
        {/* Right Leaf */}
        <path
          d="M266 175 C282 135, 315 125, 340 135 C350 160, 335 185, 266 175 Z"
          fill="#ffffff"
        />
        {/* Little stem between leaves */}
        <path d="M256 175 L256 195" strokeWidth="12" />

        {/* ================= 2. MONEY BAG (CENTER) ================= */}
        {/* Bag Neck / Tie */}
        <path
          d="M225 195 C235 202, 277 202, 287 195"
          strokeWidth="14"
        />
        <path
          d="M220 200 L292 200"
          strokeWidth="10"
        />

        {/* Bag Body - Bulbous & Friendly */}
        <path
          d="M230 200 
             C190 230, 175 290, 195 345 
             C215 390, 297 390, 317 345 
             C337 290, 322 230, 282 200 Z"
          fill="none"
          strokeWidth="16"
        />

        {/* Dollar Sign in Center of Bag */}
        {/* Top/Bottom vertical tick */}
        <path d="M256 248 L256 338" strokeWidth="12" />
        {/* S-curve */}
        <path
          d="M272 268 
             C272 254, 240 254, 240 274 
             C240 292, 272 294, 272 314 
             C272 334, 240 334, 240 320"
          strokeWidth="14"
        />

        {/* ================= 3. FUEL NOZZLE & HOSE (LEFT) ================= */}
        {/* Hose connected to bottom of bag looping left and up */}
        <path
          d="M205 345 
             C165 375, 140 345, 140 300 
             C140 260, 160 250, 172 245"
          strokeWidth="14"
        />
        {/* Gas Nozzle Body */}
        <path
          d="M172 245 
             L160 215 
             C158 210, 162 205, 168 205 
             L190 205 
             C195 205, 198 210, 196 215 
             L188 238"
          strokeWidth="13"
          fill="#ffffff"
          fillOpacity="0.2"
        />
        {/* Fuel Spout (pointing towards bag) */}
        <path
          d="M185 205 
             L215 190 
             L230 198"
          strokeWidth="13"
        />
        {/* Nozzle Trigger Handle Guard */}
        <path
          d="M164 225 
             C155 235, 162 248, 175 245"
          strokeWidth="10"
        />

        {/* ================= 4. COIN STACK (RIGHT) ================= */}
        {/* Coin 1 (Bottom) */}
        <ellipse cx="340" cy="358" rx="28" ry="9" fill="#ffffff" fillOpacity="0.1" strokeWidth="12" />
        {/* Coin 2 (Middle) */}
        <path
          d="M312 342 C312 348, 324 353, 340 353 C356 353, 368 348, 368 342"
          strokeWidth="12"
        />
        {/* Coin 3 */}
        <path
          d="M312 326 C312 332, 324 337, 340 337 C356 337, 368 332, 368 326"
          strokeWidth="12"
        />
        {/* Coin 4 */}
        <path
          d="M312 310 C312 316, 324 321, 340 321 C356 321, 368 316, 368 310"
          strokeWidth="12"
        />
        {/* Coin 5 (Top oval) */}
        <ellipse cx="340" cy="294" rx="28" ry="9" fill="#ffffff" strokeWidth="12" />
      </g>
    </svg>
  );
};
