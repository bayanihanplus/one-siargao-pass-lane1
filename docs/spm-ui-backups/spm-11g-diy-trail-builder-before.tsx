"use client";

import { useMemo, useState } from "react";

type TrailStyle = "SCENIC" | "SURF" | "NORTH" | "ISLAND" | "SUPPORT";

type Suggestion = {
  id: string;
  icon: string;
  title: string;
  trail: TrailStyle;
  type: string;
  location: string;
  support: "Self-guided candidate" | "Operator support likely" | "Guide support may apply";
  priceMode: "Pricing preview" | "Request to confirm" | "Support-based pricing";
  stampNote: string;
};

const trailStyles: Array<{ value: TrailStyle; label: string; icon: string; description: string }> = [
  {
    value: "SCENIC",
    label: "Sunset & Scenic Trail",
    icon: "🌅",
    description: "Best for slow pacing, sunset views, photo stops, and low-friction land movement.",
  },
  {
    value: "SURF",
    label: "Surf + Coastal Trail",
    icon: "🏄",
    description: "Best for surf culture, coastal routes, Cloud 9 context, and active travelers.",
  },
  {
    value: "NORTH",
    label: "North Siargao Trail",
    icon: "🚐",
    description: "Best for longer land routes, scenic corridors, and transport-supported movement.",
  },
  {
    value: "ISLAND",
    label: "Island / Water Access Trail",
    icon: "🏝️",
    description: "Best for island-hopping style requests where operator fulfillment may be required.",
  },
  {
    value: "SUPPORT",
    label: "Operator-Supported Custom Trail",
    icon: "🧑‍✈️",
    description: "Best when the traveler likely needs transport, guide support, boat access, or activity handling.",
  },
];

const suggestions: Suggestion[] = [
  {
    id: "cloud9-sunset",
    icon: "🌊",
    title: "Cloud 9 Sunset Zone",
    trail: "SCENIC",
    type: "Scenic anchor",
    location: "General Luna",
    support: "Self-guided candidate",
    priceMode: "Pricing preview",
    stampNote: "Stamp eligibility depends on governed OSP/SPM records.",
  },
  {
    id: "catangnan-bridge",
    icon: "🌉",
    title: "Catangnan Bridge",
    trail: "SCENIC",
    type: "Photo / sunset stop",
    location: "General Luna",
    support: "Self-guided candidate",
    priceMode: "Pricing preview",
    stampNote: "Candidate stop only until validation rules allow it.",
  },
  {
    id: "cloud9-surf",
    icon: "🏄",
    title: "Cloud 9 Surf Context",
    trail: "SURF",
    type: "Surf culture anchor",
    location: "General Luna",
    support: "Guide support may apply",
    priceMode: "Support-based pricing",
    stampNote: "No surf/stamp claim is created from adding this card.",
  },
  {
    id: "pacifico-corridor",
    icon: "🚐",
    title: "Pacifico North Corridor",
    trail: "NORTH",
    type: "Longer land route",
    location: "North Siargao",
    support: "Operator support likely",
    priceMode: "Request to confirm",
    stampNote: "Transport and timing must be validated before confirmation.",
  },
  {
    id: "magpupungko-context",
    icon: "🪨",
    title: "Magpupungko Scenic Context",
    trail: "NORTH",
    type: "Tide-sensitive candidate",
    location: "Pilar / east route context",
    support: "Operator support likely",
    priceMode: "Request to confirm",
    stampNote: "Requires safety, access, and timing validation.",
  },
  {
    id: "island-hopping-context",
    icon: "🏝️",
    title: "Island Hopping Route Context",
    trail: "ISLAND",
    type: "Boat/operator route",
    location: "General Luna island route",
    support: "Operator support likely",
    priceMode: "Request to confirm",
    stampNote: "Operator, manifest, payment, and QR/stamp records must exist later.",
  },
  {
    id: "custom-guide-support",
    icon: "🧑‍✈️",
    title: "Guide-Supported Custom Trail",
    trail: "SUPPORT",
    type: "Specialized trip support",
    location: "Depends on selected route",
    support: "Guide support may apply",
    priceMode: "Support-based pricing",
    stampNote: "Assigned guide appears only after operator confirmation.",
  },
];

function getStyleMeta(style: TrailStyle) {
  return trailStyles.find((item) => item.value === style) ?? trailStyles[0];
}

