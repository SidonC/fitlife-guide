"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Food {
  id: string;
  name: string;
  quantity: string;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
}

export default function FoodTab() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    protein: "",
    carbs: "",
    fats: "",
    fiber: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("fitlife_foods");
    if (saved) {
      setFoods(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFood: Food = {
      id: Date.now().toString(),
      name: formData.name,
      quantity: formData.quantity,
      protein: Number(formData.protein),
      carbs: Number(formData.carbs),
      fats: Number(formData.fats),
      fiber: Number(formData.fiber),
    };

    const updatedFoods = [...foods, newFood];
    setFoods(updatedFoods);
    localStorage.setItem("fitlife_foods", JSON.stringify(updatedFoods));

    setFormData({
      name: "",
      quantity: "",
      protein: "",
      carbs: "",
      fats: "",
      fiber: "",
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const updatedFoods = foods.filter((food) => food.id !== id);
    setFoods(updatedFoods);
    localStorage.setItem("fitlife_foods", JSON.stringify(updatedFoods));
  };

  const totals = foods.reduce(
    (acc, food) => ({
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fats: acc.fats + food.fats,
      fiber: acc.fiber + food.fiber,
    }),
    { protein: 0, carbs: 0, fats: 0, fiber: 0 }
  );

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Alimentação Diária</h2>
        <p className="text-purple-100">
          Registre suas refeições e acompanhe seus macros
        </p>
      </div>

      {/* Totals Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Total do Dia</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="text-sm text-purple-600 font-medium mb-1">
              Proteínas
            </div>
            <div className="text-2xl font-bold text-purple-700">
              {totals.protein}g
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="text-sm text-green-600 font-medium mb-1">
              Carboidratos
            </div>
            <div className="text-2xl font-bold text-green-700">
              {totals.carbs}g
            </div>
          </div>
          <div className="bg-orange-50 rounded-xl p-4">
            <div className="text-sm text-orange-600 font-medium mb-1">
              Gorduras
            </div>
            <div className="text-2xl font-bold text-orange-700">
              {totals.fats}g
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-sm text-blue-600 font-medium mb-1">Fibras</div>
            <div className="text-2xl font-bold text-blue-700">
              {totals.fiber}g
            </div>
          </div>
        </div>
      </div>

      {/* Add Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Adicionar Alimento
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Novo Alimento</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Alimento
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Ex: Peito de frango"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade
              </label>
              <input
                type="text"
                required
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Ex: 150g"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proteínas (g)
                </label>
                <input
                  type="number"
                  required
                  value={formData.protein}
                  onChange={(e) =>
                    setFormData({ ...formData, protein: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carboidratos (g)
                </label>
                <input
                  type="number"
                  required
                  value={formData.carbs}
                  onChange={(e) =>
                    setFormData({ ...formData, carbs: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gorduras (g)
                </label>
                <input
                  type="number"
                  required
                  value={formData.fats}
                  onChange={(e) =>
                    setFormData({ ...formData, fats: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fibras (g)
                </label>
                <input
                  type="number"
                  required
                  value={formData.fiber}
                  onChange={(e) =>
                    setFormData({ ...formData, fiber: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300"
              >
                Adicionar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Foods List */}
      {foods.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Alimentos de Hoje</h3>
          {foods.map((food) => (
            <div
              key={food.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{food.name}</h4>
                  <p className="text-sm text-gray-500">{food.quantity}</p>
                </div>
                <button
                  onClick={() => handleDelete(food.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Prot</div>
                  <div className="font-semibold text-purple-600">
                    {food.protein}g
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Carb</div>
                  <div className="font-semibold text-green-600">
                    {food.carbs}g
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Gord</div>
                  <div className="font-semibold text-orange-600">
                    {food.fats}g
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Fibr</div>
                  <div className="font-semibold text-blue-600">
                    {food.fiber}g
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
