"use client";

import { useEffect } from "react";

interface Props {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export const SystemNotification = ({
  message,
  type = "success",
  onClose,
}: Props) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success:
      "border-cyan-500 text-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.2)]",
    error:
      "border-red-500 text-red-400 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
    info: "border-blue-500 text-blue-400 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]",
  };

  return (
    <div
      className={`fixed top-6 right-6 z-[100] px-6 py-3 border-l-4 rounded-r-lg backdrop-blur-md transition-all animate-in slide-in-from-right duration-300 font-mono text-[11px] uppercase tracking-widest ${colors[type]}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-1.5 h-1.5 rounded-full animate-pulse ${type === "error" ? "bg-red-500" : "bg-cyan-500"}`}
        />
        <span>{message}</span>
      </div>
    </div>
  );
};
