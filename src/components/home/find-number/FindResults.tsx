"use client";
import React from "react";

export default function FindResults({
  foundNumbers,
  abbreviateMiddle,
}: {
  foundNumbers: string[] | null;
  abbreviateMiddle: (s: string, start?: number, end?: number, threshold?: number) => string;
}) {
  if (foundNumbers === null) return null;
  return (
    <div className="mt-6 bg-slate-50 rounded-lg p-6 border border-slate-100">
      <h3 className="font-bold text-lg text-slate-900 mb-4">Resultados Encontrados: {foundNumbers.length}</h3>
      {foundNumbers.length > 0 ? (
        <ul className="space-y-3">
          {foundNumbers.map((num, idx) => (
            <li key={idx} className="bg-white p-3 rounded border border-slate-200 shadow-sm break-all font-mono text-sm text-slate-700">
              <span className="font-bold text-secondary mr-2">#{idx + 1}</span>
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
  );
}
