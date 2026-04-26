import Link from "next/link";
import type { CSSProperties } from "react";

type KuyaTalaEntryButtonProps = {
  topic: "map" | "trail" | "trips" | "trip" | "pass" | "payment" | "emergency";
  title?: string;
  note?: string;
};

const topicLabels: Record<KuyaTalaEntryButtonProps["topic"], string> = {
  map: "Passport Map guidance",
  trail: "Passport Trails guidance",
  trips: "Trip guidance",
  trip: "Trip detail guidance",
  pass: "OSP Pass guidance",
  payment: "Payment guidance",
  emergency: "Safety guidance",
};

const shellStyle: CSSProperties = {
  margin: "0 0 14px",
  borderRadius: 22,
  border: "1px solid rgba(15, 118, 128, 0.18)",
  background:
    "linear-gradient(135deg, rgba(236, 253, 245, 0.96), rgba(240, 249, 255, 0.96))",
  boxShadow: "0 16px 34px rgba(15, 23, 42, 0.08)",
  padding: 14,
};

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const copyStyle: CSSProperties = {
  minWidth: 0,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  fontWeight: 900,
  color: "#078da0",
};

const titleStyle: CSSProperties = {
  margin: "4px 0 0",
  fontSize: 15,
  lineHeight: 1.2,
  fontWeight: 900,
  color: "#10234a",
};

const noteStyle: CSSProperties = {
  margin: "4px 0 0",
  fontSize: 12,
  lineHeight: 1.35,
  fontWeight: 700,
  color: "rgba(15, 23, 42, 0.62)",
};

const linkStyle: CSSProperties = {
  flex: "0 0 auto",
  borderRadius: 999,
  padding: "10px 13px",
  background: "#078da0",
  color: "#ffffff",
  fontSize: 12,
  fontWeight: 900,
  textDecoration: "none",
  boxShadow: "0 10px 22px rgba(7, 141, 160, 0.22)",
  whiteSpace: "nowrap",
};

export default function KuyaTalaEntryButton(props: KuyaTalaEntryButtonProps) {
  const href = `/traveler/settings?panel=assistant&topic=${encodeURIComponent(props.topic)}`;
  const title = props.title || `Ask Kuya Tala™ about ${topicLabels[props.topic]}`;
  const note =
    props.note ||
    "Opens the governed chat surface. Kuya Tala™ can guide, but cannot approve, issue, pay, book, dispatch, or unlock records.";

  return (
    <section style={shellStyle} aria-label="Kuya Tala contextual assistant entry">
      <div style={rowStyle}>
        <div style={copyStyle}>
          <p style={eyebrowStyle}>Kuya Tala™</p>
          <p style={titleStyle}>{title}</p>
          <p style={noteStyle}>{note}</p>
        </div>
        <Link href={href} style={linkStyle} aria-label={title}>
          Ask
        </Link>
      </div>
    </section>
  );
}
