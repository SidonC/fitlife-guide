"use client";

import { useState } from "react";
import { Mail, Lock, ChevronRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

interface AuthFlowProps {
  onAuthSuccess: (user: { id: string; email: string }) => void;
}

export default function AuthFlow({ onAuthSuccess }: AuthFlowProps) {
  // Estado para controlar se estamos no modo de login ou cadastro
  const [mode, setMode] = useState<"login" | "register">("register");
  
  // Campos do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Validações básicas
  const isEmailValid = email.includes("@") && email.includes(".");
  const isPasswordValid = password.length >= 6 && password.length <= 10;
  const isFormValid = isEmailValid && isPasswordValid;

  // Função para fazer login ou cadastro
  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        // Modo cadastro - tenta criar nova conta
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          // Cadastro bem sucedido
          onAuthSuccess({ id: data.user.id, email: data.user.email! });
        }
      } else {
        // Modo login - tenta fazer login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          // Login bem sucedido
          // O onAuthStateChange no page.tsx vai cuidar da navegação
        }
      }
    } catch (err: any) {
      // Tratamento de erros com mensagens amigáveis
      let errorMessage = "Ocorreu um erro. Tente novamente.";
      
      if (err.message?.includes("Invalid login credentials")) {
        errorMessage = "Email ou senha incorretos.";
      } else if (err.message?.includes("User already registered")) {
        errorMessage = "Este email já está cadastrado. Tente fazer login.";
      } else if (err.message?.includes("Email not confirmed")) {
        errorMessage = "Verifique seu email para confirmar o cadastro.";
      } else if (err.message?.includes("Password should be at least")) {
        errorMessage = "A senha deve ter no mínimo 6 caracteres.";
      } else if (err.message?.includes("Unable to validate email")) {
        errorMessage = "Email inválido. Verifique o formato.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
        {/* Logo do FitLife Guide */}
        <div className="flex justify-center mb-8 animate-[fadeIn_0.8s_ease-out]">
          <div className="relative">
            {/* Círculo de fundo com gradiente */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            
            {/* Logo */}
            <div className="relative w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white/50">
              <img
                src="/logo_round_small.png"
                alt="FitLife Guide"
                className="w-28 h-28 rounded-full object-cover"
                onError={(e) => {
                  // Fallback caso a imagem não carregue
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* Título e descrição */}
        <div className="text-center mb-8 animate-[fadeIn_1s_ease-out]">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
            {mode === "register" ? "Bem-vindo!" : "Bom te ver de volta"}
          </h1>
          <p className="text-gray-600 text-base">
            {mode === "register" 
              ? "Crie sua conta e comece sua jornada fitness"
              : "Entre para continuar sua evolução"
            }
          </p>
        </div>

        {/* Formulário */}
        <div className="space-y-5 animate-[fadeIn_1.2s_ease-out]">
          {/* Campo de Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && isFormValid && !loading) {
                    handleSubmit();
                  }
                }}
                className="w-full px-5 py-4 pl-12 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all shadow-sm"
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Campo de Senha */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="6 a 10 caracteres"
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  // Limita a 10 caracteres
                  if (value.length <= 10) {
                    setPassword(value);
                    setError("");
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && isFormValid && !loading) {
                    handleSubmit();
                  }
                }}
                maxLength={10}
                className="w-full px-5 py-4 pl-12 pr-12 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all shadow-sm"
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Indicador de caracteres */}
            {password && (
              <div className="mt-2 ml-1">
                <span className={`text-xs font-medium ${
                  password.length >= 6 && password.length <= 10
                    ? "text-emerald-600"
                    : "text-gray-500"
                }`}>
                  {password.length}/10 caracteres
                  {password.length < 6 && " (mínimo 6)"}
                  {password.length >= 6 && password.length <= 10 && " ✓"}
                </span>
              </div>
            )}
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="animate-[shake_0.5s_ease-out] bg-red-50 border-2 border-red-200 rounded-2xl p-4">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Informação de segurança */}
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-emerald-50/50 rounded-xl p-3 border border-emerald-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Seus dados estão protegidos e criptografados</span>
          </div>
        </div>

        {/* Toggle entre Login e Cadastro */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {mode === "register" ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
            <button
              onClick={() => {
                setMode(mode === "register" ? "login" : "register");
                setError("");
              }}
              className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors underline decoration-2 underline-offset-2"
            >
              {mode === "register" ? "Fazer login" : "Cadastre-se"}
            </button>
          </p>
        </div>
      </div>

      {/* Botão de ação fixo no rodapé */}
      <div className="p-6 relative z-10">
        <button
          disabled={!isFormValid || loading}
          onClick={handleSubmit}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
            isFormValid && !loading
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-[1.02] active:scale-[0.98]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processando...
            </>
          ) : (
            <>
              {mode === "register" ? "Criar conta" : "Entrar"}
              <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
            </>
          )}
        </button>
      </div>

      {/* Animações CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}
