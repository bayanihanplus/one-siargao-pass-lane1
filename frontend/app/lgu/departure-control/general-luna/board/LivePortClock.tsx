"use client";

import { useEffect, useState } from "react";

function getManilaClock() {
  const now = new Date();

  return {
    time: new Intl.DateTimeFormat("en-PH", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(now),
    date: new Intl.DateTimeFormat("en-PH", {
      timeZone: "Asia/Manila",
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(now),
  };
}

export default function LivePortClock() {
  const [clock, setClock] = useState<{ time: string; date: string } | null>(null);

  useEffect(() => {
    setClock(getManilaClock());
    const timer = window.setInterval(() => setClock(getManilaClock()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      suppressHydrationWarning
      style={{
        minHeight: 166,
        borderRadius: 26,
        border: "1px solid rgba(255,255,255,0.18)",
        background:
          "radial-gradient(circle at 20% 0%, rgba(243,174,38,0.12), transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.055))",
        boxShadow: "0 30px 84px rgba(0,0,0,0.38)",
        padding: "16px 18px",
        color: "#FFFFFF",
        display: "grid",
        alignContent: "center",
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#F3AE26",
          fontSize: 11,
          fontWeight: 950,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        Philippine Standard Time
      </p>
      <div
        style={{
          marginTop: 7,
          fontSize: 46,
          lineHeight: 0.92,
          fontWeight: 950,
          letterSpacing: "-0.06em",
          fontVariantNumeric: "tabular-nums",
          color: "#FFFFFF",
          WebkitTextFillColor: "#FFFFFF",
        }}
      >
        {clock?.time || "--:--:--"}
      </div>
      <p style={{ margin: "9px 0 0", color: "#D7E6F4", fontSize: 12, fontWeight: 850 }}>
        {clock?.date || "Loading date"} · General Luna Port
      </p>
    </div>
  );
}
