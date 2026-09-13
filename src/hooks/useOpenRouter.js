import { useState, useCallback } from "react";

/**
 * useOpenRouter
 * Generic hook that wraps any async API function with
 * loading / error / data state.
 *
 * Usage:
 *   const { data, loading, error, run, reset } = useOpenRouter(searchDrugInsight);
 *   await run(query, apiKey);
 */
export default function useOpenRouter(apiFn) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const run = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const result = await apiFn(...args);
        setData(result);
        return result;
      } catch (e) {
        setError(e.message || "Unexpected error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFn]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, run, reset };
}
