"use client";

import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { Header } from "@/components/Header";
import { LoginPage } from "@/components/LoginPage";
import { MobileBlock } from "@/components/MobileBlock";
import dynamic from "next/dynamic";

const MainContent = dynamic(
  () => import("@/components/MainContent").then((mod) => mod.MainContent),
  {
    ssr: false,
    loading: () => <div className="flex-1 bg-black animate-pulse" />,
  },
);
const DocumentList = dynamic(
  () => import("@/components/DocumentList").then((mod) => mod.DocumentList),
  {
    ssr: false,
  },
);
const AIAssistant = dynamic(
  () => import("@/components/AIAssistant").then((mod) => mod.AIAssistant),
  {
    ssr: false,
  },
);

interface PDFDocument {
  id: string;
  file_name: string;
  created_at: string;
  file_size: number;
  content: string;
}

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState<PDFDocument | null>(
    null,
  );

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkSize();
    window.addEventListener("resize", checkSize);

    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setAuthLoading(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => {
      window.removeEventListener("resize", checkSize);
      subscription.unsubscribe();
    };
  }, []);

  const handleUploadSuccess = () => {
    setRefreshSignal((prev) => prev + 1);
  };

  if (isMobile) {
    return <MobileBlock />;
  }

  if (authLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center font-black italic text-cyan-500 uppercase animate-pulse">
        Alustetaan_Neuraalilinkkiä...
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <Header />

      <main className="flex flex-1 overflow-hidden">
        <section className="flex-1 relative bg-slate-900/40 p-6 overflow-y-auto border-r border-cyan-500/5">
          <MainContent onUploadSuccess={handleUploadSuccess} />
        </section>

        <aside className="w-80 flex flex-col bg-slate-950/50 backdrop-blur-sm">
          <div className="flex-[0.4] p-4 overflow-hidden border-b border-cyan-500/10">
            <DocumentList
              refreshSignal={refreshSignal}
              onSelectDocument={(doc: PDFDocument | null) =>
                setSelectedDocument(doc)
              }
            />
          </div>

          <div className="flex-[0.6] p-4 overflow-hidden">
            <AIAssistant activeDocument={selectedDocument} />
          </div>
        </aside>
      </main>

      <footer className="h-6 bg-black border-t border-cyan-500/10 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
          <span className="text-[9px] uppercase tracking-widest text-cyan-500/50 font-mono">
            Suojattu yhteys: {session.user.email}
          </span>
        </div>
        <div className="text-[9px] text-slate-600 font-mono italic text-right">
          DocuPulse_Engine_v.2026.0.1
        </div>
      </footer>
    </div>
  );
}
