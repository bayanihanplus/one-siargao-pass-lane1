import Link from "next/link";

export const dynamic = "force-dynamic";

const colors = {
  navy: "#013863",
  teal: "#0596A5",
  tealDark: "#047f91",
  gold: "#F3AE26",
  mist: "#EAFBFA",
  softSlate: "#50668B",
  white: "#FFFFFF",
};

function StatusPill(props: {
  label: string;
  tone?: "teal" | "gold" | "slate";
}) {
  const bg =
    props.tone === "gold"
      ? "rgba(243,174,38,0.12)"
      : props.tone === "slate"
        ? "rgba(80,102,139,0.08)"
        : "rgba(5,150,165,0.10)";

  const color =
    props.tone === "gold"
      ? "#9a5f0c"
      : props.tone === "slate"
        ? colors.softSlate
        : colors.tealDark;

  const border =
    props.tone === "gold"
      ? "rgba(243,174,38,0.22)"
      : props.tone === "slate"
        ? "rgba(80,102,139,0.12)"
        : "rgba(5,150,165,0.16)";

  return (
    <span
      style={{
        borderRadius: 999,
        padding: "5px 8px",
        background: bg,
        border: `1px solid ${border}`,
        color,
        fontSize: 9.5,
        fontWeight: 950,
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
      }}
    >
      {props.label}
    </span>
  );
}

function InfoChip(props: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: "10px 8px",
        background: "#ffffff",
        border: "1px solid rgba(5,150,165,0.12)",
        boxShadow: "0 8px 20px rgba(1,56,99,0.045)",
        display: "grid",
        gap: 6,
        minHeight: 76,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 30,
          height: 30,
          borderRadius: 12,
          background: "rgba(5,150,165,0.10)",
          border: "1px solid rgba(5,150,165,0.14)",
          color: colors.tealDark,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
        }}
      >
        {props.icon}
      </span>

      <div>
        <div
          style={{
            color: colors.navy,
            fontSize: 10.5,
            lineHeight: 1.05,
            fontWeight: 950,
          }}
        >
          {props.label}
        </div>
        <div
          style={{
            marginTop: 2,
            color: colors.softSlate,
            fontSize: 9.2,
            lineHeight: 1.1,
            fontWeight: 760,
          }}
        >
          {props.value}
        </div>
      </div>
    </div>
  );
}

function AccessStep(props: {
  number: string;
  title: string;
  body: string;
  icon: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "28px 34px minmax(0, 1fr)",
        gap: 9,
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid rgba(1,56,99,0.07)",
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: 999,
          background: colors.teal,
          color: "#ffffff",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 950,
          boxShadow: "0 8px 18px rgba(5,150,165,0.20)",
        }}
      >
        {props.number}
      </span>

      <span
        aria-hidden="true"
        style={{
          width: 34,
          height: 34,
          borderRadius: 14,
          background: "rgba(5,150,165,0.10)",
          border: "1px solid rgba(5,150,165,0.14)",
          color: colors.tealDark,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
        }}
      >
        {props.icon}
      </span>

      <div style={{ minWidth: 0 }}>
        <strong
          style={{
            display: "block",
            color: colors.navy,
            fontSize: 12.6,
            lineHeight: 1.08,
            fontWeight: 950,
            letterSpacing: "-0.02em",
          }}
        >
          {props.title}
        </strong>
        <p
          style={{
            margin: "3px 0 0",
            color: colors.softSlate,
            fontSize: 10.4,
            lineHeight: 1.3,
            fontWeight: 740,
          }}
        >
          {props.body}
        </p>
      </div>
    </div>
  );
}

