"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

interface AuthFlowProps {
  onAuthSuccess: (user: { id: string; email: string }) => void;
}

export default function AuthFlow({ onAuthSuccess }: AuthFlowProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setLoading(true);
    setError("");

    try {
      let res;

      if (mode === "login") {
        res = await supabase.auth.signInWithPassword({ email, password });
      } else {
        res = await supabase.auth.signUp({ email, password });
      }

      if (res.error) throw res.error;

     if (res.data.user) {

  // Se for cadastro, cria perfil no banco
  if (mode === "register") {
    await supabase.from("users").insert({
      id: res.data.user.id,
      email: res.data.user.email,
      isPremium: false,
      created_at: new Date().toISOString(),
    });
  }

  onAuthSuccess({
    id: res.data.user.id,
    email: res.data.user.email!,
  });
}
    } catch (err: any) {
      setError(err.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen justify-center px-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">
        {mode === "login" ? "Entrar" : "Criar conta"}
      </h1>

      <input
        type="email"
        placeholder="Email"
        className="mb-3 p-3 rounded border"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        className="mb-3 p-3 rounded border"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-emerald-600 text-white p-3 rounded"
      >
        {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"}
      </button>

      <p className="text-sm mt-4 text-center">
        {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
        <button
          className="text-emerald-600 font-semibold"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Criar" : "Entrar"}
        </button>
      </p>
    </div>
  );
}
