"use client";

import { useState, useEffect } from "react";
import { Droplet, Flame, Apple, Wheat, Beef, ArrowRight } from "lucide-react";

interface NutritionRecommendationsProps {
  onComplete: () => void;
}

interface UserData {
  name: string;
  age: string;
  height: string;
  weight: string;
  goal: string;
}

interface Recommendations {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
}

export default function NutritionRecommendations({
  onComplete,
}: NutritionRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendations>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 60,
    fiber: 25,
    water: 2.5,
  });

  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const profile = localStorage.getItem("fitlife_profile");
    if (profile) {
      const data: UserData = JSON.parse(profile);
      setUserData(data);
      calculateRecommendations(data);
    }
  }, []);

  const calculateRecommendations = (data: UserData) => {
    const weight = parseFloat(data.weight) || 70;
    const height = parseFloat(data.height) || 170;
    const age = parseFloat(data.age) || 30;

    // Cálculo de TMB (Taxa Metabólica Basal) - Fórmula de Harris-Benedict
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;

    let calories = bmr * 1.55; // Fator de atividade moderada
    let protein = weight * 2; // 2g por kg
    let carbs = 0;
    let fat = 0;
    let fiber = 25;
    let water = weight * 0.035; // 35ml por kg

    // Ajustes baseados no objetivo
    if (data.goal === "lose") {
      // Perder peso: déficit calórico
      calories = bmr * 1.55 - 500;
      protein = weight * 2.2; // Mais proteína para preservar massa
      carbs = (calories * 0.3) / 4; // 30% carboidratos
      fat = (calories * 0.3) / 9; // 30% gordura
      fiber = 30;
      water = weight * 0.04; // Mais água
    } else if (data.goal === "gain") {
      // Ganhar massa: superávit calórico
      calories = bmr * 1.55 + 500;
      protein = weight * 2.5; // Muita proteína
      carbs = (calories * 0.45) / 4; // 45% carboidratos
      fat = (calories * 0.25) / 9; // 25% gordura
      fiber = 30;
      water = weight * 0.04;
    } else {
      // Manter peso: manutenção
      calories = bmr * 1.55;
      protein = weight * 2;
      carbs = (calories * 0.4) / 4; // 40% carboidratos
      fat = (calories * 0.3) / 9; // 30% gordura
      fiber = 25;
      water = weight * 0.035;
    }

    setRecommendations({
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      fiber: Math.round(fiber),
      water: parseFloat(water.toFixed(1)),
    });
  };

  const getGoalText = () => {
    if (!userData) return "";
    switch (userData.goal) {
      case "lose":
        return "Perder Peso";
      case "gain":
        return "Ganhar Massa Muscular";
      case "maintain":
        return "Manter o Peso";
      default:
        return "";
    }
  };

  const getGoalDescription = () => {
    if (!userData) return "";
    switch (userData.goal) {
      case "lose":
        return "Suas recomendações foram ajustadas para criar um déficit calórico saudável, priorizando proteínas para preservar massa muscular.";
      case "gain":
        return "Suas recomendações foram ajustadas para criar um superávit calórico, com alto teor de proteínas para maximizar o ganho de massa muscular.";
      case "maintain":
        return "Suas recomendações foram ajustadas para manter seu peso atual, com uma distribuição equilibrada de macronutrientes.";
      default:
        return "";
    }
  };

  const nutrients = [
    {
      icon: Flame,
      label: "Calorias",
      value: `${recommendations.calories}`,
      unit: "kcal/dia",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Beef,
      label: "Proteínas",
      value: `${recommendations.protein}`,
      unit: "g/dia",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: Wheat,
      label: "Carboidratos",
      value: `${recommendations.carbs}`,
      unit: "g/dia",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      icon: Apple,
      label: "Gorduras",
      value: `${recommendations.fat}`,
      unit: "g/dia",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Wheat,
      label: "Fibras",
      value: `${recommendations.fiber}`,
      unit: "g/dia",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Droplet,
      label: "Água",
      value: `${recommendations.water}`,
      unit: "L/dia",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <Apple className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Suas Recomendações Nutricionais
          </h1>
          <p className="text-gray-600 mb-4">
            Objetivo: <span className="font-semibold text-emerald-600">{getGoalText()}</span>
          </p>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            {getGoalDescription()}
          </p>
        </div>

        {/* Nutrientes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {nutrients.map((nutrient, index) => {
            const Icon = nutrient.icon;
            return (
              <div
                key={index}
                className={`${nutrient.bgColor} rounded-xl p-5 border border-gray-100 transition-all hover:shadow-md`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-5 h-5 ${nutrient.color}`} />
                      <span className="text-sm font-medium text-gray-700">
                        {nutrient.label}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-bold ${nutrient.color}`}>
                        {nutrient.value}
                      </span>
                      <span className="text-sm text-gray-500">
                        {nutrient.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800 text-center">
            💡 <span className="font-semibold">Dica:</span> Estas recomendações são personalizadas com base no seu perfil e objetivo. Consulte um nutricionista para um plano mais detalhado.
          </p>
        </div>

        {/* Botão Continuar */}
        <button
          onClick={onComplete}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          Continuar para Pagamento
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
