"use client";

import { useState } from "react";
import { ChevronRight, Dumbbell, Apple, TrendingUp, User, Calendar, Target, Ruler, Check, Sparkles } from "lucide-react";

interface OnboardingFlowProps {
  onComplete: (userData: UserData) => void;
}

interface UserData {
  id: string;
  name: string;
  age: string;
  birthDate: string;
  height: string;
  weight: string;
  goal: string;
  isPremium: boolean;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
  id: "",
  name: "",
  age: "",
  birthDate: "",
  height: "",
  weight: "",
  goal: "",
  isPremium: false,
});
  const welcomeScreens = [
    {
      icon: Dumbbell,
      title: "Bem-vindo ao FitLife Guide",
      description: "Seu companheiro perfeito para iniciar sua jornada fitness de forma simples e eficaz",
      showLogo: true,
    },
    {
      icon: Apple,
      title: "Acompanhe sua Alimentação",
      description: "Registre seus alimentos e monitore seus macronutrientes de forma prática",
      showLogo: false,
    },
    {
      icon: TrendingUp,
      title: "Evolua Constantemente",
      description: "Acompanhe seu progresso e veja sua evolução ao longo do tempo",
      showLogo: false,
    },
  ];

  const totalSteps = welcomeScreens.length + 5;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onComplete({
  ...userData,
  id: crypto.randomUUID(),
  isPremium: false,
});
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
    if (step === 4) return userData.age.trim() !== "" && userData.birthDate.trim() !== "";
    if (step === 5) return userData.height.trim() !== "" && userData.weight.trim() !== "";
    if (step === 6) return userData.goal.trim() !== "";
    return true;
  };

  // Welcome screens (0-2)
  if (step < welcomeScreens.length) {
    const currentScreen = welcomeScreens[step];
    const Icon = currentScreen.icon;

    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 p-6">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === step
                  ? "w-8 bg-emerald-500"
                  : index < step
                  ? "w-1 bg-emerald-300"
                  : "w-1 bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          {currentScreen.showLogo ? (
            // Logo circular com animação na primeira tela (mesmo do header)
            <div className="mb-8 animate-[fadeIn_0.8s_ease-out,zoomIn_0.8s_ease-out]">
              <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                <img 
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/045ea64b-bf92-4f6a-9fe1-259814e3fb97.png" 
                  alt="FitLife Guide Logo" 
                  className="w-44 h-44 rounded-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-3xl p-12 mb-8">
              <Icon className="w-20 h-20 text-emerald-600" strokeWidth={1.5} />
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight max-w-md">
            {currentScreen.title}
          </h1>

          <p className="text-base text-gray-600 leading-relaxed max-w-sm mb-4">
            {currentScreen.description}
          </p>

          {currentScreen.showLogo && (
            <p className="text-lg font-semibold text-emerald-600 animate-[fadeIn_1.2s_ease-out]">
              Sua jornada fitness começa aqui.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 space-y-3">
          <button
            onClick={handleNext}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            Próximo
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </button>

          <button
            onClick={handleSkipWelcome}
            className="w-full text-gray-500 hover:text-gray-700 font-medium py-3 rounded-2xl transition-all duration-200"
          >
            Pular
          </button>
        </div>
      </div>
    );
  }

  // Form Step 1: Nome (step 3)
  if (step === 3) {
    return (
      <div className="flex flex-col h-screen bg-white">
        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 p-6">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === step
                  ? "w-8 bg-emerald-500"
                  : index < step
                  ? "w-1 bg-emerald-300"
                  : "w-1 bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-6 pt-8">
          <div className="bg-emerald-50 rounded-2xl p-8 w-fit mb-6">
            <User className="w-12 h-12 text-emerald-600" strokeWidth={1.5} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
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
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
            autoFocus
          />
        </div>

        {/* Actions */}
        <div className="p-6">
          <button
            onClick={handleNext}
            disabled={!isFormValid()}
            className={`w-full font-semibold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 ${
              isFormValid()
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continuar
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  }

  // Form Step 2: Idade e Data de Nascimento (step 4)
  if (step === 4) {
    return (
      <div className="flex flex-col h-screen bg-white">
        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 p-6">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === step
                  ? "w-8 bg-emerald-500"
                  : index < step
                  ? "w-1 bg-emerald-300"
                  : "w-1 bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-6 pt-8">
          <div className="bg-emerald-50 rounded-2xl p-8 w-fit mb-6">
            <Calendar className="w-12 h-12 text-emerald-600" strokeWidth={1.5} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
            Quantos anos você tem?
          </h1>
          <p className="text-base text-gray-600 mb-8">
            Isso nos ajuda a personalizar suas metas
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Idade
              </label>
              <input
                type="number"
                value={userData.age}
                onChange={(e) => updateUserData("age", e.target.value)}
                placeholder="Ex: 25"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                min="1"
                max="120"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={userData.birthDate}
                onChange={(e) => updateUserData("birthDate", e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6">
          <button
            onClick={handleNext}
            disabled={!isFormValid()}
            className={`w-full font-semibold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 ${
              isFormValid()
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continuar
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  }

  // Form Step 3: Altura e Peso (step 5)
  if (step === 5) {
    return (
      <div className="flex flex-col h-screen bg-white">
        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 p-6">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === step
                  ? "w-8 bg-emerald-500"
                  : index < step
                  ? "w-1 bg-emerald-300"
                  : "w-1 bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-6 pt-8">
          <div className="bg-emerald-50 rounded-2xl p-8 w-fit mb-6">
            <Ruler className="w-12 h-12 text-emerald-600" strokeWidth={1.5} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
            Suas medidas
          </h1>
          <p className="text-base text-gray-600 mb-8">
            Precisamos saber sua altura e peso atual
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Altura (cm)
              </label>
              <input
                type="number"
                value={userData.height}
                onChange={(e) => updateUserData("height", e.target.value)}
                placeholder="Ex: 175"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                min="1"
                max="300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Peso (kg)
              </label>
              <input
                type="number"
                value={userData.weight}
                onChange={(e) => updateUserData("weight", e.target.value)}
                placeholder="Ex: 70"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                min="1"
                max="500"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6">
          <button
            onClick={handleNext}
            disabled={!isFormValid()}
            className={`w-full font-semibold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 ${
              isFormValid()
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continuar
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  }

  // Form Step 4: Objetivo (step 6)
  if (step === 6) {
    const goals = [
      { id: "lose", label: "Emagrecer", icon: TrendingUp },
      { id: "gain", label: "Ganhar Massa", icon: Dumbbell },
      { id: "maintain", label: "Manter Peso", icon: Target },
    ];

    return (
      <div className="flex flex-col h-screen bg-white">
        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 p-6">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === step
                  ? "w-8 bg-emerald-500"
                  : index < step
                  ? "w-1 bg-emerald-300"
                  : "w-1 bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-6 pt-8">
          <div className="bg-emerald-50 rounded-2xl p-8 w-fit mb-6">
            <Target className="w-12 h-12 text-emerald-600" strokeWidth={1.5} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
            Qual é o seu objetivo?
          </h1>
          <p className="text-base text-gray-600 mb-8">
            Escolha o que melhor descreve sua meta
          </p>

          <div className="space-y-3">
            {goals.map((goal) => {
              const Icon = goal.icon;
              const isSelected = userData.goal === goal.id;
              return (
                <button
                  key={goal.id}
                  onClick={() => updateUserData("goal", goal.id)}
                  className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className={`rounded-xl p-3 ${isSelected ? "bg-emerald-500" : "bg-gray-100"}`}>
                    <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-gray-600"}`} strokeWidth={1.5} />
                  </div>
                  <span className={`text-lg font-semibold flex-1 text-left ${isSelected ? "text-emerald-700" : "text-gray-900"}`}>
                    {goal.label}
                  </span>
                  {isSelected && (
                    <div className="bg-emerald-500 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6">
          <button
            onClick={handleNext}
            disabled={!isFormValid()}
            className={`w-full font-semibold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 ${
              isFormValid()
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continuar
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  }

  // Final Step: Resumo (step 7)
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Progress Indicators */}
      <div className="flex justify-center gap-2 p-6">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === step
                ? "w-8 bg-emerald-500"
                : index < step
                ? "w-1 bg-emerald-300"
                : "w-1 bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pt-8">
        <div className="bg-emerald-50 rounded-2xl p-8 w-fit mb-6">
          <Sparkles className="w-12 h-12 text-emerald-600" strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
          Tudo pronto, {userData.name}!
        </h1>
        <p className="text-base text-gray-600 mb-8">
          Confira suas informações antes de começar
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-200">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 text-sm">Nome</span>
            <span className="font-semibold text-gray-900">{userData.name}</span>
          </div>
          <div className="h-px bg-gray-200"></div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 text-sm">Idade</span>
            <span className="font-semibold text-gray-900">{userData.age} anos</span>
          </div>
          <div className="h-px bg-gray-200"></div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 text-sm">Data de Nascimento</span>
            <span className="font-semibold text-gray-900">
              {new Date(userData.birthDate).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className="h-px bg-gray-200"></div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 text-sm">Altura</span>
            <span className="font-semibold text-gray-900">{userData.height} cm</span>
          </div>
          <div className="h-px bg-gray-200"></div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 text-sm">Peso</span>
            <span className="font-semibold text-gray-900">{userData.weight} kg</span>
          </div>
          <div className="h-px bg-gray-200"></div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 text-sm">Objetivo</span>
            <span className="font-semibold text-gray-900">
              {userData.goal === "lose"
                ? "Emagrecer"
                : userData.goal === "gain"
                ? "Ganhar Massa"
                : "Manter Peso"}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6">
        <button
          onClick={handleNext}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          Começar Jornada
          <ChevronRight className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
