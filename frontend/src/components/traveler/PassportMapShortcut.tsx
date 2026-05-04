import Link from "next/link";

export default function PassportMapShortcut({
  href = "/traveler/settings?panel=assistant&topic=trail",
  label,
  eyebrow = "Kuya Tala™",
  title,
  body,
  compact: _compact,
}: {
  href?: string;
  label?: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  compact?: boolean;
}) {
  const displayLabel = label || title || "Talk to Kuya Tala";
  const supportingText = body || "Ask about route readiness, payment, stamps, and your next best move.";

  return (
    <section
      aria-label="Kuya Tala assistant shortcut"
      style={{
        margin: "12px auto 0",
        width: "100%",
        maxWidth: 430,
        padding: "0 12px",
        boxSizing: "border-box",
      }}
    >
      <Link
        href={href}
        style={{
          width: "100%",
          minHeight: 86,
          borderRadius: 24,
          background:
            "linear-gradient(135deg, #F4FEFF 0%, #EAFBFA 58%, #FFFFFF 100%)",
          border: "1px solid rgba(5,150,165,0.24)",
          boxShadow: "0 14px 32px rgba(1,56,99,0.11)",
          padding: "13px 14px",
          textDecoration: "none",
          display: "grid",
          gridTemplateColumns: "50px 1fr 18px",
          alignItems: "center",
          gap: 12,
          boxSizing: "border-box",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 50,
            height: 50,
            borderRadius: 18,
            background: "linear-gradient(135deg, #013863 0%, #0596A5 100%)",
            color: "#FFFFFF",
            WebkitTextFillColor: "#FFFFFF",
            display: "grid",
            placeItems: "center",
            fontSize: 20,
            fontWeight: 950,
            boxShadow: "0 10px 22px rgba(1,56,99,0.18)",
          }}
        >
          ✦
        </span>

        <span style={{ minWidth: 0, display: "block" }}>
          <span
            style={{
              display: "block",
              fontSize: 9.2,
              lineHeight: 1,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#0596A5",
              WebkitTextFillColor: "#0596A5",
            }}
          >
            {eyebrow}
          </span>

          <span
            style={{
              display: "block",
              marginTop: 4,
              fontSize: 14.2,
              lineHeight: 1.12,
              fontWeight: 950,
              color: "#013863",
              WebkitTextFillColor: "#013863",
            }}
          >
            {displayLabel}
          </span>

          <span
            style={{
              display: "block",
              marginTop: 4,
              fontSize: 11.2,
              lineHeight: 1.25,
              fontWeight: 720,
              color: "#50668B",
              WebkitTextFillColor: "#50668B",
            }}
          >
            {supportingText}
          </span>
        </span>

        <span
          aria-hidden="true"
          style={{
            fontSize: 18,
            fontWeight: 950,
            color: "#013863",
            WebkitTextFillColor: "#013863",
          }}
        >
          ›
        </span>
      </Link>
    </section>
  );
}
