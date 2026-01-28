"use client";
import React from "react";
import { useTranslations } from "next-intl";

export default function Tabs({
  active,
  onChange,
}: {
  active: "verify" | "find";
  onChange: (tab: "verify" | "find") => void;
}) {
  const t = useTranslations("Home.tabs");
  return (
    <div className="flex border-b border-slate-200">
      <button
        onClick={() => onChange("verify")}
        className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
          active === "verify" ? "bg-secondary text-white" : "bg-white text-slate-500 hover:bg-slate-50"
        }`}
      >
        {t("verify")}
      </button>
      <button
        onClick={() => onChange("find")}
        className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
          active === "find" ? "bg-secondary text-white" : "bg-white text-slate-500 hover:bg-slate-50"
        }`}
      >
        {t("find")}
      </button>
    </div>
  );
}
