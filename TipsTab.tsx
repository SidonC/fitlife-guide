"use client";

import { useState } from "react";
import { Lightbulb, Heart, Dumbbell, Apple, Droplet, Moon, Zap, Target, ChevronRight } from "lucide-react";

interface TipsTabProps {
  userGoal: string;
}

export default function TipsTab({ userGoal }: TipsTabProps) {
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  const tipsData = {
    lose: [
      {
        icon: Apple,
        title: "Nutrição",
        description: "Déficit calórico controlado",
        details: "Reduza 300-500 calorias por dia para perder peso de forma saudável. Priorize alimentos ricos em fibras e proteínas que aumentam a saciedade."
      },
      {
        icon: Dumbbell,
        title: "Treino",
        description: "Cardio + musculação",
        details: "Combine exercícios aeróbicos (corrida, bicicleta, natação) com treinos de força. O cardio acelera a queima de gordura e melhora a saúde cardiovascular."
      },
      {
        icon: Droplet,
        title: "Hidratação",
        description: "2-3 litros de água por dia",
        details: "A água ajuda na eliminação de toxinas, melhora o metabolismo e reduz a retenção de líquidos. Beba um copo antes das refeições para aumentar a saciedade."
      },
      {
        icon: Moon,
        title: "Sono",
        description: "7-9 horas por noite",
        details: "A falta de sono aumenta os hormônios da fome (grelina) e reduz a saciedade (leptina), dificultando a perda de peso. Mantenha horários regulares."
      },
      {
        icon: Target,
        title: "Mindset",
        description: "Foco e consistência",
        details: "Comer devagar permite que o cérebro registre a saciedade. Evite distrações durante as refeições e preste atenção aos sinais de fome e saciedade."
      },
    ],
    gain: [
      {
        icon: Apple,
        title: "Nutrição",
        description: "Superávit calórico inteligente",
        details: "Adicione 300-500 calorias extras por dia com alimentos nutritivos. Priorize proteínas (1.6-2.2g/kg), carboidratos complexos e gorduras saudáveis."
      },
      {
        icon: Dumbbell,
        title: "Treino",
        description: "Foco em exercícios compostos",
        details: "Treine 4-5x por semana com exercícios como agachamento, supino, levantamento terra e remada. Aumente a carga progressivamente para estimular o crescimento muscular."
      },
      {
        icon: Moon,
        title: "Sono",
        description: "Recuperação muscular",
        details: "O músculo cresce durante o descanso, não no treino. Respeite os dias de descanso e evite overtraining. A recuperação é tão importante quanto o treino."
      },
      {
        icon: Zap,
        title: "Hidratação",
        description: "3-4 litros de água por dia",
        details: "A água é crucial para síntese proteica e transporte de nutrientes. Mantenha-se hidratado antes, durante e após os treinos."
      },
      {
        icon: Target,
        title: "Mindset",
        description: "Paciência e disciplina",
        details: "Ganho de massa é um processo gradual. Mantenha a consistência no treino e alimentação. Resultados virão com o tempo."
      },
    ],
    maintain: [
      {
        icon: Apple,
        title: "Nutrição",
        description: "Equilíbrio calórico",
        details: "Calcule seu gasto calórico diário e consuma a mesma quantidade. Monitore seu peso semanalmente e ajuste se necessário."
      },
      {
        icon: Dumbbell,
        title: "Treino",
        description: "Treino misto balanceado",
        details: "Alterne entre treinos de força (2-3x) e cardio (2-3x). Isso mantém a composição corporal e melhora a saúde geral."
      },
      {
        icon: Heart,
        title: "Hidratação",
        description: "2-3 litros diários",
        details: "Mantenha-se hidratado para otimizar o metabolismo e a função corporal. A água também ajuda a controlar o apetite."
      },
      {
        icon: Moon,
        title: "Sono",
        description: "7-8 horas regulares",
        details: "O sono regula hormônios que controlam o apetite e o metabolismo. Mantenha horários consistentes de dormir e acordar."
      },
      {
        icon: Target,
        title: "Mindset",
        description: "Consistência é a chave",
        details: "A chave para manter o peso é a consistência. Crie hábitos sustentáveis que você possa seguir a longo prazo sem restrições extremas."
      },
    ],
  };

  const tips = tipsData[userGoal as keyof typeof tipsData] || tipsData.lose;

  return (
    <div className="space-y-6">
      {/* Header Premium com Gradiente */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
            <Lightbulb className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Dicas Personalizadas</h2>
            <p className="text-sm text-emerald-50">Baseadas no seu objetivo</p>
          </div>
        </div>
      </div>

      {/* Cards Premium */}
      <div className="space-y-3">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          const isExpanded = expandedTip === index;
          
          return (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {tip.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {tip.description}
                    </p>
                    
                    {isExpanded && (
                      <div className="mt-3 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {tip.details}
                        </p>
                      </div>
                    )}
                    
                    <button
                      onClick={() => setExpandedTip(isExpanded ? null : index)}
                      className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      {isExpanded ? "Ver menos" : "Ver mais"}
                      <ChevronRight 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? "rotate-90" : ""
                        }`} 
                        strokeWidth={2} 
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Goal Badge Premium */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-center gap-2">
          <Target className="w-5 h-5 text-emerald-600" strokeWidth={2} />
          <p className="text-sm text-gray-700">
            Objetivo atual:{" "}
            <span className="font-bold text-emerald-700">
              {userGoal === "lose"
                ? "Perder Peso"
                : userGoal === "gain"
                ? "Ganhar Massa"
                : "Manter Peso"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
