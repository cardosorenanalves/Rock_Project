import { useState, useEffect, useRef } from "react";

export function useFindPerfectNumbers() {
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [foundNumbers, setFoundNumbers] = useState<string[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const handleFind = () => {
    if (!rangeStart || !rangeEnd) return;
    
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
  };
}
