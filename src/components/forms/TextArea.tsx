"use client";
import React from "react";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextArea({ className = "", ...rest }: Props) {
  return <textarea className={className} {...rest} />;
}
