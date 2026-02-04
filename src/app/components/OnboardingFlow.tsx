"use client";

import { useState } from "react";
import { ChevronRight, Dumbbell, Apple, TrendingUp, User, Calendar, Target, Ruler, Check, Sparkles, Zap } from "lucide-react";

interface OnboardingFlowProps {
  onComplete: (userData: UserData) => void;
}

interface UserData {
  name: string;
  age: string;
  birthDate: string;
  height: string;
  weight: string;
  goal: string;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    age: "",
    birthDate: "",
    height: "",
    weight: "",
    goal: "",
  });

  const welcomeScreens = [
    {
      icon: Sparkles,
      title: "Bem-vindo ao FitLife Guide",
      description: "Sua jornada fitness começa aqui, de forma simples e eficaz",
      gradient: "from-emerald-500 to-teal-500",
      showLogo: true,
    },
    {
      icon: Apple,
      title: "Nutrição Inteligente",
      description: "Acompanhe sua alimentação e macronutrientes de forma prática",
      gradient: "from-teal-500 to-cyan-500",
      showLogo: false,
    },
    {
      icon: Zap,
      title: "Resultados Reais",
      description: "Evolua constantemente e alcance seus objetivos fitness",
      gradient: "from-cyan-500 to-blue-500",
      showLogo: false,
    },
  ];

  const totalSteps = welcomeScreens.length + 5;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onComplete(userData);
    }
  };

  const handleSkipWelcome = () => {
    setStep(welcomeScreens.length);
  };

  const updateUserData = (field: keyof UserData, value: string) => {
    setUserData({ ...userData, [field]: value });
  };

  const isFormValid = () => {
    if (step === 3) return userData.name.trim() !== "";
    if (step === 4) return userData.birthDate.trim() !== ""; // Só precisa da data de nascimento
    if (step === 5) return userData.height.trim() !== "" && userData.weight.trim() !== "";
    if (step === 6) return userData.goal.trim() !== "";
    return true;
  };

  // Welcome screens (0-2)
  if (step < welcomeScreens.length) {
    const currentScreen = welcomeScreens[step];
    const Icon = currentScreen.icon;

    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 relative overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${currentScreen.gradient} opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse`}></div>
        <div className={`absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr ${currentScreen.gradient} opacity-20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse`} style={{ animationDelay: '1s' }}></div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 p-6 relative z-10">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === step
                  ? "w-10 bg-gradient-to-r from-emerald-500 to-teal-500"
                  : index < step
                  ? "w-1.5 bg-emerald-400"
                  : "w-1.5 bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10">
          {currentScreen.showLogo ? (
            // Logo do FitLife Guide na primeira tela
            <div className="mb-10 animate-[zoomIn_0.8s_ease-out]">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                
                {/* Logo container */}
                <div className="relative w-48 h-48 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white/70">
                  <img 
                    src="/logo_round_small.png" 
                    alt="FitLife Guide Logo" 
                    className="w-44 h-44 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            // Ícones para outras telas
            <div className={`bg-gradient-to-br ${currentScreen.gradient} rounded-3xl p-12 mb-8 shadow-2xl animate-[fadeIn_0.6s_ease-out]`}>
              <Icon className="w-20 h-20 text-white" strokeWidth={1.5} />
            </div>
          )}

          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight max-w-md animate-[fadeIn_0.8s_ease-out]">
            {currentScreen.title}
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed max-w-sm animate-[fadeIn_1s_ease-out]">
            {currentScreen.description}
          </p>

          {currentScreen.showLogo && (
            <div className="mt-6 animate-[fadeIn_1.2s_ease-out]">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Vamos começar!</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 space-y-3 relative z-10">
          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-[1.02] active:scale-[0.98]"
          >
            Próximo
            <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
          </button>

          {step === 0 && (
            <button
              onClick={handleSkipWelcome}
              className="w-full text-gray-500 hover:text-gray-700 font-medium py-3 rounded-2xl transition-all duration-200 hover:bg-gray-100"
            >
              Pular introdução
            </button>
          )}
        </div>

        {/* Animações CSS */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes zoomIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    );
  }

  // Form Step 1: Nome (step 3)
  if (step === 3) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 p-6">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === step
                  ? "w-10 bg-gradient-to-r from-emerald-500 to-teal-500"
                  : index < step
                  ? "w-1.5 bg-emerald-400"
                  : "w-1.5 bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-6 pt-8">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-8 w-fit mb-6 shadow-xl">
            <User className="w-12 h-12 text-white" strokeWidth={1.5} />
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 leading-tight">
            Qual é o seu nome?
          </h1>
          <p className="text-base text-gray-600 mb-8">
            Vamos personalizar sua experiência
          </p>

          <input
            type="text"
            value={userData.name}
            onChange={(e) => updateUserData("name", e.target.value)}
            placeholder="Digite seu nome"
            className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all shadow-sm"
            autoFocus
          />
        </div>

        {/* Actions */}
        <div className="p-6">
          <button
            onClick={handleNext}
            disabled={!isFormValid()}
            className={`w-full font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
              isFormValid()
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            Continuar
            <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    );
  }

  // Form Step 2: Data de Nascimento (step 4)
  if (step === 4) {
    // Função para calcular idade baseado na data de nascimento
    const calculateAge = (birthDate: string) => {
      if (!birthDate) return "";
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age.toString();
    };

    const handleBirthDateChange = (date: string) => {
      updateUserData("birthDate", date);
      // Calcula e atualiza a idade automaticamente
      const calculatedAge = calculateAge(date);
      updateUserData("age", calculatedAge);
    };

    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <div className="flex justify-center gap-2 p-6">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === step
                  ? "w-10 bg-gradient-to-r from-emerald-500 to-teal-500"
                  : index < step
                  ? "w-1.5 bg-emerald-400"
                  : "w-1.5 bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col px-6 pt-8">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-3xl p-8 w-fit mb-6 shadow-xl">
            <Calendar className="w-12 h-12 text-white" strokeWidth={1.5} />
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2 leading-tight">
            Quando você nasceu?
          </h1>
          <p className="text-base text-gray-600 mb-8">
            Vamos calcular sua idade automaticamente
          </p>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              Data de Nascimento
            </label>
            <input
              type="date"
              value={userData.birthDate}
              onChange={(e) => handleBirthDateChange(e.target.value)}
              className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100 transition-all shadow-sm"
              max={new Date().toISOString().split('T')[0]} // Não permite datas futuras
            />
            
            {userData.age && (
              <div className="mt-4 p-4 bg-cyan-50 border-2 border-cyan-200 rounded-2xl">
                <p className="text-sm text-cyan-700 font-medium">
                  Você tem <span className="text-2xl font-bold text-cyan-600">{userData.age}</span> anos
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <button
            onClick={handleNext}
            disabled={!isFormValid()}
            className={`w-full font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
              isFormValid()
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-cyan-500/40 hover:shadow-cyan-500/60 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            Continuar
            <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    );
  }

  // Form Step 3: Altura e Peso (step 5)
  if (step === 5) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <div className="flex justify-center gap-2 p-6">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === step
                  ? "w-10 bg-gradient-to-r from-emerald-500 to-teal-500"
                  : index < step
                  ? "w-1.5 bg-emerald-400"
                  : "w-1.5 bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col px-6 pt-8">
          <div className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl p-8 w-fit mb-6 shadow-xl">
            <Ruler className="w-12 h-12 text-white" strokeWidth={1.5} />
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2 leading-tight">
            Suas medidas
          </h1>
          <p className="text-base text-gray-600 mb-8">
            Precisamos saber sua altura e peso atual
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                Altura (cm)
              </label>
              <input
                type="number"
                value={userData.height}
                onChange={(e) => updateUserData("height", e.target.value)}
                placeholder="Ex: 175"
                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 transition-all shadow-sm"
                min="1"
                max="300"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                Peso (kg)
              </label>
              <input
                type="number"
                value={userData.weight}
                onChange={(e) => updateUserData("weight", e.target.value)}
                placeholder="Ex: 70"
                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 transition-all shadow-sm"
                min="1"
                max="500"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <button
            onClick={handleNext}
            disabled={!isFormValid()}
            className={`w-full font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
              isFormValid()
                ? "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-teal-500/40 hover:shadow-teal-500/60 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            Continuar
            <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    );
  }

  // Form Step 4: Objetivo (step 6)
  if (step === 6) {
    const goals = [
      { 
        id: "lose", 
        label: "Emagrecer", 
        icon: TrendingUp,
        gradient: "from-orange-500 to-red-500",
        bgGradient: "from-orange-50 to-red-50"
      },
      { 
        id: "gain", 
        label: "Ganhar Massa", 
        icon: Dumbbell,
        gradient: "from-emerald-500 to-teal-500",
        bgGradient: "from-emerald-50 to-teal-50"
      },
      { 
        id: "maintain", 
        label: "Manter Peso", 
        icon: Target,
        gradient: "from-blue-500 to-cyan-500",
        bgGradient: "from-blue-50 to-cyan-50"
      },
    ];

    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <div className="flex justify-center gap-2 p-6">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === step
                  ? "w-10 bg-gradient-to-r from-emerald-500 to-teal-500"
                  : index < step
                  ? "w-1.5 bg-emerald-400"
                  : "w-1.5 bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col px-6 pt-8">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-8 w-fit mb-6 shadow-xl">
            <Target className="w-12 h-12 text-white" strokeWidth={1.5} />
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 leading-tight">
            Qual é o seu objetivo?
          </h1>
          <p className="text-base text-gray-600 mb-8">
            Escolha o que melhor descreve sua meta
          </p>

          <div className="space-y-4">
            {goals.map((goal) => {
              const Icon = goal.icon;
              const isSelected = userData.goal === goal.id;
              return (
                <button
                  key={goal.id}
                  onClick={() => updateUserData("goal", goal.id)}
                  className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 ${
                    isSelected
                      ? `border-transparent bg-gradient-to-r ${goal.gradient} shadow-lg scale-[1.02]`
                      : `border-gray-200 bg-white hover:border-gray-300 hover:shadow-md`
                  }`}
                >
                  <div className={`rounded-xl p-3 ${isSelected ? "bg-white/20" : `bg-gradient-to-br ${goal.bgGradient}`}`}>
                    <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-gray-700"}`} strokeWidth={2} />
                  </div>
                  <span className={`text-lg font-bold flex-1 text-left ${isSelected ? "text-white" : "text-gray-900"}`}>
                    {goal.label}
                  </span>
                  {isSelected && (
                    <div className="bg-white rounded-full p-1.5">
                      <Check className="w-5 h-5 text-emerald-600" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          <button
            onClick={handleNext}
            disabled={!isFormValid()}
            className={`w-full font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
              isFormValid()
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            Continuar
            <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    );
  }

  // Final Step: Resumo (step 7)
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <div className="flex justify-center gap-2 p-6">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === step
                ? "w-10 bg-gradient-to-r from-emerald-500 to-teal-500"
                : index < step
                ? "w-1.5 bg-emerald-400"
                : "w-1.5 bg-gray-200"
            }`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col px-6 pt-8">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-8 w-fit mb-6 shadow-xl">
          <Sparkles className="w-12 h-12 text-white" strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 leading-tight">
          Tudo pronto, {userData.name}!
        </h1>
        <p className="text-base text-gray-600 mb-8">
          Confira suas informações antes de começar
        </p>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 space-y-4 border-2 border-gray-100 shadow-xl">
          <div className="flex justify-between items-center py-3 px-2">
            <span className="text-gray-600 text-sm font-medium">Nome</span>
            <span className="font-bold text-gray-900">{userData.name}</span>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          <div className="flex justify-between items-center py-3 px-2">
            <span className="text-gray-600 text-sm font-medium">Idade</span>
            <span className="font-bold text-gray-900">{userData.age} anos</span>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          <div className="flex justify-between items-center py-3 px-2">
            <span className="text-gray-600 text-sm font-medium">Data de Nascimento</span>
            <span className="font-bold text-gray-900">
              {new Date(userData.birthDate).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          <div className="flex justify-between items-center py-3 px-2">
            <span className="text-gray-600 text-sm font-medium">Altura</span>
            <span className="font-bold text-gray-900">{userData.height} cm</span>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          <div className="flex justify-between items-center py-3 px-2">
            <span className="text-gray-600 text-sm font-medium">Peso</span>
            <span className="font-bold text-gray-900">{userData.weight} kg</span>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          <div className="flex justify-between items-center py-3 px-2">
            <span className="text-gray-600 text-sm font-medium">Objetivo</span>
            <span className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {userData.goal === "lose"
                ? "Emagrecer"
                : userData.goal === "gain"
                ? "Ganhar Massa"
                : "Manter Peso"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-[1.02] active:scale-[0.98]"
        >
          Começar Jornada
          <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
