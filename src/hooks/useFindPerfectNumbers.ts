import { useState } from "react";
import { MERSENNE_P } from "../utils/mersenne";
import { digitsOfPerfect, perfectFromP, getPerfectPrefix, getPerfectSuffix } from "../utils/digits";

export function useFindPerfectNumbers() {
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [foundNumbers, setFoundNumbers] = useState<string[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleFind = () => {
    try {
      if (!rangeStart || !rangeEnd) return;
      setIsSearching(true);
      setFoundNumbers(null);

      const startStr = rangeStart.trim().replace(/\D/g, "") || "0";
      const endStr = rangeEnd.trim().replace(/\D/g, "") || "0";

      const minLen = startStr.length;
      const maxLen = endStr.length;
      console.log(minLen, maxLen);
      const safeRange = minLen <= 150000 && maxLen <= 150000;
      let min: bigint | null = null;
      let max: bigint | null = null;
      if (safeRange) {
        min = BigInt(startStr);
        max = BigInt(endStr);
      }

      const found: string[] = [];
      const maxDigits = maxLen;

      // Usando timeout para não travar a UI se o loop for pesado
      setTimeout(() => {
        try {
          for (const p of MERSENNE_P) {
            const digits = digitsOfPerfect(p);
            if (digits > maxDigits + 1) break;
            if (digits < minLen - 1) continue;

            if (digits <= 150000) {
              const perfectStr = perfectFromP(p).toString();
              const len = perfectStr.length;

              let inRange = false;
              if (safeRange && min !== null && max !== null) {
                const perfectBig = BigInt(perfectStr);
                inRange = perfectBig >= min && perfectBig <= max;
                if (perfectBig > max) {
                  break;
                }
              } else {
                const geMin = len > minLen || (len === minLen && perfectStr >= startStr);
                const leMax = len < maxLen || (len === maxLen && perfectStr <= endStr);
                inRange = geMin && leMax;
                if (len > maxLen) {
                  break;
                }
              }

              if (inRange) {
                found.push(perfectStr);
              }
              continue;
            }

            const len = digits;
            if (len < minLen) continue;
            if (len > maxLen) break;
            const prefixLen = 15;
            const expectedPrefix = getPerfectPrefix(p, prefixLen);
            const minPrefix = startStr.substring(0, prefixLen);
            const maxPrefix = endStr.substring(0, prefixLen);
            const geMin = len > minLen || expectedPrefix >= minPrefix;
            const leMax = len < maxLen || expectedPrefix <= maxPrefix;
            if (geMin && leMax) {
              const preview = `${getPerfectPrefix(p, 15)}…${getPerfectSuffix(p, 15)}`;
              found.push(preview);
            }
          }
          setFoundNumbers(found);
          console.log(found[found.length - 1]);
        } catch (error) {
          console.error(error);
          alert("Erro ao processar números. Intervalo pode ser muito complexo.");
        } finally {
          setIsSearching(false);
        }
      }, 100);
    } catch (e) {
      console.error(e);
      alert("Erro ao buscar números. Verifique os valores inseridos.");
      setIsSearching(false);
    }
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
