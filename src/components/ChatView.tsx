import React, { useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, AlertCircle, Download } from "lucide-react";
import { ChatMessage } from "../types.js";

interface ChatViewProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => void;
  isPending: boolean;
  activeAgent: string;
}

export default function ChatView({ chatHistory, onSendMessage, isPending, activeAgent }: ChatViewProps) {
  const [input, setInput] = React.useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isPending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;
    onSendMessage(input.trim());
    setInput("");
  };

  // Export Chat to Markdown format
  const handleExportChat = () => {
    const markdown = chatHistory
      .map(
        (msg) =>
          `### ${msg.role === "user" ? "You" : `AI Agent (${msg.agentName || "Mentor"})`} - ${msg.timestamp}\n\n${
            msg.text
          }\n`
      )
      .join("\n---\n\n");

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "career-mentor-session.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col h-[500px] bg-white dark:bg-slate-900 rounded-2xl border border-[#E2E8F0] dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Chat header */}
      <div className="p-4 bg-[#F8FAFC] dark:bg-slate-950 border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4.5 h-4.5 text-[#3B82F6]" />
          <div>
            <h4 className="text-xs font-extrabold text-[#0F172A] dark:text-slate-100 uppercase tracking-wider">
              Interactive Agent Consultation
            </h4>
            <p className="text-[10px] text-[#64748B]">
              Active Specialist: <strong className="text-[#3B82F6] dark:text-blue-400">{activeAgent}</strong>
            </p>
          </div>
        </div>
        {chatHistory.length > 0 && (
          <button
            onClick={handleExportChat}
            className="inline-flex items-center gap-1 px-2 py-1.5 bg-[#F8FAFC] hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#475569] dark:text-slate-300 text-2xs font-bold rounded-lg border border-[#E2E8F0] dark:border-slate-800 transition-colors cursor-pointer"
            title="Export Chat as Markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Chat</span>
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EFF6FF] dark:bg-indigo-950/20 text-[#3B82F6] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="max-w-xs space-y-1">
              <h5 className="text-xs font-bold text-[#0F172A] dark:text-slate-300">Start the Discussion</h5>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Ask specific career questions like: <br />
                <span className="italic font-medium">"How can I tailor my resume for Week 1?"</span> or <br />
                <span className="italic font-medium">"Provide details on the technical coding answer."</span>
              </p>
            </div>
          </div>
        ) : (
          chatHistory.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    isUser
                      ? "bg-[#3B82F6] text-white rounded-br-none"
                      : "bg-[#F8FAFC] dark:bg-slate-950 text-[#1E293B] dark:text-slate-100 rounded-bl-none border border-[#E2E8F0] dark:border-slate-800/80"
                  }`}
                >
                  {!isUser && msg.agentName && (
                    <div className="flex items-center gap-1 mb-1 text-[9px] font-extrabold text-[#3B82F6] uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      <span>{msg.agentName}</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1.5 text-right ${
                      isUser ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Loading state indicator */}
        {isPending && (
          <div className="flex justify-start">
            <div className="bg-[#F8FAFC] dark:bg-slate-950 rounded-2xl rounded-bl-none p-3.5 border border-[#E2E8F0] dark:border-slate-800/80 flex items-center gap-2">
              <div className="flex space-x-1.5">
                <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wider">
                {activeAgent} thinking...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-950 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message your Career Mentor Agent...`}
          disabled={isPending}
          className="flex-1 px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#3B82F6] text-[#1E293B] dark:text-slate-100"
        />
        <button
          type="submit"
          disabled={!input.trim() || isPending}
          className="p-2 bg-[#3B82F6] hover:bg-blue-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-xl transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
