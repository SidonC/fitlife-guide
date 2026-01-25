"use client";

import { useState, useEffect, useRef } from "react";
import { User, Save, LogOut, Crown, ExternalLink, TrendingUp, Target, Activity, Calendar, Award, Dumbbell, Scale, Flame, Droplet, Apple, Camera } from "lucide-react";

interface Profile {
  name: string;
  birthDate: string;
  height: string;
  weight: string;
  initialWeight: string;
  goal: string;
  photo?: string;
}

interface WeightEntry {
  date: string;
  weight: number;
}

interface ProfileTabProps {
  onProfileSaved: () => void;
  onGoalChanged?: (goal: string) => void;
}

export default function ProfileTab({ onProfileSaved, onGoalChanged }: ProfileTabProps) {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    birthDate: "",
    height: "",
    weight: "",
    initialWeight: "",
    goal: "",
  });
  const [hasProfile, setHasProfile] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [weightLoss, setWeightLoss] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função para calcular idade a partir da data de nascimento
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  useEffect(() => {
    const saved = localStorage.getItem("fitlife_profile");
    const premiumStatus = localStorage.getItem("fitlife_paid");
    
    if (saved) {
      const savedProfile = JSON.parse(saved);
      
      if (!savedProfile.initialWeight) {
        savedProfile.initialWeight = savedProfile.weight;
      }
      
      setProfile(savedProfile);
      setHasProfile(true);
      
      const weightHistory = localStorage.getItem("fitlife_weight_history");
      if (weightHistory) {
        const history: WeightEntry[] = JSON.parse(weightHistory);
        if (history.length > 0) {
          const latestWeight = history[history.length - 1].weight;
          setCurrentWeight(latestWeight);
          setWeightLoss(Number(savedProfile.initialWeight) - latestWeight);
        } else {
          setCurrentWeight(Number(savedProfile.weight));
          setWeightLoss(0);
        }
      } else {
        setCurrentWeight(Number(savedProfile.weight));
        setWeightLoss(0);
      }
    }
    
    if (premiumStatus === "true") {
      setIsPremium(true);
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const photoUrl = event.target?.result as string;
        const updatedProfile = { ...profile, photo: photoUrl };
        setProfile(updatedProfile);
        localStorage.setItem("fitlife_profile", JSON.stringify(updatedProfile));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const profileToSave = {
      ...profile,
      initialWeight: profile.initialWeight || profile.weight
    };
    
    localStorage.setItem("fitlife_profile", JSON.stringify(profileToSave));
    setProfile(profileToSave);
    setHasProfile(true);
    setIsEditing(false);
    onProfileSaved();
    
    if (onGoalChanged) {
      onGoalChanged(profile.goal);
    }
  };

  const handleActivatePremium = () => {
    const hotmartCheckoutUrl = "https://pay.hotmart.com/N103969250R?off=mekmrjz9&hotfeature=51&_hi=eyJjaWQiOiIxNzY4ODcxNjc1NjU1Mzc5NDI1MTExMTk1Nzk0NTAwIiwiYmlkIjoiMTc2ODg3MTY3NTY1NTM3OTQyNTExMTE5NTc5NDUwMCIsInNpZCI6Ijc4NDcyZGZiNDA2YzRiNmI5N2YzMDVmNzIyZDVjMWQ1In0=.1768875453706&bid=1768875456019";
    window.open(hotmartCheckoutUrl, "_blank");
  };

  const handleReset = () => {
    if (confirm("Tem certeza que deseja sair e limpar todos os dados?")) {
      localStorage.clear();
      setProfile({
        name: "",
        birthDate: "",
        height: "",
        weight: "",
        initialWeight: "",
        goal: "",
      });
      setHasProfile(false);
      window.location.reload();
    }
  };

  const calculateIMC = () => {
    const heightInMeters = Number(profile.height) / 100;
    const imc = currentWeight / Math.pow(heightInMeters, 2);
    return imc.toFixed(1);
  };

  const getIMCStatus = () => {
    const imc = parseFloat(calculateIMC());
    
    if (imc < 18.5) {
      return {
        status: "Abaixo do peso",
        color: "text-yellow-700",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        percentage: (imc / 18.5) * 33,
        message: "Foque em ganhar massa muscular com treino e alimentação adequada!"
      };
    } else if (imc >= 18.5 && imc < 25) {
      return {
        status: "Peso Ideal",
        color: "text-emerald-700",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        percentage: 33 + ((imc - 18.5) / (25 - 18.5)) * 34,
        message: "Parabéns! Seu peso está na faixa saudável. Continue assim!"
      };
    } else if (imc >= 25 && imc < 30) {
      return {
        status: "Sobrepeso",
        color: "text-orange-700",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        percentage: 67 + ((imc - 25) / (30 - 25)) * 20,
        message: "Foque em exercícios e alimentação balanceada para alcançar o peso ideal."
      };
    } else {
      return {
        status: "Obesidade",
        color: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        percentage: Math.min(100, 87 + ((imc - 30) / 10) * 13),
        message: "Procure orientação profissional. Pequenas mudanças fazem grande diferença!"
      };
    }
  };

  const goals = [
    { value: "lose", label: "Emagrecer" },
    { value: "gain", label: "Ganhar Massa" },
    { value: "maintain", label: "Manter Peso" },
  ];

  const imcInfo = getIMCStatus();

  const calculateProgress = () => {
    const initialWeight = Number(profile.initialWeight);
    const targetWeight = profile.goal === "lose" ? initialWeight * 0.9 : profile.goal === "gain" ? initialWeight * 1.1 : initialWeight;
    const totalChange = Math.abs(targetWeight - initialWeight);
    const currentChange = Math.abs(currentWeight - initialWeight);
    const progress = totalChange > 0 ? (currentChange / totalChange) * 100 : 0;
    return Math.min(100, Math.round(progress));
  };

  const getCaloriesRecommendation = () => {
    const age = calculateAge(profile.birthDate);
    const bmr = 10 * currentWeight + 6.25 * Number(profile.height) - 5 * age + 5;
    if (profile.goal === "lose") return Math.round(bmr * 1.2 - 500);
    if (profile.goal === "gain") return Math.round(bmr * 1.5 + 300);
    return Math.round(bmr * 1.3);
  };

  const getMacros = () => {
    const calories = getCaloriesRecommendation();
    return {
      carbs: Math.round(calories * 0.5 / 4),
      protein: Math.round(calories * 0.3 / 4),
      fat: Math.round(calories * 0.2 / 9),
      fiber: 25,
      water: 2.5
    };
  };

  const achievements = [
    { id: 1, name: "Primeira Semana", icon: Calendar, unlocked: true },
    { id: 2, name: "5 Treinos Feitos", icon: Dumbbell, unlocked: true },
    { id: 3, name: "1kg Perdido", icon: TrendingUp, unlocked: weightLoss >= 1 },
  ];

  if (!hasProfile || isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-50 rounded-xl">
            <User className="w-6 h-6 text-emerald-600" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? "Editar Perfil" : "Criar Perfil"}
            </h2>
            <p className="text-sm text-gray-500">
              {isEditing ? "Atualize suas informações" : "Configure seu perfil para começar"}
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                placeholder="Digite seu nome"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Data de Nascimento
              </label>
              <input
                type="date"
                required
                value={profile.birthDate}
                onChange={(e) =>
                  setProfile({ ...profile, birthDate: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
              {profile.birthDate && (
                <p className="text-xs text-gray-500 mt-1">
                  Idade: {calculateAge(profile.birthDate)} anos
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  required
                  value={profile.height}
                  onChange={(e) =>
                    setProfile({ ...profile, height: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                  placeholder="Ex: 175"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={profile.weight}
                  onChange={(e) =>
                    setProfile({ ...profile, weight: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                  placeholder="Ex: 75.5"
                  disabled={isEditing}
                />
              </div>
            </div>

            {isEditing && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Dica:</strong> Para atualizar seu peso, vá até a aba "Evolução" e registre um novo peso.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Objetivo
              </label>
              <div className="space-y-2">
                {goals.map((goal) => (
                  <label
                    key={goal.value}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      profile.goal === goal.value
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="goal"
                      value={goal.value}
                      checked={profile.goal === goal.value}
                      onChange={(e) =>
                        setProfile({ ...profile, goal: e.target.value })
                      }
                      className="w-4 h-4 text-emerald-600"
                      required
                    />
                    <span className="font-medium text-gray-900">
                      {goal.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" strokeWidth={2} />
                Salvar Perfil
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl transition-all duration-200"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  const macros = getMacros();
  const userAge = calculateAge(profile.birthDate);

  return (
    <div className="space-y-6 pb-8">
      {/* Cabeçalho do Perfil com Upload de Foto */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-white/30 overflow-hidden hover:opacity-90 transition-opacity cursor-pointer group"
            >
              {profile.photo ? (
                <img 
                  src={profile.photo} 
                  alt="Foto de perfil" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-emerald-600" strokeWidth={2} />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-sm text-white/90 mt-1">{userAge} anos</p>
            <div className="flex items-center gap-2 mt-1">
              {isPremium ? (
                <span className="inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                  <Crown className="w-3 h-3" />
                  Premium Ativo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                  Conta Gratuita
                </span>
              )}
            </div>
          </div>
        </div>
        
        {!isPremium && (
          <button
            onClick={handleActivatePremium}
            className="w-full bg-white text-emerald-600 hover:bg-gray-50 font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
          >
            <Crown className="w-5 h-5" />
            Ativar Premium
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Resumo de Evolução de Peso */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Evolução de Peso
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <p className="text-xs text-white/80 mb-1">Peso Inicial</p>
            <p className="text-xl font-bold">{profile.initialWeight} kg</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <p className="text-xs text-white/80 mb-1">Peso Atual</p>
            <p className="text-xl font-bold">{currentWeight.toFixed(1)} kg</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <p className="text-xs text-white/80 mb-1">
              {profile.goal === "lose" ? "Perda Total" : profile.goal === "gain" ? "Ganho Total" : "Variação"}
            </p>
            <p className="text-xl font-bold">
              {weightLoss > 0 ? "-" : weightLoss < 0 ? "+" : ""}{Math.abs(weightLoss).toFixed(1)} kg
            </p>
          </div>
        </div>
        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold">Progresso do Objetivo</p>
            <p className="text-sm font-bold">{calculateProgress()}%</p>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5">
            <div 
              className="bg-white h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Cartões de Status Rápido */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-gray-600 font-medium">Peso Atual</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{currentWeight.toFixed(1)} kg</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-emerald-600" />
            <p className="text-xs text-gray-600 font-medium">Objetivo</p>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {goals.find((g) => g.value === profile.goal)?.label}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-purple-600" />
            <p className="text-xs text-gray-600 font-medium">IMC</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{calculateIMC()}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <p className="text-xs text-gray-600 font-medium">Progresso</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{calculateProgress()}%</p>
        </div>
      </div>

      {/* Resumo da Jornada */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          Resumo da Jornada
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <p className="text-xs text-gray-600 mb-1">Dias Ativos</p>
            <p className="text-2xl font-bold text-emerald-700">7</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs text-gray-600 mb-1">Treinos Concluídos</p>
            <p className="text-2xl font-bold text-blue-700">5</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <p className="text-xs text-gray-600 mb-1">Checklists Completos</p>
            <p className="text-2xl font-bold text-purple-700">12</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
            <p className="text-xs text-gray-600 mb-1">Última Atualização</p>
            <p className="text-sm font-bold text-orange-700">Hoje</p>
          </div>
        </div>
      </div>

      {/* Indicadores de Saúde */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600" />
          Indicadores de Saúde
        </h3>
        
        <div className={`${imcInfo.bgColor} rounded-xl p-4 border ${imcInfo.borderColor} mb-4`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">IMC: {calculateIMC()}</p>
            <span className={`text-xs font-bold ${imcInfo.color}`}>{imcInfo.status}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-yellow-400 via-emerald-500 to-red-500"
              style={{ width: `${imcInfo.percentage}%` }}
            />
          </div>
          
          <p className="text-xs text-gray-700 leading-relaxed">
            {imcInfo.message}
          </p>
        </div>
      </div>

      {/* Plano Atual */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Apple className="w-5 h-5 text-emerald-600" />
          Plano Atual
        </h3>
        
        <div className="space-y-3">
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold text-gray-700">Calorias Diárias</span>
              </div>
              <span className="text-lg font-bold text-emerald-700">{getCaloriesRecommendation()} kcal</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
              <p className="text-xs text-gray-600 mb-1">Carboidratos</p>
              <p className="text-lg font-bold text-blue-700">{macros.carbs}g</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
              <p className="text-xs text-gray-600 mb-1">Proteínas</p>
              <p className="text-lg font-bold text-purple-700">{macros.protein}g</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
              <p className="text-xs text-gray-600 mb-1">Fibras</p>
              <p className="text-lg font-bold text-orange-700">{macros.fiber}g</p>
            </div>
            <div className="bg-cyan-50 rounded-xl p-3 border border-cyan-100 flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-600" />
              <div>
                <p className="text-xs text-gray-600">Água</p>
                <p className="text-lg font-bold text-cyan-700">{macros.water}L</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conquistas */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600" />
          Conquistas
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`rounded-xl p-4 border-2 text-center transition-all ${
                achievement.unlocked
                  ? "bg-yellow-50 border-yellow-300"
                  : "bg-gray-50 border-gray-200 opacity-50"
              }`}
            >
              <achievement.icon
                className={`w-8 h-8 mx-auto mb-2 ${
                  achievement.unlocked ? "text-yellow-600" : "text-gray-400"
                }`}
              />
              <p className="text-xs font-semibold text-gray-700">{achievement.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="space-y-3">
        <button
          onClick={() => setIsEditing(true)}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
        >
          <Save className="w-5 h-5" />
          Editar Perfil
        </button>

        {!isPremium && (
          <button
            onClick={handleActivatePremium}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
          >
            <Crown className="w-5 h-5" />
            Ativar Premium
            <ExternalLink className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={handleReset}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-red-200"
        >
          <LogOut className="w-5 h-5" />
          Sair da Conta
        </button>
      </div>
    </div>
  );
}
