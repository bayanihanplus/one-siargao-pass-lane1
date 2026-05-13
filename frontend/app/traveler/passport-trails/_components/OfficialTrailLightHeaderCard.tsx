import type { CSSProperties, ReactNode } from "react";

const OSP = {
  navy: "#013863",
  teal: "#0596A5",
  gold: "#F3AE26",
  white: "#FFFFFF",
  mist: "#EAFBFA",
  mistSoft: "#F4FCFA",
  slate: "#50668B",
  lineTeal: "rgba(5,150,165,0.16)",
  shadow: "0 20px 44px rgba(1,56,99,0.10)",
};

export type OfficialTrailLightHeaderCardProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  rightIcon?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
};

export function OfficialTrailLightHeaderCard({
  eyebrow = "Official Trail",
  title,
  subtitle,
  backHref,
  backLabel = "‹ Official Trail",
  rightIcon,
  children,
  style,
}: OfficialTrailLightHeaderCardProps) {
  return (
    <section
      aria-label={title}
      style={{
        borderRadius: 30,
        padding: 14,
        background: `linear-gradient(145deg, ${OSP.white} 0%, ${OSP.mistSoft} 56%, ${OSP.mist} 100%)`,
        boxShadow: OSP.shadow,
        border: `1px solid ${OSP.lineTeal}`,
        color: OSP.navy,
        overflow: "hidden",
        position: "relative",
        ...style,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -34,
          top: -34,
          width: 126,
          height: 126,
          borderRadius: "50%",
          background: "rgba(243,174,38,0.16)",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            {backHref ? (
              <a
                href={backHref}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 999,
                  padding: "7px 10px",
                  background: "rgba(1,56,99,0.06)",
                  color: OSP.navy,
                  textDecoration: "none",
                  fontSize: 9,
                  lineHeight: 1,
                  fontWeight: 900,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                }}
              >
                {backLabel}
              </a>
            ) : (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 999,
                  padding: "7px 10px",
                  background: "rgba(1,56,99,0.06)",
                  color: OSP.navy,
                  fontSize: 9,
                  lineHeight: 1,
                  fontWeight: 900,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                }}
              >
                {eyebrow}
              </span>
            )}

            <h1
              style={{
                margin: "13px 0 0",
                color: OSP.navy,
                fontSize: 26,
                lineHeight: 0.98,
                fontWeight: 940,
                letterSpacing: "-0.055em",
              }}
            >
              {title}
            </h1>

            {subtitle ? (
              <p
                style={{
                  margin: "8px 0 0",
                  color: OSP.slate,
                  fontSize: 12,
                  lineHeight: 1.25,
                  fontWeight: 760,
                }}
              >
                {subtitle}
              </p>
            ) : null}
          </div>

          {rightIcon ? (
            <div
              style={{
                width: 66,
                height: 66,
                borderRadius: 22,
                background: OSP.white,
                color: OSP.navy,
                display: "grid",
                placeItems: "center",
                border: "1px solid rgba(5,150,165,0.14)",
                boxShadow: "0 14px 28px rgba(1,56,99,0.10)",
                flex: "0 0 auto",
              }}
            >
              {rightIcon}
            </div>
          ) : null}
        </div>

        {children ? <div style={{ marginTop: 14 }}>{children}</div> : null}
      </div>
    </section>
  );
}