export default function Cloud9SiteAccessPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 16% 0%, rgba(5,150,165,0.14), transparent 30%), linear-gradient(180deg, #effbf9 0%, #ffffff 62%, #fffaf0 100%)",
        padding: "14px 14px 148px",
        color: colors.navy,
        boxSizing: "border-box",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 430,
          margin: "0 auto",
          display: "grid",
          gap: 12,
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <Link
            href="/traveler/home"
            style={{
              minHeight: 38,
              borderRadius: 999,
              padding: "0 13px",
              background: "#ffffff",
              border: "1px solid rgba(1,56,99,0.08)",
              color: colors.navy,
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 950,
              boxShadow: "0 8px 20px rgba(1,56,99,0.055)",
            }}
          >
            ← Home
          </Link>

          <StatusPill label="Cloud 9 Access" />
        </header>

        <section
          style={{
            borderRadius: 30,
            padding: 16,
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(234,251,250,0.98) 58%, rgba(255,248,232,0.94) 100%)",
            border: "1px solid rgba(5,150,165,0.16)",
            boxShadow: "0 22px 50px rgba(1,56,99,0.10)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              right: -36,
              top: -40,
              width: 150,
              height: 150,
              borderRadius: 999,
              background: "rgba(5,150,165,0.08)",
            }}
          />

          <div style={{ position: "relative", zIndex: 1, display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "58px minmax(0, 1fr)", gap: 12, alignItems: "center" }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 22,
                  background: "#ffffff",
                  border: "1px solid rgba(5,150,165,0.16)",
                  boxShadow: "0 12px 26px rgba(1,56,99,0.08)",
                  display: "grid",
                  placeItems: "center",
                  color: colors.tealDark,
                  fontSize: 26,
                  fontWeight: 950,
                }}
                aria-label="LGU governed access"
              >
                9
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <StatusPill label="LGU-governed" />
                  <StatusPill label="Official fee" tone="gold" />
                </div>

                <h1
                  style={{
                    margin: "9px 0 0",
                    color: colors.navy,
                    fontSize: 25,
                    lineHeight: 0.98,
                    letterSpacing: "-0.055em",
                    fontWeight: 950,
                  }}
                >
                  Cloud 9 Site Access
                </h1>

                <p
                  style={{
                    margin: "7px 0 0",
                    color: colors.softSlate,
                    fontSize: 12.4,
                    lineHeight: 1.38,
                    fontWeight: 780,
                  }}
                >
                  Review the official fee, then attach Cloud 9 access to your One Siargao Pass QR.
                </p>
              </div>
            </div>

            <section
              style={{
                borderRadius: 24,
                padding: 14,
                background:
                  "linear-gradient(135deg, rgba(5,150,165,0.10), rgba(255,255,255,0.94) 58%, rgba(243,174,38,0.10))",
                border: "1px solid rgba(5,150,165,0.14)",
                display: "grid",
                gridTemplateColumns: "56px minmax(0, 1fr) auto",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.76)",
                  border: "1px solid rgba(5,150,165,0.16)",
                  color: colors.tealDark,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 950,
                }}
              >
                ₱
              </span>

              <div>
                <div
                  style={{
                    color: colors.navy,
                    fontSize: 31,
                    lineHeight: 0.9,
                    letterSpacing: "-0.06em",
                    fontWeight: 950,
                  }}
                >
                  ₱100
                </div>
                <div
                  style={{
                    marginTop: 5,
                    color: colors.softSlate,
                    fontSize: 11.5,
                    lineHeight: 1.2,
                    fontWeight: 850,
                  }}
                >
                  Official LGU entrance fee
                </div>
              </div>

              <StatusPill label="Official" tone="gold" />
            </section>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                gap: 7,
              }}
            >
              <InfoChip icon="🗓️" label="Trip" value="Within trip" />
              <InfoChip icon="⏱️" label="Use" value="One-time" />
              <InfoChip icon="#" label="QR" value="Traveler ID" />
              <InfoChip icon="👤" label="Identity" value="Traveler" />
              <InfoChip icon="✓" label="Gate" value="LGU check" />
            </div>

            <div
              style={{
                borderRadius: 18,
                padding: "10px 11px",
                background: "rgba(1,56,99,0.045)",
                border: "1px solid rgba(1,56,99,0.07)",
                display: "grid",
                gridTemplateColumns: "28px minmax(0, 1fr)",
                gap: 9,
                alignItems: "center",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: "#ffffff",
                  border: "1px solid rgba(5,150,165,0.14)",
                  color: colors.tealDark,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 950,
                }}
              >
                ✓
              </span>
              <p
                style={{
                  margin: 0,
                  color: colors.softSlate,
                  fontSize: 10.8,
                  lineHeight: 1.34,
                  fontWeight: 760,
                }}
              >
                Access is attached to your official Traveler QR for LGU gate validation. No separate paid-access QR is created.
              </p>
            </div>
          </div>
        </section>

        <section
          style={{
            borderRadius: 26,
            padding: "14px 15px 4px",
            background: "#ffffff",
            border: "1px solid rgba(1,56,99,0.08)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.075)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
            <div>
              <p
                style={{
                  margin: 0,
                  color: colors.tealDark,
                  fontSize: 10,
                  fontWeight: 950,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                Access Flow
              </p>
              <h2
                style={{
                  margin: "4px 0 0",
                  color: colors.navy,
                  fontSize: 16,
                  lineHeight: 1.05,
                  letterSpacing: "-0.035em",
                  fontWeight: 950,
                }}
              >
                Gate-ready access flow
              </h2>
            </div>

            <StatusPill label="QR attached" />
          </div>

          <AccessStep number="1" icon="▣" title="Scan or open access" body="Start from your OSP account or Cloud 9 signage flow." />
          <AccessStep number="2" icon="₱" title="Confirm LGU fee" body="Review the official ₱100 entrance fee before payment." />
          <AccessStep number="3" icon="✓" title="Attach to your QR" body="Access is attached to your official Traveler QR, not a separate QR." />
          <AccessStep number="4" icon="⌁" title="Show at site check" body="Present your OSP QR for LGU access validation at Cloud 9." />
        </section>

        <section
          style={{
            borderRadius: 24,
            padding: 14,
            background: "#fff8e8",
            border: "1px solid rgba(243,174,38,0.24)",
            color: colors.navy,
            boxShadow: "0 10px 24px rgba(154,95,12,0.045)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#9a5f0c",
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Access Doctrine
          </p>
          <p
            style={{
              margin: "7px 0 0",
              color: colors.navy,
              fontSize: 11.5,
              lineHeight: 1.42,
              fontWeight: 780,
            }}
          >
            Cloud 9 access is LGU-governed and linked to the official One Siargao Pass QR. OSP handles the digital access flow; LGU rules and gate validation remain the source of authority.
          </p>
        </section>
      </section>

      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          padding: "10px 14px calc(14px + env(safe-area-inset-bottom))",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.92) 22%, rgba(255,255,255,0.98) 100%)",
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 430,
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 8,
            pointerEvents: "auto",
          }}
        >
          <Link
            href="/traveler/site-access/cloud-9/book"
            style={{
              minHeight: 52,
              borderRadius: 20,
              background: "linear-gradient(135deg, #047f91 0%, #08a6b4 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              gap: 10,
              padding: "0 48px",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 950,
              letterSpacing: "-0.01em",
              boxShadow: "0 18px 40px rgba(5,150,165,0.28)",
              overflow: "hidden",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.16), transparent 42%, rgba(255,255,255,0.08))",
                pointerEvents: "none",
              }}
            />
            <span style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
              Book Cloud 9 Access · ₱100
            </span>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                width: 28,
                height: 28,
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.16)",
                color: "#ffffff",
                fontSize: 17,
                fontWeight: 950,
              }}
            >
              →
            </span>
          </Link>

          <Link
            href="/traveler/home"
            style={{
              minHeight: 42,
              borderRadius: 18,
              background: "rgba(255,248,232,0.94)",
              color: "#9a5f0c",
              border: "1px solid rgba(243,174,38,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 14px",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 950,
              boxShadow: "0 8px 22px rgba(154,95,12,0.055)",
            }}
          >
            I’ll Pay at LGU Counter
          </Link>
        </div>
      </div>
    </main>
  );
}
