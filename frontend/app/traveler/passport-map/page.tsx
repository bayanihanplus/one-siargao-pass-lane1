export default function TravelerPassportMapPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f9fc",
        color: "#14264b",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          minHeight: "100vh",
          margin: "0 auto",
          background: "linear-gradient(180deg, #ffffff 0%, #eef6fa 48%, #ffffff 100%)",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 0 40px rgba(15,23,42,0.08)",
        }}
      >
        <div
          style={{
            padding: "18px 14px 92px",
          }}
        >
          <header
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <a
              href="/"
              aria-label="Back to One Siargao Pass home"
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                border: "2px solid #13a8b7",
                color: "#13a8b7",
                background: "rgba(255,255,255,0.92)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                textDecoration: "none",
                lineHeight: 0.9,
                fontWeight: 950,
                letterSpacing: "-0.04em",
                boxShadow: "0 8px 18px rgba(18,169,186,0.10)",
                flex: "0 0 auto",
              }}
            >
              <span>
                <span style={{ fontSize: 9, letterSpacing: "0.04em" }}>ONE</span>
                <br />
                <span style={{ fontSize: 18 }}>SIARGAO</span>
                <br />
                <span style={{ fontSize: 11, letterSpacing: "0.03em" }}>PASS</span>
              </span>
            </a>

            <div
              style={{
                flex: 1,
                minWidth: 0,
                paddingTop: 7,
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontFamily: 'Georgia, "Times New Roman", Times, serif',
                  fontSize: 30,
                  lineHeight: 1.02,
                  letterSpacing: "-0.045em",
                  color: "#14264b",
                  fontWeight: 900,
                  whiteSpace: "nowrap",
                }}
              >
                Siargao Passport Map
              </h1>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#6c7890",
                  fontSize: 16,
                  lineHeight: 1.15,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                Follow the Trails. Build the Journey.
              </p>
            </div>

            <a
              href="/traveler/pass"
              aria-label="Open One Siargao Pass"
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                color: "#14264b",
                background: "rgba(255,255,255,0.86)",
                border: "1px solid rgba(20,38,75,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                position: "relative",
                marginTop: 8,
                flex: "0 0 auto",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#ff5638",
                }}
              />
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
                <path
                  d="M18 8.5a6 6 0 1 0-12 0c0 7-2.5 7.7-2.5 9h17c0-1.3-2.5-2-2.5-9Z"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.8 20.2a2.4 2.4 0 0 0 4.4 0"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />
              </svg>
            </a>
          </header>

          <section
            style={{
              marginTop: 22,
              minHeight: 520,
              borderRadius: 28,
              border: "1px solid rgba(19,168,183,0.14)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(238,248,251,0.94) 52%, rgba(255,255,255,0.96) 100%)",
              boxShadow: "0 18px 46px rgba(15,23,42,0.07)",
              padding: 18,
            }}
          >
            <div
              style={{
                minHeight: 450,
                borderRadius: 24,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(238,248,251,0.62) 52%, rgba(255,255,255,0.86) 100%)",
                padding: "18px 6px 24px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  maxWidth: 265,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    fontFamily:
                      '"Bradley Hand", "Segoe Print", "Comic Sans MS", cursive',
                    fontSize: 22,
                    lineHeight: 1,
                    color: "#14264b",
                    letterSpacing: "-0.02em",
                    transform: "rotate(-2deg)",
                  }}
                >
                  Hello, Explorer! <span style={{ fontSize: 23 }}>🌴</span>
                </div>

                <h2
                  style={{
                    margin: "18px 0 0",
                    fontFamily: 'Georgia, "Times New Roman", Times, serif',
                    fontSize: 42,
                    lineHeight: 1.03,
                    letterSpacing: "-0.052em",
                    color: "#14264b",
                    fontWeight: 900,
                  }}
                >
                  Your Siargao
                  <br />
                  Journey,
                  <br />
                  <span
                    style={{
                      position: "relative",
                      display: "inline-block",
                      fontFamily:
                        '"Bradley Hand", "Segoe Print", "Comic Sans MS", cursive',
                      fontSize: 53,
                      lineHeight: 0.92,
                      fontWeight: 400,
                      color: "#159aaa",
                      letterSpacing: "-0.06em",
                      transform: "rotate(-2deg)",
                    }}
                  >
                    Mapped
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: 2,
                        right: -10,
                        bottom: -8,
                        height: 4,
                        borderRadius: 999,
                        background: "#f2b705",
                        transform: "rotate(-8deg)",
                      }}
                    />
                  </span>
                </h2>

                <p
                  style={{
                    margin: "32px 0 0",
                    color: "#53657f",
                    fontSize: 16,
                    lineHeight: 1.45,
                    fontWeight: 750,
                    maxWidth: 250,
                  }}
                >
                  Collect stamps. Unlock trails.
                  <br />
                  Create memories that last.
                </p>
              </div>

              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  right: -64,
                  top: 30,
                  width: 250,
                  height: 250,
                  borderRadius: "48% 52% 46% 54%",
                  background:
                    "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.96) 0 9%, rgba(188,238,244,0.72) 10% 24%, rgba(103,200,212,0.46) 25% 42%, rgba(22,143,158,0.22) 43% 62%, transparent 63%)",
                  opacity: 0.7,
                }}
              />
            </div>
          </section>
        </div>

        <nav
          style={{
            position: "fixed",
            left: "50%",
            bottom: 0,
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 430,
            borderTop: "1px solid rgba(203,213,225,0.78)",
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(16px)",
            padding: "10px 28px 18px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            boxShadow: "0 -8px 28px rgba(15,23,42,0.05)",
          }}
        >
          <BottomNavItem href="/traveler/passport-map" label="Map" active icon="map" />
          <BottomNavItem href="/traveler/trips" label="Trails" icon="trail" />
          <BottomNavItem href="/traveler/pass" label="Pass" icon="pass" />
          <BottomNavItem href="/" label="Profile" icon="profile" />
        </nav>
      </div>
    </main>
  );
}

function BottomNavItem(props: {
  href: string;
  label: string;
  active?: boolean;
  icon: "map" | "trail" | "pass" | "profile";
}) {
  const color = props.active ? "#13a8b7" : "#6b7890";

  return (
    <a
      href={props.href}
      style={{
        minWidth: 54,
        color,
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        fontWeight: props.active ? 900 : 750,
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <NavIcon type={props.icon} active={props.active} />
      </span>
      <span>{props.label}</span>
    </a>
  );
}

function NavIcon(props: {
  type: "map" | "trail" | "pass" | "profile";
  active?: boolean;
}) {
  if (props.type === "map") {
    return (
      <svg viewBox="0 0 24 24" width="27" height="27" fill={props.active ? "currentColor" : "none"}>
        <path
          d="M3.5 5.8 8.7 3.8l6.6 2.4 5.2-2v14l-5.2 2-6.6-2.4-5.2 2v-14Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M8.7 3.8v14M15.3 6.2v14" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (props.type === "trail") {
    return (
      <svg viewBox="0 0 24 24" width="27" height="27" fill="none">
        <path
          d="M6 18c3-7 9-5 12-12"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
        <circle cx="6" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="18" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (props.type === "pass") {
    return (
      <svg viewBox="0 0 24 24" width="27" height="27" fill="none">
        <rect x="5" y="4" width="14" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 9h6M9 13h6M9 17h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="27" height="27" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5.5 20a6.5 6.5 0 0 1 13 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
