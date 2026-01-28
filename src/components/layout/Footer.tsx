"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../assets/png/logo.png";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Layout.footer");
  return (
    <footer className="bg-[#111827] text-white py-6 px-4 md:px-8 mt-auto overflow-hidden relative">
      <div className="flex justify-between items-center relative z-10">
        <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
          <Image src={logo} alt={t("logoAlt")} height={40} />
        </Link>
      </div>
      <div className="absolute right-0 top-0 bottom-0 flex">
        <div className="h-full w-12 bg-secondary transform -skew-x-12 translate-x-4 border-l-4 border-[#111827]"></div>
        <div className="h-full w-12 bg-primary transform -skew-x-12 translate-x-2 border-l-4 border-[#111827]"></div>
      </div>
    </footer>
  );
}
