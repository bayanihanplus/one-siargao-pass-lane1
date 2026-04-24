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
                width: 78,
                height: 78,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                flex: "0 0 auto",
              }}
            >
              <img
                src="/osp/one-siargao-pass-logo.png"
                alt="One Siargao Pass"
                style={{
                  width: "78px",
                  height: "78px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
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

              <SpmMapVisualPreview />

              <SpmLegendAndStatus />
            </div>
          </section>

          <SpmTrailCardsPreview />

          <SpmVerifiedStopsPreview />

          <SpmContinueJourneyPreview />
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

function SpmContinueJourneyPreview() {
  return (
    <section
      aria-label="Preview-only continue journey card"
      style={{
        marginTop: 18,
        marginBottom: 8,
      }}
    >
      <div
        style={{
          borderRadius: 28,
          background:
            "linear-gradient(135deg, #14264b 0%, #17446f 52%, #13a8b7 100%)",
          color: "#ffffff",
          padding: 18,
          boxShadow: "0 16px 34px rgba(20,38,75,0.18)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: -28,
            top: -36,
            width: 132,
            height: 132,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 22,
            bottom: -34,
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: "rgba(242,183,5,0.22)",
          }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.72)",
            }}
          >
            Continue Your Journey
          </div>

          <h2
            style={{
              margin: "8px 0 0",
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              fontSize: 25,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              fontWeight: 900,
            }}
          >
            Next preview stop:
            <br />
            Daku Island
          </h2>

          <p
            style={{
              margin: "10px 0 0",
              maxWidth: 250,
              fontSize: 13,
              lineHeight: 1.35,
              fontWeight: 750,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            This card is visual-only until SPM is connected to governed trail,
            QR, booking, and Passport Stamp records.
          </p>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <a
              href="/traveler/trips"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 42,
                borderRadius: 999,
                background: "#ffffff",
                color: "#14264b",
                padding: "0 16px",
                fontSize: 13,
                fontWeight: 950,
                textDecoration: "none",
                boxShadow: "0 8px 18px rgba(15,23,42,0.14)",
              }}
            >
              View Trips
            </a>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: 42,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.36)",
                color: "rgba(255,255,255,0.82)",
                padding: "0 14px",
                fontSize: 12,
                fontWeight: 900,
              }}
            >
              No stamp action yet
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpmVerifiedStopsPreview() {
  return (
    <section
      aria-label="Preview-only verified stops cards"
      style={{
        marginTop: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 12,
          padding: "0 2px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              fontSize: 24,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "#14264b",
              fontWeight: 900,
            }}
          >
            Verified Stops
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 12,
              lineHeight: 1.25,
              color: "#6b7890",
              fontWeight: 750,
            }}
          >
            Visual preview only. Real verification requires governed QR/stamp records.
          </p>
        </div>

        <a
          href="/traveler/passport-map"
          style={{
            color: "#13a8b7",
            fontSize: 12,
            fontWeight: 900,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          See all
        </a>
      </div>

      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 9,
        }}
      >
        <StopPreviewCard name="General Luna" meta="Town Start" icon="📍" />
        <StopPreviewCard name="Cloud 9" meta="Surf Zone" icon="🌊" />
        <StopPreviewCard name="Magpupungko" meta="Tide Pool" icon="🪨" />
      </div>
    </section>
  );
}

function StopPreviewCard(props: {
  name: string;
  meta: string;
  icon: string;
}) {
  return (
    <a
      href="/traveler/passport-map"
      aria-label={`${props.name} preview stop. Visual only.`}
      style={{
        minHeight: 116,
        borderRadius: 20,
        border: "1px solid rgba(203,213,225,0.72)",
        background: "rgba(255,255,255,0.96)",
        boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
        padding: "12px 10px",
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #e8f9fb 0%, #ffffff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 21,
          boxShadow: "inset 0 0 0 1px rgba(19,168,183,0.14)",
        }}
      >
        {props.icon}
      </div>

      <div>
        <h3
          style={{
            margin: 0,
            color: "#14264b",
            fontSize: 12,
            lineHeight: 1.12,
            fontWeight: 950,
            letterSpacing: "-0.015em",
          }}
        >
          {props.name}
        </h3>

        <p
          style={{
            margin: "5px 0 0",
            color: "#6b7890",
            fontSize: 10,
            lineHeight: 1.2,
            fontWeight: 750,
          }}
        >
          {props.meta}
        </p>

        <div
          style={{
            marginTop: 8,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            borderRadius: 999,
            background: "rgba(31,164,91,0.10)",
            color: "#1fa45b",
            padding: "5px 7px",
            fontSize: 9,
            lineHeight: 1,
            fontWeight: 950,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#1fa45b",
            }}
          />
          Preview
        </div>
      </div>
    </a>
  );
}

