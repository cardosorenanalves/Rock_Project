"use client";
import React from "react";

type Result = {
  isPerfect: boolean;
  checkedNumber: string;
  matchedP: number | null;
  method?: string;
} | null;

export default function VerifyResultCard({
  result,
  abbreviateMiddle,
}: {
  result: Result;
  abbreviateMiddle: (s: string, start?: number, end?: number, threshold?: number) => string;
}) {
  if (!result) return null;
  return (
    <div className="mt-6 bg-slate-50 rounded-lg p-6 border border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        {result.isPerfect ? (
          <div className="bg-primary/20 p-1 rounded-full">
            <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
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
        <div className="mb-4 p-3 bg-secondary/10 text-secondary rounded-md text-sm border border-blue-100">
          Nota: Devido ao tamanho extremo, este número foi verificado usando validação avançada de prefixo, sufixo e contagem de dígitos.
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-slate-600 text-sm">• Números Perfeitos: 6, 28, 496, 8128, 33550336, ...</p>
      </div>
    </div>
  );
}
