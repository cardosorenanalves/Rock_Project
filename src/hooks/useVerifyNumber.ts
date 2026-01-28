import { useState } from "react";
import { VerifyService } from "../services/VerifyService";

export function useVerifyNumber() {
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    isPerfect: boolean;
    checkedNumber: string;
    matchedP: number | null;
    method?: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setError(null);
    if (!number.trim()) {
      setError("required");
      return;
    }

    setLoading(true);
    try {
      const data = await VerifyService.verify(number);
      setResult({
        isPerfect: data.isPerfect,
        checkedNumber: number.trim(),
        matchedP: data.matchedP ?? null,
        method: data.method,
      });
    } catch (error) {
      console.error("Erro na verificação:", error);
      setResult({
        isPerfect: false,
        checkedNumber: number.trim(),
        matchedP: null,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    number,
    setNumber,
    result,
    handleVerify,
    loading,
    error,
  };
}