function ShellButton(props: {
  children: string;
  icon: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "dark";
  disabled?: boolean;
}) {
  const variant = props.variant ?? "primary";
  const style =
    variant === "primary"
      ? {
          background: "linear-gradient(135deg, #078da0, #0f766e)",
          color: "#ffffff",
          border: "1px solid rgba(7,141,160,0.25)",
          boxShadow: "0 16px 32px rgba(7,141,160,0.24)",
        }
      : variant === "dark"
        ? {
            background: "#10234a",
            color: "#ffffff",
            border: "1px solid rgba(16,35,74,0.24)",
            boxShadow: "0 16px 32px rgba(16,35,74,0.18)",
          }
        : {
            background: "rgba(255,255,255,0.88)",
            color: "#075985",
            border: "1px solid rgba(14,116,144,0.16)",
            boxShadow: "0 12px 26px rgba(15,23,42,0.08)",
          };

  const commonStyle = {
    minHeight: 45,
    borderRadius: 999,
    padding: "12px 15px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    textDecoration: "none",
    fontSize: 12.5,
    fontWeight: 950,
    cursor: props.disabled ? "not-allowed" : "pointer",
    opacity: props.disabled ? 0.55 : 1,
    ...style,
  } as const;

  if (props.href) {
    return (
      <a href={props.href} style={commonStyle}>
        <span aria-hidden="true">{props.icon}</span>
        <span>{props.children}</span>
      </a>
    );
  }

  return (
    <button type="button" onClick={props.onClick} disabled={props.disabled} style={commonStyle}>
      <span aria-hidden="true">{props.icon}</span>
      <span>{props.children}</span>
    </button>
  );
}

function Pill(props: { children: string; tone?: "blue" | "green" | "gold" | "slate" }) {
  const tone = props.tone ?? "slate";
  const theme = {
    blue: ["rgba(14,165,233,0.10)", "#0369a1", "rgba(14,165,233,0.18)"],
    green: ["rgba(22,163,74,0.10)", "#166534", "rgba(22,163,74,0.18)"],
    gold: ["rgba(217,119,6,0.11)", "#92400e", "rgba(217,119,6,0.18)"],
    slate: ["rgba(15,23,42,0.06)", "#334155", "rgba(15,23,42,0.10)"],
  }[tone];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "7px 10px",
        background: theme[0],
        color: theme[1],
        border: `1px solid ${theme[2]}`,
        fontSize: 10.5,
        fontWeight: 950,
        whiteSpace: "nowrap",
      }}
    >
      {props.children}
    </span>
  );
}

