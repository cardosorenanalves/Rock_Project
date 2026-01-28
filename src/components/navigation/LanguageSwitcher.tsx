"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: string) => {
    // Set cookie for next-intl (default cookie name is NEXT_LOCALE)
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    startTransition(() => {
      // Reload the page to apply the new locale from the cookie
      window.location.reload();
    });
  };

  return (
    <div className="flex items-center gap-2 bg-[#1f2937] rounded-md p-1">
      <button
        onClick={() => handleLocaleChange("pt")}
        disabled={isPending || locale === "pt"}
        className={`px-3 py-1 text-xs font-bold rounded-sm transition-colors ${
          locale === "pt"
            ? "bg-secondary text-white cursor-default"
            : "text-slate-400 hover:text-white"
        }`}
      >
        PT
      </button>
      <button
        onClick={() => handleLocaleChange("en")}
        disabled={isPending || locale === "en"}
        className={`px-3 py-1 text-xs font-bold rounded-sm transition-colors ${
          locale === "en"
            ? "bg-secondary text-white cursor-default"
            : "text-slate-400 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}