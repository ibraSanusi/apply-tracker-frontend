import { useState, useEffect } from "react";
import { X, Mail, Copy, Check, Send, MessageSquare, Clock } from "lucide-react";
import type { Application } from "../types/application.types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (message: string) => void;
    isLoading: boolean;
    title: string;
    confirmText: string;
    app: Application & { username: string };
    week: number;
}

const defaultMessage = (app: Application & { username: string }, week: number) =>
    `Hola,\n\n` +
    `Hace ${week} días envié mi candidatura como ${app.position} a ${app.company} y ` +
    `quería hacer un breve seguimiento.\n\n` +
    `¿Tienen alguna novedad al respecto?\n\n` +
    `Gracias,\n\n` +
    `${app.username}`;

export default function FollowUpModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    title,
    confirmText,
    app,
    week,
}: Props) {
    const [message, setMessage] = useState(defaultMessage(app, week));
    const [copied, setCopied] = useState(false);

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

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const handleSendEmail = () => {
        if (!app.email) return;
        const subject = encodeURIComponent(`Seguimiento Candidatura - ${app.position} - ${app.username}`);
        const body = encodeURIComponent(message);
        window.location.href = `mailto:${app.email}?subject=${subject}&body=${body}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">{title}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    {app.company} • {app.position}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Quick Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-400 mb-1">
                                <Clock size={14} />
                                <span className="text-[10px] font-black uppercase tracking-wider">Days since applied</span>
                            </div>
                            <p className="text-lg font-black text-slate-900">{week} Days</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-400 mb-1">
                                <Mail size={14} />
                                <span className="text-[10px] font-black uppercase tracking-wider">Contact Email</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900 truncate">
                                {app.email || "No email provided"}
                            </p>
                        </div>
                    </div>

                    {/* Message Area */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Follow-up Message
                            </label>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <Check size={12} /> Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={12} /> Copy
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="relative group">
                            <textarea
                                className="w-full h-48 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none scrollbar-hide"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write your follow-up message here..."
                            />
                            <div className="absolute bottom-3 right-3 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                <span className="text-[10px] font-bold text-slate-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-slate-100">
                                    {message.length} characters
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Email Action */}
                    {app.email && (
                        <button
                            onClick={handleSendEmail}
                            className="w-full flex items-center justify-center gap-3 p-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl text-emerald-700 font-bold transition-all group"
                        >
                            <div className="p-2 bg-emerald-100 group-hover:bg-emerald-200 rounded-xl transition-colors">
                                <Send size={18} />
                            </div>
                            <span>Open Email Client</span>
                        </button>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-50 p-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-8 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(message)}
                        disabled={isLoading}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Check size={20} />
                        )}
                        {isLoading ? "Updating..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
