"use client";
import React from "react";
import { jsPDF } from "jspdf";

export default function FindResults({
  foundNumbers,
  abbreviateMiddle,
}: {
  foundNumbers: string[] | null;
  abbreviateMiddle: (s: string, start?: number, end?: number, threshold?: number) => string;
}) {
  const handleDownload = (num: string, index: number) => {
    const doc = new jsPDF();
    doc.setFont("courier");
    
    // Configurações da página
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    const lineHeight = 5; // Altura da linha para font size 10
    let cursorY = 30; // Posição Y inicial
    
    // Título
    doc.setFontSize(16);
    doc.text(`Número Perfeito #${index + 1}`, margin, 20);
    
    // Conteúdo
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(num, 190);
    
    // Garantir que é um array para iteração
    const lines = Array.isArray(splitText) ? splitText : [splitText];
    
    lines.forEach((line) => {
      // Verificar se cabe na página atual
      if (cursorY + lineHeight > pageHeight - margin) {
        doc.addPage();
        cursorY = margin + 10; // Reiniciar cursor na nova página
      }
      
      doc.text(line, margin, cursorY);
      cursorY += lineHeight;
    });
    
    doc.save(`numero-perfeito-${index + 1}.pdf`);
  };

  if (foundNumbers === null) return null;
  
  return (
    <div className="mt-6 bg-slate-50 rounded-lg p-6 border border-slate-100">
      <h3 className="font-bold text-lg text-slate-900 mb-4">Resultados Encontrados: {foundNumbers.length}</h3>
      {foundNumbers.length > 0 ? (
        <ul className="space-y-3">
          {foundNumbers.map((num, idx) => {
            const isAbbreviated = num.includes("…");
            return (
              <li key={idx} className="bg-white p-4 rounded border border-slate-200 shadow-sm font-mono text-sm text-slate-700 flex items-center justify-between gap-4">
                <div className="break-all flex-1">
                  <span className="font-bold text-secondary mr-2">#{idx + 1}</span>
                  {abbreviateMiddle(num, 15, 15, 40)}
                </div>
                
                <div className="shrink-0">
                  {isAbbreviated ? (
                    <span className="text-xs text-slate-400 italic" title="Muito grande para download">
                      ⚠️ <span className="hidden sm:inline">Muito grande</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDownload(num, idx)}
                      className="text-xs bg-secondary hover:opacity-90 text-white px-2 sm:px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 font-sans font-bold shadow-sm"
                      title="Baixar PDF"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      <span className="hidden sm:inline">Baixar PDF</span>
                      <span className="sm:hidden">PDF</span>
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center py-4 bg-white rounded border border-slate-200 text-slate-500">
          Nenhum número perfeito encontrado neste intervalo.
        </div>
      )}
    </div>
  );
}
