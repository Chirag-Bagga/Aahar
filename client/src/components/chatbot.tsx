import { useCallback, useEffect, useRef, useState } from "react";

/** Who sent the message */
type Sender = "AI" | "User";

/** Single chat message */
interface Message {
  id: string;
  sender: Sender;
  text: string;
}

/** API response shape from your /chatbot endpoint */
interface ChatResponse {
  answer: string;
}

/** Prefer env-driven base URL over hardcoding IPs */
const API_BASE =
  import.meta.env.VITE_CHATBOT_URL ??
  `${import.meta.env.VITE_API_URL ?? "http://localhost:4000/api"}/chatbot`;

const genId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: genId(), sender: "AI", text: "Hi, how can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetchAbortRef = useRef<AbortController | null>(null);

  // Auto-scroll chat to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // Clean up pending request on unmount
  useEffect(() => {
    return () => {
      fetchAbortRef.current?.abort();
    };
  }, []);

  const toggleChat = useCallback(() => setIsOpen((p) => !p), []);

  const handleSend = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const question = input.trim();
      if (!question) return;

      // Push user's message immediately
      setMessages((prev) => [
        ...prev,
        { id: genId(), sender: "User", text: question },
      ]);
      setInput("");
      setLoading(true);

      // Cancel any in-flight request before starting a new one
      fetchAbortRef.current?.abort();
      const controller = new AbortController();
      fetchAbortRef.current = controller;

      try {
        const res = await fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
          signal: controller.signal,
          // credentials: "include", // uncomment if your API uses cookies
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => "");
          throw new Error(`${res.status} ${res.statusText} ${errText}`.trim());
        }

        // Ensure JSON
        const contentType = res.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          throw new Error("Unexpected response format (not JSON).");
        }

        const data: ChatResponse = await res.json();
        setMessages((prev) => [
          ...prev,
          { id: genId(), sender: "AI", text: data.answer },
        ]);
      } catch (err: unknown) {
        // Ignore AbortError (it happens when user resubmits fast or closes widget)
        if (err instanceof DOMException && err.name === "AbortError") return;

        console.error("Error fetching chatbot answer:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: genId(),
            sender: "AI",
            text:
              "Sorry, there was an error retrieving the answer. Please try again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input]
  );

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Icon Button */}
      <button
        onClick={toggleChat}
        className="inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 p-0 normal-case leading-5"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="chatbot-window"
        title={isOpen ? "Close chat" : "Open chat"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          id="chatbot-window"
          role="dialog"
          aria-label="Chatbot"
          aria-modal="false"
          style={{
            boxShadow: "0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)",
          }}
          className="fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-white p-6 rounded-lg border border-[#e5e7eb] w-[440px] h-[634px]"
        >
          {/* Heading */}
          <div className="flex flex-col space-y-1.5 pb-6">
            <h2 className="font-semibold text-lg tracking-tight">Chatbot</h2>
            <p className="text-sm text-[#6b7280] leading-3">
              Powered by Mendable and Vercel
            </p>
          </div>

          {/* Messages */}
          <div
            className="pr-4 h-[474px] overflow-y-auto"
            style={{ minWidth: "100%" }}
            role="log"
            aria-live="polite"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 my-4 text-gray-600 text-sm flex-1 ${
                  m.sender === "User" ? "justify-end" : "justify-start"
                }`}
              >
                {m.sender === "AI" && (
                  <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                    <div className="rounded-full bg-gray-100 border p-1">
                      <svg
                        stroke="none"
                        fill="black"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        height="20"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                        />
                      </svg>
                    </div>
                  </span>
                )}
                <p className="leading-relaxed max-w-[300px]">
                  <span className="block font-bold text-gray-700">
                    {m.sender === "AI" ? "AI" : "You"}
                  </span>
                  {m.text}
                </p>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex justify-center items-center my-4">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center pt-0">
            <form
              className="flex items-center justify-center w-full space-x-2"
              onSubmit={handleSend}
            >
              <label htmlFor="chatbot-input" className="sr-only">
                Type your message
              </label>
              <input
                id="chatbot-input"
                ref={inputRef}
                className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                placeholder="Type your message"
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInput(e.target.value)
                }
                disabled={loading}
                autoComplete="off"
              />
              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2"
                type="submit"
                disabled={loading}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