export default function BuildYourOwnPassportTrailPage() {
  const [selectedStyle, setSelectedStyle] = useState<TrailStyle>("SCENIC");
  const [supportLevel, setSupportLevel] = useState("Flexible support");
  const [draftIds, setDraftIds] = useState<string[]>([]);

  const styleMeta = getStyleMeta(selectedStyle);

  const filteredSuggestions = useMemo(
    () => suggestions.filter((item) => item.trail === selectedStyle || selectedStyle === "SUPPORT"),
    [selectedStyle]
  );

  const draftItems = useMemo(
    () => suggestions.filter((item) => draftIds.includes(item.id)),
    [draftIds]
  );

  function toggleDraft(id: string) {
    setDraftIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 15% 0%, rgba(45,212,191,0.22), transparent 36%), radial-gradient(circle at 96% 6%, rgba(251,191,36,0.18), transparent 32%), linear-gradient(180deg, #f8fdff 0%, #eefbf7 46%, #f8fafc 100%)",
        padding: "18px 14px 108px",
        color: "#10234a",
      }}
    >
      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        <header
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 34,
            border: "1px solid rgba(14,116,144,0.16)",
            background:
              "linear-gradient(145deg, rgba(12,74,110,0.98), rgba(8,145,178,0.92) 48%, rgba(20,184,166,0.82))",
            boxShadow: "0 26px 58px rgba(15,23,42,0.20)",
            padding: 18,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 83% 16%, rgba(255,255,255,0.28), transparent 22%), radial-gradient(circle at 18% 92%, rgba(250,204,21,0.22), transparent 24%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <a
                href="/traveler/passport-trails"
                aria-label="Back to Passport Trails"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 18,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  background: "rgba(255,255,255,0.16)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.22)",
                  fontWeight: 950,
                  fontSize: 18,
                }}
              >
                ←
              </a>
              <Pill tone="gold">Specialized trip</Pill>
            </div>

            <div style={{ marginTop: 26 }}>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 950,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                Passport Trails™ Custom Builder
              </div>

              <h1
                style={{
                  margin: "8px 0 0",
                  fontSize: 32,
                  lineHeight: 0.98,
                  letterSpacing: "-0.05em",
                  color: "#ffffff",
                  fontWeight: 950,
                }}
              >
                Build Your Own Passport Trail
              </h1>

              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 17,
                  lineHeight: 1.18,
                  color: "#fef9c3",
                  fontWeight: 950,
                }}
              >
                Build a draft route request.
              </p>

              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: 12.5,
                  lineHeight: 1.48,
                  color: "rgba(255,255,255,0.83)",
                  fontWeight: 700,
                  maxWidth: 370,
                }}
              >
                Choose a Passport Trail style, add suggested stops or tours to your draft, then ask Kuya Tala™
                to shape the request. Nothing is booked, paid, assigned, or stamp-validated from this page.
              </p>
            </div>

            <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 9 }}>
              <ShellButton href="#builder" icon="🧩" variant="primary">
                Open builder
              </ShellButton>
              <ShellButton href="#draft-route" icon="🧺" variant="secondary">
                View draft
              </ShellButton>
            </div>
          </div>
        </header>

        <section
          id="builder"
          aria-label="Passport Trail builder controls"
          style={{
            marginTop: 16,
            borderRadius: 30,
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(14,116,144,0.14)",
            boxShadow: "0 22px 52px rgba(15,23,42,0.10)",
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "#078da0",
            }}
          >
            Step 1
          </div>
          <h2 style={{ margin: "5px 0 0", fontSize: 22, lineHeight: 1.06, fontWeight: 950 }}>
            Choose a Passport Trail style.
          </h2>

          <select
            value={selectedStyle}
            onChange={(event) => setSelectedStyle(event.target.value as TrailStyle)}
            style={{
              marginTop: 13,
              width: "100%",
              minHeight: 50,
              borderRadius: 18,
              border: "1px solid rgba(14,116,144,0.22)",
              background: "#ffffff",
              color: "#10234a",
              padding: "0 14px",
              fontSize: 13,
              fontWeight: 850,
              outline: "none",
              boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
            }}
            aria-label="Choose Passport Trail style"
          >
            {trailStyles.map((style) => (
              <option key={style.value} value={style.value}>
                {style.icon} {style.label}
              </option>
            ))}
          </select>

          <div
            style={{
              marginTop: 12,
              borderRadius: 22,
              background: "linear-gradient(135deg, rgba(236,253,245,0.96), rgba(240,249,255,0.96))",
              border: "1px solid rgba(14,116,144,0.12)",
              padding: 13,
            }}
          >
            <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
              <span style={{ fontSize: 26 }} aria-hidden="true">
                {styleMeta.icon}
              </span>
              <div>
                <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 950 }}>{styleMeta.label}</h3>
                <p style={{ margin: "6px 0 0", fontSize: 11.8, lineHeight: 1.43, fontWeight: 700, color: "rgba(15,23,42,0.64)" }}>
                  {styleMeta.description}
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <label
              style={{
                display: "block",
                fontSize: 10.5,
                fontWeight: 950,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "#078da0",
              }}
            >
              Support expectation
            </label>
            <select
              value={supportLevel}
              onChange={(event) => setSupportLevel(event.target.value)}
              style={{
                marginTop: 8,
                width: "100%",
                minHeight: 48,
                borderRadius: 18,
                border: "1px solid rgba(14,116,144,0.22)",
                background: "#ffffff",
                color: "#10234a",
                padding: "0 14px",
                fontSize: 13,
                fontWeight: 850,
                outline: "none",
              }}
              aria-label="Choose support expectation"
            >
              <option>Flexible support</option>
              <option>Self-guided where possible</option>
              <option>Transport support likely</option>
              <option>Guide support preferred</option>
              <option>Operator-supported route</option>
            </select>
          </div>
        </section>

        <section
          aria-label="Auto-populated suggested tours and stops"
          style={{
            marginTop: 18,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-end" }}>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 950,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: "#078da0",
                }}
              >
                Step 2
              </div>
              <h2 style={{ margin: "5px 0 0", fontSize: 22, lineHeight: 1.06, fontWeight: 950 }}>
                Auto-populated suggestions.
              </h2>
            </div>
            <Pill tone="blue">{filteredSuggestions.length} shown</Pill>
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 11 }}>
            {filteredSuggestions.map((item) => {
              const selected = draftIds.includes(item.id);

              return (
                <article
                  key={item.id}
                  style={{
                    borderRadius: 28,
                    border: selected ? "1px solid rgba(22,163,74,0.35)" : "1px solid rgba(14,116,144,0.14)",
                    background: selected
                      ? "linear-gradient(135deg, rgba(236,253,245,0.98), rgba(255,255,255,0.94))"
                      : "rgba(255,255,255,0.92)",
                    boxShadow: selected ? "0 22px 48px rgba(22,163,74,0.12)" : "0 18px 40px rgba(15,23,42,0.08)",
                    padding: 15,
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span
                      aria-hidden="true"
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 19,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "linear-gradient(135deg, #e0f7fa, #ecfdf5)",
                        fontSize: 22,
                        flex: "0 0 auto",
                      }}
                    >
                      {item.icon}
                    </span>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.12, fontWeight: 950 }}>{item.title}</h3>
                          <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "rgba(15,23,42,0.56)", fontWeight: 800 }}>
                            {item.type} • {item.location}
                          </p>
                        </div>
                        <Pill tone={selected ? "green" : "slate"}>{selected ? "Added" : "Preview"}</Pill>
                      </div>

                      <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                        <Pill tone="blue">{item.support}</Pill>
                        <Pill tone="gold">{item.priceMode}</Pill>
                      </div>

                      <p style={{ margin: "10px 0 0", fontSize: 11.8, lineHeight: 1.42, fontWeight: 700, color: "rgba(15,23,42,0.64)" }}>
                        {item.stampNote}
                      </p>

                      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <ShellButton onClick={() => toggleDraft(item.id)} icon={selected ? "−" : "+"} variant={selected ? "secondary" : "primary"}>
                          {selected ? "Remove" : "Add to draft"}
                        </ShellButton>
                        <ShellButton href="/traveler/passport-map" icon="🗺️" variant="secondary">
                          Map
                        </ShellButton>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section
          id="draft-route"
          aria-label="Draft route board"
          style={{
            marginTop: 18,
            borderRadius: 30,
            background: "rgba(15,23,42,0.94)",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 24px 54px rgba(15,23,42,0.20)",
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "#67e8f9",
            }}
          >
            Step 3
          </div>

          <h2 style={{ margin: "6px 0 0", fontSize: 22, lineHeight: 1.08, fontWeight: 950 }}>
            Draft route board
          </h2>

          <p style={{ margin: "8px 0 0", fontSize: 12, lineHeight: 1.45, color: "rgba(255,255,255,0.72)", fontWeight: 700 }}>
            {draftItems.length
              ? `${draftItems.length} item${draftItems.length > 1 ? "s" : ""} added. This is a local planning draft only.`
              : "Add suggested tours or stops above to shape a local planning draft."}
          </p>

          <div style={{ marginTop: 13, display: "grid", gap: 8 }}>
            {draftItems.length ? (
              draftItems.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    borderRadius: 18,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    padding: "10px 11px",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(103,232,249,0.16)",
                      color: "#67e8f9",
                      fontSize: 11,
                      fontWeight: 950,
                    }}
                  >
                    {index + 1}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 900 }}>{item.title}</div>
                    <div style={{ marginTop: 2, fontSize: 10.8, color: "rgba(255,255,255,0.62)", fontWeight: 700 }}>
                      {item.support} • {item.priceMode}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  padding: "13px 12px",
                  fontSize: 12,
                  lineHeight: 1.45,
                  color: "rgba(255,255,255,0.70)",
                  fontWeight: 700,
                }}
              >
                No draft items yet. Start by adding one suggestion.
              </div>
            )}
          </div>

          <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
            <ShellButton
              href="/traveler/settings?panel=assistant&topic=trail"
              icon="✨"
              variant="primary"
              disabled={!draftItems.length}
            >
              Ask Kuya Tala to shape this
            </ShellButton>
            <ShellButton href="/traveler/passport-trails" icon="🏝️" variant="secondary">
              Back to trail catalog
            </ShellButton>
          </div>

          <div style={{ marginTop: 13, display: "grid", gap: 7 }}>
            {[
              "This draft is not saved to backend yet.",
              "No booking, payment, operator, guide, QR validation, or stamp progress is created here.",
              "Specialized pricing may be higher than fixed tours once fulfillment is reviewed.",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  fontSize: 11.4,
                  lineHeight: 1.4,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.68)",
                }}
              >
                <span aria-hidden="true">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label="Sticky actions"
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 20,
            padding: "10px 14px 14px",
            background: "linear-gradient(180deg, rgba(248,250,252,0), rgba(248,250,252,0.98) 30%, rgba(248,250,252,1))",
          }}
        >
          <div
            style={{
              maxWidth: 460,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 9,
            }}
          >
            <ShellButton href="#builder" icon="🧩" variant="secondary">
              Builder
            </ShellButton>
            <ShellButton href="#draft-route" icon="🧺" variant="primary">
              Draft route
            </ShellButton>
          </div>
        </section>
      </div>
    </main>
  );
}
