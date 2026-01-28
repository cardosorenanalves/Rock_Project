import { useState, useEffect, useRef } from "react";
import { getSessionStorageSafe, setSessionStorageSafe } from "../utils/storage";

export function useFindPerfectNumbers() {
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [foundNumbers, setFoundNumbers] = useState<string[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const storedStart = getSessionStorageSafe("findPerfectNumbers_rangeStart");
    const storedEnd = getSessionStorageSafe("findPerfectNumbers_rangeEnd");
    const storedResults = getSessionStorageSafe("findPerfectNumbers_foundNumbers");

    if (storedStart) setRangeStart(storedStart);
    if (storedEnd) setRangeEnd(storedEnd);
    if (storedResults) {
      try {
        setFoundNumbers(JSON.parse(storedResults));
      } catch (e) {
        console.error("Failed to parse stored numbers", e);
      }
    }
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setSessionStorageSafe("findPerfectNumbers_rangeStart", rangeStart);
      setSessionStorageSafe("findPerfectNumbers_rangeEnd", rangeEnd);
      if (foundNumbers !== null) {
        setSessionStorageSafe("findPerfectNumbers_foundNumbers", JSON.stringify(foundNumbers));
      }
    }
  }, [rangeStart, rangeEnd, foundNumbers, isLoaded]);

  const saveSearchState = () => {
    // Mantido para compatibilidade, mas agora o useEffect cuida da persistência
    setSessionStorageSafe("findPerfectNumbers_rangeStart", rangeStart);
    setSessionStorageSafe("findPerfectNumbers_rangeEnd", rangeEnd);
    if (foundNumbers !== null) {
      setSessionStorageSafe("findPerfectNumbers_foundNumbers", JSON.stringify(foundNumbers));
    }
  };

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
      setError("required");
      return;
    }

    // Validação segura para números gigantes
    const startStr = rangeStart.trim();
    const endStr = rangeEnd.trim();
    
    // Limite seguro para BigInt (embora suporte mais, vamos ser conservadores para evitar travamentos)
    const MAX_SAFE_BIGINT_LENGTH = 10000;

    if (startStr.length > MAX_SAFE_BIGINT_LENGTH || endStr.length > MAX_SAFE_BIGINT_LENGTH) {
      // Validação baseada em string para números gigantes
      if (startStr.length > endStr.length) {
        setError("range");
        return;
      }
      if (startStr.length === endStr.length && startStr > endStr) {
        setError("range");
        return;
      }
    } else {
      // Validação padrão com BigInt para números "pequenos"
      try {
        const start = BigInt(startStr);
        const end = BigInt(endStr);

        if (start >= end) {
          setError("range");
          return;
        }
      } catch (e) {
        // Se falhar na conversão (ex: caracteres inválidos), mostra erro
        setError("invalid");
        return;
      }
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
    saveSearchState,
  };
}
