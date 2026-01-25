"use client";

import { useState, useEffect } from "react";
import { Pill, Plus, X, Flame, Gem, Star, TrendingUp, CheckCircle2, Check, Edit2 } from "lucide-react";

interface SupplementIntake {
  supplementId: string;
  date: string;
  amount: number;
  unit: string;
  time: string;
}

interface Supplement {
  id: string;
  name: string;
  icon: string;
  dailyGoal: number;
  unit: string;
  color: string;
}

const AVAILABLE_SUPPLEMENTS: Supplement[] = [
  { id: "creatina", name: "Creatina", icon: "💪", dailyGoal: 5, unit: "g", color: "from-blue-50 to-blue-100" },
  { id: "whey", name: "Whey Protein", icon: "🥤", dailyGoal: 30, unit: "g", color: "from-purple-50 to-purple-100" },
  { id: "bcaa", name: "BCAA", icon: "⚡", dailyGoal: 5, unit: "g", color: "from-green-50 to-green-100" },
  { id: "omega3", name: "Ômega 3", icon: "🐟", dailyGoal: 2, unit: "cápsulas", color: "from-cyan-50 to-cyan-100" },
  { id: "multi", name: "Multivitamínico", icon: "💊", dailyGoal: 1, unit: "cápsula", color: "from-orange-50 to-orange-100" },
  { id: "vitamina-d", name: "Vitamina D", icon: "☀️", dailyGoal: 1, unit: "cápsula", color: "from-yellow-50 to-yellow-100" },
  { id: "magnesio", name: "Magnésio", icon: "⚗️", dailyGoal: 1, unit: "cápsula", color: "from-indigo-50 to-indigo-100" },
  { id: "colageno", name: "Colágeno", icon: "✨", dailyGoal: 10, unit: "g", color: "from-pink-50 to-pink-100" },
  { id: "cafeina", name: "Cafeína", icon: "☕", dailyGoal: 200, unit: "mg", color: "from-amber-50 to-amber-100" },
  { id: "glutamina", name: "Glutamina", icon: "🔋", dailyGoal: 5, unit: "g", color: "from-teal-50 to-teal-100" },
];

