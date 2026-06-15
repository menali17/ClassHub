"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, GraduationCap, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [senha,    setSenha]    = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const { login } = useAuth();
  const router    = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("sessao") === "expirada") {
        setError("Sua sessão expirou. Faça login novamente.");
      }
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, senha);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "E-mail ou senha incorretos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-light px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-2xl bg-orange-500 flex items-center justify-center shadow-md">
          <GraduationCap size={22} color="white" />
        </div>
        <span className="text-xl font-bold text-neutral-900">ClassHub</span>
      </div>

      <div className="bg-bg-card rounded-2xl shadow-panel w-full max-w-md p-8">
        <h1 className="text-h3 font-semibold text-neutral-900 mb-1">Entrar na plataforma</h1>
        <p className="text-caption text-bg-muted mb-6">Acesse com suas credenciais institucionais</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">E-mail institucional</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="usuario@engnet.com"
              required
              className="w-full rounded-lg border border-bg-border bg-bg-card px-4 py-2.5 text-sm text-neutral-900
                placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">Senha</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-bg-border bg-bg-card px-4 py-2.5 pr-11 text-sm text-neutral-900
                  placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-error text-sm">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-bold py-3 rounded-lg text-sm transition-all"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-caption text-bg-muted text-center max-w-sm">
        Primeiro acesso? Contate a coordenação para receber suas credenciais.
      </p>
    </div>
  );
}
