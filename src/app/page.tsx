"use client";

import { useState } from "react";
import { MERSENNE_P } from "../utils/mersenne";
import { digitsOfPerfect, perfectFromP, getPerfectPrefix, getPerfectSuffix } from "../utils/digits";

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
      <header className="bg-[#111827] text-white py-4 px-4 md:px-8 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <button className="text-yellow-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="flex items-center gap-1 font-bold text-xl tracking-wide">
            <span className="text-white">ROCK</span>
            <span className="text-yellow-400">•</span>
            <span className="text-yellow-400">ENCANTECH</span>
          </div>
        </div>
        <button className="bg-[#1f2937] hover:bg-[#374151] text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          Números Perfeitos
        </h1>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("verify")}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === "verify"
                  ? "bg-[#1d4ed8] text-white"
                  : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              Verificar Número
            </button>
            <button
              onClick={() => setActiveTab("find")}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === "find"
                  ? "bg-[#1d4ed8] text-white"
                  : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              Encontrar Números
            </button>
          </div>

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
                  <textarea
                    inputMode="numeric"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Digite um número"
                    className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all h-32 resize-y font-mono text-sm"
                  />
                </div>

                <button
                  onClick={handleVerify}
                  className="w-full bg-[#facc15] hover:bg-[#eab308] text-slate-900 font-bold py-3 px-4 rounded-md transition-colors"
                >
                  Verificar
                </button>

                <p className="text-slate-500 text-sm leading-relaxed">
                  Um número perfeito é igual à soma de todos seus divisores
                  positivos, exceto ele mesmo.
                </p>

                {result && (
                  <div className="mt-6 bg-slate-50 rounded-lg p-6 border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                      {result.isPerfect ? (
                        <div className="bg-yellow-100 p-1 rounded-full">
                           <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        </div>
                      ) : (
                         <div className="bg-red-100 p-1 rounded-full">
                           <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </div>
                      )}
                      <span className="font-bold text-lg text-slate-900">
                        {result.isPerfect
                          ? `Sim! ${abbreviateMiddle(result.checkedNumber)} é um número perfeito!`
                          : `Não! ${abbreviateMiddle(result.checkedNumber)} não é um número perfeito.`}
                      </span>
                    </div>

                    {result.method === "hybrid" && (
                      <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm border border-blue-100">
                        Nota: Devido ao tamanho extremo, este número foi verificado usando validação avançada de prefixo, sufixo e contagem de dígitos.
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-slate-600 text-sm">
                        • Números Perfeitos: 6, 28, 496, 8128, 33550336, ...
                      </p>
                    </div>
                  </div>
                )}
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
                      <label className="block text-slate-500 mb-2 text-sm">
                        De (Início)
                      </label>
                      <textarea
                        inputMode="numeric"
                        value={rangeStart}
                        onChange={(e) => setRangeStart(e.target.value)}
                        placeholder="Ex: 1"
                        className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all h-32 resize-y font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-2 text-sm">
                        Até (Fim)
                      </label>
                      <textarea
                        inputMode="numeric"
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(e.target.value)}
                        placeholder="Ex: 1000"
                        className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all h-32 resize-y font-mono text-sm"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleFind}
                    disabled={isSearching}
                    className={`w-full font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
                      isSearching
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-[#facc15] hover:bg-[#eab308] text-slate-900"
                    }`}
                  >
                    {isSearching ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      "Buscar Números"
                    )}
                  </button>
                </div>

                {foundNumbers !== null && (
                  <div className="mt-6 bg-slate-50 rounded-lg p-6 border border-slate-100">
                    <h3 className="font-bold text-lg text-slate-900 mb-4">
                      Resultados Encontrados: {foundNumbers.length}
                    </h3>
                    
                    {foundNumbers.length > 0 ? (
                      <ul className="space-y-3">
                        {foundNumbers.map((num, idx) => (
                          <li key={idx} className="bg-white p-3 rounded border border-slate-200 shadow-sm break-all font-mono text-sm text-slate-700">
                            <span className="font-bold text-blue-600 mr-2">#{idx + 1}</span>
                            {abbreviateMiddle(num, 15, 15, 40)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-4 bg-white rounded border border-slate-200 text-slate-500">
                        Nenhum número perfeito encontrado neste intervalo.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#111827] text-white py-6 px-4 md:px-8 mt-auto overflow-hidden relative">
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-1 font-bold text-lg tracking-wide">
            <span className="text-white">ROCK</span>
            <span className="text-yellow-400">•</span>
            <span className="text-yellow-400">ENCANTECH</span>
          </div>
        </div>
        
        {/* Decorative Arrows (CSS Shapes) */}
        <div className="absolute right-0 top-0 bottom-0 flex">
           <div className="h-full w-12 bg-[#1d4ed8] transform -skew-x-12 translate-x-4 border-l-4 border-[#111827]"></div>
           <div className="h-full w-12 bg-yellow-400 transform -skew-x-12 translate-x-2 border-l-4 border-[#111827]"></div>
        </div>
      </footer>
    </div>
  );
}
