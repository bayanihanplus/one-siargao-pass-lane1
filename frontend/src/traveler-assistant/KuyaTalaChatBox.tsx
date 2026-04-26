"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ChatRole = "assistant" | "traveler" | "system";

type KuyaTalaTopic = "map" | "trail" | "trips" | "trip" | "pass" | "payment" | "emergency" | "general";

type KuyaTalaChatBoxProps = {
  topic?: KuyaTalaTopic | string;
};

const TOPIC_CONTEXT: Record<KuyaTalaTopic, { label: string; intro: string; placeholder: string }> = {
  general: {
    label: "General OSP/SPM guidance",
    intro:
      "Maayong adlaw — I’m Kuya Tala™, your Siargao Journey Guide. I can help you understand your OSP Pass, QR status, trip readiness, payments, Passport Trails, Emergency & Safety guidance, official alerts, and responsible movement around Siargao. What would you like help with today?",
    placeholder: "Ask Kuya Tala™ about your trip, QR/pass, Passport Trails, safety, or alerts…",
  },
  map: {
    label: "Passport Map guidance",
    intro:
      "Hi, I’m Kuya Tala™. You opened me from the Passport Map. I can help explain map progress, verified stops, Passport Trails, QR/stamp logic, and responsible Siargao movement. I cannot mark places visited or unlock stamps unless system records prove it.",
    placeholder: "Ask about Passport Map progress, verified stops, QR scans, or trail movement…",
  },
  trail: {
    label: "Passport Trails guidance",
    intro:
      "Hi, I’m Kuya Tala™. You opened me from Passport Trails. I can help compare trail types, explain stop logic, QR verification, stamp rules, and next safe planning steps. I cannot confirm booking, pricing, guide assignment, or manifest status without system proof.",
    placeholder: "Ask about trails, stops, QR verification, stamps, or planning your next move…",
  },
  trips: {
    label: "Trip guidance",
    intro:
      "Hi, I’m Kuya Tala™. You opened me from your Trips area. I can help explain trip readiness, pass status, payments, QR context, and next traveler actions based on visible records. I cannot approve or change trip status.",
    placeholder: "Ask about trip readiness, records, pass status, or next traveler actions…",
  },
  trip: {
    label: "Trip detail guidance",
    intro:
      "Hi, I’m Kuya Tala™. You opened me from a trip detail page. I can help you read trip status, QR/pass context, payment readiness, and compliance notes. I cannot change trip, pass, payment, or clearance records.",
    placeholder: "Ask about this trip, QR/pass status, payment readiness, or clearance notes…",
  },
  pass: {
    label: "OSP Pass guidance",
    intro:
      "Hi, I’m Kuya Tala™. You opened me from your OSP Pass area. I can help explain pass readiness, QR status, validity, and what the system can or cannot confirm. I cannot issue, regenerate, or approve a pass without backend proof.",
    placeholder: "Ask about OSP Pass readiness, QR status, validity, or pass limits…",
  },
  payment: {
    label: "Payment guidance",
    intro:
      "Hi, I’m Kuya Tala™. You opened me from a payment page. I can help explain payment state, display currency estimates, settlement notes, and safe next steps. I cannot mark a payment paid, refund, or override payment records.",
    placeholder: "Ask about payment status, currency estimates, settlement, or next safe steps…",
  },
  emergency: {
    label: "Emergency & Safety guidance",
    intro:
      "Hi, I’m Kuya Tala™. You opened me from Emergency & Safety. I can guide you to safety information and OSP records, but I cannot dispatch responders, confirm help is coming, or create an emergency incident unless backend records prove it.",
    placeholder: "Ask about safety guidance, emergency limits, OSP records, or official alerts…",
  },
};

function normalizeTopic(value?: string): KuyaTalaTopic {
  if (
    value === "map" ||
    value === "trail" ||
    value === "trips" ||
    value === "trip" ||
    value === "pass" ||
    value === "payment" ||
    value === "emergency"
  ) {
    return value;
  }
  return "general";
}

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  actions?: string[];
  createdAt: string;
};

const STORAGE_KEY = "osp-kuya-tala-phase1-chat";
const MAX_MESSAGE_LENGTH = 700;

const STARTER_ACTIONS = [
  "Check my QR/pass status",
  "Help me with Passport Trails",
  "What should I do in an emergency?",
  "Any official safety broadcast?",
];

