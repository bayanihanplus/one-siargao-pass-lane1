import type { ReactNode } from "react";

const OSP = {
  teal: "#0596A5",
};

export function OfficialTrailSectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        color: OSP.teal,
        fontSize: 9.4,
        lineHeight: 1,
        fontWeight: 900,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}
