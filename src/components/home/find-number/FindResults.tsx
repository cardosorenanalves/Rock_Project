"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { setSessionStorageSafe } from "../../../utils/storage";
import { useTranslations } from "next-intl";

export default function FindResults({
  foundNumbers,
  abbreviateMiddle,
  onViewDetails,
}: {
  foundNumbers: string[] | null;
  abbreviateMiddle: (s: string, start?: number, end?: number, threshold?: number) => string;
  onViewDetails: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("FindNumber.results");

  const handleView = (num: string, index: number) => {
    onViewDetails();
    setSessionStorageSafe("selectedPerfectNumber", num);
    setSessionStorageSafe("selectedPerfectNumberIndex", index.toString());
    router.push("/perfect-number/view");
  };

  if (foundNumbers === null) return null;
  
  return (
    <div className="mt-6 bg-slate-50 rounded-lg p-6 border border-slate-100">
      <h3 className="font-bold text-lg text-slate-900 mb-4">{t("title", { count: foundNumbers.length })}</h3>
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
                    <span className="text-xs text-slate-400 italic" title={t("tooBigTooltip")}>
                      ⚠️ <span className="hidden sm:inline">{t("tooBig")}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleView(num, idx)}
                      className="text-xs bg-secondary hover:opacity-90 text-white px-2 sm:px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 font-sans font-bold shadow-sm"
                      title={t("viewFull")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <span className="hidden sm:inline">{t("viewFull")}</span>
                      <span className="sm:hidden">{t("view")}</span>
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center py-4 bg-white rounded border border-slate-200 text-slate-500">
          {t("empty")}
        </div>
      )}
    </div>
  );
}
