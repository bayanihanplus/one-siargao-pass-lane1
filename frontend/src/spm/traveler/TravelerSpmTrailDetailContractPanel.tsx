import { getTravelerSpmTrailDetail } from "./travelerSpmReadApi";

const OSP = {
  deepNavy: "#013863",
  teal: "#0596A5",
  gold: "#F3AE26",
  mist: "#EAFBFA",
  slate: "#50668B",
};

type Props = {
  trailSlug: string;
};

export default async function TravelerSpmTrailDetailContractPanel({ trailSlug }: Props) {
  const data = await getTravelerSpmTrailDetail(trailSlug);

  return (
    <section
      aria-label="Traveler-safe Passport Trail detail contract"
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
        {data?.family
          ? `${data.family.name} is connected to the traveler-safe trail detail contract`
          : "Traveler-safe trail detail contract connected"}
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
        {data?.family
          ? `${data.nodes?.length || 0} approved nodes, ${data.packages?.length || 0} published packages, ${data.packageNodes?.length || 0} package-node links loaded from TRAVELER_SAFE_SPM_TRAIL_DETAIL_V1.`
          : "No published trail detail returned for this slug yet."}
      </p>

      <div
        style={{
          display: "inline-flex",
          marginTop: 12,
          borderRadius: 999,
          background: OSP.deepNavy,
          color: "#FFFFFF",
          padding: "8px 11px",
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        TRAVELER_SAFE_SPM_TRAIL_DETAIL_V1
      </div>
    </section>
  );
}
