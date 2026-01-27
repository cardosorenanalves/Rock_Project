"use client";
import React from "react";
import Image from "next/image";
import logo from "../../assets/png/logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-white py-6 px-4 md:px-8 mt-auto overflow-hidden relative">
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center gap-1">
          <Image src={logo} alt="Rock Encantech Logo" height={40} />
        </div>
      </div>
      <div className="absolute right-0 top-0 bottom-0 flex">
        <div className="h-full w-12 bg-[#1d4ed8] transform -skew-x-12 translate-x-4 border-l-4 border-[#111827]"></div>
        <div className="h-full w-12 bg-yellow-400 transform -skew-x-12 translate-x-2 border-l-4 border-[#111827]"></div>
      </div>
    </footer>
  );
}
