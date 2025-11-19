"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useRef } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const assistantMessage: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const res = await fetch("/api/ask-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        assistantMessage.content += chunkValue;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...assistantMessage };
          return updated;
        });
        scrollToBottom();
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error: Could not contact AI assistant." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Helper: Check if content looks like HTML
  const isHTML = (text: string) => /<\/?[a-z][\s\S]*>/i.test(text);

  // 🧩 Format message content
  const renderMessage = (content: string) => {
    if (isHTML(content)) {
      return (
        <div className="text-sm">
          <SyntaxHighlighter
            language="html"
            style={oneDark}
            customStyle={{
              background: "transparent",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {content}
          </SyntaxHighlighter>
        </div>
      );
    } else {
      return <div className="whitespace-pre-wrap break-words">{content}</div>;
    }
  };

  return (
    <section className="flex flex-col items-center min-h-[90vh] bg-[#0f172a] text-white p-6">
      <div className="w-full max-w-2xl flex flex-col h-[80vh] border border-gray-700 rounded-2xl bg-gray-900 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              👋 Hi! I’m your Assistant.
              <br />
              Ask me anything you want to find out.
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl max-w-[80%] ${
                m.role === "user"
                  ? "ml-auto bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              {renderMessage(m.content)}
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="p-3 border-t border-gray-700 flex gap-2 bg-gray-800"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 p-3 rounded-lg bg-gray-700 text-white outline-none placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
