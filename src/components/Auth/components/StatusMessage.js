"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";

export function StatusMessage({ message, isSuccess = false, className = "" }) {
  if (!message) return null;

  return (
    <div
      className={`
      flex items-center gap-2 p-3 rounded-md
      ${
        isSuccess
          ? "bg-green-50 text-green-600 border border-green-200"
          : "bg-red-50 text-red-600 border border-red-200"
      }
      ${className}
    `}
    >
      {isSuccess ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0" />
      )}
      <p className="text-sm">{message}</p>
    </div>
  );
}
