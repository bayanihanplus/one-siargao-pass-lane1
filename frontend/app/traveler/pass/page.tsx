import Link from "next/link";
import UniversalTravelerBottomTabBar from "../../../src/components/traveler/UniversalTravelerBottomTabBar";

const OSP = {
  navy: "#013863",
  deep: "#002E52",
  teal: "#0596A5",
  gold: "#F3AE26",
  white: "#FFFFFF",
  mist: "#EAFBFA",
  slate: "#50668B",
  pale: "#F7FEFC",
} as const;

const actions = [
  {
    title: "Scan Point",
    copy: "Open camera scanner",
    href: "/traveler/scan",
    badge: "SCAN",
    tone: "gold",
  },
  {
    title: "Records",
    copy: "Access and payments",
    href: "/traveler/payments",
    badge: "LOG",
    tone: "white",
  }
];

const statusItems = [
  { label: "Identity", value: "QR ready" },
  { label: "Access", value: "Available" },
  { label: "Records", value: "Linked" },
];

function MiniQrPattern() {
  const blocks = [
    [0, 0],
    [1, 0],
    [2, 0],
    [0, 1],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [6, 0],
    [7, 0],
    [8, 0],
    [6, 1],
    [8, 1],
    [6, 2],
    [7, 2],
    [8, 2],
    [0, 6],
    [1, 6],
    [2, 6],
    [0, 7],
    [2, 7],
    [0, 8],
    [1, 8],
    [2, 8],
    [4, 4],
    [5, 4],
    [7, 4],
    [4, 5],
    [6, 5],
    [8, 5],
    [5, 6],
    [7, 6],
    [4, 7],
    [8, 7],
    [6, 8],
    [7, 8],
  ];

  return (
    <div
      aria-hidden="true"
      style={{
        width: 164,
        height: 164,
        borderRadius: 32,
        background:
          "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(247,254,252,1) 100%)",
        border: "1px solid rgba(1,56,99,0.08)",
        boxShadow:
          "inset 0 0 0 9px rgba(234,251,250,0.76), 0 22px 48px rgba(1,56,99,0.13)",
        display: "grid",
        placeItems: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          width: 108,
          height: 108,
          display: "grid",
          gridTemplateColumns: "repeat(9, 1fr)",
          gridTemplateRows: "repeat(9, 1fr)",
          gap: 4,
        }}
      >
        {Array.from({ length: 81 }).map((_, index) => {
          const x = index % 9;
          const y = Math.floor(index / 9);
          const active = blocks.some(([bx, by]) => bx === x && by === y);

          return (
            <span
              key={`${x}-${y}`}
              style={{
                borderRadius: 3,
                background: active ? OSP.deep : "rgba(5,150,165,0.07)",
              }}
            />
          );
        })}
      </div>

      <span
        style={{
          position: "absolute",
          right: 17,
          bottom: 17,
          width: 34,
          height: 34,
          borderRadius: 999,
          background: OSP.gold,
          color: OSP.deep,
          display: "grid",
          placeItems: "center",
          fontSize: 11,
          fontWeight: 1000,
          border: "4px solid #FFFFFF",
          boxShadow: "0 12px 24px rgba(243,174,38,0.24)",
        }}
      >
        OSP
      </span>
    </div>
  );
}

function ActionCard({
  title,
  copy,
  href,
  badge,
  tone,
}: {
  title: string;
  copy: string;
  href: string;
  badge: string;
  tone: string;
}) {
  const isGold = tone === "gold";
  const isTeal = tone === "teal";

  return (
    <Link
      href={href}
      className="osp-pass-action-card"
      style={{
        minHeight: 66,
        textDecoration: "none",
        borderRadius: 20,
        background: isTeal
          ? "linear-gradient(180deg, rgba(247,254,252,0.98) 0%, rgba(255,255,255,0.98) 100%)"
          : isGold
            ? "linear-gradient(180deg, rgba(255,250,239,0.98) 0%, rgba(255,255,255,0.98) 100%)"
            : "#FFFFFF",
        border: isTeal
          ? "1px solid rgba(5,150,165,0.13)"
          : isGold
            ? "1px solid rgba(243,174,38,0.18)"
            : "1px solid rgba(1,56,99,0.075)",
        boxShadow: "0 11px 26px rgba(1,56,99,0.055)",
        padding: "11px 12px",
        display: "grid",
        gridTemplateColumns: "38px 1fr 16px",
        gap: 10,
        alignItems: "center",
      }}
    >
      <span
        style={{
          width: 38,
          height: 38,
          borderRadius: 15,
          display: "grid",
          placeItems: "center",
          background: isTeal ? OSP.teal : isGold ? OSP.gold : OSP.mist,
          color: isGold ? OSP.deep : isTeal ? "#FFFFFF" : OSP.teal,
          fontSize: 9.5,
          fontWeight: 1000,
          letterSpacing: "-0.035em",
          boxShadow: isTeal
            ? "0 9px 20px rgba(5,150,165,0.16)"
            : isGold
              ? "0 9px 20px rgba(243,174,38,0.18)"
              : "0 8px 18px rgba(1,56,99,0.04)",
        }}
      >
        {badge}
      </span>

      <span>
        <span
          style={{
            display: "block",
            color: OSP.navy,
            fontSize: 14,
            lineHeight: 1.08,
            fontWeight: 920,
            letterSpacing: "-0.018em",
            marginBottom: 3,
          }}
        >
          {title}
        </span>
        <span
          style={{
            display: "block",
            color: OSP.slate,
            fontSize: 12,
            lineHeight: 1.25,
            fontWeight: 700,
          }}
        >
          {copy}
        </span>
      </span>

      <span
        aria-hidden="true"
        style={{
          color: isGold ? OSP.gold : OSP.teal,
          fontSize: 20,
          fontWeight: 900,
          lineHeight: 1,
        }}
      >
        ›
      </span>
    </Link>
  );
}

