import React, { useState, useEffect, useRef } from "react";
import { X, Sparkles, Save } from "lucide-react";

interface SaveToastProps {
  isVisible: boolean;
  onSave: () => void;
  onDismiss: () => void;
  isSaving?: boolean;
}

const SaveToast: React.FC<SaveToastProps> = ({
  isVisible,
  onSave,
  onDismiss,
  isSaving = false,
}) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const DURATION = 15000; // 15 seconds

  useEffect(() => {
    if (!isVisible || isSaving || isPaused) {
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
  }, [isVisible, isSaving, isPaused, onDismiss]);

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
          <div className="p-2 bg-primary/20 rounded-xl text-primary shrink-0">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-800 leading-tight">
              ¿Quieres guardar esta solicitud?
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Podrás acceder a ella más tarde desde tu panel de aplicaciones.
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
            onClick={onSave}
            disabled={isSaving}
            className="flex-1 py-2.5 px-4 bg-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={14} className="group-hover:-translate-y-px transition-transform" />
            )}
            {isSaving ? "Guardando..." : "Sí, guardar"}
          </button>
          <button
            onClick={onDismiss}
            disabled={isSaving}
            className="flex-1 py-2.5 px-4 bg-white/50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:bg-white hover:border-slate-300 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            Ahora no
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-primary/30 w-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Decorative background element for premium feel */}
      <div className="absolute -z-10 top-0 left-0 w-full h-full bg-linear-to-br from-primary/5 to-secondary/5 blur-2xl rounded-2xl opacity-50" />
    </div>
  );
};

export default SaveToast;