function SpmTrailCardsPreview() {
  return (
    <section
      aria-label="Preview-only Passport Trails cards"
      style={{
        marginTop: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 12,
          padding: "0 2px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              fontSize: 24,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "#14264b",
              fontWeight: 900,
            }}
          >
            Your Trails
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 12,
              lineHeight: 1.25,
              color: "#6b7890",
              fontWeight: 750,
            }}
          >
            Preview-only trail cards. Real trail state comes later.
          </p>
        </div>

        <a
          href="/traveler/passport-map"
          style={{
            color: "#13a8b7",
            fontSize: 12,
            fontWeight: 900,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          View all
        </a>
      </div>

      <div
        style={{
          marginTop: 12,
          display: "grid",
          gap: 10,
        }}
      >
        <TrailPreviewCard
          title="General Luna Explorer"
          subtitle="Town center • surf culture • local stops"
          status="Preview"
          statusColor="#13a8b7"
          progressText="Visual only"
          icon="🌊"
        />

        <TrailPreviewCard
          title="Island Discovery Trail"
          subtitle="Guyam • Daku • Naked Island"
          status="Preview"
          statusColor="#1fa45b"
          progressText="Stamp-ready later"
          icon="🏝️"
        />

        <TrailPreviewCard
          title="North Coast Adventure"
          subtitle="Pacifico • Alegria • Taktak Falls"
          status="Locked"
          statusColor="#8b95a1"
          progressText="Requires governed records"
          icon="🛵"
        />
      </div>
    </section>
  );
}

function TrailPreviewCard(props: {
  title: string;
  subtitle: string;
  status: string;
  statusColor: string;
  progressText: string;
  icon: string;
}) {
  return (
    <a
      href="/traveler/passport-map"
      aria-label={`${props.title} preview card. Visual only.`}
      style={{
        minHeight: 88,
        borderRadius: 22,
        border: "1px solid rgba(203,213,225,0.74)",
        background: "rgba(255,255,255,0.96)",
        boxShadow: "0 10px 28px rgba(15,23,42,0.055)",
        padding: "14px 14px",
        textDecoration: "none",
        display: "grid",
        gridTemplateColumns: "48px 1fr auto",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 16,
          background: "linear-gradient(135deg, #e8f9fb 0%, #ffffff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 25,
          boxShadow: "inset 0 0 0 1px rgba(19,168,183,0.14)",
        }}
      >
        {props.icon}
      </div>

      <div style={{ minWidth: 0 }}>
        <h3
          style={{
            margin: 0,
            color: "#14264b",
            fontSize: 15,
            lineHeight: 1.15,
            fontWeight: 950,
            letterSpacing: "-0.015em",
          }}
        >
          {props.title}
        </h3>

        <p
          style={{
            margin: "5px 0 0",
            color: "#6b7890",
            fontSize: 11,
            lineHeight: 1.25,
            fontWeight: 700,
          }}
        >
          {props.subtitle}
        </p>

        <div
          style={{
            marginTop: 8,
            color: "#8090a6",
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {props.progressText}
        </div>
      </div>

      <div
        style={{
          alignSelf: "flex-start",
          borderRadius: 999,
          background: `${props.statusColor}18`,
          color: props.statusColor,
          padding: "6px 8px",
          fontSize: 10,
          lineHeight: 1,
          fontWeight: 950,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {props.status}
      </div>
    </a>
  );
}

function SpmLegendAndStatus() {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 3,
        marginTop: 24,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          borderRadius: 999,
          background: "rgba(20,38,75,0.08)",
          color: "#14264b",
          padding: "6px 10px",
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#f2b705",
          }}
        />
        Preview Mode
      </div>

      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 8,
          maxWidth: 245,
        }}
      >
        <LegendItem color="#1fa45b" label="Completed" />
        <LegendItem color="#13a8b7" label="Available" />
        <LegendItem color="#8b95a1" label="Locked" />
        <LegendRouteItem label="Your Route" />
      </div>

      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        <StatusCard value="5" label="Trails Unlocked" />
        <StatusCard value="3" label="Places Verified" />
        <StatusCard value="42%" label="Journey Progress" />
        <StatusCard value="Active" label="Pass Status" />
      </div>

      <p
        style={{
          margin: "10px 2px 0",
          fontSize: 10,
          lineHeight: 1.35,
          color: "#718096",
          fontWeight: 700,
        }}
      >
        Preview values are visual-only until connected to governed OSP/SPM stamp,
        QR, and traveler progress records.
      </p>
    </div>
  );
}

