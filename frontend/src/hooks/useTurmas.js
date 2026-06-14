"use client";
import { useCallback, useEffect, useState } from "react";
import { getTurmas } from "@/lib/api";

export function useTurmas({ enabled = true } = {}) {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTurmas();
      setTurmas(Array.isArray(data) ? data : data?.turmas ?? []);
    } catch (err) {
      setTurmas([]);
      setError(err.message || "Erro ao carregar turmas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) load();
    else setLoading(false);
  }, [enabled, load]);

  return { turmas, loading, error, reload: load };
}
