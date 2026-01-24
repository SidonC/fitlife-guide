"use client";

import { useState, useEffect } from "react";
import { Apple, Plus, Trash2 } from "lucide-react";

interface Food {
  id: string;
  name: string;
  quantity: string;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export default function NutritionTab() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("fitlife_nutrition");
    if (saved) {
      setFoods(JSON.parse(saved));
    }
  }, []);

  const handleAddFood = () => {
    if (!formData.name || !formData.quantity) return;

    const newFood: Food = {
      id: Date.now().toString(),
      name: formData.name,
      quantity: formData.quantity,
      protein: Number(formData.protein) || 0,
      carbs: Number(formData.carbs) || 0,
      fat: Number(formData.fat) || 0,
      fiber: Number(formData.fiber) || 0,
    };

    const updated = [...foods, newFood];
    setFoods(updated);
    localStorage.setItem("fitlife_nutrition", JSON.stringify(updated));
    setFormData({
      name: "",
      quantity: "",
      protein: "",
      carbs: "",
      fat: "",
      fiber: "",
    });
    setShowForm(false);
  };

  const handleDeleteFood = (id: string) => {
    const updated = foods.filter((food) => food.id !== id);
    setFoods(updated);
    localStorage.setItem("fitlife_nutrition", JSON.stringify(updated));
  };

  const totals = foods.reduce(
    (acc, food) => ({
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat,
      fiber: acc.fiber + food.fiber,
    }),
    { protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-xl">
            <Apple className="w-6 h-6 text-emerald-600" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Alimentação</h2>
            <p className="text-sm text-gray-500">Registre suas refeições</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200"
        >
          <Plus className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>

      {/* Add Food Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Adicionar Alimento
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nome do alimento"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
            />
            <input
              type="text"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              placeholder="Quantidade (ex: 100g, 1 unidade)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={formData.protein}
                onChange={(e) =>
                  setFormData({ ...formData, protein: e.target.value })
                }
                placeholder="Proteínas (g)"
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
              <input
                type="number"
                value={formData.carbs}
                onChange={(e) =>
                  setFormData({ ...formData, carbs: e.target.value })
                }
                placeholder="Carboidratos (g)"
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
              <input
                type="number"
                value={formData.fat}
                onChange={(e) =>
                  setFormData({ ...formData, fat: e.target.value })
                }
                placeholder="Gorduras (g)"
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
              <input
                type="number"
                value={formData.fiber}
                onChange={(e) =>
                  setFormData({ ...formData, fiber: e.target.value })
                }
                placeholder="Fibras (g)"
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddFood}
                className="flex-1 bg-emerald-500 text-white rounded-xl py-3 font-semibold hover:bg-emerald-600 transition-all duration-200"
              >
                Adicionar
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 bg-gray-100 text-gray-700 rounded-xl py-3 font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Totals */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Total Diário
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <p className="text-xs text-gray-600 mb-1">Proteínas</p>
            <p className="text-2xl font-bold text-emerald-700">
              {totals.protein}g
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">Carboidratos</p>
            <p className="text-2xl font-bold text-blue-700">{totals.carbs}g</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <p className="text-xs text-gray-600 mb-1">Gorduras</p>
            <p className="text-2xl font-bold text-orange-700">{totals.fat}g</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <p className="text-xs text-gray-600 mb-1">Fibras</p>
            <p className="text-2xl font-bold text-purple-700">
              {totals.fiber}g
            </p>
          </div>
        </div>
      </div>

      {/* Food List */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Alimentos de Hoje
        </h3>
        {foods.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            Nenhum alimento registrado ainda. Adicione sua primeira refeição!
          </p>
        ) : (
          <div className="space-y-3">
            {foods.map((food) => (
              <div
                key={food.id}
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      {food.name}
                    </h4>
                    <p className="text-xs text-gray-500">{food.quantity}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteFood(food.id)}
                    className="p-1 hover:bg-white rounded-lg transition-colors"
                  >
                    <Trash2
                      className="w-4 h-4 text-gray-400 hover:text-red-500"
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">P: </span>
                    <span className="font-medium text-gray-900">
                      {food.protein}g
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">C: </span>
                    <span className="font-medium text-gray-900">
                      {food.carbs}g
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">G: </span>
                    <span className="font-medium text-gray-900">
                      {food.fat}g
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">F: </span>
                    <span className="font-medium text-gray-900">
                      {food.fiber}g
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
