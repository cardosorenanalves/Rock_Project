"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import RockEncantechHeader from "../../../components/layout/RockEncantechHeader";
import Footer from "../../../components/layout/Footer";
import { getSessionStorageSafe } from "../../../utils/storage";

export default function ViewPerfectNumber() {
  const router = useRouter();
  const [number, setNumber] = useState<string | null>(null);
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const storedNumber = getSessionStorageSafe("selectedPerfectNumber");
    const storedIndex = getSessionStorageSafe("selectedPerfectNumberIndex");

    if (!storedNumber) {
      router.push("/");
      return;
    }

    setNumber(storedNumber);
    if (storedIndex) {
      setIndex(parseInt(storedIndex, 10));
    }
  }, [router]);

  const handleDownload = () => {
    if (!number || index === null) return;

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
    const splitText = doc.splitTextToSize(number, 190);
    
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

  if (!number) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <RockEncantechHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Número Perfeito #{index !== null ? index + 1 : ""}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Visualização completa do número encontrado.
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 transition-colors"
            >
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
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 font-mono text-sm break-all max-h-[60vh] overflow-y-auto mb-8 shadow-inner text-slate-700 leading-relaxed">
            {number}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDownload}
              className="bg-secondary hover:opacity-90 text-white px-6 py-3 rounded-md transition-colors flex items-center gap-2 font-bold shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Baixar PDF
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
