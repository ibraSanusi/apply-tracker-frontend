import React, { useState, useEffect, useRef } from "react";
import { X, CheckCircle, ExternalLink } from "lucide-react";

interface SaveSuccessToastProps {
  isVisible: boolean;
  onNavigate: () => void;
  onDismiss: () => void;
}

const SaveSuccessToast: React.FC<SaveSuccessToastProps> = ({
  isVisible,
  onNavigate,
  onDismiss,
}) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const DURATION = 8000; // 8 seconds

  useEffect(() => {
    if (!isVisible || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const interval = 100;
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev - (interval / DURATION) * 100;
        if (next <= 0) {
          clearInterval(timerRef.current!);
          onDismiss();
          return 0;
        }
        return next;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isVisible, isPaused, onDismiss]);

  // Reset progress when it becomes visible
  useEffect(() => {
    if (isVisible) {
      setProgress(100);
      setIsPaused(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="glass p-5 rounded-2xl shadow-2xl border border-white/40 max-w-sm flex flex-col gap-4 bg-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-600 shrink-0">
            <CheckCircle size={20} className="animate-bounce" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="text-sm font-bold text-slate-800 leading-tight">
              ¡Guardado con éxito!
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Tu solicitud ha sido guardada. ¿Quieres ver los detalles ahora?
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onNavigate}
            className="flex-1 py-2.5 px-4 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <ExternalLink size={14} className="group-hover:translate-x-px group-hover:-translate-y-px transition-transform" />
            Ver detalles
          </button>
          <button
            onClick={onDismiss}
            className="flex-1 py-2.5 px-4 bg-white/50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:bg-white hover:border-slate-300 active:scale-[0.98] transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-emerald-500/30 w-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -z-10 top-0 left-0 w-full h-full bg-linear-to-br from-emerald-500/5 to-teal-500/5 blur-2xl rounded-2xl opacity-50" />
    </div>
  );
};

export default SaveSuccessToast;
