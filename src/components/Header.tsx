"use client";

import { supabase } from "@/lib/supabaseClient";

export const Header = () => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-500/20 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
        <div className="flex items-center gap-2 justify-center md:justify-start">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          <h1 className="text-2xl md:text-3xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_2px_10px_rgba(34,211,238,0.3)]">
            DocuPulse AI
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] md:text-xs font-mono tracking-widest uppercase text-cyan-500/70">
          <p className="whitespace-nowrap">
            <span className="text-cyan-400/90 font-bold">Heikki Törmänen</span>
          </p>
          <span className="px-2 py-1 border border-cyan-500/30 rounded bg-cyan-500/5">
            @2026
          </span>
        </div>

        <div className="flex items-center justify-center md:justify-end">
          <button
            onClick={handleSignOut}
            className="border-2 border-cyan-500 px-6 py-1.5 text-xs font-black uppercase italic text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] active:scale-95"
          >
            Lopeta_Istunto
          </button>
        </div>
      </div>
    </header>
  );
};
