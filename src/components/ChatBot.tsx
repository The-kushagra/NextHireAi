"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function ChatBot({ role }: { role: 'recruiter' | 'candidate' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const initialMessage = role === 'recruiter'
    ? "Hi! I'm your NextHire AI assistant. I can help you manage your hiring pipeline and understand your candidates. What can I help you with?"
    : "Hi! I'm your NextHire AI assistant. I can help you find jobs, improve your resume, and track your applications. What can I help you with?"

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: initialMessage }])
    }
  }, [role, messages.length, initialMessage])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    // Add placeholder for assistant message
    setMessages(prev => [...prev, { role: "assistant", content: "" }])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: newMessages, role }),
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) throw new Error("Failed to send message")

      const reader = response.body?.getReader()
      const textDecoder = new TextDecoder()

      if (reader) {
        let assistantContent = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = textDecoder.decode(value)
          assistantContent += chunk

          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = { role: "assistant", content: assistantContent }
            return updated
          })
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: "assistant", content: "Sorry, I encountered an error. Please try again." }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "size-14 rounded-full bg-primary text-white flex items-center justify-center transition-all duration-300 hover:bg-[#0EA371] active:scale-95",
          isOpen && "rotate-90 scale-0 opacity-0"
        )}
      >
        <MessageCircle className="size-7" />
      </button>

      {/* Chat Panel */}
      <div
        className={cn(
          "fixed bottom-6 right-6 w-[400px] h-[600px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-48px)] flex flex-col bg-card border border-border rounded-lg shadow-sm overflow-hidden transition-all duration-500 origin-bottom-right sm:w-[400px] w-[calc(100vw-32px)] sm:bottom-6 sm:right-6 bottom-4 right-4",
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-10 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-border bg-card flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span className="text-white">NextHire</span> AI
              <Sparkles className="size-4 text-muted-foreground" />
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Powered by Groq</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="size-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[#1F2530] transition-all"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-card"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div
                className={cn(
                  "p-4 rounded-lg text-sm leading-relaxed",
                  msg.role === "user" 
                    ? "bg-[#1F2530] border border-[#2A3447] text-white font-medium rounded-tr-none" 
                    : "bg-[#11151F] border border-border text-slate-300 rounded-tl-none"
                )}
              >
                {msg.content === "" && msg.role === "assistant" ? (
                  <div className="flex gap-1 py-1">
                    <div className="size-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="size-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="size-1.5 bg-slate-500 rounded-full animate-bounce" />
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-card border-t border-border">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-[#1F2530] border border-border rounded-lg px-5 py-3.5 pr-14 text-sm text-white focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground"
            />
            <button
              disabled={!input.trim() || isLoading}
              className="absolute right-2 size-10 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-[#0EA371] disabled:opacity-50 disabled:hover:bg-primary transition-all active:scale-95"
            >
              {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
