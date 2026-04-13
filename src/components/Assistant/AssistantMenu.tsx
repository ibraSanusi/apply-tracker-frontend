import { Save, AlertCircle } from "lucide-react";

interface AssistantMenuProps {
  hasPendingSave: boolean;
  onShowToast: () => void;
  isSaving?: boolean;
  className?: string;
}

const AssistantMenu: React.FC<AssistantMenuProps> = ({
  hasPendingSave,
  onShowToast,
  isSaving = false,
  className = "",
}) => {
  if (!hasPendingSave) return null;

  return (
    <div className={`flex items-center justify-between px-4 py-2 bg-secondary/5 border-y border-secondary/10 ${className} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
      <div className="flex items-center gap-2 text-secondary">
        <AlertCircle size={14} className="animate-pulse" />
        <span className="text-[11px] font-medium tracking-wide">Tienes una solicitud pendiente por guardar</span>
      </div>
      <button
        onClick={onShowToast}
        disabled={isSaving}
        className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-white text-[10px] font-bold rounded-lg hover:bg-secondary-dark transition-all active:scale-95 disabled:opacity-70 group"
      >
        {isSaving ? (
          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Save size={12} className="group-hover:-translate-y-px transition-transform" />
        )}
        Guardar ahora
      </button>
    </div>
  );
};

export default AssistantMenu;
