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
  const isPasswordValid = password.length >= 6;
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <div className="flex-1 flex flex-col justify-center px-6">
        {/* Ícone do topo */}
        <div className="bg-emerald-50 rounded-2xl p-6 w-fit mb-6">
          <Mail className="w-10 h-10 text-emerald-600" />
        </div>

        {/* Título e descrição */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {mode === "register" ? "Crie sua conta" : "Bem-vindo de volta"}
        </h1>
        <p className="text-gray-600 mb-8">
          {mode === "register" 
            ? "Cadastre-se para começar sua jornada fitness"
            : "Entre com suas credenciais para continuar"
          }
        </p>

        {/* Campo de Email */}
        <label className="text-sm font-semibold text-gray-700 mb-2">
          Email
        </label>
        <div className="relative mb-4">
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(""); // Limpa erro ao digitar
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter" && isFormValid && !loading) {
                handleSubmit();
              }
            }}
            className="w-full px-5 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
          />
          <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Campo de Senha */}
        <label className="text-sm font-semibold text-gray-700 mb-2">
          Senha
        </label>
        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(""); // Limpa erro ao digitar
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter" && isFormValid && !loading) {
                handleSubmit();
              }
            }}
            className="w-full px-5 py-4 pl-12 pr-12 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
          />
          <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Informação de segurança */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Seus dados estão protegidos e criptografados.
        </div>

        {/* Toggle entre Login e Cadastro */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            {mode === "register" ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
            <button
              onClick={() => {
                setMode(mode === "register" ? "login" : "register");
                setError("");
              }}
              className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
            >
              {mode === "register" ? "Fazer login" : "Cadastre-se"}
            </button>
          </p>
        </div>
      </div>

      {/* Botão de ação fixo no rodapé */}
      <div className="p-6">
        <button
          disabled={!isFormValid || loading}
          onClick={handleSubmit}
          className={`w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 ${
            isFormValid && !loading
              ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
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
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