function LegendItem(props: {
  color: string;
  label: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        color: "#42526b",
        fontSize: 11,
        fontWeight: 850,
      }}
    >
      <span
        style={{
          width: 11,
          height: 11,
          borderRadius: "50%",
          background: props.color,
          boxShadow: "0 2px 6px rgba(15,23,42,0.12)",
        }}
      />
      {props.label}
    </div>
  );
}

function LegendRouteItem(props: {
  label: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        color: "#42526b",
        fontSize: 11,
        fontWeight: 850,
      }}
    >
      <span
        style={{
          width: 18,
          height: 0,
          borderTop: "3px dashed #1976d2",
          display: "inline-block",
        }}
      />
      {props.label}
    </div>
  );
}

function StatusCard(props: {
  value: string;
  label: string;
}) {
  return (
    <div
      style={{
        minHeight: 72,
        borderRadius: 18,
        background: "rgba(255,255,255,0.92)",
        border: "1px solid rgba(203,213,225,0.64)",
        boxShadow: "0 8px 22px rgba(15,23,42,0.05)",
        padding: "12px 10px",
      }}
    >
      <div
        style={{
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
          fontSize: 24,
          lineHeight: 1,
          fontWeight: 900,
          color: "#14264b",
          letterSpacing: "-0.04em",
        }}
      >
        {props.value}
      </div>
      <div
        style={{
          marginTop: 7,
          fontSize: 10,
          lineHeight: 1.2,
          fontWeight: 900,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "#68758c",
        }}
      >
        {props.label}
      </div>
    </div>
  );
}

