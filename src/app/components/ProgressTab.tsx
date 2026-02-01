"use client";

import PremiumLock from "./PremiumLock";
import { useState, useEffect } from "react";
import { TrendingUp, Plus, Trash2, X, Scale, Flame, Beef, Wheat, Apple as AppleIcon, Droplet, Activity, Salad } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface WeightEntry {
  date: string;
  weight: number;
}

interface DailyMetrics {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
}

interface NutrientGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
}

  export default function ProgressTab() {

  const [isPremium, setIsPremium] = useState(false);
  useEffect(() => {
  const paid = localStorage.getItem("fitlife_paid") === "true";
    setIsPremium(paid);
  }, []);
  const [weight, setWeight] = useState("");
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  
  // Modal de registro
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'water' | 'calories' | 'protein' | 'carbs' | 'fat' | 'fiber'>('water');
  const [modalValue, setModalValue] = useState("");
  
  // Métricas diárias
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetrics>({
    date: new Date().toISOString().split('T')[0],
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    water: 0,
  });
  
  const [metricsHistory, setMetricsHistory] = useState<DailyMetrics[]>([]);

  const today = new Date().toISOString().split('T')[0];

  // Calcular metas baseadas no IMC ideal
  const calculateGoals = (): NutrientGoals => {
    const profile = localStorage.getItem("fitlife_profile");
    if (!profile) {
      return {
        calories: 2000,
        protein: 150,
        carbs: 250,
        fat: 60,
        fiber: 30,
        water: 3000,
      };
    }

    const userData = JSON.parse(profile);
    const height = Number(userData.height) / 100;
    const currentWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : Number(userData.weight);
    const goal = userData.goal;

    // Calcular peso ideal baseado no IMC 22
    const idealWeight = 22 * Math.pow(height, 2);

    // Calcular idade
    const birthDate = new Date(userData.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Calcular TMB usando Mifflin-St Jeor
    const bmr = 10 * currentWeight + 6.25 * Number(userData.height) - 5 * age + 5;

    // Ajustar calorias baseado no objetivo
    let calories;
    if (goal === "lose") {
      calories = Math.round(bmr * 1.2 - 500);
    } else if (goal === "gain") {
      calories = Math.round(bmr * 1.5 + 300);
    } else {
      calories = Math.round(bmr * 1.3);
    }

    return {
      calories,
      protein: Math.round(currentWeight * 2),
      carbs: Math.round(calories * 0.5 / 4),
      fat: Math.round(calories * 0.25 / 9),
      fiber: 30,
      water: Math.round(currentWeight * 35),
    };
  };

  const goals = calculateGoals();

  useEffect(() => {
    const saved = localStorage.getItem("fitlife_weight_history");
    if (saved) {
      setWeightHistory(JSON.parse(saved));
    }

    const savedMetrics = localStorage.getItem("fitlife_metrics_history");
    if (savedMetrics) {
      const metrics = JSON.parse(savedMetrics);
      setMetricsHistory(metrics);
      
      const todayMetrics = metrics.find((m: DailyMetrics) => m.date === today);
      if (todayMetrics) {
        setDailyMetrics(todayMetrics);
      }
    }
  }, [today]);

  const handleAddWeight = () => {
    if (!weight || isNaN(Number(weight))) return;

    const newEntry: WeightEntry = {
      date: new Date().toLocaleDateString("pt-BR"),
      weight: Number(weight),
    };

    const updated = [...weightHistory, newEntry].sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });
    
    setWeightHistory(updated);
    localStorage.setItem("fitlife_weight_history", JSON.stringify(updated));
    
    setWeight("");
  };

  const handleDeleteWeight = (index: number) => {
    const updated = weightHistory.filter((_, i) => i !== index);
    setWeightHistory(updated);
    localStorage.setItem("fitlife_weight_history", JSON.stringify(updated));
  };

  const openModal = (type: 'water' | 'calories' | 'protein' | 'carbs' | 'fat' | 'fiber') => {
    setModalType(type);
    setModalValue("");
    setShowModal(true);
  };

  const handleAddNutrient = () => {
    if (!modalValue || isNaN(Number(modalValue))) return;

    const updatedMetrics = {
      ...dailyMetrics,
      [modalType]: dailyMetrics[modalType] + Number(modalValue),
    };

    setDailyMetrics(updatedMetrics);

    const existingIndex = metricsHistory.findIndex(m => m.date === today);
    let updated;
    
    if (existingIndex >= 0) {
      updated = [...metricsHistory];
      updated[existingIndex] = updatedMetrics;
    } else {
      updated = [...metricsHistory, updatedMetrics];
    }
    
    setMetricsHistory(updated);
    localStorage.setItem("fitlife_metrics_history", JSON.stringify(updated));
    
    setShowModal(false);
    setModalValue("");
  };

  const getTodayProgress = () => {
    return {
      calories: Math.min((dailyMetrics.calories / goals.calories) * 100, 100),
      protein: Math.min((dailyMetrics.protein / goals.protein) * 100, 100),
      carbs: Math.min((dailyMetrics.carbs / goals.carbs) * 100, 100),
      fat: Math.min((dailyMetrics.fat / goals.fat) * 100, 100),
      fiber: Math.min((dailyMetrics.fiber / goals.fiber) * 100, 100),
      water: Math.min((dailyMetrics.water / goals.water) * 100, 100),
    };
  };

  const getInsights = () => {
    const progress = getTodayProgress();
    const profile = localStorage.getItem("fitlife_profile");
    
    if (profile) {
      const userData = JSON.parse(profile);
      const height = Number(userData.height) / 100;
      const idealWeight = 22 * Math.pow(height, 2);
      const currentWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : Number(userData.weight);
      const difference = currentWeight - idealWeight;
      
      if (Math.abs(difference) < 2) {
        return `🎯 Você está no peso ideal! IMC perfeito para sua altura.`;
      } else if (difference > 0) {
        return `📊 Meta: ${idealWeight.toFixed(1)}kg (IMC ideal). Faltam ${difference.toFixed(1)}kg para o objetivo!`;
      } else {
        return `📊 Meta: ${idealWeight.toFixed(1)}kg (IMC ideal). Ganhe ${Math.abs(difference).toFixed(1)}kg de massa!`;
      }
    }
    
    if (progress.water >= 72 && progress.water < 100) {
      return `Você atingiu ${Math.round(progress.water)}% da meta de água hoje! 💧`;
    } else if (progress.water >= 100) {
      return "Meta de água batida! Continue assim! 💧✨";
    } else if (progress.protein < 50) {
      return "Proteína abaixo do ideal, priorize carnes magras e whey 🥩";
    } else if (progress.calories >= 80) {
      return `Você atingiu ${Math.round(progress.calories)}% da meta de calorias! 🔥`;
    } else {
      return "Continue registrando seu consumo para insights personalizados! 📊";
    }
  };

  // Gráfico de Peso
  const chartData = weightHistory.map((entry) => ({
    date: entry.date,
    peso: entry.weight,
  }));

  // Gráfico de IMC
  const imcChartData = weightHistory.map((entry) => {
    const profile = localStorage.getItem("fitlife_profile");
    if (!profile) return { date: entry.date, imc: 0 };
    
    const userData = JSON.parse(profile);
    const height = Number(userData.height) / 100;
    const imc = entry.weight / Math.pow(height, 2);
    
    return {
      date: entry.date,
      imc: parseFloat(imc.toFixed(1)),
    };
  });

  // Gerar dados para os últimos 31 dias
  const generateMonthlyData = () => {
    const data = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = metricsHistory.find(m => m.date === dateStr);
      
      data.push({
        day: String(day).padStart(2, '0'),
        Calorias: dayData?.calories || 0,
        Proteínas: dayData?.protein || 0,
        Água: dayData ? dayData.water / 10 : 0,
      });
    }

    return data;
  };

  const monthlyChartData = generateMonthlyData();
  const progress = getTodayProgress();

  const modalLabels = {
    water: { title: "Adicionar Água", unit: "ml", icon: Droplet, color: "blue" },
    calories: { title: "Adicionar Calorias", unit: "kcal", icon: Flame, color: "orange" },
    protein: { title: "Adicionar Proteínas", unit: "g", icon: Beef, color: "red" },
    carbs: { title: "Adicionar Carboidratos", unit: "g", icon: Wheat, color: "amber" },
    fat: { title: "Adicionar Gorduras", unit: "g", icon: Salad, color: "yellow" },
    fiber: { title: "Adicionar Fibras", unit: "g", icon: AppleIcon, color: "green" },
  };

  const currentModal = modalLabels[modalType];
  const ModalIcon = currentModal.icon;

  return (
  <PremiumLock isPremium={isPremium}>
    
    <div className="space-y-6 pb-6">
      {/* Header Premium com Gradiente */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
            <TrendingUp className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Painel de Evolução</h2>
            <p className="text-sm text-emerald-50">Acompanhe seu progresso diário</p>
          </div>
        </div>
      </div>

      {/* Dashboard em Cards (Grid 3x2 desktop, 2x3 mobile) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {/* Card Calorias */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-md">
              <Flame className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <button
              onClick={() => openModal('calories')}
              className="p-2 bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
          <p className="text-xs font-bold text-orange-900 mb-1">Calorias</p>
          <p className="text-lg font-black text-orange-700 mb-1">{dailyMetrics.calories}<span className="text-xs font-normal text-orange-600">/{goals.calories}</span></p>
          <div className="w-full bg-orange-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress.calories}%` }}
            />
          </div>
          <p className="text-xs text-orange-700 font-semibold">{Math.round(progress.calories)}% da meta</p>
        </div>

        {/* Card Proteínas */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-md">
              <Beef className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <button
              onClick={() => openModal('protein')}
              className="p-2 bg-gradient-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
          <p className="text-xs font-bold text-red-900 mb-1">Proteínas</p>
          <p className="text-lg font-black text-red-700 mb-1">{dailyMetrics.protein}g<span className="text-xs font-normal text-red-600">/{goals.protein}g</span></p>
          <div className="w-full bg-red-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress.protein}%` }}
            />
          </div>
          <p className="text-xs text-red-700 font-semibold">{Math.round(progress.protein)}% da meta</p>
        </div>

        {/* Card Carboidratos */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl shadow-md">
              <Wheat className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <button
              onClick={() => openModal('carbs')}
              className="p-2 bg-gradient-to-br from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
          <p className="text-xs font-bold text-amber-900 mb-1">Carboidratos</p>
          <p className="text-lg font-black text-amber-700 mb-1">{dailyMetrics.carbs}g<span className="text-xs font-normal text-amber-600">/{goals.carbs}g</span></p>
          <div className="w-full bg-amber-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress.carbs}%` }}
            />
          </div>
          <p className="text-xs text-amber-700 font-semibold">{Math.round(progress.carbs)}% da meta</p>
        </div>

        {/* Card Gorduras */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-gradient-to-br from-yellow-500 to-orange-400 rounded-xl shadow-md">
              <Salad className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <button
              onClick={() => openModal('fat')}
              className="p-2 bg-gradient-to-br from-yellow-500 to-orange-400 hover:from-yellow-600 hover:to-orange-500 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
          <p className="text-xs font-bold text-yellow-900 mb-1">Gorduras</p>
          <p className="text-lg font-black text-yellow-700 mb-1">{dailyMetrics.fat}g<span className="text-xs font-normal text-yellow-600">/{goals.fat}g</span></p>
          <div className="w-full bg-yellow-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-orange-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress.fat}%` }}
            />
          </div>
          <p className="text-xs text-yellow-700 font-semibold">{Math.round(progress.fat)}% da meta</p>
        </div>

        {/* Card Fibras */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-md">
              <AppleIcon className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <button
              onClick={() => openModal('fiber')}
              className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
          <p className="text-xs font-bold text-green-900 mb-1">Fibras</p>
          <p className="text-lg font-black text-green-700 mb-1">{dailyMetrics.fiber}g<span className="text-xs font-normal text-green-600">/{goals.fiber}g</span></p>
          <div className="w-full bg-green-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress.fiber}%` }}
            />
          </div>
          <p className="text-xs text-green-700 font-semibold">{Math.round(progress.fiber)}% da meta</p>
        </div>

        {/* Card Água */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-md">
              <Droplet className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <button
              onClick={() => openModal('water')}
              className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
          <p className="text-xs font-bold text-blue-900 mb-1">Água</p>
          <p className="text-lg font-black text-blue-700 mb-1">{dailyMetrics.water}ml<span className="text-xs font-normal text-blue-600">/{goals.water}ml</span></p>
          <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress.water}%` }}
            />
          </div>
          <p className="text-xs text-blue-700 font-semibold">{Math.round(progress.water)}% da meta</p>
        </div>
      </div>

      {/* Insights Inteligentes */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
            <Activity className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">💡 Insight do Dia</p>
            <p className="text-sm text-emerald-50">
              {getInsights()}
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico Diário de Evolução (Mês Completo) */}
      {monthlyChartData.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-lg">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Evolução Diária do Mês
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="day" 
                  stroke="#6b7280"
                  style={{ fontSize: '11px' }}
                  label={{ value: 'Dia do Mês', position: 'insideBottom', offset: -5, style: { fontSize: '12px', fill: '#6b7280' } }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '11px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #10b981',
                    borderRadius: '12px',
                    color: '#111827',
                    fontWeight: 'bold',
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="Calorias"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ fill: '#f97316', r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1000}
                />
                <Line
                  type="monotone"
                  dataKey="Proteínas"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1000}
                />
                <Line
                  type="monotone"
                  dataKey="Água"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">*Água em dezenas de ml (escala ajustada para visualização)</p>
        </div>
      )}

      {/* Gráfico de Evolução do IMC */}
      {imcChartData.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-lg">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Evolução do IMC
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={imcChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: '11px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '11px' }}
                  domain={[15, 35]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #9333ea',
                    borderRadius: '12px',
                    color: '#111827',
                    fontWeight: 'bold',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="imc"
                  stroke="#9333ea"
                  strokeWidth={3}
                  dot={{ fill: '#9333ea', r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-center">
              <p className="text-yellow-700 font-semibold">&lt; 18.5</p>
              <p className="text-gray-600">Abaixo</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center">
              <p className="text-emerald-700 font-semibold">18.5-24.9</p>
              <p className="text-gray-600">Ideal</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center">
              <p className="text-orange-700 font-semibold">25-29.9</p>
              <p className="text-gray-600">Sobrepeso</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
              <p className="text-red-700 font-semibold">&gt; 30</p>
              <p className="text-gray-600">Obesidade</p>
            </div>
          </div>
        </div>
      )}

      {/* Gráfico de Peso */}
      {weightHistory.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-lg">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            Evolução de Peso
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: '11px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '11px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #10b981',
                    borderRadius: '12px',
                    color: '#111827',
                    fontWeight: 'bold',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="peso"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Registrar Peso - RESPONSIVO */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-lg">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-600" />
          Registrar Peso
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Ex: 75.5"
            className="flex-1 w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all font-semibold"
          />
          <button
            onClick={handleAddWeight}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Adicionar
          </button>
        </div>
      </div>

      {/* Histórico de Peso */}
      {weightHistory.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-lg">
          <h3 className="text-base font-bold text-gray-900 mb-4">Histórico de Peso</h3>
          <div className="space-y-2">
            {weightHistory.slice(-5).reverse().map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl hover:from-gray-100 hover:to-emerald-100 transition-all duration-200"
              >
                <div>
                  <p className="text-sm font-bold text-gray-900">{entry.weight} kg</p>
                  <p className="text-xs text-gray-500">{entry.date}</p>
                </div>
                <button
                  onClick={() => handleDeleteWeight(weightHistory.length - 1 - index)}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Registro Rápido */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 bg-gradient-to-br from-${currentModal.color}-500 to-${currentModal.color}-600 rounded-xl shadow-md`}>
                  <ModalIcon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{currentModal.title}</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" strokeWidth={2} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Quantidade ({currentModal.unit})
                </label>
                <input
                  type="number"
                  value={modalValue}
                  onChange={(e) => setModalValue(e.target.value)}
                  placeholder={`Ex: ${modalType === 'water' ? '250' : modalType === 'calories' ? '500' : '30'}`}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all font-semibold text-lg"
                  autoFocus
                />
              </div>
              
              <button
                onClick={handleAddNutrient}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl py-3.5 font-bold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
  </div>
  </PremiumLock>
);
}
