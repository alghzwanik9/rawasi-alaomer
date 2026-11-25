"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Building2,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  leadCreated?: {
    refId: string;
    contactName: string;
    contactPhone: string;
    whatsappUrl: string;
  };
  suggestions?: string[];
  createdAt: string;
}

const INITIAL_WELCOME_MESSAGE: Message = {
  id: "msg_welcome",
  role: "assistant",
  content: `مرحباً بك في **منصة رواسي العمر للاستشارات والتنفيذ المتكامل** 🏛️
أنا مساعدك الاستشاري الذكي، جاهز للإجابة عن خدمات قطاعاتنا الخمسة (المقاولات، التوريد، التقنية، التشغيل، وتمكين القطاع غير الربحي)، أو مساعدتك في أدلة ونماذج **مرجع الجمعيات**، وقيد طلب مشروعك لإحالته مباشرة للإدارة التنفيذية.

كيف يمكنني خدمتك اليوم؟`,
  suggestions: [
    "📋 استفسار عن ترخيص وتأسيس جمعية",
    "🏗️ طلب دراسة مشروع مقاولات وتأهيل",
    "📥 ما هي النماذج المتوفرة في مرجع الجمعيات؟",
    "💬 أرغب في التواصل مع الإدارة التنفيذية",
  ],
  createdAt: new Date().toISOString(),
};

const SESSION_STORAGE_KEY = "rawasi_ai_chat_session_v1";

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat session from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  // Save chat session to sessionStorage
  useEffect(() => {
    try {
      if (messages.length > 1) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages));
      }
    } catch {
      // sessionStorage unavailable
    }
  }, [messages]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue("");
    setIsLoading(true);

    try {
      // Prepare payload with formatted messages history
      const payload = {
        sessionId: "session_user",
        messages: newHistory.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          content: m.content,
        })),
      };

      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: `ast_${Date.now()}`,
        role: "assistant",
        content:
          data.reply ||
          "أهلاً بك. يسعدنا استلام استفسارك ومتابعة احتياجك مع الإدارة التنفيذية.",
        leadCreated: data.leadCreated,
        suggestions: data.suggestions,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (!isOpen) {
        setHasUnread(true);
      }
    } catch {
      const fallbackMessage: Message = {
        id: `err_${Date.now()}`,
        role: "assistant",
        content:
          "نعتذر، تعذر الاتصال المباشر بالخادم في هذه اللحظة. يسعدنا تواصلكم المباشر مع إدارة رواسي العمر عبر واتساب على الرقم: **+966538881885**.",
        suggestions: ["المتابعة عبر واتساب", "أدلة مرجع الجمعيات"],
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  return (
    <div dir="rtl" className="relative font-sans text-right">
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group hidden sm:flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg border border-[#E2ECF5] text-xs font-semibold text-[#163063] hover:text-[#47A3B8] hover:border-[#47A3B8]/40 transition-all hover:scale-105"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#47A3B8] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#47A3B8]"></span>
            </span>
            <span>استشر مساعد رواسي الذكي</span>
            <Sparkles className="w-3.5 h-3.5 text-[#47A3B8]" />
          </button>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "إغلاق المساعد الذكي" : "فتح المساعد الذكي"}
          className={`relative p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center ${
            isOpen
              ? "bg-[#163063] text-white rotate-90 scale-95"
              : "bg-gradient-to-tr from-[#163063] via-[#2360A5] to-[#47A3B8] text-white hover:scale-110 hover:shadow-cyan-900/20"
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white ring-2 ring-emerald-400/30 animate-pulse" />
              )}
            </>
          )}
        </button>
      </div>

      {/* Chat Window Drawer / Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="مساعد رواسي العمر الاستشاري الذكي"
          className="fixed bottom-24 left-4 sm:left-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[calc(100vh-7rem)] bg-white rounded-2xl shadow-2xl border border-[#E2ECF5] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#163063] via-[#1B3B73] to-[#2360A5] p-4 text-white flex items-center justify-between select-none border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-[#47A3B8]">
                <Sparkles className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white">مساعد رواسي الاستشاري</h3>
                  <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-medium px-2 py-0.5 rounded-full border border-emerald-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    نشط 24/7
                  </span>
                </div>
                <p className="text-[11px] text-blue-100/80">استشارات المشاريع وأدلة مرجع الجمعيات</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              <button
                onClick={handleResetChat}
                title="بدء محادثة جديدة"
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="تصغير"
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F2F8FC]/40 text-xs sm:text-[13px] leading-relaxed">
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? "items-start" : "items-end"}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl ${
                      isUser
                        ? "bg-[#163063] text-white rounded-tr-none shadow-sm"
                        : "bg-white text-slate-800 rounded-tl-none border border-[#E2ECF5] shadow-sm"
                    }`}
                  >
                    {/* Render plain text with bold formatting */}
                    <div className="whitespace-pre-wrap space-y-1">
                      {m.content.split("\n").map((line, i) => {
                        // Highlight bold text
                        const formatted = line.replace(
                          /\*\*(.*?)\*\*/g,
                          "<strong class='font-bold text-[#163063]'>$1</strong>"
                        );
                        return (
                          <p
                            key={i}
                            dangerouslySetInnerHTML={{
                              __html: isUser ? line : formatted,
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Lead Card Confirmation & WhatsApp Handoff */}
                    {m.leadCreated && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2.5">
                        <div className="bg-[#F2F8FC] p-2.5 rounded-xl border border-[#E2ECF5] flex items-center justify-between">
                          <span className="text-[11px] font-medium text-slate-500">رقم تتبع الطلب:</span>
                          <span className="text-xs font-mono font-bold text-[#163063] bg-white px-2 py-0.5 rounded border border-[#E2ECF5]">
                            {m.leadCreated.refId}
                          </span>
                        </div>

                        <a
                          href={m.leadCreated.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 px-3 rounded-xl shadow-md transition-all hover:scale-[1.02] text-xs text-center"
                        >
                          <span>المتابعة عبر واتساب الإدارة التنفيذية</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Suggestions Chips attached to assistant message */}
                  {!isUser && m.suggestions && m.suggestions.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[92%]">
                      {m.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSendMessage(sug)}
                          disabled={isLoading}
                          className="bg-white hover:bg-[#F2F8FC] border border-[#E2ECF5] hover:border-[#47A3B8]/60 text-[#163063] text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors text-right shadow-2xs"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-1.5 bg-white border border-[#E2ECF5] px-3.5 py-2.5 rounded-2xl rounded-tl-none w-fit shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#163063] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#2360A5] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#47A3B8] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-400 mr-2 font-medium">جاري إعداد الرد...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-[#E2ECF5]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="اكتب استفسارك أو طلبك هنا..."
                disabled={isLoading}
                className="flex-1 bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2360A5] focus:bg-white transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="p-2.5 bg-[#163063] hover:bg-[#2360A5] disabled:bg-slate-200 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed"
                title="إرسال"
              >
                <Send className="w-4 h-4 -scale-x-100" />
              </button>
            </form>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>رواسي العمر — جهة واحدة، مسار واضح</span>
              <span className="font-mono">WhatsApp: 0538881885</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
