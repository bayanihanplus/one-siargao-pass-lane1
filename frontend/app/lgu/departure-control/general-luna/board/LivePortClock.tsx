"use client";

import { useEffect, useState } from "react";

function getManilaClock() {
  const now = new Date();

  const time = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);

  const date = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(now);

  return { time, date };
}

export default function LivePortClock() {
  const [clock, setClock] = useState<{ time: string; date: string } | null>(null);

  useEffect(() => {
    setClock(getManilaClock());

    const interval = window.setInterval(() => {
      setClock(getManilaClock());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      suppressHydrationWarning
      style={{
        borderRadius: 28,
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
        border: "1px solid rgba(255,255,255,0.20)",
        boxShadow: "0 28px 90px rgba(0,0,0,0.42)",
        padding: "16px 18px",
        minHeight: 110,
        display: "grid",
        alignContent: "center",
        color: "#ffffff",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#F3AE26",
          fontSize: 12,
          fontWeight: 950,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        Philippine Standard Time
      </p>

      <div
        style={{
          marginTop: 6,
          color: "#ffffff",
          fontSize: 42,
          lineHeight: 0.95,
          fontWeight: 950,
          letterSpacing: "-0.045em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {clock?.time || "--:--:--"}
      </div>

      <p
        style={{
          margin: "8px 0 0",
          color: "#B8C9DA",
          fontSize: 12,
          fontWeight: 850,
        }}
      >
        {clock?.date || "Loading date"} · General Luna Port
      </p>
    </section>
  );
}
