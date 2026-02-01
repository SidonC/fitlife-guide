interface PremiumLockProps {
  isPremium: boolean;
  children: React.ReactNode;
}

export default function PremiumLock({ isPremium, children }: PremiumLockProps) {
  return (
    <div className="relative">
      <div className={isPremium ? "" : "pointer-events-none select-none blur-sm"}>
        {children}
      </div>

      {!isPremium && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
          <div className="text-5xl mb-3">🔒</div>
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
      )}
    </div>
  );
}