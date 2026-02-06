"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import * as pdfjs from "pdfjs-dist";
import { SystemNotification } from "./SystemNotification";

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

interface PDFTextItem {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
}

interface MainContentProps {
  onUploadSuccess: () => void;
}

export const MainContent = ({ onUploadSuccess }: MainContentProps) => {
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        const strings = textContent.items.map((item) => {
          const textItem = item as PDFTextItem;
          return textItem.str;
        });
        fullText += strings.join(" ") + "\n";
      }
      return fullText;
    } catch (error) {
      console.error("PDF_TEKSTIN_EROTUS_EPÄONNISTUI:", error);
      return "";
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user)
        throw new Error("Käyttäjää ei tunnistettu. Kirjaudu uudelleen.");

      const extractedText = await extractTextFromPDF(file);
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("documents").insert([
        {
          user_id: user.id,
          file_name: file.name,
          storage_path: filePath,
          file_size: file.size,
          content: extractedText,
        },
      ]);

      if (dbError) throw dbError;

      onUploadSuccess();
      setNotification({
        msg: "Dokumentti tallennettu profiiliisi.",
        type: "success",
      });
    } catch (error) {
      console.error("PROCESS_CRITICAL_FAILURE:", error);
      setNotification({
        msg: 'VIRHE: Tiedostomuoto on väärä',
        type: "error",
      });
    } finally {
      setUploading(false);
      if (event.target) event.target.value = "";
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl border-2 border-dashed border-cyan-500/20 rounded-3xl bg-slate-900/40 backdrop-blur-xl p-12 transition-all hover:border-cyan-400/40 hover:bg-cyan-500/5 group flex flex-col items-center text-center relative overflow-hidden">
        <div
          className={`w-20 h-20 rounded-full border-2 border-cyan-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all relative ${uploading ? "animate-pulse" : ""}`}
        >
          <span className="text-3xl relative z-10">📄</span>
          {uploading && (
            <div className="absolute inset-0 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        <h2 className="text-xl font-black text-cyan-400 uppercase tracking-tighter italic mb-2">
          {uploading ? "Analysoidaan..." : "Lataa lähdemateriaali"}
        </h2>

        <p className="text-slate-500 text-sm mb-8 max-w-xs font-mono">
          {uploading &&
            "Etsitään tietokuvioita ja synkronoidaan DocuPulse AI:n kanssa..."}
        </p>

        <label
          className={`relative px-10 py-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-[0.2em] cursor-pointer hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)] active:scale-95 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {uploading ? "Käsitellään..." : "Valitse tiedosto"}
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>

        <div className="mt-10 flex gap-6 text-[9px] text-slate-600 font-mono uppercase tracking-[0.3em]">
          <span className="flex items-center gap-1">
            <div className="w-1 h-1 bg-cyan-500 rounded-full" /> Salattu
          </span>
          <span className="flex items-center gap-1">
            <div className="w-1 h-1 bg-cyan-500 rounded-full" /> PDF
          </span>
          <span className="flex items-center gap-1">
            <div className="w-1 h-1 bg-cyan-500 rounded-full" /> Max_10MB
          </span>
        </div>

        {notification && (
          <SystemNotification
            message={notification.msg}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </div>
  );
};
