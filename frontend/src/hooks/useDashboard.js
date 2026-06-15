"use client";
import { useCallback, useEffect, useState } from "react";
import { getDashboard } from "@/lib/api";

/** Carrega os indicadores consolidados do dashboard. */
export function useDashboard({ enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDashboard();
      setData(result);
    } catch (err) {
      setData(null);
      setError(err.message || "Dashboard indisponível.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  return { data, loading, error, reload: load };
}
