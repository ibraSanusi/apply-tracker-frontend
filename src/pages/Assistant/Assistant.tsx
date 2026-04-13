import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { assistantService } from "../../services/assistant.service";
import { applicationsService } from "../../services/applications.service";
import { cvTemplate } from "../../lib/constants";
import { useAuth } from "../../context/AuthContext";
import SaveToast from "../../components/Assistant/SaveToast";
import AssistantMenu from "../../components/Assistant/AssistantMenu";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Assistant() {
  const [jobDescription, setJobDescription] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [hasPendingSave, setHasPendingSave] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastResponse, setLastResponse] = useState("");
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleChat = async () => {
    if (!jobDescription.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: jobDescription,
    };

    setMessages((prev) => [...prev, userMessage]);
    setJobDescription("");
    setIsTyping(true);

    try {
      const res = await assistantService.chat({
        jobDescription,
        cvTemplate,
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedContent }
              : msg,
          ),
        );
      }

      setLastResponse(accumulatedContent);
      setShowSaveToast(true);
      setHasPendingSave(true);
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Lo siento, hubo un error al procesar tu solicitud.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSaveApplication = async () => {
    if (!lastResponse) return;

    setIsSaving(true);
    try {
      const cleanResponse = lastResponse
        .replace(/```json/g, "")
        .replace(/```/g, "");

      const data = JSON.parse(cleanResponse);
      const payload = {
        ...data,
        cv: JSON.stringify(data.cv),
      };

      // Sanitize payload to prevent 400 errors from backend
      if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        delete payload.email;
      }
      if (payload.salary) {
        payload.salary = Number(String(payload.salary).replace(/[^0-9.]/g, ""));
        if (isNaN(payload.salary)) delete payload.salary;
      }

      await applicationsService.save(payload);
      setShowSaveToast(false);
      setHasPendingSave(false);
    } catch (error) {
      console.error("Error saving application:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto bg-white/50 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-primary text-white flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold">AI Assistant</h2>
          <p className="text-xs text-white/70">
            Personalized Application Advice
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
            <div className="p-4 bg-primary/10 rounded-full">
              <Bot size={48} className="text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                ¡Hola, {user?.name}!
              </h3>
              <p className="text-slate-600 max-w-xs mx-auto">
                Pega la descripción de la oferta de trabajo y te ayudaré a
                adaptar tu CV.
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                message.role === "user"
                  ? "bg-secondary text-white"
                  : "bg-primary text-white"
              } shadow-lg`}
            >
              {message.role === "user" ? <User size={20} /> : <Bot size={20} />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                message.role === "user"
                  ? "bg-secondary text-white rounded-tr-none"
                  : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
              }`}
            >
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isTyping && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-4 flex-row">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg">
              <Bot size={20} />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-5 py-3 shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-primary" />
              <span className="text-sm text-slate-500 italic">
                Analizando oferta...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        {/* Save Action Manual Menu */}
        <AssistantMenu
          hasPendingSave={hasPendingSave && !showSaveToast}
          onShowToast={() => setShowSaveToast(true)}
          isSaving={isSaving}
          className="mb-4 rounded-xl"
        />
        <div className="relative flex items-end gap-2 max-w-3xl mx-auto">
          <textarea
            className="flex-1 min-h-[56px] max-h-40 p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
            placeholder="Pega aquí la descripción del empleo..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleChat();
              }
            }}
          />
          <button
            onClick={handleChat}
            disabled={!jobDescription.trim() || isTyping}
            className={`p-4 rounded-xl flex items-center justify-center transition-all ${
              !jobDescription.trim() || isTyping
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-primary text-white shadow-lg hover:bg-primary-dark active:scale-95"
            }`}
          >
            {isTyping ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <Send size={24} />
            )}
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-slate-400">
          Presiona Enter para enviar • Shift + Enter para nueva línea
        </p>
      </div>


      {/* Save Toast */}
      <SaveToast
        isVisible={showSaveToast}
        isSaving={isSaving}
        onSave={handleSaveApplication}
        onDismiss={() => setShowSaveToast(false)}
      />
    </div>
  );
}
