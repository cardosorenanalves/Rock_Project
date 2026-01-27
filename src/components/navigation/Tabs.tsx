"use client";
import React from "react";

export default function Tabs({
  active,
  onChange,
}: {
  active: "verify" | "find";
  onChange: (tab: "verify" | "find") => void;
}) {
  return (
    <div className="flex border-b border-slate-200">
      <button
        onClick={() => onChange("verify")}
        className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
          active === "verify" ? "bg-[#1d4ed8] text-white" : "bg-white text-slate-500 hover:bg-slate-50"
        }`}
      >
        Verificar Número
      </button>
      <button
        onClick={() => onChange("find")}
        className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
          active === "find" ? "bg-[#1d4ed8] text-white" : "bg-white text-slate-500 hover:bg-slate-50"
        }`}
      >
        Encontrar Números
      </button>
    </div>
  );
}
