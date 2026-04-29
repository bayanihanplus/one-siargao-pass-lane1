import Link from "next/link";

const cardStyle = {
  borderRadius: "24px",
  background: "#ffffff",
  border: "1px solid rgba(23, 59, 50, 0.1)",
  padding: "20px",
} as const;

export default function SiargaoPassportMapLandingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #eef8f3 0%, #f8f4e9 52%, #e7f5f7 100%)",
        color: "#173b32",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "28px 18px 88px",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px",
            marginBottom: "30px",
          }}
        >
          <Link
            href="/"
            style={{
              color: "#245246",
              textDecoration: "none",
              fontWeight: 900,
              letterSpacing: "-0.02em",
            }}
          >
            ← One Siargao Pass
          </Link>

          <Link
            href="/traveler/start"
            style={{
              borderRadius: "999px",
              background: "#173b32",
              color: "#fff7d6",
              padding: "11px 15px",
              fontWeight: 900,
              textDecoration: "none",
              boxShadow: "0 12px 26px rgba(23, 59, 50, 0.18)",
            }}
          >
            Create My OSP Pass
          </Link>
        </header>

        <div
          style={{
            borderRadius: "34px",
            background: "rgba(255, 255, 255, 0.82)",
            border: "1px solid rgba(23, 59, 50, 0.12)",
            boxShadow: "0 24px 70px rgba(23, 59, 50, 0.14)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "44px 24px 32px",
              background:
                "radial-gradient(circle at 18% 8%, rgba(56, 142, 112, 0.22), transparent 34%), radial-gradient(circle at 82% 20%, rgba(232, 196, 92, 0.25), transparent 30%)",
            }}
          >
            <p
              style={{
                margin: "0 0 12px",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                fontSize: "12px",
                fontWeight: 900,
                color: "#3c7b6a",
              }}
            >
              Siargao Passport Map
            </p>

            <h1
              style={{
                margin: 0,
                maxWidth: "780px",
                fontSize: "clamp(38px, 7vw, 76px)",
                lineHeight: "0.96",
                letterSpacing: "-0.065em",
                color: "#173b32",
              }}
            >
              Follow the Trails. Build the Journey.
            </h1>

            <p
              style={{
                margin: "20px 0 0",
                maxWidth: "740px",
                fontSize: "18px",
                lineHeight: 1.65,
                color: "#315c51",
              }}
            >
              Discover Siargao routes, Passport Trails™, approved local partner
              experiences, scenic stops, and future stamp-enabled journeys
              powered by One Siargao Pass.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "28px",
              }}
            >
              <Link
                href="/traveler/start"
                style={{
                  borderRadius: "18px",
                  background: "#173b32",
                  color: "#fff7d6",
                  padding: "14px 18px",
                  fontWeight: 900,
                  textDecoration: "none",
                }}
              >
                Create My OSP Pass
              </Link>

              <Link
                href="/login?mode=returning"
                style={{
                  borderRadius: "18px",
                  background: "rgba(23, 59, 50, 0.08)",
                  color: "#173b32",
                  padding: "14px 18px",
                  fontWeight: 900,
                  textDecoration: "none",
                  border: "1px solid rgba(23, 59, 50, 0.12)",
                }}
              >
                View My Saved Progress
              </Link>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
              padding: "18px",
            }}
          >
            <article style={cardStyle}>
              <h2 style={{ margin: "0 0 8px", fontSize: "18px" }}>
                Siargao Partner Tours
              </h2>
              <p style={{ margin: 0, color: "#4a6a61", lineHeight: 1.55, fontSize: "14px" }}>
                Operated by approved local partners. Passport stamps available.
              </p>
            </article>

            <article style={cardStyle}>
              <h2 style={{ margin: "0 0 8px", fontSize: "18px" }}>
                Passport Trails™ Curated Tours
              </h2>
              <p style={{ margin: 0, color: "#4a6a61", lineHeight: 1.55, fontSize: "14px" }}>
                Trail-based experiences operated by approved local partners, with verified Passport stamps included.
              </p>
            </article>

            <article style={cardStyle}>
              <h2 style={{ margin: "0 0 8px", fontSize: "18px" }}>
                Build Your Own Passport Trail
              </h2>
              <p style={{ margin: 0, color: "#4a6a61", lineHeight: 1.55, fontSize: "14px" }}>
                Plan your own route with eligible Passport stamps where validation and partner support are available.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
