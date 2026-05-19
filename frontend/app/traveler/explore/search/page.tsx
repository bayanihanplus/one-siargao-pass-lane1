import Link from "next/link";
import UniversalTravelerBottomTabBar from "../../../../src/components/traveler/UniversalTravelerBottomTabBar";

type ExploreSearchPageProps = {
  searchParams?: {
    q?: string | string[];
  };
};

const lanes = [
  { label: "Stays", href: "/traveler/explore/stays", note: "Places to stay" },
  { label: "Tours", href: "/traveler/explore/tours", note: "Island trips and local activities" },
  { label: "Rentals", href: "/traveler/explore/rentals", note: "Transport, gear, and mobility" },
  { label: "Surf", href: "/traveler/explore/surf-schools", note: "Lessons, instructors, and board options" },
  { label: "Food", href: "/traveler/explore/food-culture", note: "Food and local culture" },
  { label: "Health", href: "/traveler/explore/beauty-health", note: "Care and wellness" },
];

function normalizeQuery(value?: string | string[]) {
  if (Array.isArray(value)) return String(value[0] || "").trim();
  return String(value || "").trim();
}

export default function ExploreSearchPage({ searchParams }: ExploreSearchPageProps) {
  const q = normalizeQuery(searchParams?.q);

  return (
    <main className="osp-traveler-bottom-tab-safe-page"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #effafa 0%, #ffffff 45%, #f7fbfc 100%)",
        color: "#013863",
        padding: "22px 16px 96px",
      }}
    >
      <section style={{ maxWidth: 430, margin: "0 auto" }}>
        <header
          style={{
            display: "grid",
            gridTemplateColumns: "48px 1fr 48px",
            alignItems: "center",
            gap: 10,
            marginBottom: 18,
          }}
        >
          <Link
            href="/traveler/explore"
            aria-label="Back to Explore"
            style={{
              width: 48,
              height: 48,
              borderRadius: 999,
              background: "#ffffff",
              display: "grid",
              placeItems: "center",
              color: "#013863",
              textDecoration: "none",
              fontSize: 26,
              fontWeight: 950,
              boxShadow: "0 14px 30px rgba(1,56,99,0.10)",
            }}
          >
            ‹
          </Link>

          <div style={{ textAlign: "center" }}>
            <p
              style={{
                margin: 0,
                color: "#0596A5",
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
              }}
            >
              One Siargao Pass
            </p>
            <h1
              style={{
                margin: "5px 0 0",
                fontSize: 24,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
              }}
            >
              Search Explore
            </h1>
          </div>

          <div />
        </header>

        <form
          action="/traveler/explore/search"
          method="get"
          style={{
            minHeight: 58,
            borderRadius: 22,
            background: "#ffffff",
            border: "1px solid rgba(5,150,165,0.14)",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            gap: 10,
            padding: "8px 9px 8px 15px",
            boxShadow: "0 16px 36px rgba(1,56,99,0.10)",
            marginBottom: 16,
          }}
        >
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search Siargao…"
            aria-label="Search Siargao"
            style={{
              width: "100%",
              border: 0,
              outline: 0,
              background: "transparent",
              color: "#013863",
              fontSize: 14,
              fontWeight: 820,
              minWidth: 0,
            }}
          />
          <button
            type="submit"
            style={{
              minHeight: 40,
              borderRadius: 16,
              padding: "0 15px",
              border: 0,
              background: "linear-gradient(135deg, #013863, #0596A5)",
              color: "#ffffff",
              fontWeight: 950,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Go
          </button>
        </form>

        <section
          style={{
            borderRadius: 30,
            background: "#ffffff",
            padding: 18,
            boxShadow: "0 18px 45px rgba(1,56,99,0.10)",
            border: "1px solid rgba(5,150,165,0.12)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#0596A5",
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            {q ? "Search route" : "Explore lanes"}
          </p>

          <h2
            style={{
              margin: "7px 0 5px",
              fontSize: 20,
              lineHeight: 1.15,
              letterSpacing: "-0.035em",
            }}
          >
            {q ? `Open results for “${q}”` : "Choose where to continue"}
          </h2>

          <p
            style={{
              margin: 0,
              color: "#50668B",
              fontSize: 13,
              lineHeight: 1.55,
              fontWeight: 650,
            }}
          >
            {q ? "Select the matching Explore lane below." : "Search or jump directly into a live Explore section."}
          </p>

          <div style={{ display: "grid", gap: 9, marginTop: 15 }}>
            {lanes.map((lane) => (
              <Link
                key={lane.href}
                href={q ? `${lane.href}?q=${encodeURIComponent(q)}` : lane.href}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  padding: "13px 14px",
                  borderRadius: 20,
                  background: "#f7ffff",
                  border: "1px solid rgba(5,150,165,0.13)",
                  color: "#013863",
                  textDecoration: "none",
                }}
              >
                <span>
                  <span style={{ display: "block", fontSize: 14, fontWeight: 950 }}>{lane.label}</span>
                  <span style={{ display: "block", marginTop: 2, color: "#5f7193", fontSize: 12, fontWeight: 650 }}>
                    {lane.note}
                  </span>
                </span>
                <span style={{ color: "#0596A5", fontSize: 20, fontWeight: 950 }}>›</span>
              </Link>
            ))}
          </div>
        </section>
      </section>

      <UniversalTravelerBottomTabBar activeTab="explore" />
    </main>
  );
}
