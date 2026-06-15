"use client";
import { useEffect, useState } from "react";
import { getAlunosBaixaFrequencia } from "@/lib/api";
import { normalizePerfil } from "@/utils/roles";

/**
 * Carrega alunos com baixa frequência para admin ou professor.
 * Admin: todos os alunos. Professor: alunos das turmas do professor.
 */
export function useAlunosFaltosos(user) {
  const [faltosos, setFaltosos] = useState([]);
  const [frequencias, setFrequencias] = useState([]);
  const [taxaMedia, setTaxaMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const perfil = normalizePerfil(user.perfil);
    if (perfil !== "admin" && perfil !== "professor") {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const report = await getAlunosBaixaFrequencia();

        if (cancelled) return;

        setFrequencias([]);
        setFaltosos(Array.isArray(report?.alunos) ? report.alunos : []);
        setTaxaMedia(null);
      } catch (err) {
        if (!cancelled) setError(err.message || "Erro ao carregar dados de frequência.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [user]);

  return { faltosos, frequencias, taxaMedia, loading, error };
}
