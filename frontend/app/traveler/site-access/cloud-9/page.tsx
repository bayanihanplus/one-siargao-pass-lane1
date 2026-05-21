import Link from "next/link";

// OSP_CLOUD9_SITE_ACCESS_BANNER_12A
const CLOUD9 = {
  title: "Cloud 9 Access",
  eyebrow: "LGU SITE ACCESS",
  subtitle: "Boardwalk entry for surf viewing, photos, and a short coastal stop.",
  heroImage:
    "/osp/spm/passport-map/site-visit/cloud-9-access.png",
  chips: ["Surf landmark", "Boardwalk", "Quick stop"],
  stats: [
    { label: "BEST TIME", value: "Daylight visit" },
    { label: "VIBE", value: "Surf landmark" },
    { label: "STAY", value: "30–60 min" },
  ],
};

function Pill({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "teal" | "gold";
}) {
  const styles =
    tone === "teal"
      ? {
          background: "rgba(5,150,165,0.10)",
          border: "1px solid rgba(5,150,165,0.16)",
          color: "#047481",
        }
      : tone === "gold"
        ? {
            background: "rgba(243,174,38,0.12)",
            border: "1px solid rgba(243,174,38,0.20)",
            color: "#B57A00",
          }
        : {
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.075)",
            color: "#013863",
          };

  return (
    <span
      style={{
        minHeight: 34,
        padding: "0 14px",
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 850,
        lineHeight: 1,
        whiteSpace: "nowrap",
        ...styles,
      }}
    >
      {children}
    </span>
  );
}

export default function Cloud9SiteAccessPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(5,150,165,0.12), transparent 30%), linear-gradient(180deg, #EAFBFA 0%, #F8FEFD 52%, #FFFDF8 100%)",
        padding: "22px 16px 40px",
        color: "#013863",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section
        style={{
          width: "min(430px, 100%)",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <Link
            href="/traveler/home"
            style={{
              minHeight: 40,
              padding: "0 16px",
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              background: "rgba(255,255,255,0.96)",
              border: "1px solid rgba(1,56,99,0.075)",
              color: "#013863",
              fontSize: 14,
              fontWeight: 900,
              boxShadow: "0 10px 24px rgba(1,56,99,0.06)",
            }}
          >
            ← Home
          </Link>

          <Pill tone="teal">Site visit</Pill>
        </header>

        <article
          style={{
            borderRadius: 28,
            overflow: "hidden",
            background: "rgba(255,255,255,0.975)",
            border: "1px solid rgba(1,56,99,0.075)",
            boxShadow: "0 22px 56px rgba(1,56,99,0.11)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        >
          <div
            style={{
              position: "relative",
              height: 210,
              backgroundImage: `linear-gradient(180deg, rgba(1,56,99,0.00) 0%, rgba(1,56,99,0.10) 100%), url("${CLOUD9.heroImage}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(1,56,99,0.00) 45%, rgba(1,56,99,0.22) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                right: 16,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <Pill tone="gold">Cloud 9</Pill>
              <Pill>Site visit</Pill>
            </div>
          </div>

          <div
            style={{
              padding: "18px 16px 16px",
            }}
          >
            <p
              style={{
                margin: "0 0 6px",
                color: "#D99000",
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              {CLOUD9.eyebrow}
            </p>

            <h1
              style={{
                margin: "0 0 8px",
                fontSize: 30,
                lineHeight: 1.05,
                letterSpacing: "-0.032em",
                fontWeight: 900,
                color: "#013863",
              }}
            >
              {CLOUD9.title}
            </h1>

            <p
              style={{
                margin: "0 0 16px",
                color: "#50668B",
                fontSize: 14,
                lineHeight: 1.48,
                fontWeight: 700,
                maxWidth: 336,
              }}
            >
              {CLOUD9.subtitle}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 16,
              }}
            >
              {CLOUD9.chips.map((chip) => (
                <Pill key={chip}>{chip}</Pill>
              ))}
            </div>

            <section
              style={{
                borderRadius: 22,
                padding: 14,
                background: "linear-gradient(180deg, #F6FEFD 0%, #EDF9F8 100%)",
                border: "1px solid rgba(5,150,165,0.14)",
                boxShadow: "0 10px 22px rgba(5,150,165,0.065)",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "42px 1fr",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 16,
                    background: "#FFFFFF",
                    border: "1px solid rgba(5,150,165,0.14)",
                    display: "grid",
                    placeItems: "center",
                    color: "#0596A5",
                    fontSize: 15,
                    fontWeight: 940,
                    boxShadow: "0 8px 18px rgba(1,56,99,0.05)",
                  }}
                >
                  QR
                </div>

                <div>
                  <p
                    style={{
                      margin: "0 0 4px",
                      color: "#013863",
                      fontSize: 15,
                      fontWeight: 900,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    OSP QR ready
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: "#50668B",
                      fontSize: 13,
                      lineHeight: 1.38,
                      fontWeight: 720,
                    }}
                  >
                    Scan when site access is active.
                  </p>
                </div>
              </div>
            </section>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 10,
                marginBottom: 14,
              }}
            >
              {CLOUD9.stats.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    minHeight: 78,
                    borderRadius: 20,
                    background: "#FFFFFF",
                    border: "1px solid rgba(1,56,99,0.075)",
                    boxShadow: "0 10px 22px rgba(1,56,99,0.045)",
                    padding: "12px 12px 10px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 8px",
                      color: "#6B7D99",
                      fontSize: 10,
                      lineHeight: 1.1,
                      letterSpacing: "0.12em",
                      fontWeight: 900,
                    }}
                  >
                    {stat.label}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: "#013863",
                      fontSize: 13,
                      lineHeight: 1.2,
                      fontWeight: 850,
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <section
              style={{
                borderRadius: 22,
                padding: 14,
                background: "linear-gradient(180deg, #FFF9EE 0%, #FFF5E3 100%)",
                border: "1px solid rgba(243,174,38,0.18)",
                boxShadow: "0 10px 22px rgba(243,174,38,0.065)",
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "42px 1fr",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 16,
                    background: "#FFFFFF",
                    border: "1px solid rgba(243,174,38,0.18)",
                    display: "grid",
                    placeItems: "center",
                    color: "#D99000",
                    fontSize: 13,
                    fontWeight: 940,
                    boxShadow: "0 8px 18px rgba(1,56,99,0.05)",
                  }}
                >
                  MAP
                </div>

                <div>
                  <p
                    style={{
                      margin: "0 0 4px",
                      color: "#013863",
                      fontSize: 15,
                      fontWeight: 900,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Quick General Luna stop
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: "#50668B",
                      fontSize: 13,
                      lineHeight: 1.38,
                      fontWeight: 720,
                    }}
                  >
                    Boardwalk, surf view, nearby café flow.
                  </p>
                </div>
              </div>
            </section>

            <div
              style={{
                display: "grid",
                gap: 10,
              }}
            >
              <Link
                href="/traveler/site-access/cloud-9/book"
                style={{
                  minHeight: 54,
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  background: "#0596A5",
                  color: "#FFFFFF",
                  fontSize: 15,
                  fontWeight: 900,
                  boxShadow: "0 16px 34px rgba(5,150,165,0.22)",
                }}
              >
                Continue to Access
              </Link>

              <Link
                href="/traveler/home"
                style={{
                  minHeight: 48,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  background: "#FFFFFF",
                  border: "1px solid rgba(1,56,99,0.075)",
                  color: "#50668B",
                  fontSize: 14,
                  fontWeight: 850,
                }}
              >
                Back to Home
              </Link>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
