"use client";

import { Lock } from "lucide-react";

export default function PremiumLock({ children }) {
  const isPremium = false;

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="pointer-events-none blur-sm opacity-50">
        {children}
      </div>

      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-xl">
        <Lock className="w-12 h-12 text-gray-700 mb-3" />
        <p className="font-bold text-gray-800 text-lg">
          Conteúdo Premium
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Assine para desbloquear
        </p>
        <button className="bg-emerald-500 text-white px-5 py-2 rounded-xl shadow">
          Desbloquear
        </button>
      </div>
    </div>
  );
}