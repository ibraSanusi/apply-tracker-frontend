import { X, ExternalLink, Download } from "lucide-react";
import { useEffect } from "react";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export default function PreviewModal({
  isOpen,
  onClose,
  url,
  title,
}: PreviewModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden transform transition-all animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <ExternalLink className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-xs sm:max-w-md">
                Document Preview
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-slate-500 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2 font-bold text-sm px-3"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Open Original</span>
            </a>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 bg-slate-100 relative">
          <iframe 
            src={`${url}#toolbar=0`} 
            className="w-full h-full border-none"
            title="PDF Preview"
          />
        </div>
      </div>
    </div>
  );
}
