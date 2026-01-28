"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Header from "../../components/layout/Header";
import RockEncantechHeader from "../../components/layout/RockEncantechHeader";
import Tabs from "../../components/navigation/Tabs";
import Footer from "../../components/layout/Footer";
import { FindNumber } from "../../components/home/find-number/FindNumber";
import { VerifyNumber } from "../../components/home/verify-number/VerifyNumber";
import { getSessionStorageSafe, setSessionStorageSafe } from "../../utils/storage";

export default function Home() {
  const t = useTranslations("Home");
  const [activeTab, setActiveTab] = useState<"verify" | "find">("verify");

  useEffect(() => {
    const storedTab = getSessionStorageSafe("activeTab");
    if (storedTab === "verify" || storedTab === "find") {
      setActiveTab(storedTab);
    }
  }, []);

  const handleTabChange = (tab: "verify" | "find") => {
    setActiveTab(tab);
    setSessionStorageSafe("activeTab", tab);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <RockEncantechHeader />

      {/* Main Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 md:p-8">
        <Header title={t("title")} />

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
          {/* Tabs */}
          <Tabs active={activeTab} onChange={handleTabChange} />

          {/* Content */}
          <div className="p-6 md:p-8">
            {activeTab === "verify" ? (
              <VerifyNumber />
            ) : (
              <FindNumber />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
