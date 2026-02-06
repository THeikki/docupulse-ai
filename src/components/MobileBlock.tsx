"use client";

export const MobileBlock = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-8 text-center">
    <div className="w-16 h-16 mb-6 border-2 border-red-500/50 rounded-full flex items-center justify-center animate-pulse">
      <span className="text-2xl text-red-500">⚠️</span>
    </div>
    <h2 className="text-xl font-black text-red-500 uppercase tracking-[0.3em] mb-4 italic">
      Yhteensopivuusvirhe
    </h2>
    <div className="max-w-xs space-y-4">
      <p className="text-xs text-slate-400 font-mono leading-relaxed uppercase">
        DocuPulse AI vaatii laajan resoluution optimaaliseen käyttökokemukseen.
      </p>
      <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
        <p className="text-[10px] text-red-400/80 font-bold uppercase tracking-widest">
          Käytä työpöytäversiota jatkaaksesi.
        </p>
      </div>
    </div>
    <p className="mt-12 text-[8px] text-slate-700 font-mono uppercase tracking-[0.5em]">
      System_Access_Denied: low_res_detected
    </p>
  </div>
);
