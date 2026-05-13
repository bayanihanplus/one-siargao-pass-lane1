import type { CSSProperties } from "react";

const OSP = {
  navy: "#013863",
  teal: "#0596A5",
  mistSoft: "#F4FCFA",
  slate: "#50668B",
};

export type OfficialTrailSummaryItem = {
  label: string;
  value: string;
};

export type OfficialTrailSummaryGridProps = {
  items: OfficialTrailSummaryItem[];
  columns?: 1 | 2;
  style?: CSSProperties;
};

export function OfficialTrailSummaryGrid({
  items,
  columns = 2,
  style,
}: OfficialTrailSummaryGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: columns === 1 ? "1fr" : "1fr 1fr",
        gap: 8,
        ...style,
      }}
    >
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          style={{
            borderRadius: 17,
            padding: "10px",
            background: OSP.mistSoft,
            border: "1px solid rgba(5,150,165,0.11)",
          }}
        >
          <div
            style={{
              color: OSP.slate,
              fontSize: 8.5,
              lineHeight: 1,
              fontWeight: 860,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {item.label}
          </div>
          <strong
            style={{
              display: "block",
              marginTop: 6,
              color: OSP.navy,
              fontSize: 11.2,
              lineHeight: 1.1,
              fontWeight: 900,
            }}
          >
            {item.value}
          </strong>
        </div>
      ))}
    </div>
  );
}