function getActionHref(action: string) {
  const value = String(action || "").toLowerCase();

  if (value.includes("osp pass") || value.includes("pass / qr") || value.includes("qr/pass") || value.includes("qr status") || value.includes("show osp pass") || value.includes("checkpoint")) {
    return "/traveler/pass";
  }

  if (value.includes("payment")) {
    return "/traveler/trips";
  }

  if (value.includes("passport map") || value.includes("verified stop")) {
    return "/traveler/passport-map";
  }

  if (value.includes("passport trail") || value.includes("trail")) {
    return "/traveler/passport-trails";
  }

  if (value.includes("emergency") || value.includes("safety") || value.includes("alert") || value.includes("broadcast")) {
    return "/traveler/emergency-safety";
  }

  if (value.includes("trip") || value.includes("booking") || value.includes("return continuity")) {
    return "/traveler/trips";
  }

  return "/traveler/settings?panel=assistant";
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowLabel() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function createIntroMessage(topic?: string): ChatMessage {
  const normalizedIntroTopic = normalizeTopic(topic);
  return {
    id: `assistant-intro-${normalizedIntroTopic}-${Date.now()}`,
    role: "assistant",
    text: TOPIC_CONTEXT[normalizedIntroTopic].intro,
    createdAt: nowLabel(),
  };
}

function cleanMessage(value: string) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, MAX_MESSAGE_LENGTH);
}

function isSpeechRequest(value: string) {
  const lowered = value.toLowerCase();
  return (
    lowered.includes("voice input") ||
    lowered.includes("microphone") ||
    lowered.includes("speech-to-text") ||
    lowered.includes("speech to text")
  );
}

