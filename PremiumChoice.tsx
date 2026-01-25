"use client";

import { Crown, Zap, Check, X } from "lucide-react";

interface PremiumChoiceProps {
  onChoosePremium: () => void;
  onSkip: () => void;
}

export default function PremiumChoice({ onChoosePremium, onSkip }: PremiumChoiceProps) {
  const premiumFeatures = [
    "Animações de exercícios por grupo muscular",
    "Planos de treino personalizados",
    "Acompanhamento detalhado de progresso",
    "Receitas fitness exclusivas",
    "Suporte prioritário",
    "Sem anúncios",
  ];

  const freeFeatures = [
    "Dicas básicas de nutrição",
    "Registro de peso",
    "Calculadora de IMC",
    "Suplementos básicos",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-lg">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Escolha Sua Experiência
          </h1>
          <p className="text-gray-600 text-lg">
            Desbloqueie todo o potencial do FitLife Guide
          </p>
        </div>

        {/* Cards de Comparação */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Premium Card */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-400 text-purple-900 px-4 py-1 rounded-bl-2xl font-bold text-sm">
              RECOMENDADO
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/20 rounded-full p-3">
                <Crown className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Premium</h2>
                <p className="text-purple-100 text-sm">Acesso completo</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">R$ 9,99</span>
                <span className="text-purple-200">/mês</span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-white/20 rounded-full p-1 mt-0.5">
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const hotmartCheckoutUrl = "https://pay.hotmart.com/N103969250R?off=mekmrjz9&hotfeature=51&_hi=eyJjaWQiOiIxNzY4ODcxNjc1NjU1Mzc5NDI1MTExMTk1Nzk0NTAwIiwiYmlkIjoiMTc2ODg3MTY3NTY1NTM3OTQyNTExMTE5NTc5NDUwMCIsInNpZCI6Ijc4NDcyZGZiNDA2YzRiNmI5N2YzMDVmNzIyZDVjMWQ1In0=.1768875453706&bid=1768875456019";
                window.open(hotmartCheckoutUrl, "_blank");
              }}
              className="w-full bg-white text-purple-600 font-bold py-4 rounded-xl hover:bg-purple-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              <Zap className="w-5 h-5" />
              Ativar Premium
            </button>
          </div>

          {/* Free Card */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gray-100 rounded-full p-3">
                <Zap className="w-8 h-8 text-gray-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gratuito</h2>
                <p className="text-gray-500 text-sm">Recursos limitados</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-900">R$ 0</span>
                <span className="text-gray-500">/mês</span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {freeFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-emerald-100 rounded-full p-1 mt-0.5">
                    <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-start gap-3 opacity-50">
                  <div className="bg-gray-100 rounded-full p-1 mt-0.5">
                    <X className="w-4 h-4 text-gray-400" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-gray-500">Sem exercícios animados</span>
                </div>
                <div className="flex items-start gap-3 opacity-50 mt-2">
                  <div className="bg-gray-100 rounded-full p-1 mt-0.5">
                    <X className="w-4 h-4 text-gray-400" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-gray-500">Sem planos personalizados</span>
                </div>
              </div>
            </div>

            <button
              onClick={onSkip}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              Continuar com Gratuito
            </button>
          </div>
        </div>

        {/* Info adicional */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            💡 Você pode ativar o Premium a qualquer momento na aba de Perfil
          </p>
        </div>
      </div>
    </div>
  );
}
