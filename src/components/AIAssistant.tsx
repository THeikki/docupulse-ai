"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantProps {
  activeDocument: {
    id: string;
    file_name: string;
    content: string;
  } | null;
}

export const AIAssistant = ({ activeDocument }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([]);
    setInput("");
  }, [activeDocument?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeDocument || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const fullPrompt = `
      Käytä alla olevaa dokumentin tekstiä vastataksesi kysymykseen mahdollisimman tarkasti.
      
      DOKUMENTIN TEKSTI:
      ${activeDocument.content}
      
      KÄYTTÄJÄN KYSYMYS:
      ${input}
    `;

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text },
      ]);
    } catch (error) {
      console.error("AI_LINK_FAILURE:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "CRITICAL_ERROR: Neural link failed. Verify AI_API_KEY status.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/40 rounded-2xl border border-cyan-500/10 overflow-hidden backdrop-blur-md">
      <div className="p-3 border-b border-cyan-500/10 bg-cyan-500/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${activeDocument ? "bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" : "bg-slate-700"}`}
          />
          <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.2em] italic">
            {activeDocument
              ? `Analysoidaan: ${activeDocument.file_name}`
              : "Järjestelmä valmiustilassa"}
          </span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth custom-scrollbar"
      >
        {!activeDocument ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
            <span className="text-4xl mb-4">🧠</span>
            <p className="text-[10px] text-cyan-500 font-mono uppercase tracking-[0.3em]">
              Valitse lähdemateriaali
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-4 rounded-lg border border-cyan-500/10 bg-cyan-500/5">
            <p className="text-[10px] text-cyan-500/80 font-mono leading-relaxed">
              &gt; Dokumentti `{activeDocument.file_name}` analysoitu. <br />
              &gt; Odotetaan syötettä...
            </p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] p-3 rounded-xl text-[11px] leading-relaxed border transition-all ${
                  m.role === "user"
                    ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-50"
                    : "bg-slate-950/60 border-slate-800 text-slate-300"
                }`}
              >
                <span className="text-[8px] font-bold uppercase mb-1 block opacity-30 tracking-tighter">
                  {m.role === "user" ? "User_Input" : "DocuPulse_AI"}
                </span>
                {m.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-950/40 border border-cyan-500/20 px-4 py-2 rounded-full animate-pulse">
              <span className="text-[9px] text-cyan-400 font-mono tracking-widest uppercase">
                Käsitellään..
              </span>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-black/20 border-t border-cyan-500/10"
      >
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!activeDocument || loading}
            placeholder={
              activeDocument
                ? "Kysy dokumentista..."
                : "Valitse dokumentti ensin"
            }
            className="w-full bg-slate-950/80 border border-cyan-500/20 rounded-xl py-3 pl-4 pr-12 text-[11px] text-slate-200 placeholder:text-slate-800 focus:outline-none focus:border-cyan-500/50 transition-all font-mono"
          />
          <button
            type="submit"
            disabled={!activeDocument || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-500 hover:text-cyan-400 disabled:text-slate-900 transition-all"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
