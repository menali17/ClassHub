"use client";
import { useCallback, useEffect, useState } from "react";
import { getProfessores } from "@/lib/api";

export function useProfessores({ enabled = true } = {}) {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfessores();
      setProfessores(Array.isArray(data) ? data : []);
    } catch (err) {
      setProfessores([]);
      setError(err.message || "Erro ao carregar professores.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) load();
    else setLoading(false);
  }, [enabled, load]);

  return { professores, loading, error, reload: load };
}
