"use client";

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SystemModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-cyan-500/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

        <h3 className="text-sm font-black text-cyan-400 uppercase tracking-[0.3em] italic mb-4">
          {title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed font-mono mb-8">
          {message}
        </p>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-700 text-[10px] font-bold text-slate-500 hover:bg-slate-800 transition-all uppercase tracking-widest"
          >
            Peruuta
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/50 text-[10px] font-bold text-red-500 hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.1)]"
          >
            Vahvista
          </button>
        </div>
      </div>
    </div>
  );
};
