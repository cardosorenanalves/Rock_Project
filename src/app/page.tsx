"use client";

import { useState } from "react";
import { MERSENNE_P } from "../utils/mersenne";
import { digitsOfPerfect, perfectFromP, getPerfectPrefix, getPerfectSuffix } from "../utils/digits";
import Header from "../components/layout/Header";
import RockEncantechHeader from "../components/layout/RockEncantechHeader";
import Tabs from "../components/navigation/Tabs";
import Footer from "../components/layout/Footer";
import TextArea from "../components/forms/TextArea";
import Button from "../components/forms/Button";
import VerifyResultCard from "../components/result/VerifyResultCard";
import FindResults from "../components/result/FindResults";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"verify" | "find">("verify");
  const [number, setNumber] = useState("");
  const [result, setResult] = useState<{
    isPerfect: boolean;
    checkedNumber: string;
    matchedP: number | null;
    method?: string;
  } | null>(null);
  const MAX_P_BIGINT = 107; // limite seguro no browser

  const abbreviateMiddle = (
    s: string,
    start: number = 8,
    end: number = 8,
    threshold: number = 24
  ) => {
    const len = s.length;
    const minLen = Math.max(start + end + 3, threshold);
    if (len <= minLen) return s;
    return `${s.slice(0, start)}…${s.slice(-end)}`;
  };

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
      console.log(minLen, maxLen)
      const safeRange = minLen <= 150000 && maxLen <= 150000;
      let min: bigint | null = null;
      let max: bigint | null = null;
      if (safeRange) {
        min = BigInt(startStr);
        max = BigInt(endStr);
      }

      // if (min > max) {
      //   alert("O número inicial deve ser menor ou igual ao final.");
      //   setIsSearching(false);
      //   return;
      // }

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

  const handleVerify = () => {
    if (!number) return;

    const input = number.trim();
    const normalized = input.replace(/^0+/, "") || "0";

    const digitCount = normalized.length;

    for (const p of MERSENNE_P) {
      const expectedDigits = digitsOfPerfect(p);
      console.log(digitCount, expectedDigits)
      if (digitCount === expectedDigits) {
        // p pequeno → confirma com BigInt
        if (p <= MAX_P_BIGINT) {
          console.log('asda')
          const perfect = perfectFromP(p);
          console.log(perfect.toString())
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
          }).then(res => res.json()).then(data => {
            if (data.isPerfect) {
              setResult({ 
                isPerfect: true, 
                checkedNumber: input, 
                matchedP: data.p,
                method: data.method 
              });
              return;
            } else {
              setResult({ isPerfect: false, checkedNumber: input, matchedP: null });
            }
          }).catch(err => {
            console.error("Erro na verificação:", err);
            setResult({ isPerfect: false, checkedNumber: input, matchedP: null });
          })
        }
      }

      if (digitCount < expectedDigits) break;
    }

    setResult({ isPerfect: false, checkedNumber: input, matchedP: null });
  };


  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <RockEncantechHeader />

      {/* Main Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 md:p-8">
        <Header title="Números Perfeitos" />

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
          {/* Tabs */}
          <Tabs active={activeTab} onChange={setActiveTab} />

          {/* Content */}
          <div className="p-6 md:p-8">
            {activeTab === "verify" ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">
                    É um número perfeito?
                  </h2>
                  <label className="block text-slate-500 mb-2">
                    Digite um número
                  </label>
                  <TextArea
                    inputMode="numeric"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Digite um número"
                    className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all h-32 resize-y font-mono text-sm"
                  />
                </div>

                <Button
                  onClick={handleVerify}
                  className="w-full bg-[#facc15] hover:bg-[#eab308] text-slate-900 font-bold py-3 px-4 rounded-md transition-colors"
                >
                  Verificar
                </Button>

                <p className="text-slate-500 text-sm leading-relaxed">
                  Um número perfeito é igual à soma de todos seus divisores
                  positivos, exceto ele mesmo.
                </p>

                <VerifyResultCard result={result} abbreviateMiddle={abbreviateMiddle} />
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">
                    Encontrar Números Perfeitos
                  </h2>
                  <p className="text-slate-500 text-sm mb-4">
                    Digite um intervalo para buscar números perfeitos.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-slate-500 mb-2 text-sm">De (Início)</label>
                      <TextArea
                        inputMode="numeric"
                        value={rangeStart}
                        onChange={(e) => setRangeStart(e.target.value)}
                        placeholder="Ex: 1"
                        className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all h-32 resize-y font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-2 text-sm">Até (Fim)</label>
                      <TextArea
                        inputMode="numeric"
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(e.target.value)}
                        placeholder="Ex: 1000"
                        className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all h-32 resize-y font-mono text-sm"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleFind}
                    disabled={isSearching}
                    loading={isSearching}
                    className={`w-full font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
                      isSearching
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-[#facc15] hover:bg-[#eab308] text-slate-900"
                    }`}
                  >
                    Buscar Números
                  </Button>
                </div>

                <FindResults foundNumbers={foundNumbers} abbreviateMiddle={abbreviateMiddle} />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
