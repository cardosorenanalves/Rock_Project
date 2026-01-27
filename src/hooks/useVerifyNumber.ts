import { useState } from "react";
import { MERSENNE_P } from "../utils/mersenne";
import { digitsOfPerfect, perfectFromP } from "../utils/digits";

export function useVerifyNumber() {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState<{
    isPerfect: boolean;
    checkedNumber: string;
    matchedP: number | null;
    method?: string;
  } | null>(null);
  const MAX_P_BIGINT = 107; // limite seguro no browser

  const handleVerify = () => {
    if (!number) return;

    const input = number.trim();
    const normalized = input.replace(/^0+/, "") || "0";

    const digitCount = normalized.length;

    for (const p of MERSENNE_P) {
      const expectedDigits = digitsOfPerfect(p);
      console.log(digitCount, expectedDigits);
      if (digitCount === expectedDigits) {
        // p pequeno → confirma com BigInt
        if (p <= MAX_P_BIGINT) {
          console.log("asda");
          const perfect = perfectFromP(p);
          console.log(perfect.toString());
          if (perfect.toString() === normalized) {
            setResult({ isPerfect: true, checkedNumber: input, matchedP: p });
            return;
          }
        } else {
          fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              number: normalized,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.isPerfect) {
                setResult({
                  isPerfect: true,
                  checkedNumber: input,
                  matchedP: data.p,
                  method: data.method,
                });
                return;
              } else {
                setResult({
                  isPerfect: false,
                  checkedNumber: input,
                  matchedP: null,
                });
              }
            })
            .catch((err) => {
              console.error("Erro na verificação:", err);
              setResult({
                isPerfect: false,
                checkedNumber: input,
                matchedP: null,
              });
            });
        }
      }

      if (digitCount < expectedDigits) break;
    }

    setResult({ isPerfect: false, checkedNumber: input, matchedP: null });
  };

  return {
    number,
    setNumber,
    result,
    handleVerify,
  };
}
