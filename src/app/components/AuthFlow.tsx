"use client";

import { useState } from "react";
import { Phone, ChevronRight, ShieldCheck } from "lucide-react";

interface AuthFlowProps {
  onAuthSuccess: (user: { phone: string }) => void;
}

export default function AuthFlow({ onAuthSuccess }: AuthFlowProps) {
  const [phone, setPhone] = useState("");

  const isValid = phone.replace(/\D/g, "").length >= 11;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="bg-emerald-50 rounded-2xl p-6 w-fit mb-6">
          <Phone className="w-10 h-10 text-emerald-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Crie sua conta
        </h1>
        <p className="text-gray-600 mb-8">
          Use seu número de celular para entrar com segurança
        </p>

        <label className="text-sm font-semibold text-gray-700 mb-2">
          Telefone (com DDD)
        </label>

        <input
          type="tel"
          placeholder="Ex: 11999999999"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all mb-6"
        />

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Seu número é usado apenas para identificação.
        </div>
      </div>

      <div className="p-6">
        <button
          disabled={!isValid}
          onClick={() => onAuthSuccess({ phone })}
          className={`w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 ${
            isValid
              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continuar
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
