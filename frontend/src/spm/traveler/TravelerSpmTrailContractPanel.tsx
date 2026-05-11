import Link from "next/link";
import {
  getTravelerSpmTrails,
  getTrailPackageCountLabel,
  toSpmTrailSlug,
} from "./travelerSpmReadApi";

const OSP = {
  deepNavy: "#013863",
  teal: "#0596A5",
  gold: "#F3AE26",
  mist: "#EAFBFA",
  slate: "#50668B",
};

export default async function TravelerSpmTrailContractPanel() {
  const data = await getTravelerSpmTrails();
  const trails = data?.items ?? [];

  return (
    <section
      aria-label="Traveler-safe Passport Trails contract"
      style={{
        margin: "14px 0 18px",
        borderRadius: 24,
        border: "1px solid rgba(5,150,165,0.18)",
        background:
          "linear-gradient(135deg, rgba(234,251,250,0.92), rgba(255,255,255,0.96))",
        boxShadow: "0 16px 36px rgba(1,56,99,0.08)",
        padding: 16,
        color: OSP.deepNavy,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              color: OSP.teal,
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Backend Contract
          </div>
          <h2
            style={{
              margin: "5px 0 4px",
              fontSize: 18,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              fontWeight: 850,
            }}
          >
            Passport Trails are now reading from the traveler-safe SPM contract
          </h2>
          <p
            style={{
              margin: 0,
              maxWidth: 760,
              color: OSP.slate,
              fontSize: 13,
              lineHeight: 1.55,
            }}
          >
            {trails.length
              ? `${trails.length} official trail families loaded from TRAVELER_SAFE_SPM_TRAILS_V1.`
              : "TRAVELER_SAFE_SPM_TRAILS_V1 is connected. No published trail families returned yet."}
          </p>
        </div>

        <div
          style={{
            borderRadius: 999,
            background: OSP.deepNavy,
            color: "#FFFFFF",
            padding: "8px 11px",
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          TRAVELER_SAFE_SPM_TRAILS_V1
        </div>
      </div>

      {trails.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 9,
            marginTop: 13,
          }}
        >
          {trails.slice(0, 8).map((trail) => (
            <Link
              key={trail.id}
              href={`/traveler/passport-trails/${toSpmTrailSlug(trail.code)}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                background: "#FFFFFF",
                border: "1px solid rgba(1,56,99,0.12)",
                color: OSP.deepNavy,
                padding: "8px 11px",
                textDecoration: "none",
                fontSize: 12,
                fontWeight: 850,
              }}
            >
              <span>{trail.name}</span>
              <span style={{ color: OSP.teal }}>
                {getTrailPackageCountLabel(trail.packages?.length || 0)}
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
