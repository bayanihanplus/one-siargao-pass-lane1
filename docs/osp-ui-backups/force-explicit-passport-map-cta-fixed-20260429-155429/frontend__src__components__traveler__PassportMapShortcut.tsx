import React from "react";

export default function PassportMapShortcut(props: {
  compact?: boolean;
  title?: string;
  body?: string;
}) {
  const title = props.title || "Open Siargao Passport Map";
  const body =
    props.body ||
    "View Passport Trails, verified map stops, and your next Siargao journey path.";

  return React.createElement(
    "section",
    {
      "aria-label": "Siargao Passport Map shortcut",
      style: {
        margin: props.compact ? "12px 0" : "16px 0",
        borderRadius: 22,
        padding: props.compact ? 14 : 16,
        background: "linear-gradient(135deg, rgba(236,253,245,0.98) 0%, rgba(240,249,255,0.98) 100%)",
        border: "1px solid rgba(20,184,166,0.28)",
        boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
      } satisfies React.CSSProperties,
    },
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        } satisfies React.CSSProperties,
      },
      React.createElement(
        "div",
        { style: { flex: "1 1 210px", minWidth: 0 } satisfies React.CSSProperties },
        React.createElement(
          "div",
          {
            style: {
              fontSize: 11,
              fontWeight: 950,
              color: "#0f766e",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            } satisfies React.CSSProperties,
          },
          "Siargao Passport Map",
        ),
        React.createElement(
          "div",
          {
            style: {
              marginTop: 5,
              fontSize: props.compact ? 16 : 18,
              fontWeight: 950,
              color: "#0f172a",
              letterSpacing: "-0.03em",
              lineHeight: 1.12,
            } satisfies React.CSSProperties,
          },
          title,
        ),
        React.createElement(
          "p",
          {
            style: {
              margin: "6px 0 0",
              fontSize: 13,
              lineHeight: 1.45,
              fontWeight: 650,
              color: "#475569",
            } satisfies React.CSSProperties,
          },
          body,
        ),
      ),
      React.createElement(
        "a",
        {
          href: "/traveler/passport-map",
          style: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            minHeight: 42,
            borderRadius: 999,
            padding: "0 16px",
            background: "#0f766e",
            color: "#ffffff",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 950,
            boxShadow: "0 10px 22px rgba(15,118,110,0.22)",
            whiteSpace: "nowrap",
            WebkitTapHighlightColor: "transparent",
          } satisfies React.CSSProperties,
        },
        React.createElement("span", { "aria-hidden": "true" }, "🗺️"),
        "Open Map",
      ),
    ),
  );
}
