"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Minimize2,
  Info,
  Activity,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { AssessmentContext, ChatMessage } from "@/app/api/chat/route";

interface ChatbotProps {
  context?: AssessmentContext;
  isOpenExternal?: boolean;
  onToggleExternal?: (open: boolean) => void;
}

const DEFAULT_WELCOME = 
  "Hi! I'm the **MediScan-AI Assistant**. I can help explain your health risk screening results, clarify medical biomarkers (like BMI, Cholesterol, Blood Pressure), and guide you on the assessment process.";

const SUGGESTED_PROMPTS = [
  "Explain my result",
  "What does my risk score mean?",
  "What is BMI?",
  "How does the prediction work?",
  "What should I do next?",
];

export default function Chatbot({
  context,
  isOpenExternal,
  onToggleExternal,
}: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: DEFAULT_WELCOME },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync external open trigger (e.g. from "Ask AI Assistant" buttons in navbar or result screen)
  useEffect(() => {
    if (typeof isOpenExternal === "boolean") {
      setIsOpen(isOpenExternal);
    }
  }, [isOpenExternal]);

  const toggleChat = (open: boolean) => {
    setIsOpen(open);
    if (onToggleExternal) onToggleExternal(open);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          context,
          history: updatedMessages,
        }),
      });

      if (!res.ok) throw new Error("Chat server response error");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Thank you for your question." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I encountered a temporary connection issue. Please make sure the system is running and try asking again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([{ role: "assistant", content: DEFAULT_WELCOME }]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleChat(true)}
              className="px-4 py-3 rounded-full bg-gradient-to-r from-sky-600 via-teal-600 to-sky-700 text-white shadow-xl shadow-sky-600/30 flex items-center gap-2.5 group cursor-pointer border border-white/20"
              id="open-chatbot-btn"
              aria-label="Open MediScan AI Assistant"
            >
              <div className="relative">
                <Bot className="w-6 h-6 text-white animate-bounce-short" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold leading-tight flex items-center gap-1">
                  <span>MediScan AI Assistant</span>
                  <Sparkles className="w-3 h-3 text-sky-200" />
                </span>
                <span className="text-[10px] text-sky-100 font-medium">Ask questions & results</span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden text-slate-900"
            id="chatbot-window"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-500 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">MediScan AI Assistant</h3>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Your health information assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Clear conversation"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Clear chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleChat(false)}
                  title="Minimize assistant"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Minimize chat"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Assessment Context Alert Banner */}
            {context && context.riskLevel && (
              <div className="px-4 py-2 bg-sky-50 border-b border-sky-100 text-sky-900 text-xs flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span className="font-semibold truncate">
                    Active: {context.disease} ({context.riskLevel} • {context.probability}%)
                  </span>
                </div>
                <span className="text-[10px] text-sky-600 uppercase font-bold tracking-wider">Loaded</span>
              </div>
            )}

            {/* Chat Message Scrollable Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((msg, index) => {
                const isAssistant = msg.role === "assistant";
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-2.5 ${isAssistant ? "justify-start" : "justify-end"}`}
                  >
                    {isAssistant && (
                      <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs text-xs font-bold mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                        isAssistant
                          ? "bg-white text-slate-800 border border-slate-200/90 shadow-xs rounded-tl-sm whitespace-pre-line"
                          : "bg-gradient-to-r from-sky-600 to-teal-600 text-white font-medium rounded-tr-sm shadow-md"
                      }`}
                    >
                      {/* Simple Markdown Bold parsing */}
                      {msg.content.split("\n").map((line, lIdx) => {
                        const boldParsed = line.split(/(\*\*.*?\*\*)/g).map((part, pIdx) => {
                          if (part.startsWith("**") && part.endsWith("**")) {
                            return (
                              <strong key={pIdx} className="font-bold text-slate-900 dark:text-white">
                                {part.slice(2, -2)}
                              </strong>
                            );
                          }
                          return part;
                        });
                        return (
                          <p key={lIdx} className={lIdx > 0 ? "mt-1.5" : ""}>
                            {boldParsed}
                          </p>
                        );
                      })}
                    </div>

                    {!isAssistant && (
                      <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs text-xs mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div className="bg-white border border-slate-200 px-3 py-2 rounded-xl flex items-center gap-1 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompt Pills */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-700 border border-slate-200/80 transition-colors whitespace-nowrap cursor-pointer shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Message Input Box */}
            <div className="p-3 bg-white border-t border-slate-200 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a question or request explanation..."
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 transition-colors text-slate-800 placeholder-slate-400"
                  id="chatbot-input-field"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white transition-colors cursor-pointer shadow-xs"
                  aria-label="Send message"
                  id="chatbot-send-btn"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Safety disclaimer */}
              <div className="pt-2 text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-slate-400" />
                <span>AI screening support only • Not medical advice</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
