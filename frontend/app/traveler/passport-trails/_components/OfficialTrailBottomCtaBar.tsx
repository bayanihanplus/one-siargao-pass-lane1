import type { CSSProperties } from "react";

const OSP = {
  navy: "#013863",
  white: "#FFFFFF",
  mistSoft: "#F4FCFA",
  slate: "#50668B",
};

export type OfficialTrailBottomCtaBarProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href: string;
  label: string;
  style?: CSSProperties;
};

export function OfficialTrailBottomCtaBar({
  eyebrow = "Continue",
  title,
  subtitle,
  href,
  label,
  style,
}: OfficialTrailBottomCtaBarProps) {
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        padding: "10px 14px calc(10px + env(safe-area-inset-bottom))",
        background: "rgba(244,252,250,0.92)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(1,56,99,0.08)",
        zIndex: 40,
        ...style,
      }}
    >
      <div
        style={{
          maxWidth: 390,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              color: OSP.slate,
              fontSize: 8.6,
              fontWeight: 900,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
          <strong
            style={{
              display: "block",
              marginTop: 4,
              color: OSP.navy,
              fontSize: 14.2,
              fontWeight: 940,
            }}
          >
            {title}
          </strong>
          {subtitle ? (
            <div
              style={{
                marginTop: 3,
                color: OSP.slate,
                fontSize: 9.2,
                fontWeight: 760,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        <a
          href={href}
          style={{
            minHeight: 50,
            borderRadius: 999,
            padding: "0 22px",
            background: OSP.navy,
            color: OSP.white,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12.6,
            fontWeight: 930,
            boxShadow: "0 16px 34px rgba(1,56,99,0.20)",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </a>
      </div>
    </div>
  );
}
