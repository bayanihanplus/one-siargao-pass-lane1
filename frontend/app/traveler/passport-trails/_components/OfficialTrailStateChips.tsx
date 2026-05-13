import type { CSSProperties } from "react";

const OSP = {
  navy: "#013863",
  gold: "#F3AE26",
  white: "#FFFFFF",
  slate: "#50668B",
};

export type OfficialTrailStateChip = {
  label: string;
  value?: string;
  active?: boolean;
};

export type OfficialTrailStateChipsProps = {
  chips: OfficialTrailStateChip[];
  columns?: 2 | 3 | 4;
  style?: CSSProperties;
};

export function OfficialTrailStateChips({
  chips,
  columns = 4,
  style,
}: OfficialTrailStateChipsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 7,
        ...style,
      }}
    >
      {chips.map((chip) => (
        <div
          key={`${chip.label}-${chip.value || ""}`}
          style={{
            minHeight: 54,
            borderRadius: 16,
            padding: "8px 6px",
            background: OSP.white,
            color: OSP.navy,
            border: "1px solid rgba(5,150,165,0.14)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: chip.active === false ? "rgba(80,102,139,0.35)" : OSP.gold,
            }}
          />
          <strong
            style={{
              fontSize: 8.6,
              lineHeight: 1,
              fontWeight: 900,
              textAlign: "center",
            }}
          >
            {chip.label}
          </strong>
          {chip.value ? (
            <span
              style={{
                color: OSP.slate,
                fontSize: 7.4,
                lineHeight: 1,
                fontWeight: 760,
                textAlign: "center",
              }}
            >
              {chip.value}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
