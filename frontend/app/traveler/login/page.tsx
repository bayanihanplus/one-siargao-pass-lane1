/*
 * OSP-TRAVELER-APP-AUTH-ENTRY-02B
 * Traveler App-native login entry.
 * Keep /login as universal website/platform access.
 */

import Link from "next/link";

function AppAction(props: {
  href: string;
  children: string;
  variant?: "primary" | "secondary";
}) {
  const primary = props.variant !== "secondary";

  return (
    <Link
      href={props.href}
      style={{
        minHeight: 48,
        borderRadius: 999,
        padding: "0 18px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        background: primary
          ? "linear-gradient(135deg, #013863 0%, #003B66 45%, #0596A5 100%)"
          : "rgba(255,255,255,0.94)",
        color: primary ? "#FFFFFF" : "#013863",
        border: primary ? "1px solid rgba(5,150,165,0.26)" : "1px solid rgba(5,150,165,0.18)",
        boxShadow: primary ? "0 16px 34px rgba(1,56,99,0.22)" : "0 8px 18px rgba(1,56,99,0.07)",
        fontSize: 14,
        fontWeight: 950,
        whiteSpace: "nowrap",
      }}
    >
      {props.children}
    </Link>
  );
}

export default function TravelerLoginPage() {
  return (
    <main
      data-osp-traveler-login="true"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 14% -4%, rgba(5,150,165,0.18), transparent 34%), radial-gradient(circle at 96% 2%, rgba(243,174,38,0.16), transparent 30%), linear-gradient(180deg, #F8FDFF 0%, #F4FCFA 46%, #FFFFFF 100%)",
        color: "#013863",
        padding: "14px 12px 96px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        <section
          style={{
            borderRadius: 30,
            background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,253,255,0.96))",
            border: "1px solid rgba(5,150,165,0.16)",
            boxShadow: "0 20px 50px rgba(1,56,99,0.12)",
            padding: 18,
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <Link
              href="/traveler/home"
              aria-label="Back to Traveler Home"
              style={{
                width: 40,
                height: 40,
                borderRadius: 16,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                background: "#FFFFFF",
                color: "#013863",
                border: "1px solid rgba(5,150,165,0.18)",
                boxShadow: "0 8px 18px rgba(1,56,99,0.08)",
                fontWeight: 950,
              }}
            >
              ←
            </Link>

            <span
              style={{
                borderRadius: 999,
                padding: "7px 10px",
                background: "#EAFBFA",
                color: "#0596A5",
                border: "1px solid rgba(5,150,165,0.18)",
                fontSize: 11,
                fontWeight: 950,
              }}
            >
              Traveler App
            </span>
          </div>

          <div style={{ marginTop: 22 }}>
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 950,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#0596A5",
              }}
            >
              One Siargao Pass
            </div>

            <h1
              style={{
                margin: "7px 0 0",
                fontSize: 31,
                lineHeight: 1,
                letterSpacing: "-0.045em",
                fontWeight: 950,
                color: "#013863",
              }}
            >
              Continue your OSP Pass.
            </h1>

            <p
              style={{
                margin: "10px 0 0",
                color: "#50668B",
                fontSize: 14.2,
                lineHeight: 1.4,
                fontWeight: 760,
              }}
            >
              Sign in to your traveler account or create your official OSP Pass for Siargao.
            </p>
          </div>

          <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
            <AppAction href="/login?mode=returning">Sign In to My OSP Pass</AppAction>
            <AppAction href="/traveler/register?source=traveler_login" variant="secondary">
              Create My OSP Pass
            </AppAction>
          </div>
        </section>

        <section
          style={{
            marginTop: 13,
            borderRadius: 24,
            background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240,253,250,0.92))",
            border: "1px solid rgba(14,116,144,0.14)",
            boxShadow: "0 16px 36px rgba(15,23,42,0.08)",
            padding: 14,
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#0596A5",
            }}
          >
            Traveler access
          </div>

          <div style={{ marginTop: 11, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              ["QR", "Show your pass"],
              ["Trips", "Continue records"],
              ["Trails", "Save progress"],
              ["Receipts", "View payments"],
            ].map(([title, body]) => (
              <div
                key={title}
                style={{
                  borderRadius: 18,
                  background: "#FFFFFF",
                  border: "1px solid rgba(5,150,165,0.13)",
                  boxShadow: "0 8px 18px rgba(1,56,99,0.05)",
                  padding: "11px 9px",
                }}
              >
                <strong style={{ display: "block", fontSize: 13, color: "#013863", lineHeight: 1.05 }}>
                  {title}
                </strong>
                <span style={{ display: "block", marginTop: 5, fontSize: 11.2, color: "#50668B", fontWeight: 850 }}>
                  {body}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
