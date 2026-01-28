"use client";
import React from "react";
import { useTranslations } from "next-intl";

interface VerifyResultCardProps {
  result: {
    isPerfect: boolean;
    checkedNumber: string;
    matchedP: number | null;
  } | null;
  abbreviateMiddle: (
    s: string,
    start?: number,
    end?: number,
    threshold?: number
  ) => string;
}

export default function VerifyResultCard({
  result,
  abbreviateMiddle,
}: VerifyResultCardProps) {
  const t = useTranslations("VerifyResult");
  if (!result) return null;

  return (
    <div
      className={`mt-6 p-6 rounded-lg border ${
        result.isPerfect
          ? "bg-emerald-50 border-emerald-200"
          : "bg-slate-50 border-slate-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-1 p-1 rounded-full ${
            result.isPerfect ? "bg-emerald-500" : "bg-slate-400"
          }`}
        >
          {result.isPerfect ? (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>
        <div>
          <h3
            className={`font-bold text-lg ${
              result.isPerfect ? "text-emerald-800" : "text-slate-800"
            }`}
          >
            {result.isPerfect
              ? t("perfect")
              : t("notPerfect")}
          </h3>
          <p
            className={`text-sm mt-1 font-mono break-all ${
              result.isPerfect ? "text-emerald-600" : "text-slate-600"
            }`}
          >
            {abbreviateMiddle(result.checkedNumber)}
          </p>
          {result.isPerfect && result.matchedP && (
            <p className="text-xs text-emerald-500 mt-2 font-mono">
              p = {result.matchedP} (2ᵖ⁻¹ × (2ᵖ - 1))
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
