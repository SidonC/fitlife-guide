"use client";

import { Smartphone, ArrowRight } from "lucide-react";

interface InstallPromptProps {
  onComplete: () => void;
}

export default function InstallPrompt({ onComplete }: InstallPromptProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-white p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 bg-emerald-100 rounded-full">
            <Smartphone className="w-12 h-12 text-emerald-600" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Adicione à Tela Inicial
          </h2>
          <p className="text-sm text-gray-600">
            Tenha acesso rápido ao FitLife Guide
          </p>
        </div>

        {/* Instructions */}
        <div className="space-y-4 bg-gray-50 rounded-2xl p-5">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Android</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Toque no menu (⋮) e selecione "Adicionar à tela inicial"
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">iOS (Safari)</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Toque no botão de compartilhar (□↑) e escolha "Adicionar à Tela de Início"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefit */}
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
          <p className="text-xs text-center text-emerald-800">
            Acesse o app com um toque, sem precisar abrir o navegador!
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={onComplete}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          Continuar
          <ArrowRight className="w-5 h-5" strokeWidth={2} />
        </button>

        {/* Skip */}
        <button
          onClick={onComplete}
          className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Pular por enquanto
        </button>
      </div>
    </div>
  );
}
