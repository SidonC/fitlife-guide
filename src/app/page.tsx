"use client";

import { supabase } from "../lib/supabaseClient";
import AuthFlow from "./components/AuthFlow";
import { useState, useEffect } from "react";
import { User, TrendingUp, Pill, ShoppingBag, Dumbbell, UserRound } from "lucide-react";
import OnboardingFlow from "./components/OnboardingFlow";
import PremiumChoice from "./components/PremiumChoice";
import PaymentFlow from "./components/PaymentFlow";
import InstallPrompt from "./components/InstallPrompt";
import NutritionRecommendations from "./components/NutritionRecommendations";
import ProfileTab from "./components/ProfileTab";
import ProgressTab from "./components/ProgressTab";
import SupplementsTab from "./components/SupplementsTab";
import OffersTab from "./components/OffersTab";
import ExercisesTab from "./components/ExercisesTab";
import NutritionistTab from "./components/NutritionistTab";

type Tab = "progress" | "supplements" | "offers" | "profile" | "exercises" | "nutritionist";
type AppState = "auth" | "onboarding" | "nutrition" | "premiumChoice" | "payment" | "install" | "main";

interface UserData {
  name: string;
  age: string;
  birthDate: string;
  height: string;
  weight: string;
  goal: string;
}

export default function FitLifeGuide() {
  const [appState, setAppState] = useState<AppState>("auth");
  const [activeTab, setActiveTab] = useState<Tab>("progress");
  const [hasProfile, setHasProfile] = useState(false);
  const [userGoal, setUserGoal] = useState<string>("lose");
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Monitora mudanças no estado de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        // Nenhum usuário logado, volta para tela de autenticação
        setAppState("auth");
        return;
      }

      // Usuário está logado, busca o perfil dele na tabela profiles
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error);
        // Se não encontrar perfil, significa que precisa completar onboarding
        setAppState("onboarding");
        return;
      }

      if (profile) {
        // Perfil encontrado, carrega os dados e vai para tela principal
        setUserGoal(profile.goal || "lose");
        setIsPremium(profile.ispremium || false);
        setHasProfile(true);
        setAppState("main");
      } else {
        // Perfil não encontrado, vai para onboarding
        setAppState("onboarding");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Função chamada quando o usuário completa o formulário de autenticação
  const handleAuthSuccess = async (user: { id: string; email: string }) => {
    try {
      // Por enquanto, apenas vai para onboarding
      // A lógica real de signup/login está no AuthFlow
      setAppState("onboarding");
    } catch (err) {
      console.error("Erro na autenticação:", err);
    }
  };

  // Função chamada quando o usuário completa o onboarding
  const handleOnboardingComplete = async (userData: UserData) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Usuário não autenticado", userError);
      alert("Erro: usuário não encontrado. Por favor, faça login novamente.");
      setAppState("auth");
      return;
    }

    // Insere os dados do perfil na tabela profiles
    // IMPORTANTE: Usando nomes de campos exatamente como estão no banco
    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      name: userData.name,
      age: userData.age,
      birthdate: userData.birthDate, // Campo no banco é "birthdate" (tudo minúsculo)
      height: userData.height,
      weight: userData.weight,
      goal: userData.goal,
      ispremium: false, // Campo no banco é "ispremium" (tudo minúsculo)
    });

    if (error) {
      console.error("Erro ao salvar perfil:", error);
      alert(`Erro ao salvar perfil: ${error.message}`);
      return;
    }

    // Dados salvos com sucesso, continua o fluxo
    setUserGoal(userData.goal);
    setHasProfile(true);
    setAppState("nutrition");
  };

  const handleNutritionComplete = () => {
    localStorage.setItem("fitlife_seen_nutrition", "true");
    setAppState("premiumChoice");
  };

  const handleChoosePremium = () => {
    localStorage.setItem("fitlife_seen_premium_choice", "true");
    setAppState("payment");
  };

  const handleSkipPremium = () => {
    localStorage.setItem("fitlife_seen_premium_choice", "true");
    localStorage.setItem("fitlife_paid", "false");
    setIsPremium(false);
    setHasProfile(true);
    setAppState("install");
  };

  const handlePaymentComplete = () => {
    localStorage.setItem("fitlife_paid", "true");
    setIsPremium(true);
    setHasProfile(true);
    setAppState("install");
  };

  const handleInstallPromptComplete = () => {
    localStorage.setItem("fitlife_seen_install", "true");
    setAppState("main");
  };

  const handleGoalChanged = (newGoal: string) => {
    setUserGoal(newGoal);
  };

  // Tabs base
  const baseTabs = [
    { id: "progress" as Tab, label: "Evolução", icon: TrendingUp },
    { id: "supplements" as Tab, label: "Suplementos", icon: Pill },
    { id: "offers" as Tab, label: "Ofertas", icon: ShoppingBag },
    { id: "nutritionist" as Tab, label: "Nutricionista", icon: UserRound },
    { id: "profile" as Tab, label: "Perfil", icon: User },
  ];

  // Adiciona aba de exercícios se for premium
  const tabs = isPremium
    ? [
        baseTabs[0],
        { id: "exercises" as Tab, label: "Exercícios", icon: Dumbbell },
        ...baseTabs.slice(1),
      ]
    : baseTabs;

  if (appState === "auth") {
    return <AuthFlow onAuthSuccess={handleAuthSuccess} />;
  }

  if (appState === "onboarding") {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (appState === "nutrition") {
    return <NutritionRecommendations onComplete={handleNutritionComplete} />;
  }

  if (appState === "premiumChoice") {
    return (
      <PremiumChoice
        onChoosePremium={handleChoosePremium}
        onSkip={handleSkipPremium}
      />
    );
  }

  if (appState === "payment") {
    return <PaymentFlow onComplete={handlePaymentComplete} />;
  }

  if (appState === "install") {
    return <InstallPrompt onComplete={handleInstallPromptComplete} />;
  }

  return (
    <>
      {appState === "main" && (
        <div className="flex flex-col h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-gradient-to-br from-emerald-600 to-teal-700 border-b border-emerald-700/50 shadow-lg">
            <div className="flex items-center justify-center py-4 px-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
                  <img
                    src="/logo_round_small.png"
                    alt="FitLife Guide"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 pb-24">
            {activeTab === "profile" && (
              <ProfileTab
                onProfileSaved={() => setHasProfile(true)}
                onGoalChanged={handleGoalChanged}
              />
            )}
            {activeTab === "progress" && <ProgressTab />}
            {activeTab === "supplements" && <SupplementsTab />}
            {activeTab === "offers" && <OffersTab />}
            {activeTab === "nutritionist" && <NutritionistTab />}
            {activeTab === "exercises" && isPremium && <ExercisesTab />}
          </main>

          {/* Bottom Nav */}
          <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-emerald-600 to-teal-700 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
            <div className="flex justify-around items-center h-16 px-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                      isActive
                        ? "text-yellow-300 scale-110"
                        : "text-white/80 hover:text-white hover:scale-105"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isActive
                          ? "drop-shadow-[0_2px_8px_rgba(253,224,71,0.5)]"
                          : ""
                      }`}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    <span className="text-[10px] font-semibold">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
