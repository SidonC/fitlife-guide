"use client";

import { ShoppingBag, ExternalLink, Shield, Droplet, Pill, Zap, Apple, Heart, Flame, Dumbbell } from "lucide-react";

export default function OffersTab() {
  const products = [
    {
      id: 1,
      name: "Whey Protein Concentrado",
      brand: "Growth Supplements",
      description: "Auxilia na recuperação e no ganho de massa muscular.",
      icon: Droplet,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      link: "https://mercadolivre.com/sec/2k9NkW1",
    },
    {
      id: 2,
      name: "Creatina Monohidratada",
      brand: "Max Titanium",
      description: "Aumenta força e desempenho nos treinos.",
      icon: Dumbbell,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
      link: "https://mercadolivre.com/sec/24BXnKf",
    },
    {
      id: 3,
      name: "BCAA 2:1:1",
      brand: "Integralmedica",
      description: "Ajuda na recuperação e redução da fadiga.",
      icon: Flame,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
      link: "https://mercadolivre.com/sec/1cJU84i",
    },
    {
      id: 4,
      name: "Barras Proteicas",
      brand: "Bold Nutrition",
      description: "Fonte prática de proteína para o dia a dia.",
      icon: Apple,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
      link: "https://mercadolivre.com/sec/2WXeDfS",
    },
    {
      id: 5,
      name: "Multivitamínico",
      brand: "Vitafor",
      description: "Suporte diário de vitaminas e minerais.",
      icon: Pill,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-50",
      link: "https://mercadolivre.com/sec/22iv2Tc",
    },
    {
      id: 6,
      name: "Ômega 3",
      brand: "Essential Nutrition",
      description: "Contribui para saúde do coração e articulações.",
      icon: Heart,
      iconColor: "text-red-600",
      iconBg: "bg-red-50",
      link: "https://mercadolivre.com/sec/27rJnzp",
    },
    {
      id: 7,
      name: "Pré-treino",
      brand: "Probiótica",
      description: "Mais energia e foco para treinar.",
      icon: Zap,
      iconColor: "text-cyan-600",
      iconBg: "bg-cyan-50",
      link: "https://mercadolivre.com/sec/1AxmwyE",
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Header Premium com Gradiente */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
            <ShoppingBag className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Ofertas Exclusivas</h2>
            <p className="text-sm text-emerald-50">Suplementos com os melhores preços</p>
          </div>
        </div>
      </div>

      {/* Aviso de Transparência e Confiança */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-100 rounded-xl shrink-0">
            <Shield className="w-6 h-6 text-green-600" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              Compra Segura pelo Mercado Livre
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Todos os produtos exibidos aqui são vendidos e entregues pelo Mercado Livre.
              Ao clicar em <strong>Comprar</strong>, você será redirecionado para o site oficial do Mercado Livre,
              com pagamento, garantia e suporte feitos pela própria plataforma.
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Produtos - 2 colunas no mobile, 3 no desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {products.map((product) => {
          const Icon = product.icon;
          return (
            <div
              key={product.id}
              className="bg-white border-2 border-gray-200 rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Ícone no lugar da imagem */}
              <div className={`aspect-square ${product.iconBg} flex items-center justify-center`}>
                <Icon className={`w-20 h-20 md:w-24 md:h-24 ${product.iconColor}`} strokeWidth={1.5} />
              </div>
              
              <div className="p-3 md:p-4">
                <p className="text-xs font-semibold text-emerald-600 mb-1 truncate">
                  {product.brand}
                </p>
                <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">
                  {product.name}
                </h3>
                
                {/* Descrição do produto */}
                <p className="text-xs text-gray-600 mb-3 line-clamp-2 min-h-[2rem]">
                  {product.description}
                </p>
                
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-2 md:py-3 px-2 rounded-lg md:rounded-xl transition-all duration-200 flex items-center justify-center gap-1 md:gap-2 shadow-md hover:shadow-lg text-xs md:text-sm"
                >
                  <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
                  <span className="hidden sm:inline">Comprar Agora</span>
                  <span className="sm:hidden">Comprar</span>
                  <ExternalLink className="w-3 h-3 md:w-4 md:h-4" strokeWidth={2} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Informativo */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-5 shadow-sm">
        <p className="text-sm text-center text-gray-700">
          💡 <strong>Dica:</strong> Sempre consulte um nutricionista antes de iniciar o uso de suplementos.
        </p>
      </div>
    </div>
  );
}
