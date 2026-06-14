"use client";
import { useCallback, useEffect, useState } from "react";
import { getAlunos } from "@/lib/api";

export function useAlunos({ enabled = true } = {}) {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAlunos();
      setAlunos(Array.isArray(data) ? data : []);
    } catch (err) {
      setAlunos([]);
      setError(err.message || "Erro ao carregar alunos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) load();
    else setLoading(false);
  }, [enabled, load]);

  return { alunos, loading, error, reload: load };
}
