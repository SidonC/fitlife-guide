"use client";

import { useState } from "react";
import { User, Phone, Target, MessageSquare, Send, CheckCircle2, Award, Clock, DollarSign, Shield } from "lucide-react";

export default function NutritionistTab() {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    goal: "emagrecer",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Gerar mensagem automática
    const goalText = 
      formData.goal === "emagrecer" ? "emagrecer" :
      formData.goal === "ganhar" ? "ganhar massa muscular" :
      "manter minha forma física";

    const message = `Olá Rafaela, meu nome é ${formData.name}.
Meu objetivo é ${goalText}.
Gostaria de agendar uma consulta online.${formData.message ? `\n\nMensagem adicional: ${formData.message}` : ""}`;

    // Codificar mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5516991817699?text=${encodedMessage}`;

    // Abrir WhatsApp
    window.open(whatsappUrl, "_blank");

    // Reset após 2 segundos
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({
        name: "",
        whatsapp: "",
        goal: "emagrecer",
        message: "",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
            <User className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Atendimento Nutricional</h2>
            <p className="text-sm text-emerald-50">Acompanhamento profissional online</p>
          </div>
        </div>
      </div>

      {/* Perfil da Nutricionista */}
      <div className="bg-white border-2 border-emerald-200 rounded-2xl overflow-hidden shadow-md">
        {/* Header do Card com Foto Real */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white">
          <div className="flex items-center gap-4">
            {/* Foto Real da Nutricionista */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/12d6e29b-299a-4633-9e06-f626ff880b8a.jpg" 
                alt="Rafaela Trevizan - Nutricionista" 
                className="w-full h-full rounded-full object-cover border-4 border-white/30 shadow-lg"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-1">Rafaela Trevizan</h3>
              <p className="text-emerald-50 text-sm font-medium">Nutricionista • CRN 60793</p>
            </div>
          </div>
        </div>

        {/* Informações */}
        <div className="p-5 space-y-4">
          {/* Descrição */}
          <p className="text-gray-700 leading-relaxed">
            Consultas online com foco em saúde, emagrecimento e desempenho físico,
            com plano alimentar personalizado.
          </p>

          {/* Detalhes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 bg-emerald-50 p-3 rounded-xl">
              <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0" strokeWidth={2} />
              <div>
                <p className="text-xs text-gray-500 font-medium">Atendimento</p>
                <p className="text-sm font-bold text-gray-900">Online</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-emerald-50 p-3 rounded-xl">
              <DollarSign className="w-5 h-5 text-emerald-600 flex-shrink-0" strokeWidth={2} />
              <div>
                <p className="text-xs text-gray-500 font-medium">Valor da Consulta</p>
                <p className="text-sm font-bold text-gray-900">R$ 150,00</p>
              </div>
            </div>
          </div>

          {/* Selo de Confiança */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" strokeWidth={2} />
              </div>
              <p className="text-sm text-gray-800 font-medium">
                Atendimento profissional com registro no conselho.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de Contato */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <MessageSquare className="w-5 h-5 text-emerald-600" strokeWidth={2} />
          <h3 className="text-lg font-bold text-gray-900">Agendar Consulta</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digite seu nome"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              WhatsApp *
            </label>
            <input
              type="tel"
              required
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="(00) 00000-0000"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Objetivo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Seu Objetivo *
            </label>
            <select
              required
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors bg-white"
            >
              <option value="emagrecer">Emagrecer</option>
              <option value="ganhar">Ganhar Massa Muscular</option>
              <option value="manter">Manter Forma Física</option>
            </select>
          </div>

          {/* Mensagem Opcional */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mensagem Adicional (opcional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Conte um pouco mais sobre suas necessidades..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
          >
            {isSubmitting ? (
              <>
                <CheckCircle2 className="w-5 h-5 animate-pulse" strokeWidth={2} />
                Abrindo WhatsApp...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" strokeWidth={2} />
                Falar com a Nutricionista
              </>
            )}
          </button>
        </form>
      </div>

      {/* Benefícios */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-emerald-600" strokeWidth={2} />
          <h3 className="text-base font-bold text-gray-900">O que você recebe:</h3>
        </div>
        
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <span className="text-sm text-gray-700">Plano alimentar personalizado para seu objetivo</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <span className="text-sm text-gray-700">Acompanhamento profissional online</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <span className="text-sm text-gray-700">Orientações sobre suplementação adequada</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <span className="text-sm text-gray-700">Suporte contínuo via WhatsApp</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
