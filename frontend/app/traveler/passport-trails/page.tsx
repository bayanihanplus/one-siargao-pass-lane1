import Link from "next/link";

const trailFamilies = [
  {
    icon: "🏝️",
    name: "Island Hopping",
    slug: "tri-island-joiner",
    status: "Live",
    title: "Tri-Island Joiner",
    route: "Guyam • Daku • Naked Island",
    progress: "33%",
    stops: "3 stops",
    cta: "Continue Trail",
    live: true,
  },
  {
    icon: "🌊",
    name: "Surf & Coastal",
    slug: "surf-coastal",
    status: "Preview",
    title: "Surf & Coastal Trail",
    route: "Cloud 9 • Pacifico • Coastal viewpoints",
    progress: "Preview",
    stops: "3 preview stops",
    cta: "Preview Trail",
    live: false,
  },
  {
    icon: "🍽️",
    name: "Food & Culture",
    slug: "food-culture",
    status: "Preview",
    title: "Food & Culture Trail",
    route: "Local flavors • markets • community stops",
    progress: "Preview",
    stops: "3 preview stops",
    cta: "Preview Trail",
    live: false,
  },
  {
    icon: "🌿",
    name: "Nature & Inland",
    slug: "nature-inland",
    status: "Preview",
    title: "Nature & Inland Trail",
    route: "Falls • inland routes • nature stops",
    progress: "Preview",
    stops: "3 preview stops",
    cta: "Preview Trail",
    live: false,
  },
  {
    icon: "🏘️",
    name: "Heritage & Local Life",
    slug: "heritage-local-life",
    status: "Preview",
    title: "Heritage & Local Life Trail",
    route: "Local life • heritage • community route",
    progress: "Preview",
    stops: "3 preview stops",
    cta: "Preview Trail",
    live: false,
  },
  {
    icon: "⭐",
    name: "Hidden Gems",
    slug: "hidden-gems",
    status: "Preview",
    title: "Hidden Gems Trail",
    route: "Curated discoveries • lesser-known stops",
    progress: "Preview",
    stops: "3 preview stops",
    cta: "Preview Trail",
    live: false,
  },
];

const diyTemplates = [
  "My Beach Day",
  "My Food Crawl",
  "My North Siargao Route",
];

function SectionEyebrow(props: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 9,
        fontWeight: 720,
        letterSpacing: "0.13em",
        textTransform: "uppercase",
        color: "#0796a6",
      }}
    >
      {props.children}
    </div>
  );
}