export default function SupplementsTab() {
  const [selectedSupplements, setSelectedSupplements] = useState<Supplement[]>([]);
  const [intakes, setIntakes] = useState<SupplementIntake[]>([]);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);
  const [modalData, setModalData] = useState({ amount: "", unit: "", time: "" });
  const [editingDosage, setEditingDosage] = useState<string | null>(null);
  const [newDosage, setNewDosage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const savedSupplements = localStorage.getItem("fitlife_selected_supplements");
    const savedIntakes = localStorage.getItem("fitlife_supplement_intakes");
    
    if (savedSupplements) {
      setSelectedSupplements(JSON.parse(savedSupplements));
    }
    
    if (savedIntakes) {
      setIntakes(JSON.parse(savedIntakes));
    }
  }, []);

  const handleToggleSupplement = (supplement: Supplement) => {
    const isSelected = selectedSupplements.some((s) => s.id === supplement.id);
    
    let updated: Supplement[];
    if (isSelected) {
      updated = selectedSupplements.filter((s) => s.id !== supplement.id);
    } else {
      updated = [...selectedSupplements, supplement];
    }
    
    setSelectedSupplements(updated);
    localStorage.setItem("fitlife_selected_supplements", JSON.stringify(updated));
  };

  const handleUpdateDosage = (supplementId: string) => {
    if (!newDosage || isNaN(Number(newDosage))) return;

    const updated = selectedSupplements.map((supp) =>
      supp.id === supplementId
        ? { ...supp, dailyGoal: Number(newDosage) }
        : supp
    );

    setSelectedSupplements(updated);
    localStorage.setItem("fitlife_selected_supplements", JSON.stringify(updated));
    setEditingDosage(null);
    setNewDosage("");
  };

  const getTodayIntake = (supplementId: string) => {
    return intakes
      .filter((intake) => intake.supplementId === supplementId && intake.date === today)
      .reduce((sum, intake) => sum + intake.amount, 0);
  };

  const getWeeklyConsistency = () => {
    if (selectedSupplements.length === 0) return 0;
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    });

    let totalPossible = selectedSupplements.length * 7;
    let totalCompleted = 0;

    last7Days.forEach((date) => {
      selectedSupplements.forEach((supp) => {
        const dayIntake = intakes
          .filter((intake) => intake.supplementId === supp.id && intake.date === date)
          .reduce((sum, intake) => sum + intake.amount, 0);
        if (dayIntake >= supp.dailyGoal) {
          totalCompleted++;
        }
      });
    });

    return Math.round((totalCompleted / totalPossible) * 100);
  };

  const getConsecutiveDays = () => {
    if (selectedSupplements.length === 0) return 0;
    
    let consecutive = 0;
    let currentDate = new Date();
    
    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const allCompleted = selectedSupplements.every((supp) => {
        const dayIntake = intakes
          .filter((intake) => intake.supplementId === supp.id && intake.date === dateStr)
          .reduce((sum, intake) => sum + intake.amount, 0);
        return dayIntake >= supp.dailyGoal;
      });
      
      if (!allCompleted) break;
      consecutive++;
      currentDate.setDate(currentDate.getDate() - 1);
      if (consecutive > 365) break;
    }
    
    return consecutive;
  };

  const handleOpenIntakeModal = (supplement: Supplement) => {
    setSelectedSupplement(supplement);
    setModalData({ amount: "", unit: supplement.unit, time: new Date().toTimeString().slice(0, 5) });
    setShowIntakeModal(true);
  };

  const handleRegister = () => {
    if (!selectedSupplement || !modalData.amount) return;

    const newIntake: SupplementIntake = {
      supplementId: selectedSupplement.id,
      date: today,
      amount: parseFloat(modalData.amount),
      unit: modalData.unit,
      time: modalData.time,
    };

    const updated = [...intakes, newIntake];
    setIntakes(updated);
    localStorage.setItem("fitlife_supplement_intakes", JSON.stringify(updated));
    
    setShowIntakeModal(false);
    setSelectedSupplement(null);
    setModalData({ amount: "", unit: "", time: "" });
  };

  const weeklyConsistency = getWeeklyConsistency();
  const consecutiveDays = getConsecutiveDays();

  const getConsistencyBadge = () => {
    if (weeklyConsistency >= 90) return { icon: <Gem className="w-6 h-6" />, text: "Diamante", color: "from-cyan-500 to-blue-500" };
    if (weeklyConsistency >= 70) return { icon: <Flame className="w-6 h-6" />, text: "Fogo", color: "from-orange-500 to-red-500" };
    return { icon: <Star className="w-6 h-6" />, text: "Estrela", color: "from-yellow-500 to-amber-500" };
  };

  const badge = getConsistencyBadge();

  const getInsight = () => {
    if (selectedSupplements.length === 0) {
      return { text: "Adicione seus suplementos para começar o acompanhamento!", color: "from-blue-50 to-indigo-50 border-blue-200" };
    }
    
    const completedToday = selectedSupplements.filter((supp) => getTodayIntake(supp.id) >= supp.dailyGoal);
    
    if (completedToday.length === selectedSupplements.length) {
      return { text: "Todos os suplementos tomados hoje! 💪", color: "from-emerald-50 to-green-50 border-emerald-200" };
    }
    
    if (weeklyConsistency >= 80) {
      return { text: `Consistência semanal: ${weeklyConsistency}% - Excelente! 🔥`, color: "from-blue-50 to-indigo-50 border-blue-200" };
    }
    
    const missing = selectedSupplements.find((supp) => getTodayIntake(supp.id) < supp.dailyGoal);
    if (missing) {
      return { text: `Não esqueça de tomar ${missing.name} hoje!`, color: "from-amber-50 to-orange-50 border-amber-200" };
    }
    
    return { text: "Continue assim! Consistência é a chave 💎", color: "from-purple-50 to-pink-50 border-purple-200" };
  };

  const insight = getInsight();

  // Estado inicial - sem suplementos selecionados
  if (selectedSupplements.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header Premium */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Pill className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Suplementos</h2>
              <p className="text-sm text-white/90">Controle diário e consistência semanal</p>
            </div>
          </div>
        </div>

        {/* Card Estado Vazio */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
          <div className="max-w-sm mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pill className="w-10 h-10 text-emerald-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Você ainda não selecionou seus suplementos
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Escolha os suplementos que você utiliza para começar o acompanhamento diário
            </p>
            <button
              onClick={() => setShowSelectionModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-bold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Adicionar Suplementos
            </button>
          </div>
        </div>

        {/* Modal de Seleção */}
        {showSelectionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Selecione seus Suplementos</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Escolha os suplementos que você utiliza no dia a dia
                  </p>
                </div>
                <button
                  onClick={() => setShowSelectionModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAILABLE_SUPPLEMENTS.map((supplement) => {
                  const isSelected = selectedSupplements.some((s) => s.id === supplement.id);
                  
                  return (
                    <button
                      key={supplement.id}
                      onClick={() => handleToggleSupplement(supplement)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl">{supplement.icon}</div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-900">{supplement.name}</p>
                        <p className="text-xs text-gray-600">
                          {supplement.dailyGoal} {supplement.unit}/dia
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowSelectionModal(false)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl py-3 font-bold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200"
                >
                  Confirmar Seleção ({selectedSupplements.length})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Estado com suplementos selecionados
  return (
    <div className="space-y-6">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Pill className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Suplementos</h2>
              <p className="text-sm text-white/90">Controle diário e consistência semanal</p>
            </div>
          </div>
          <button
            onClick={() => setShowSelectionModal(true)}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold backdrop-blur-sm transition-colors"
          >
            Gerenciar
          </button>
        </div>
      </div>

      {/* Cards de Suplementos - Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {selectedSupplements.map((supplement) => {
          const todayIntake = getTodayIntake(supplement.id);
          const progress = Math.min((todayIntake / supplement.dailyGoal) * 100, 100);
          const isCompleted = todayIntake >= supplement.dailyGoal;
          const isEditing = editingDosage === supplement.id;

          return (
            <div
              key={supplement.id}
              className={`bg-gradient-to-br ${supplement.color} border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300`}
            >
              {/* Ícone e Nome */}
              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl">{supplement.icon}</div>
                {isCompleted && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" strokeWidth={2} />
                )}
              </div>

              <h3 className="text-sm font-bold text-gray-900 mb-1">{supplement.name}</h3>
              
              {/* Dosagem Editável */}
              <div className="mb-3">
                {isEditing ? (
                  <div className="flex gap-1 mb-2">
                    <input
                      type="number"
                      value={newDosage}
                      onChange={(e) => setNewDosage(e.target.value)}
                      placeholder={supplement.dailyGoal.toString()}
                      className="flex-1 bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs text-gray-900 focus:outline-none focus:border-emerald-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdateDosage(supplement.id)}
                      className="px-2 py-1 bg-emerald-500 text-white rounded-lg text-xs font-semibold hover:bg-emerald-600"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => {
                        setEditingDosage(null);
                        setNewDosage("");
                      }}
                      className="px-2 py-1 bg-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-400"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>{todayIntake}{supplement.unit}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{supplement.dailyGoal}{supplement.unit}</span>
                      <button
                        onClick={() => {
                          setEditingDosage(supplement.id);
                          setNewDosage(supplement.dailyGoal.toString());
                        }}
                        className="p-0.5 hover:bg-white/50 rounded transition-colors"
                      >
                        <Edit2 className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                )}
                <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isCompleted ? "bg-emerald-500" : "bg-gray-400"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Status e Botão */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${isCompleted ? "text-emerald-700" : "text-gray-500"}`}>
                  {isCompleted ? "Completo" : "Pendente"}
                </span>
                <button
                  onClick={() => handleOpenIntakeModal(supplement)}
                  className="p-1.5 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4 text-gray-700" strokeWidth={2} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insight do Dia */}
      <div className={`bg-gradient-to-br ${insight.color} border rounded-2xl p-5`}>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/50 rounded-xl">
            <TrendingUp className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Insight do Dia</p>
            <p className="text-xs text-gray-700">{insight.text}</p>
          </div>
        </div>
      </div>

      {/* Consistência Semanal */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Consistência Semanal</p>
            <p className="text-3xl font-bold text-gray-900">{weeklyConsistency}%</p>
            <p className="text-xs text-gray-500 mt-1">{consecutiveDays} dias seguidos</p>
          </div>
          <div className={`p-4 bg-gradient-to-br ${badge.color} rounded-2xl text-white`}>
            {badge.icon}
          </div>
        </div>
        
        {/* Badge */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1.5 bg-gradient-to-r ${badge.color} text-white rounded-full text-xs font-bold flex items-center gap-1.5`}>
              {badge.icon}
              <span>{badge.text}</span>
            </div>
            <p className="text-xs text-gray-500">Seu nível atual</p>
          </div>
        </div>
      </div>

      {/* Modal de Seleção de Suplementos */}
      {showSelectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Selecione seus Suplementos</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Escolha os suplementos que você utiliza no dia a dia
                </p>
              </div>
              <button
                onClick={() => setShowSelectionModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AVAILABLE_SUPPLEMENTS.map((supplement) => {
                const isSelected = selectedSupplements.some((s) => s.id === supplement.id);
                
                return (
                  <button
                    key={supplement.id}
                    onClick={() => handleToggleSupplement(supplement)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl">{supplement.icon}</div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900">{supplement.name}</p>
                      <p className="text-xs text-gray-600">
                        {supplement.dailyGoal} {supplement.unit}/dia
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowSelectionModal(false)}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl py-3 font-bold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200"
              >
                Confirmar Seleção ({selectedSupplements.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Registro de Consumo */}
      {showIntakeModal && selectedSupplement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Registrar {selectedSupplement.name}
              </h3>
              <button
                onClick={() => setShowIntakeModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantidade
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={modalData.amount}
                    onChange={(e) => setModalData({ ...modalData, amount: e.target.value })}
                    placeholder="0"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                  <div className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-700 font-semibold">
                    {modalData.unit}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Horário (opcional)
                </label>
                <input
                  type="time"
                  value={modalData.time}
                  onChange={(e) => setModalData({ ...modalData, time: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <button
                onClick={handleRegister}
                disabled={!modalData.amount}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl py-3 font-bold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
