import { useState, useEffect, useRef } from "react";

export function useFindPerfectNumbers() {
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [foundNumbers, setFoundNumbers] = useState<string[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const handleFind = () => {
    setError(null);
    if (!rangeStart.trim() || !rangeEnd.trim()) {
      setError("Por favor, preencha ambos os campos.");
      return;
    }

    try {
      const start = BigInt(rangeStart);
      const end = BigInt(rangeEnd);

      if (start >= end) {
        setError("O número inicial deve ser menor que o número final.");
        return;
      }
    } catch (e) {
      setError("Por favor, insira números válidos.");
      return;
    }
    
    setIsSearching(true);
    setFoundNumbers(null);

    // Termina worker anterior se existir
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    // Inicializa novo worker
    workerRef.current = new Worker(new URL("../workers/find.worker.ts", import.meta.url));

    workerRef.current.onmessage = (e) => {
      const { type, payload } = e.data;
      if (type === "SUCCESS") {
        console.log(payload[payload.length - 1])
        setFoundNumbers(payload);
        setIsSearching(false);
      } else if (type === "ERROR") {
        console.error(payload);
        alert("Erro ao processar números.");
        setIsSearching(false);
      }
    };

    workerRef.current.onerror = (e) => {
      console.error("Worker error:", e);
      alert("Erro inesperado no Worker.");
      setIsSearching(false);
    };

    // Envia dados para o worker
    workerRef.current.postMessage({ rangeStart, rangeEnd });
  };

  return {
    rangeStart,
    setRangeStart,
    rangeEnd,
    setRangeEnd,
    foundNumbers,
    isSearching,
    handleFind,
    error,
  };
}
