"use client";

import { ExternalLink, Crown, Check } from "lucide-react";

interface PaymentFlowProps {
  onComplete: () => void;
}

export default function PaymentFlow({ onComplete }: PaymentFlowProps) {
  const handleShopifyCheckout = () => {
    // Link do Shopify será inserido aqui
    const shopifyCheckoutUrl = "[COLOQUE AQUI O LINK DO CHECKOUT]";
    
    // Abre o checkout do Shopify em nova aba
    window.open(shopifyCheckoutUrl, "_blank");
    
    // Simula conclusão do pagamento (em produção, isso seria confirmado via webhook)
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const premiumFeatures = [
    "Animações de exercícios por grupo muscular",
    "Planos de treino personalizados",
    "Acompanhamento detalhado de progresso",
    "Receitas fitness exclusivas",
    "Suporte prioritário",
    "Sem anúncios",
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-3">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            FitLife Premium
          </h1>
        </div>
        <div className="text-center">
          <span className="text-4xl font-bold text-purple-600">R$ 9,99</span>
          <span className="text-sm text-gray-600 ml-2">/mês</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Benefícios */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              O que você vai desbloquear:
            </h2>
            <div className="space-y-3">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-purple-100 rounded-full p-1 mt-0.5">
                    <Check className="w-4 h-4 text-purple-600" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Informações de Pagamento */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Checkout Seguro
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              Você será redirecionado para nosso checkout seguro do Shopify para finalizar o pagamento.
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>✓ Pagamento 100% seguro e criptografado</li>
              <li>✓ Acesso imediato após confirmação</li>
              <li>✓ Cancele quando quiser</li>
            </ul>
          </div>

          {/* Botão de Checkout */}
          <button
            onClick={handleShopifyCheckout}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-5 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            <Crown className="w-6 h-6" />
            Ir para Checkout Seguro
            <ExternalLink className="w-5 h-5" />
          </button>

          {/* Botão Secundário - Pular */}
          <button
            onClick={onComplete}
            className="w-full text-gray-500 hover:text-gray-700 font-medium py-3 rounded-xl transition-all duration-200"
          >
            Continuar sem Premium
          </button>

          <p className="text-center text-xs text-gray-500">
            🔒 Pagamento processado com segurança pelo Shopify
          </p>
        </div>
      </div>
    </div>
  );
}
