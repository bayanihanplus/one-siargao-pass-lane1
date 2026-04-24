export default function TravelerPassportMapPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fcff 0%, #eef8fb 42%, #ffffff 100%)",
        color: "#14264b",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          margin: "0 auto",
          padding: "18px 16px 28px",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          <a
            href="/"
            style={{
              color: "#0f9aaa",
              fontSize: 13,
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            ← Home
          </a>

          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#70839e",
            }}
          >
            One Siargao Pass
          </div>
        </header>

        <section
          style={{
            marginTop: 22,
            borderRadius: 30,
            border: "1px solid rgba(20, 169, 186, 0.18)",
            background: "#ffffff",
            boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              minHeight: 260,
              padding: "26px 22px",
              background:
                "linear-gradient(135deg, rgba(18,176,196,0.16), rgba(255,255,255,0.94) 42%, rgba(244,211,94,0.16))",
              position: "relative",
            }}
          >
            <div
              style={{
                width: 74,
                height: 74,
                borderRadius: "50%",
                border: "2px solid #18aaba",
                color: "#18aaba",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                lineHeight: 1,
                fontSize: 13,
                textAlign: "center",
                background: "rgba(255,255,255,0.72)",
              }}
            >
              ONE
              <br />
              PASS
            </div>

            <h1
              style={{
                margin: "22px 0 0",
                fontSize: 34,
                lineHeight: 1.02,
                letterSpacing: "-0.04em",
                color: "#14264b",
              }}
            >
              Siargao
              <br />
              Passport Map
            </h1>

            <p
              style={{
                margin: "10px 0 0",
                color: "#667894",
                fontSize: 16,
                lineHeight: 1.35,
                fontWeight: 600,
              }}
            >
              Follow the Trails. Build the Journey.
            </p>

            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                right: -36,
                bottom: -40,
                width: 210,
                height: 210,
                borderRadius: "44% 56% 48% 52%",
                background:
                  "radial-gradient(circle at 35% 28%, #ffffff 0 10%, #bceef4 11% 26%, #67c8d4 27% 44%, #168f9e 45% 62%, transparent 63%)",
                opacity: 0.95,
              }}
            />
          </div>

          <div style={{ padding: "18px 18px 20px" }}>
            <div
              style={{
                borderRadius: 22,
                border: "1px solid #d9edf2",
                background: "#f3fbfd",
                padding: 16,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#1598a8",
                }}
              >
                Route Shell Active
              </div>

              <h2
                style={{
                  margin: "8px 0 0",
                  fontSize: 20,
                  lineHeight: 1.15,
                  color: "#14264b",
                }}
              >
                Passport Trails are being prepared.
              </h2>

              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 14,
                  lineHeight: 1.45,
                  color: "#5d708d",
                }}
              >
                This page is reserved for the approved map-first SPM experience.
                Verified stops, Passport Stamps, trail progress, and route
                completion will only appear when backed by governed OSP/SPM
                validation records.
              </p>
            </div>

            <div
              style={{
                marginTop: 16,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <a
                href="/traveler/trips"
                style={{
                  borderRadius: 18,
                  background: "#14264b",
                  color: "#ffffff",
                  padding: "14px 12px",
                  textAlign: "center",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                View Trips
              </a>

              <a
                href="/traveler/pass"
                style={{
                  borderRadius: 18,
                  background: "#12a9ba",
                  color: "#ffffff",
                  padding: "14px 12px",
                  textAlign: "center",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                View Pass
              </a>
            </div>
          </div>
        </section>

        <nav
          style={{
            marginTop: 18,
            border: "1px solid #e5edf2",
            borderRadius: 24,
            background: "#ffffff",
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 8px 30px rgba(15,23,42,0.06)",
          }}
        >
          <a href="/" style={navLinkStyle}>
            Home
          </a>
          <a href="/traveler/trips" style={navLinkStyle}>
            Trips
          </a>
          <a href="/traveler/passport-map" style={activeNavLinkStyle}>
            Map
          </a>
          <a href="/traveler/pass" style={navLinkStyle}>
            Pass
          </a>
        </nav>
      </div>
    </main>
  );
}

const navLinkStyle = {
  color: "#6b7f9f",
  fontSize: 12,
  fontWeight: 800,
  textDecoration: "none",
};

const activeNavLinkStyle = {
  color: "#12a9ba",
  fontSize: 12,
  fontWeight: 900,
  textDecoration: "none",
};
