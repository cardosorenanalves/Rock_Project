"use client";

import { useState } from "react";
import Header from "../components/layout/Header";
import RockEncantechHeader from "../components/layout/RockEncantechHeader";
import Tabs from "../components/navigation/Tabs";
import Footer from "../components/layout/Footer";
import { FindNumber } from "../components/home/find-number/FindNumber";
import { VerifyNumber } from "../components/home/verify-number/VerifyNumber";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"verify" | "find">("verify");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <RockEncantechHeader />

      {/* Main Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 md:p-8">
        <Header title="Números Perfeitos" />

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
          {/* Tabs */}
          <Tabs active={activeTab} onChange={setActiveTab} />

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
