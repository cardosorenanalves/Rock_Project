"use client";
import React from "react";

export default function Header({ title }: { title: string }) {
  return <h1 className="text-3xl font-bold text-slate-900 mb-6">{title}</h1>;
}