function SpmMapVisualPreview() {
  return (
    <div
      aria-label="Visual-only Siargao Passport Map preview. Not live map data."
      style={{
        position: "absolute",
        right: -34,
        top: 6,
        width: 260,
        height: 404,
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <svg viewBox="0 0 260 404" width="260" height="404" fill="none">
        <defs>
          <filter id="spmPinShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.22" />
          </filter>
          <linearGradient id="spmSea" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d8f6fb" />
            <stop offset="52%" stopColor="#85ddeb" />
            <stop offset="100%" stopColor="#34b8cc" />
          </linearGradient>
          <linearGradient id="spmIsland" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#dff6b5" />
            <stop offset="44%" stopColor="#8fc36b" />
            <stop offset="100%" stopColor="#4f944c" />
          </linearGradient>
        </defs>

        <path
          d="M40 42C78 2 165-7 211 44C256 94 247 185 223 249C199 313 142 392 83 376C24 360 7 267 15 195C23 123 2 82 40 42Z"
          fill="url(#spmSea)"
          opacity="0.68"
        />
        <path
          d="M147 14C183 33 198 73 194 108C190 143 218 161 213 202C208 243 175 266 156 303C137 340 101 370 70 350C39 330 54 285 70 250C86 215 70 188 85 157C100 126 127 113 122 78C117 43 111-5 147 14Z"
          fill="#f7f0b3"
          opacity="0.95"
        />
        <path
          d="M148 25C178 42 188 77 184 106C180 138 205 158 198 196C192 232 162 255 146 288C129 322 100 342 77 326C54 310 68 274 82 245C96 216 82 190 96 162C110 134 135 121 130 88C125 55 119 8 148 25Z"
          fill="url(#spmIsland)"
        />
        <path
          d="M138 36C157 54 159 83 148 104C137 125 162 145 160 170C158 195 130 206 124 232C118 258 99 280 83 271C67 262 81 238 91 219C101 200 83 183 96 162C109 141 127 129 125 100C123 71 119 18 138 36Z"
          fill="#6bab55"
          opacity="0.58"
        />

        <path d="M79 342C42 352 25 376 17 398" stroke="#f6ffff" strokeWidth="7" strokeLinecap="round" opacity="0.82" />
        <path d="M35 328C18 330 10 341 3 354" stroke="#f6ffff" strokeWidth="5" strokeLinecap="round" opacity="0.75" />
        <path d="M205 83C235 63 250 36 258 10" stroke="#f6ffff" strokeWidth="6" strokeLinecap="round" opacity="0.7" />

        <path
          d="M69 328C98 293 145 294 154 255C162 220 193 210 184 176C176 144 147 137 154 102C158 76 176 58 187 43"
          stroke="#1976d2"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="7 8"
          opacity="0.9"
        />
        <path
          d="M69 328C98 293 145 294 154 255C162 220 193 210 184 176C176 144 147 137 154 102C158 76 176 58 187 43"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="7 8"
          opacity="0.85"
        />

        <PreviewPin x={154} y={255} type="completed" />
        <PreviewPin x={184} y={176} type="completed" />
        <PreviewPin x={69} y={328} type="completed" />
        <PreviewPin x={70} y={332} type="available" />
        <PreviewPin x={154} y={102} type="locked" />
        <PreviewPin x={187} y={43} type="locked" />

        <path d="M218 317l13 31 13-31-13 8-13-8Z" fill="#12375d" opacity="0.72" />
        <path d="M231 302v58M207 331h48" stroke="#12375d" strokeWidth="2" opacity="0.72" />
      </svg>

      <MapLabel text="Alegria Beach" top={42} right={48} />
      <MapLabel text="Pacifico" top={125} right={25} />
      <MapLabel text="Magpupungko" top={211} right={58} />
      <MapLabel text="Cloud 9" top={260} right={26} />
      <MapLabel text="General Luna" top={317} right={70} />
      <MapLabel text="Daku Island" top={353} right={154} />
    </div>
  );
}

function PreviewPin(props: {
  x: number;
  y: number;
  type: "completed" | "available" | "locked";
}) {
  const isCompleted = props.type === "completed";
  const isAvailable = props.type === "available";

  return (
    <g filter="url(#spmPinShadow)" transform={`translate(${props.x - 17} ${props.y - 34})`}>
      <path
        d="M17 0C7.8 0 0 7.5 0 16.8C0 29.4 17 39 17 39C17 39 34 29.4 34 16.8C34 7.5 26.2 0 17 0Z"
        fill={isCompleted ? "#1fa45b" : isAvailable ? "#13a8b7" : "#8b95a1"}
      />
      <circle cx="17" cy="16.5" r="10.2" fill={isAvailable ? "#ffffff" : "rgba(255,255,255,0.2)"} />
      {isCompleted ? (
        <path d="M11.2 16.6l4 4.2 8-9" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      ) : null}
      {isAvailable ? (
        <circle cx="17" cy="16.5" r="6" fill="#13a8b7" />
      ) : null}
      {!isCompleted && !isAvailable ? (
        <>
          <rect x="12" y="15" width="10" height="8" rx="2" fill="#ffffff" />
          <path d="M14 15v-2.4a3 3 0 0 1 6 0V15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : null}
    </g>
  );
}

function MapLabel(props: {
  text: string;
  top: number;
  right: number;
}) {
  return (
    <span
      style={{
        position: "absolute",
        top: props.top,
        right: props.right,
        color: "#25344d",
        fontSize: 10,
        lineHeight: 1,
        fontWeight: 900,
        textShadow: "0 1px 2px rgba(255,255,255,0.95)",
        whiteSpace: "nowrap",
      }}
    >
      {props.text}
    </span>
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