export default function PassportTrailsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(19,168,183,0.16), transparent 34%), linear-gradient(180deg, #f6fbfc 0%, #ffffff 72%)",
        color: "#14264b",
        fontFamily:
          '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif',
        padding: "18px 14px 110px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <SectionEyebrow>Siargao Passport Map™</SectionEyebrow>
            <h1
              style={{
                margin: "5px 0 0",
                fontSize: 32,
                lineHeight: 1.02,
                fontWeight: 690,
                letterSpacing: "-0.05em",
              }}
            >
              Passport Trails™
            </h1>
          </div>

          <Link
            href="/traveler/passport-map"
            style={{
              textDecoration: "none",
              border: "1px solid #bdebf0",
              borderRadius: 999,
              background: "rgba(255,255,255,0.9)",
              color: "#0796a6",
              padding: "10px 14px",
              fontSize: 12,
              fontWeight: 720,
              whiteSpace: "nowrap",
            }}
          >
            ← Map
          </Link>
        </header>

        <section
          aria-label="Passport Trails discovery hero"
          style={{
            borderRadius: 28,
            background:
              "linear-gradient(135deg, rgba(10,115,145,0.94), rgba(19,168,183,0.88), rgba(132,184,101,0.86))",
            color: "#ffffff",
            padding: 20,
            overflow: "hidden",
            boxShadow: "0 18px 44px rgba(15,23,42,0.14)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              borderRadius: 999,
              padding: "6px 10px",
              background: "rgba(255,255,255,0.16)",
              fontSize: 9,
              fontWeight: 720,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Trail Family Discovery
          </div>

          <h2
            style={{
              margin: "12px 0 8px",
              fontSize: 25,
              lineHeight: 1.06,
              fontWeight: 690,
              letterSpacing: "-0.04em",
            }}
          >
            Choose a journey. Unlock stamps. Build your Siargao Passport.
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: 13,
              lineHeight: 1.45,
              fontWeight: 600,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            Start with the live Island Hopping Trail or preview coming trail families. QR, stamp, booking, and payment activation remain governed by OSP/SPM readiness.
          </p>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 8,
            }}
          >
            {[
              ["1", "Live trail"],
              ["6", "Families"],
              ["AI", "Trail help"],
            ].map(([value, label]) => (
              <div
                key={label}
                style={{
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.16)",
                  padding: "10px 8px",
                }}
              >
                <div style={{ fontSize: 17, fontWeight: 720 }}>{value}</div>
                <div style={{ marginTop: 2, fontSize: 9.5, fontWeight: 650 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label="Live trail"
          style={{
            marginTop: 16,
            border: "1px solid #d3eef2",
            borderRadius: 26,
            background:
              "linear-gradient(135deg, rgba(240,253,255,0.98), rgba(238,248,239,0.94))",
            padding: 16,
            boxShadow: "0 14px 36px rgba(15,23,42,0.06)",
          }}
        >
          <SectionEyebrow>Continue Now</SectionEyebrow>
          <h2
            style={{
              margin: "7px 0 8px",
              fontSize: 23,
              lineHeight: 1.06,
              fontWeight: 690,
              letterSpacing: "-0.04em",
            }}
          >
            Island Hopping is live.
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 12.5,
              lineHeight: 1.42,
              fontWeight: 600,
              color: "#607089",
            }}
          >
            Open Tri-Island Joiner to see stops, QR verification guidance, stamp rules, and the recommended next move.
          </p>

          <Link
            href="/traveler/passport-trails/tri-island-joiner"
            style={{
              marginTop: 14,
              display: "block",
              textDecoration: "none",
              borderRadius: 20,
              background: "#13a8b7",
              color: "#ffffff",
              padding: 14,
              boxShadow: "0 12px 28px rgba(19,168,183,0.22)",
            }}
          >
            <div style={{ fontSize: 18 }}>🏝️</div>
            <div
              style={{
                marginTop: 8,
                fontSize: 17,
                fontWeight: 720,
                lineHeight: 1.12,
              }}
            >
              Tri-Island Joiner
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 11.5,
                fontWeight: 600,
                opacity: 0.9,
              }}
            >
              Guyam • Daku • Naked Island
            </div>
            <div
              style={{
                marginTop: 10,
                borderRadius: 999,
                background: "rgba(255,255,255,0.18)",
                padding: "7px 10px",
                display: "inline-flex",
                fontSize: 10,
                fontWeight: 720,
              }}
            >
              Continue Trail →
            </div>
          </Link>
        </section>

        <section aria-label="All trail families" style={{ marginTop: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 10,
            }}
          >
            <div>
              <SectionEyebrow>Trail Families</SectionEyebrow>
              <h2
                style={{
                  margin: "5px 0 0",
                  fontSize: 24,
                  lineHeight: 1.08,
                  fontWeight: 690,
                  letterSpacing: "-0.04em",
                }}
              >
                Pick your travel style.
              </h2>
            </div>
          </div>

          <div style={{ display: "grid", gap: 11 }}>
            {trailFamilies.map((family) => (
              <Link
                key={family.slug}
                href={`/traveler/passport-trails/${family.slug}`}
                aria-label={`Open ${family.name} trail family`}
                style={{
                  textDecoration: "none",
                  border: family.live
                    ? "1px solid rgba(11,151,166,0.24)"
                    : "1px solid rgba(11,151,166,0.13)",
                  borderRadius: 24,
                  background: family.live
                    ? "linear-gradient(135deg, rgba(221,253,255,0.98), rgba(232,250,239,0.96))"
                    : "rgba(255,255,255,0.92)",
                  padding: 14,
                  color: "#14264b",
                  boxShadow: family.live
                    ? "0 12px 30px rgba(15,23,42,0.06)"
                    : "0 8px 22px rgba(15,23,42,0.04)",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "36px 1fr auto",
                    alignItems: "center",
                    gap: 11,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: family.live ? "#d8fbef" : "#edf8fa",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                    }}
                  >
                    {family.icon}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 720,
                        lineHeight: 1.14,
                      }}
                    >
                      {family.name}
                    </div>
                    <div
                      style={{
                        marginTop: 3,
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#607089",
                        lineHeight: 1.28,
                      }}
                    >
                      {family.route}
                    </div>
                  </div>

                  <span
                    style={{
                      borderRadius: 999,
                      padding: "5px 8px",
                      background: family.live ? "#d8fbef" : "#edf2f5",
                      color: family.live ? "#138a58" : "#718096",
                      fontSize: 8.5,
                      fontWeight: 720,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {family.status}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: 12,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      borderRadius: 14,
                      background: "rgba(242,246,248,0.92)",
                      padding: "9px 10px",
                    }}
                  >
                    <div style={{ fontSize: 8, fontWeight: 720, color: "#7b8aa0" }}>
                      STOPS
                    </div>
                    <div style={{ marginTop: 3, fontSize: 11, fontWeight: 720 }}>
                      {family.stops}
                    </div>
                  </div>

                  <div
                    style={{
                      borderRadius: 14,
                      background: "rgba(242,246,248,0.92)",
                      padding: "9px 10px",
                    }}
                  >
                    <div style={{ fontSize: 8, fontWeight: 720, color: "#7b8aa0" }}>
                      PROGRESS
                    </div>
                    <div style={{ marginTop: 3, fontSize: 11, fontWeight: 720 }}>
                      {family.progress}
                    </div>
                  </div>

                  <div
                    style={{
                      borderRadius: 14,
                      background: family.live ? "#dff8ff" : "#edf2f5",
                      padding: "9px 10px",
                    }}
                  >
                    <div style={{ fontSize: 8, fontWeight: 720, color: "#7b8aa0" }}>
                      ACTION
                    </div>
                    <div
                      style={{
                        marginTop: 3,
                        fontSize: 11,
                        fontWeight: 720,
                        color: family.live ? "#078da0" : "#718096",
                      }}
                    >
                      {family.cta}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          aria-label="DIY Trails and Assistant"
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 10,
          }}
        >
          <Link
            href="/traveler/passport-trails?mode=diy"
            style={{
              textDecoration: "none",
              border: "1px solid #d3eef2",
              borderRadius: 24,
              background: "rgba(255,255,255,0.92)",
              padding: 15,
              color: "#14264b",
            }}
          >
            <div style={{ fontSize: 20 }}>🧩</div>
            <div
              style={{
                marginTop: 8,
                fontSize: 14,
                fontWeight: 720,
                lineHeight: 1.14,
              }}
            >
              DIY Trails
            </div>
            <div
              style={{
                marginTop: 5,
                fontSize: 10.5,
                fontWeight: 600,
                color: "#607089",
                lineHeight: 1.25,
              }}
            >
              {diyTemplates.join(" • ")}
            </div>
          </Link>

          <Link
            href="/traveler/settings?panel=assistant"
            style={{
              textDecoration: "none",
              border: "1px solid #bdebf0",
              borderRadius: 24,
              background:
                "linear-gradient(135deg, rgba(227,253,255,0.96), rgba(255,255,255,0.92))",
              padding: 15,
              color: "#14264b",
            }}
          >
            <div style={{ fontSize: 20 }}>🤖</div>
            <div
              style={{
                marginTop: 8,
                fontSize: 14,
                fontWeight: 720,
                lineHeight: 1.14,
              }}
            >
              Ask Passport Assistant
            </div>
            <div
              style={{
                marginTop: 5,
                fontSize: 10.5,
                fontWeight: 600,
                color: "#607089",
                lineHeight: 1.25,
              }}
            >
              Help choosing trails, stops, stamps, and events.
            </div>
          </Link>
        </section>

        <section
          aria-label="AI Passport Assistant trail prompt chips"
          style={{
            marginTop: 18,
            border: "1px solid #bdebf0",
            borderRadius: 24,
            background:
              "linear-gradient(135deg, rgba(227,253,255,0.96), rgba(255,255,255,0.92))",
            padding: 15,
          }}
        >
          <SectionEyebrow>AI Passport Assistant</SectionEyebrow>
          <div
            style={{
              marginTop: 8,
              fontSize: 15,
              fontWeight: 720,
              lineHeight: 1.14,
            }}
          >
            Let the assistant help you pick the right trail.
          </div>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 11.5,
              lineHeight: 1.38,
              fontWeight: 600,
              color: "#607089",
            }}
          >
            Use it as your Passport Trails guide, not as booking or payment confirmation.
          </p>

          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 7 }}>
            {[
              "Help me choose a trail",
              "Show live trails",
              "Explain preview trails",
              "Plan a DIY trail",
              "What events fit my journey?",
            ].map((prompt) => (
              <Link
                key={prompt}
                href="/traveler/settings?panel=assistant"
                style={{
                  textDecoration: "none",
                  border: "1px solid rgba(11,151,166,0.18)",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.86)",
                  padding: "7px 9px",
                  color: "#078da0",
                  fontSize: 10.5,
                  fontWeight: 720,
                  lineHeight: 1,
                }}
              >
                {prompt}
              </Link>
            ))}
          </div>
        </section>

        <section
          aria-label="Events preview"
          style={{
            marginTop: 18,
            border: "1px solid #d3eef2",
            borderRadius: 24,
            background: "rgba(255,255,255,0.9)",
            padding: 15,
          }}
        >
          <SectionEyebrow>Events Discovery Preview</SectionEyebrow>
          <div
            style={{
              marginTop: 8,
              fontSize: 15,
              fontWeight: 720,
              lineHeight: 1.14,
            }}
          >
            Match future events to your trail.
          </div>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 11.5,
              lineHeight: 1.38,
              fontWeight: 600,
              color: "#607089",
            }}
          >
            Events will connect to Passport Trails later. For now, use the Assistant to understand which trail family fits your travel style.
          </p>
        </section>

        <nav
          aria-label="Passport Trails bottom navigation"
          style={{
            position: "fixed",
            left: "50%",
            bottom: 18,
            transform: "translateX(-50%)",
            width: "min(392px, calc(100vw - 28px))",
            border: "1px solid #dbeef2",
            borderRadius: 26,
            background: "rgba(255,255,255,0.94)",
            boxShadow: "0 14px 36px rgba(15,23,42,0.08)",
            padding: 10,
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 8,
          }}
        >
          {[
            { label: "Map", href: "/traveler/passport-map", icon: "⌖" },
            { label: "Trails", href: "/traveler/passport-trails", icon: "⌁" },
            { label: "Pass", href: "/traveler/pass", icon: "▣" },
            { label: "Profile", href: "/traveler/profile", icon: "○" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                textDecoration: "none",
                borderRadius: 18,
                padding: "9px 6px",
                textAlign: "center",
                color: item.label === "Trails" ? "#0796a6" : "#607089",
                background: item.label === "Trails" ? "#dff8ff" : "transparent",
                fontSize: 10,
                fontWeight: 720,
              }}
            >
              <div style={{ fontSize: 16, lineHeight: 1 }}>{item.icon}</div>
              <div style={{ marginTop: 4 }}>{item.label}</div>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
