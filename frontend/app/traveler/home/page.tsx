export const metadata = {
  title: "Traveler Access Retired | One Siargao Pass",
};

export default function RetiredTravelerHomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px 18px",
        background:
          "radial-gradient(circle at top left, rgba(5,150,165,0.13), transparent 34%), linear-gradient(180deg, #F6FBFC 0%, #FFFFFF 100%)",
        color: "#102A43",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 28,
          border: "1px solid rgba(5,150,165,0.16)",
          background: "rgba(255,255,255,0.96)",
          boxShadow: "0 24px 70px rgba(7,30,51,0.10)",
          padding: 26,
        }}
      >
        <p
          style={{
            margin: "0 0 10px",
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#0796A6",
          }}
        >
          One Siargao Pass
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: 28,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            color: "#071E33",
          }}
        >
          This traveler access link has been retired.
        </h1>

        <p
          style={{
            margin: "14px 0 0",
            color: "#465A69",
            fontSize: 15,
            lineHeight: 1.65,
          }}
        >
          Please use the latest official One Siargao Pass access channel provided by the project team.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 22,
          }}
        >
          <a
            href="/"
            style={{
              borderRadius: 999,
              padding: "12px 16px",
              background: "#013863",
              color: "#FFFFFF",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 850,
            }}
          >
            Go to One Siargao Pass
          </a>

          <a
            href="/login?mode=returning"
            style={{
              borderRadius: 999,
              padding: "12px 16px",
              background: "#F3AE26",
              color: "#013863",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 850,
            }}
          >
            Sign in
          </a>
        </div>
      </section>
    </main>
  );
}