export default function KuyaTalaChatBox(props: KuyaTalaChatBoxProps) {
  const normalizedTopic = normalizeTopic(props.topic);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [lastError, setLastError] = useState("");
  const [loadedStorage, setLoadedStorage] = useState(false);
  const storageKey = `${STORAGE_KEY}:${normalizedTopic}`;
  const [messages, setMessages] = useState<ChatMessage[]>([createIntroMessage(normalizedTopic)]);

  const endRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lastSendRef = useRef("");

  const normalizedInput = useMemo(() => cleanMessage(input), [input]);
  const remaining = MAX_MESSAGE_LENGTH - input.length;
  const canSend = normalizedInput.length > 0 && remaining >= 0 && !isSending;

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(
            parsed
              .filter((item) => item?.role && item?.text)
              .slice(-30)
              .map((item) => ({
                id: String(item.id || makeId()),
                role:
                  item.role === "traveler" || item.role === "system"
                    ? item.role
                    : "assistant",
                text: String(item.text || ""),
                actions: Array.isArray(item.actions) ? item.actions.slice(0, 4) : undefined,
                createdAt: String(item.createdAt || nowLabel()),
              })),
          );
        }
      }
    } catch {
      window.sessionStorage.removeItem(storageKey);
    } finally {
      setLoadedStorage(true);
    }
  }, []);

  useEffect(() => {
    if (!loadedStorage) return;

    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(messages.slice(-30)));
    } catch {
      // Best-effort only.
    }
  }, [loadedStorage, messages, storageKey]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 40);

    return () => window.clearTimeout(timer);
  }, [messages.length, isSending]);

  function appendMessage(message: ChatMessage) {
    setMessages((current) => [...current, message].slice(-30));
  }

  async function sendMessage(messageText?: string) {
    const raw = String(messageText || input);
    const message = cleanMessage(raw);

    if (!message || isSending) return;

    if (raw.length > MAX_MESSAGE_LENGTH) {
      setLastError(`Please keep your question under ${MAX_MESSAGE_LENGTH} characters.`);
      textareaRef.current?.focus({ preventScroll: true });
      return;
    }

    if (isSpeechRequest(message)) {
      setLastError("Speech input is not active in Phase 1. Please type your message.");
      textareaRef.current?.focus({ preventScroll: true });
      return;
    }

    const sendKey = `${message}-${Math.floor(Date.now() / 1000)}`;
    if (lastSendRef.current === sendKey) return;
    lastSendRef.current = sendKey;

    setLastError("");
    setInput("");

    appendMessage({
      id: makeId(),
      role: "traveler",
      text: message,
      createdAt: nowLabel(),
    });

    setIsSending(true);

    try {
      const res = await fetch("/api/traveler/assistant/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, topic: normalizedTopic }),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok || !payload?.ok) {
        const errorText =
          payload?.message ||
          "Kuya Tala™ could not respond right now. Please check backend availability and try again.";

        setLastError(errorText);
        appendMessage({
          id: makeId(),
          role: "system",
          text: errorText,
          createdAt: nowLabel(),
        });
        return;
      }

      appendMessage({
        id: makeId(),
        role: "assistant",
        createdAt: nowLabel(),
        text:
          payload?.response?.answer ||
          "I received your message. I can guide you only from approved OSP/SPM context and visible system records.",
        actions: Array.isArray(payload?.response?.nextActions)
          ? payload.response.nextActions.slice(0, 4)
          : STARTER_ACTIONS,
      });
    } catch {
      const errorText = "Kuya Tala™ could not connect to the assistant endpoint right now.";
      setLastError(errorText);
      appendMessage({
        id: makeId(),
        role: "system",
        text: errorText,
        createdAt: nowLabel(),
      });
    } finally {
      setIsSending(false);
      window.setTimeout(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        textareaRef.current?.focus({ preventScroll: true });
      }, 50);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage();
  }

  function onComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function resetConversation() {
    setLastError("");
    setInput("");
    setMessages([
      {
        id: "intro-reset",
        role: "assistant",
        createdAt: nowLabel(),
        text:
          "I’m ready. Ask me about your OSP Pass / QR, trip status, Passport Trails, Emergency & Safety, payments, or official alerts.",
        actions: STARTER_ACTIONS,
      },
    ]);

    try {
      window.sessionStorage.removeItem(storageKey);
    } catch {
      // Ignore.
    }

    window.setTimeout(() => textareaRef.current?.focus({ preventScroll: true }), 50);
  }

  return (
    <section
      aria-label="Kuya Tala live traveler chat"
      style={{
        marginTop: 12,
        borderRadius: 30,
        padding: 14,
        background: "linear-gradient(145deg, #ecfeff, #ffffff 52%, #fff8eb)",
        border: "1px solid rgba(125,211,252,0.76)",
        boxShadow: "0 18px 46px rgba(15,23,42,0.08)",
        display: "grid",
        gap: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#078da0",
            }}
          >
            Phase 1 Guided Chat
          </div>

          <h3
            style={{
              margin: "7px 0 6px",
              fontSize: 21,
              lineHeight: 1.05,
              fontWeight: 900,
              letterSpacing: "-0.045em",
              color: "#10234a",
            }}
          >
            Talk to Kuya Tala™
          </h3>
        </div>

        <button
          type="button"
          onClick={resetConversation}
          style={{
            minHeight: 34,
            borderRadius: 999,
            border: "1px solid rgba(191,231,238,0.92)",
            background: "#ffffff",
            color: "#078da0",
            padding: "0 10px",
            fontSize: 10.5,
            fontWeight: 900,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Reset
        </button>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 11.8,
          lineHeight: 1.45,
          fontWeight: 650,
          color: "#53657d",
        }}
      >
        Chat is active for guided OSP/SPM assistance. Speech input is not active in Phase 1.
        Kuya Tala™ answers from approved rules and visible records only.
      </p>

      <div
        style={{
          borderRadius: 18,
          padding: 11,
          background: "linear-gradient(135deg, #fffbeb, #ffffff)",
          border: "1px solid #fde68a",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 950,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#b45309",
          }}
        >
          Capability boundary
        </div>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 11.2,
            lineHeight: 1.42,
            fontWeight: 680,
            color: "#53657d",
          }}
        >
          Kuya Tala™ can guide. It cannot approve, issue, pay, book, assign, unlock,
          dispatch, send official broadcasts, or confirm live schedules without backend proof.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateRows: "minmax(0, 1fr) auto",
          gap: 10,
          minHeight: 560,
        }}
      >
        <div
          style={{
            display: "grid",
            alignContent: "start",
            gap: 10,
            height: 430,
            minHeight: 430,
            maxHeight: 430,
            overflowY: "auto",
            overscrollBehavior: "contain",
            padding: "10px 7px 12px",
            scrollBehavior: "smooth",
            borderRadius: 24,
            background:
              "linear-gradient(180deg, rgba(248,250,252,0.78), rgba(255,255,255,0.72))",
            border: "1px solid rgba(226,232,240,0.82)",
            boxSizing: "border-box",
          }}
        >
          {messages.map((message) => {
            const assistant = message.role === "assistant";
            const system = message.role === "system";

            return (
              <article
                key={message.id}
                aria-label={
                  assistant ? "Kuya Tala message" : system ? "System message" : "Traveler message"
                }
                style={{
                  justifySelf: assistant || system ? "start" : "end",
                  width: "fit-content",
                  maxWidth: "92%",
                  minWidth: assistant || system ? 120 : 80,
                  borderRadius: assistant || system ? "20px 20px 20px 8px" : "20px 20px 8px 20px",
                  padding: "10px 12px",
                  background: system
                    ? "linear-gradient(135deg, #fff1f2, #ffffff)"
                    : assistant
                      ? "linear-gradient(135deg, #ffffff, #ecfeff)"
                      : "linear-gradient(135deg, #14b8c6, #078da0)",
                  border: system
                    ? "1px solid #fecaca"
                    : assistant
                      ? "1px solid rgba(191,231,238,0.92)"
                      : "1px solid rgba(255,255,255,0.35)",
                  color: assistant || system ? "#10234a" : "#ffffff",
                  boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 950,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: system ? "#b91c1c" : assistant ? "#078da0" : "rgba(255,255,255,0.78)",
                    }}
                  >
                    {system ? "System" : assistant ? "Kuya Tala™" : "You"}
                  </div>

                  <div
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      opacity: assistant || system ? 0.58 : 0.82,
                    }}
                  >
                    {message.createdAt}
                  </div>
                </div>

                <p
                  style={{
                    margin: "5px 0 0",
                    fontSize: 11.8,
                    lineHeight: 1.45,
                    fontWeight: 680,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {message.text}
                </p>

                {assistant && message.actions?.length ? (
                  <div
                    style={{
                      marginTop: 9,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                    }}
                  >
                    {message.actions.map((action) => {
                      const href = getActionHref(action);

                      return (
                        <a
                          key={action}
                          href={href}
                          style={{
                            borderRadius: 999,
                            border: "1px solid rgba(125,211,252,0.76)",
                            background: "#ffffff",
                            color: "#078da0",
                            padding: "7px 9px",
                            fontSize: 10.5,
                            fontWeight: 850,
                            cursor: "pointer",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                          aria-label={"Open " + action}
                        >
                          {action}
                          <span aria-hidden="true">↗</span>
                        </a>
                      );
                    })}
                  </div>
                ) : null}
              </article>
            );
          })}

          {isSending ? (
            <div
              style={{
                justifySelf: "start",
                borderRadius: "20px 20px 20px 8px",
                padding: "10px 12px",
                background: "#ffffff",
                border: "1px solid rgba(191,231,238,0.92)",
                color: "#53657d",
                fontSize: 11.5,
                fontWeight: 750,
                boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
                minHeight: 40,
                display: "flex",
                alignItems: "center",
              }}
            >
              Kuya Tala™ is checking approved {TOPIC_CONTEXT[normalizedTopic].label.toLowerCase()} context…
            </div>
          ) : null}

          <div ref={endRef} aria-hidden="true" />
        </div>

        {lastError ? (
          <div
            style={{
              borderRadius: 16,
              padding: "9px 10px",
              background: "#fff1f2",
              border: "1px solid #fecaca",
              color: "#7f1d1d",
              fontSize: 11.2,
              lineHeight: 1.35,
              fontWeight: 760,
            }}
          >
            {lastError}
          </div>
        ) : null}

        <form
          onSubmit={onSubmit}
          style={{
            display: "grid",
            gap: 9,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(10px)",
            borderRadius: 24,
            padding: 9,
            border: "1px solid rgba(191,231,238,0.72)",
            boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
            boxSizing: "border-box",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(event) => {
              if (event.target.value.length <= MAX_MESSAGE_LENGTH + 50) {
                setInput(event.target.value);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
            name="message"
            placeholder={TOPIC_CONTEXT[normalizedTopic].placeholder}
            rows={3}
            style={{
              width: "100%",
              resize: "none",
              minHeight: 86,
              maxHeight: 86,
              borderRadius: 18,
              border: remaining < 0 ? "1px solid #fecaca" : "1px solid rgba(191,231,238,0.92)",
              padding: 12,
              fontSize: 12,
              lineHeight: 1.4,
              color: "#10234a",
              background: "#ffffff",
              boxSizing: "border-box",
              outlineColor: remaining < 0 ? "#ef4444" : "#14b8c6",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 10.5,
                lineHeight: 1.25,
                fontWeight: 700,
                color: remaining < 0 ? "#b91c1c" : "#64748b",
              }}
            >
              {remaining < 0
                ? `${Math.abs(remaining)} characters over limit.`
                : `Press Enter to send. Shift+Enter for a new line. ${remaining} characters left.`}
            </span>

            <button
              type="submit"
              disabled={!canSend}
              style={{
                minHeight: 44,
                borderRadius: 17,
                border: "1px solid rgba(125,211,252,0.76)",
                background: canSend
                  ? "linear-gradient(135deg, #14b8c6, #078da0)"
                  : "linear-gradient(135deg, #cbd5e1, #94a3b8)",
                color: "#ffffff",
                fontWeight: 950,
                fontSize: 12.5,
                padding: "0 14px",
                boxShadow: canSend ? "0 12px 26px rgba(7,141,160,0.20)" : "none",
                cursor: canSend ? "pointer" : "not-allowed",
                whiteSpace: "nowrap",
              }}
            >
              {isSending ? "Sending…" : "Send"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
