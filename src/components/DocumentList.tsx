"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { SystemNotification } from "./SystemNotification";
import { SystemModal } from "../components/modals/SystemModal";

interface PDFDocument {
  id: string;
  file_name: string;
  created_at: string;
  file_size: number;
  content: string;
  storage_path: string;
}

interface DocumentListProps {
  refreshSignal: number;
  onSelectDocument: (doc: PDFDocument | null) => void;
}

export const DocumentList = ({
  refreshSignal,
  onSelectDocument,
}: DocumentListProps) => {
  const [documents, setDocuments] = useState<PDFDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<PDFDocument | null>(
    null,
  );

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("documents")
        .select("id, file_name, storage_path, created_at, file_size, content")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Virhe haettaessa dokumentteja:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refreshSignal]);

  const openDeleteModal = (e: React.MouseEvent, doc: PDFDocument) => {
    e.stopPropagation();
    setDocumentToDelete(doc);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!documentToDelete) return;

    try {
      await supabase.storage
        .from("documents")
        .remove([documentToDelete.storage_path]);
      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentToDelete.id);

      if (dbError) throw dbError;

      setDocuments((prev) => prev.filter((d) => d.id !== documentToDelete.id));
      if (selectedId === documentToDelete.id) {
        setSelectedId(null);
        onSelectDocument(null);
      }
      setNotification({ msg: "Poisto onnistui", type: "success" });
    } catch (error) {
      setNotification({ msg: `Poisto epäonnistui: ${error}`, type: "error" });
    } finally {
      setIsModalOpen(false);
      setDocumentToDelete(null);
    }
  };

  const handleSelect = (doc: PDFDocument) => {
    setSelectedId(doc.id);
    onSelectDocument(doc);
  };

  if (loading && documents.length === 0) {
    return (
      <div className="text-[10px] text-cyan-500/50 font-mono animate-pulse p-4 uppercase tracking-widest">
        Haetaan tiedostoja...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest italic">
          Lähdetiedostot
        </h3>
        <span className="text-[9px] text-slate-600 font-mono uppercase">
          {documents.length} Kappaletta
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {documents.length === 0 ? (
          <div className="text-[10px] text-slate-700 font-mono italic p-4 border border-cyan-500/5 rounded-lg text-center uppercase tracking-tighter">
            Ei_löytyneitä_tiedostoja
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleSelect(doc)}
              className={`group relative flex flex-col p-3 rounded-lg border transition-all cursor-pointer overflow-hidden ${
                selectedId === doc.id
                  ? "bg-cyan-500/10 border-cyan-500/40"
                  : "bg-slate-900/40 border-cyan-500/5 hover:border-cyan-500/20"
              }`}
            >
              {selectedId === doc.id && (
                <div className="absolute left-0 top-0 w-1 h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
              )}

              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-slate-300 group-hover:text-cyan-400 truncate pr-4">
                  {doc.file_name}
                </span>
                <button
                  onClick={(e) => openDeleteModal(e, doc)}
                  className="text-slate-600 hover:text-red-500 transition-colors p-1"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </div>

              <div className="flex justify-between items-center mt-2 border-t border-cyan-500/5 pt-2">
                <span className="text-[8px] text-slate-500 font-mono uppercase">
                  {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                </span>
                <span className="text-[8px] text-slate-600 font-mono">
                  {new Date(doc.created_at).toLocaleDateString("fi-FI")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <SystemModal
        isOpen={isModalOpen}
        title="VAHVISTA_POISTO"
        message={`Oletko varma, että haluat poistaa tiedoston "${documentToDelete?.file_name}" pysyvästi järjestelmästä?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsModalOpen(false);
          setDocumentToDelete(null);
        }}
      />

      {notification && (
        <SystemNotification
          message={notification.msg}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};