export default function TravelerPassPage() {
  return (
    <main
      className="osp-pass-surface-hardening-18d"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% 0%, rgba(5,150,165,0.11), transparent 31%), linear-gradient(180deg, #EAFBFA 0%, #F9FEFD 48%, #FFFDF8 100%)",
        color: OSP.navy,
        padding: "20px 16px calc(128px + env(safe-area-inset-bottom))",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <style>{`
        .osp-pass-surface-hardening-18d {
          --osp-navy: #013863;
          --osp-deep: #002E52;
          --osp-teal: #0596A5;
          --osp-gold: #F3AE26;
          --osp-slate: #50668B;
          --osp-soft-stroke: rgba(1, 56, 99, 0.052);
          --osp-glass-stroke: rgba(255, 255, 255, 0.72);
          background:
            radial-gradient(circle at 50% -4%, rgba(5, 150, 165, 0.14), transparent 34%),
            radial-gradient(circle at 50% 100%, rgba(243, 174, 38, 0.075), transparent 36%),
            linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 48%, #FFFDF8 100%) !important;
        }

        .osp-pass-surface-hardening-18d .osp-pass-wallet-card {
          border-color: rgba(255, 255, 255, 0.76) !important;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.985), rgba(247,254,252,0.945)) !important;
          box-shadow:
            0 28px 78px rgba(1, 56, 99, 0.118),
            inset 0 1px 0 rgba(255,255,255,0.92),
            inset 0 -1px 0 rgba(1,56,99,0.025) !important;
          backdrop-filter: blur(14px);
        }

        .osp-pass-surface-hardening-18d .osp-pass-wallet-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.32), transparent 38%),
            radial-gradient(circle at 82% 12%, rgba(5,150,165,0.055), transparent 26%),
            radial-gradient(circle at 14% 88%, rgba(243,174,38,0.055), transparent 28%);
        }


        .osp-pass-surface-hardening-18d .osp-pass-action-card {
          position: relative;
          isolation: isolate;
          border-color: rgba(1, 56, 99, 0.052) !important;
          box-shadow:
            0 14px 34px rgba(1, 56, 99, 0.062),
            inset 0 1px 0 rgba(255,255,255,0.88) !important;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            border-color 180ms ease,
            filter 180ms ease,
            background 180ms ease;
          will-change: transform;
        }

        .osp-pass-surface-hardening-18d .osp-pass-action-card::before {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: inherit;
          pointer-events: none;
          z-index: -1;
          opacity: 0.68;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.72), rgba(234,251,250,0.18), rgba(243,174,38,0.052));
        }

        .osp-pass-surface-hardening-18d .osp-pass-action-card:hover {
          transform: translateY(-2px);
          border-color: rgba(5, 150, 165, 0.16) !important;
          box-shadow:
            0 20px 48px rgba(1, 56, 99, 0.092),
            inset 0 1px 0 rgba(255,255,255,0.94) !important;
          filter: saturate(1.045);
        }

        .osp-pass-surface-hardening-18d .osp-pass-action-card:active {
          transform: translateY(0) scale(0.992);
          box-shadow:
            0 12px 28px rgba(1, 56, 99, 0.066),
            inset 0 1px 0 rgba(255,255,255,0.84) !important;
        }

        .osp-pass-surface-hardening-18d .osp-pass-action-card:focus-visible {
          outline: 3px solid rgba(243, 174, 38, 0.36);
          outline-offset: 3px;
          border-color: rgba(243, 174, 38, 0.38) !important;
        }

        @media (hover: none) {
          .osp-pass-surface-hardening-18d .osp-pass-action-card:hover {
            transform: none;
            filter: none;
          }
        }
      `}</style>

      <section
        style={{
          width: "min(430px, 100%)",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <Link
            href="/traveler/home"
            style={{
              minHeight: 38,
              padding: "0 15px",
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              background: "rgba(255,255,255,0.96)",
              border: "1px solid rgba(1,56,99,0.075)",
              color: OSP.navy,
              fontSize: 13.5,
              fontWeight: 900,
              boxShadow: "0 10px 24px rgba(1,56,99,0.055)",
            }}
          >
            ← Home
          </Link>

          <span
            style={{
              minHeight: 32,
              padding: "0 13px",
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.78)",
              border: "1px solid rgba(5,150,165,0.14)",
              color: OSP.teal,
              fontSize: 11.5,
              fontWeight: 900,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              boxShadow: "0 9px 20px rgba(1,56,99,0.04)",
            }}
          >
            Official Pass
          </span>
        </header>

        <article
          id="official-qr"
          className="osp-pass-wallet-card"
          style={{
            borderRadius: 32,
                background: "rgba(255,255,255,0.985)",
            border: "1px solid rgba(1,56,99,0.075)",
            boxShadow: "0 26px 70px rgba(1,56,99,0.125)",
            marginBottom: 12,
            position: "relative",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background:
                "linear-gradient(90deg, rgba(5,150,165,0.82), rgba(243,174,38,0.82), rgba(1,56,99,0.82))",
            }}
          />

          <section
            style={{
              padding: "18px 16px 10px",
              background:
                "linear-gradient(180deg, rgba(247,254,252,0.98) 0%, rgba(255,255,255,0.98) 100%)",
            }}
          >
            <p
              style={{
                margin: "0 0 5px",
                color: OSP.gold,
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              One Siargao Pass
            </p>

            <h1
              style={{
                margin: "0 0 7px",
                color: OSP.navy,
                fontSize: 29,
                lineHeight: 1.04,
                fontWeight: 920,
                letterSpacing: "-0.038em",
              }}
            >
              Official Traveler QR
            </h1>

            <p
              style={{
                margin: 0,
                color: OSP.slate,
                fontSize: 13.5,
                lineHeight: 1.42,
                fontWeight: 720,
                maxWidth: 320,
              }}
            >
              Your QR for supported access, scans, and records.
            </p>
          </section>

          <section
            style={{
              padding: "14px 14px 14px",
              display: "grid",
              justifyItems: "center",
              background:
                "radial-gradient(circle at 50% 10%, rgba(5,150,165,0.08), transparent 48%), #FFFFFF",
            }}
          >
            <MiniQrPattern />

            <div
              style={{
                marginTop: 14,
                width: "100%",
                borderRadius: 22,
                background: "#FFFFFF",
                border: "1px solid rgba(1,56,99,0.075)",
                boxShadow: "0 10px 24px rgba(1,56,99,0.045)",
                padding: "12px 13px",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 10,
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 4px",
                    color: OSP.slate,
                    fontSize: 9.5,
                    letterSpacing: "0.13em",
                    textTransform: "uppercase",
                    fontWeight: 950,
                  }}
                >
                  Pass code
                </p>
                <p
                  style={{
                    margin: 0,
                    color: OSP.deep,
                    fontSize: 16,
                    lineHeight: 1.05,
                    fontWeight: 930,
                    letterSpacing: "-0.028em",
                  }}
                >
                  OSP-READY-START-HERE
                </p>
              </div>

              <span
                style={{
                  minHeight: 32,
                  padding: "0 12px",
                  borderRadius: 999,
                  background: "rgba(5,150,165,0.095)",
                  border: "1px solid rgba(5,150,165,0.14)",
                  color: OSP.teal,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11.5,
                  fontWeight: 900,
                }}
              >
                Ready
              </span>
            </div>

            <div
              style={{
                marginTop: 10,
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 8,
              }}
            >
              {statusItems.map((item) => (
                <div
                  key={item.label}
                  style={{
                    minHeight: 54,
                    borderRadius: 18,
                    background: "#FFFFFF",
                    border: "1px solid rgba(1,56,99,0.065)",
                    boxShadow: "0 8px 18px rgba(1,56,99,0.035)",
                    padding: "9px 8px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 5px",
                      color: OSP.slate,
                      fontSize: 8.7,
                      fontWeight: 950,
                      letterSpacing: "0.10em",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: item.label === "Identity" ? OSP.teal : OSP.navy,
                      fontSize: 11.5,
                      lineHeight: 1.05,
                      fontWeight: 900,
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <section
          style={{
            display: "grid",
            gap: 9,
            marginBottom: 12,
          }}
        >
          {actions.map((action) => (
            <ActionCard key={action.title} {...action} />
          ))}
        </section>

        <section
          style={{
            borderRadius: 22,
            padding: 14,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,254,252,0.92) 100%)",
            border: "1px solid rgba(1,56,99,0.075)",
            boxShadow: "0 12px 30px rgba(1,56,99,0.055)",
          }}
        >
          <p
            style={{
              margin: "0 0 5px",
              color: OSP.gold,
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Access layer
          </p>

          <h2
            style={{
              margin: "0 0 6px",
              color: OSP.navy,
              fontSize: 17,
              lineHeight: 1.1,
              fontWeight: 920,
              letterSpacing: "-0.026em",
            }}
          >
            Connected to your traveler pass.
          </h2>

          <p
            style={{
              margin: 0,
              color: OSP.slate,
              fontSize: 12.7,
              lineHeight: 1.4,
              fontWeight: 700,
            }}
          >
            Site access, trail activity, scan points, and payment records can attach as OSP services activate.
          </p>
        </section>
      </section>

      <UniversalTravelerBottomTabBar activeTab="pass" fixed />
    </main>
  );
}
