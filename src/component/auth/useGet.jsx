// Hook สำหรับดึงข้อมูล
import { useState, useEffect } from "react";
export const useFetch = (url, initialValue, headers) => {
  const [data, setData] = useState(initialValue);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error("Failed to fetch");
        const result = await response.json();
        if (isMounted) setData(result);
      } catch (error) {
        if (isMounted) setError(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [url, headers]);

  return { data, error, loading };
};