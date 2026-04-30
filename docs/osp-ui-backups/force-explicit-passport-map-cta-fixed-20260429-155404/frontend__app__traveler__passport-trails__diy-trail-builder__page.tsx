"use client";

import { useMemo, useState } from "react";
import UniversalTravelerBottomTabBar from "../../../../src/components/traveler/UniversalTravelerBottomTabBar";

type TrailStyle = "SCENIC" | "SURF" | "NORTH" | "ISLAND" | "SUPPORT";

type Suggestion = {
  id: string;
  icon: string;
  title: string;
  trail: TrailStyle;
  category: string;
  area: string;
  support: "Self-guided candidate" | "Operator support likely" | "Guide support may apply";
  priceMode: "Estimate later" | "Request to confirm" | "Support-based pricing";
  note: string;
};

const DRAFT_STORAGE_KEY = "osp-spm-diy-passport-trail-draft-v1";

const trailStyles: Array<{ value: TrailStyle; label: string; icon: string; description: string }> = [
  {
    value: "SCENIC",
    label: "Sunset & Scenic Trail",
    icon: "🌅",
    description: "Golden-hour stops, scenic anchors, photos, and lighter land movement.",
  },
  {
    value: "SURF",
    label: "Surf + Coastal Trail",
    icon: "🏄",
    description: "Surf culture, coastal stops, Cloud 9 context, and active island energy.",
  },
  {
    value: "NORTH",
    label: "North Siargao Trail",
    icon: "🚐",
    description: "Longer land movement, north coast stops, and transport-supported routing.",
  },
  {
    value: "ISLAND",
    label: "Island / Water Access Trail",
    icon: "🏝️",
    description: "Island-hopping style requests where operator fulfillment may be required.",
  },
  {
    value: "SUPPORT",
    label: "Operator-Supported Custom Trail",
    icon: "🧑‍✈️",
    description: "Best when transport, guide support, boat access, or activity handling may be needed.",
  },
];

/*
 * SPM-11H LOCK:
 * The local `suggestions` array below is a temporary UX scaffold only.
 * Future production suggestions/dropdowns must be populated from approved
 * Operator tour-led activities, approved Passport Trails packages/nodes,
 * approved operator pricing, guide-support requirement flags, and governed
 * OSP/SPM fulfillment records.
 *
 * Selecting a suggestion means draft interest only. It must not create
 * booking, payment, guide assignment, QR validation, manifest, or Passport
 * Stamp progress.
 */

const suggestions: Suggestion[] = [
  {
    id: "cloud9-sunset",
    icon: "🌊",
    title: "Cloud 9 Sunset Zone",
    trail: "SCENIC",
    category: "Scenic anchor",
    area: "General Luna",
    support: "Self-guided candidate",
    priceMode: "Estimate later",
    note: "Good as a soft scenic anchor. Validation still depends on governed OSP/SPM records.",
  },
  {
    id: "catangnan-bridge",
    icon: "🌉",
    title: "Catangnan Bridge",
    trail: "SCENIC",
    category: "Photo stop",
    area: "General Luna",
    support: "Self-guided candidate",
    priceMode: "Estimate later",
    note: "Good for sunset / scenic routing after local validation rules allow it.",
  },
  {
    id: "cloud9-surf",
    icon: "🏄",
    title: "Cloud 9 Surf Context",
    trail: "SURF",
    category: "Surf culture",
    area: "General Luna",
    support: "Guide support may apply",
    priceMode: "Support-based pricing",
    note: "Useful for surf-oriented planning. No surf, booking, or stamp claim is created here.",
  },
  {
    id: "pacifico-corridor",
    icon: "🚐",
    title: "Pacifico North Corridor",
    trail: "NORTH",
    category: "Longer land route",
    area: "North Siargao",
    support: "Operator support likely",
    priceMode: "Request to confirm",
    note: "Transport, route time, and operator feasibility must be reviewed.",
  },
  {
    id: "magpupungko-context",
    icon: "🪨",
    title: "Magpupungko Scenic Context",
    trail: "NORTH",
    category: "Tide-sensitive stop",
    area: "Pilar / east route",
    support: "Operator support likely",
    priceMode: "Request to confirm",
    note: "Requires timing, access, safety, and governed stop validation.",
  },
  {
    id: "island-hopping-context",
    icon: "🏝️",
    title: "Island Hopping Route Context",
    trail: "ISLAND",
    category: "Boat route",
    area: "General Luna islands",
    support: "Operator support likely",
    priceMode: "Request to confirm",
    note: "Boat/operator, payment, manifest, and QR/stamp records must exist later.",
  },
  {
    id: "custom-guide-support",
    icon: "🧑‍✈️",
    title: "Guide-Supported Custom Trail",
    trail: "SUPPORT",
    category: "Specialized support",
    area: "Depends on route",
    support: "Guide support may apply",
    priceMode: "Support-based pricing",
    note: "Assigned guide details appear only after operator confirmation.",
  },
];

function getStyleMeta(style: TrailStyle) {
  return trailStyles.find((item) => item.value === style) ?? trailStyles[0];
}

function CompactButton(props: {
  children: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "dark";
  disabled?: boolean;
}) {
  const variant = props.variant ?? "primary";
  const theme =
    variant === "primary"
      ? {
          background: "linear-gradient(135deg, #078da0, #0f766e)",
          color: "#ffffff",
          border: "1px solid rgba(7,141,160,0.24)",
          shadow: "0 10px 22px rgba(7,141,160,0.20)",
        }
      : variant === "dark"
        ? {
            background: "#10234a",
            color: "#ffffff",
            border: "1px solid rgba(16,35,74,0.22)",
            shadow: "0 10px 22px rgba(16,35,74,0.18)",
          }
        : variant === "ghost"
          ? {
              background: "transparent",
              color: "#075985",
              border: "1px solid rgba(14,116,144,0.18)",
              shadow: "none",
            }
          : {
              background: "rgba(255,255,255,0.88)",
              color: "#075985",
              border: "1px solid rgba(14,116,144,0.16)",
              shadow: "0 8px 18px rgba(15,23,42,0.07)",
            };

  const style = {
    minHeight: 38,
    borderRadius: 14,
    padding: "9px 11px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    textDecoration: "none",
    fontSize: 11.3,
    lineHeight: 1,
    fontWeight: 900,
    cursor: props.disabled ? "not-allowed" : "pointer",
    opacity: props.disabled ? 0.55 : 1,
    background: theme.background,
    color: theme.color,
    border: theme.border,
    boxShadow: theme.shadow,
  } as const;

  if (props.href) {
    return (
      <a href={props.href} style={style}>
        {props.icon ? <span aria-hidden="true">{props.icon}</span> : null}
        <span>{props.children}</span>
      </a>
    );
  }

  return (
    <button type="button" onClick={props.onClick} disabled={props.disabled} style={style}>
      {props.icon ? <span aria-hidden="true">{props.icon}</span> : null}
      <span>{props.children}</span>
    </button>
  );
}

function Pill(props: { children: string; tone?: "blue" | "green" | "gold" | "slate" }) {
  const theme = {
    blue: ["rgba(14,165,233,0.10)", "#0369a1", "rgba(14,165,233,0.18)"],
    green: ["rgba(22,163,74,0.10)", "#166534", "rgba(22,163,74,0.18)"],
    gold: ["rgba(217,119,6,0.10)", "#92400e", "rgba(217,119,6,0.18)"],
    slate: ["rgba(15,23,42,0.06)", "#334155", "rgba(15,23,42,0.10)"],
  }[props.tone ?? "slate"];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "5px 8px",
        background: theme[0],
        color: theme[1],
        border: `1px solid ${theme[2]}`,
        fontSize: 9.6,
        fontWeight: 900,
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
  const [savedNotice, setSavedNotice] = useState("");

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
    setSavedNotice("");
    setDraftIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function saveLocalDraft() {
    const payload = {
      savedAt: new Date().toISOString(),
      selectedStyle,
      supportLevel,
      items: draftItems,
      disclaimer:
        "Local planning draft only. No booking, payment, operator, guide, QR validation, or stamp progress is created.",
    };

    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
    setSavedNotice("Draft saved on this device.");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 15% 0%, rgba(45,212,191,0.18), transparent 34%), radial-gradient(circle at 96% 4%, rgba(251,191,36,0.15), transparent 30%), linear-gradient(180deg, #f8fdff 0%, #eefbf7 46%, #f8fafc 100%)",
        padding: "14px 12px 94px",
        color: "#10234a",
      }}
    >
      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        <header
          style={{
            borderRadius: 28,
            background: "linear-gradient(145deg, rgba(12,74,110,0.98), rgba(8,145,178,0.92), rgba(20,184,166,0.82))",
            boxShadow: "0 22px 48px rgba(15,23,42,0.18)",
            padding: 16,
            color: "#ffffff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <a
              href="/traveler/passport-trails"
              aria-label="Back to Passport Trails"
              style={{
                width: 38,
                height: 38,
                borderRadius: 15,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                background: "rgba(255,255,255,0.16)",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.20)",
                fontWeight: 950,
              }}
            >
              ←
            </a>
            <Pill tone="gold">Specialized trip</Pill>
          </div>

          <div style={{ marginTop: 22 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.78)",
              }}
            >
              Passport Trails™ Builder
            </div>

            <h1 style={{ margin: "7px 0 0", fontSize: 29, lineHeight: 1, letterSpacing: "-0.045em", fontWeight: 950 }}>
              Build Your Own Passport Trail
            </h1>

            <p style={{ margin: "9px 0 0", color: "#fef9c3", fontSize: 15.5, fontWeight: 950 }}>
              Build a draft itinerary request.
            </p>

            <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.82)", fontSize: 12.2, lineHeight: 1.45, fontWeight: 680 }}>
              Choose a trail style, add suggested tours or stops, save a local draft, then review the final itinerary summary.
            </p>
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <CompactButton href="#builder" icon="🧩">Builder</CompactButton>
            <CompactButton href="/traveler/passport-trails/diy-trail-builder/summary" icon="📋" variant="secondary">
              Summary
            </CompactButton>
          </div>
        </header>

        <section
          id="builder"
          aria-label="Builder controls"
          style={{
            marginTop: 12,
            borderRadius: 24,
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(14,116,144,0.13)",
            boxShadow: "0 16px 36px rgba(15,23,42,0.08)",
            padding: 13,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 9.8, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase", color: "#078da0" }}>
                Step 1
              </div>
              <h2 style={{ margin: "4px 0 0", fontSize: 18, lineHeight: 1.08, fontWeight: 950 }}>Choose trail style</h2>
            </div>
            <Pill tone="blue">{`${styleMeta.icon} ${styleMeta.label}`}</Pill>
          </div>

          <select
            value={selectedStyle}
            onChange={(event) => {
              setSelectedStyle(event.target.value as TrailStyle);
              setSavedNotice("");
            }}
            aria-label="Choose Passport Trail style"
            style={{
              marginTop: 11,
              width: "100%",
              minHeight: 42,
              borderRadius: 14,
              border: "1px solid rgba(14,116,144,0.22)",
              background: "#ffffff",
              color: "#10234a",
              padding: "0 11px",
              fontSize: 12.2,
              fontWeight: 820,
              outline: "none",
            }}
          >
            {trailStyles.map((style) => (
              <option key={style.value} value={style.value}>
                {style.icon} {style.label}
              </option>
            ))}
          </select>

          <p style={{ margin: "9px 0 0", fontSize: 11.3, lineHeight: 1.4, color: "rgba(15,23,42,0.62)", fontWeight: 700 }}>
            {styleMeta.description}
          </p>

          <label style={{ display: "block", marginTop: 13, fontSize: 9.8, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase", color: "#078da0" }}>
            Support expectation
          </label>

          <select
            value={supportLevel}
            onChange={(event) => {
              setSupportLevel(event.target.value);
              setSavedNotice("");
            }}
            aria-label="Choose support expectation"
            style={{
              marginTop: 7,
              width: "100%",
              minHeight: 42,
              borderRadius: 14,
              border: "1px solid rgba(14,116,144,0.22)",
              background: "#ffffff",
              color: "#10234a",
              padding: "0 11px",
              fontSize: 12.2,
              fontWeight: 820,
              outline: "none",
            }}
          >
            <option>Flexible support</option>
            <option>Self-guided where possible</option>
            <option>Transport support likely</option>
            <option>Guide support preferred</option>
            <option>Operator-supported route</option>
          </select>
        </section>

        <section aria-label="Auto-populated suggested tours and stops" style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 9.8, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase", color: "#078da0" }}>
                Step 2
              </div>
              <h2 style={{ margin: "4px 0 0", fontSize: 19, lineHeight: 1.08, fontWeight: 950 }}>
                Suggested tours & stops
              </h2>
            </div>
            <Pill tone="blue">{`${filteredSuggestions.length} options`}</Pill>
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 9 }}>
            {filteredSuggestions.map((item) => {
              const selected = draftIds.includes(item.id);

              return (
                <article
                  key={item.id}
                  style={{
                    borderRadius: 22,
                    border: selected ? "1px solid rgba(22,163,74,0.34)" : "1px solid rgba(14,116,144,0.13)",
                    background: selected ? "linear-gradient(135deg, rgba(236,253,245,0.98), rgba(255,255,255,0.94))" : "rgba(255,255,255,0.92)",
                    boxShadow: selected ? "0 16px 34px rgba(22,163,74,0.12)" : "0 12px 28px rgba(15,23,42,0.07)",
                    padding: 12,
                  }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div
                      aria-hidden="true"
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 16,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "linear-gradient(135deg, #e0f7fa, #ecfdf5)",
                        fontSize: 19,
                        flex: "0 0 auto",
                      }}
                    >
                      {item.icon}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: 14.2, lineHeight: 1.13, fontWeight: 950 }}>{item.title}</h3>
                          <p style={{ margin: "3px 0 0", fontSize: 10.8, color: "rgba(15,23,42,0.55)", fontWeight: 780 }}>
                            {item.category} • {item.area}
                          </p>
                        </div>
                        <Pill tone={selected ? "green" : "slate"}>{selected ? "Added" : "Preview"}</Pill>
                      </div>

                      <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 5 }}>
                        <Pill tone="blue">{item.support}</Pill>
                        <Pill tone="gold">{item.priceMode}</Pill>
                      </div>

                      <p style={{ margin: "8px 0 0", fontSize: 11.2, lineHeight: 1.38, color: "rgba(15,23,42,0.63)", fontWeight: 690 }}>
                        {item.note}
                      </p>

                      <div style={{ marginTop: 10, display: "flex", gap: 7, flexWrap: "wrap" }}>
                        <CompactButton onClick={() => toggleDraft(item.id)} icon={selected ? "−" : "+"} variant={selected ? "secondary" : "primary"}>
                          {selected ? "Remove" : "Add"}
                        </CompactButton>
                        <CompactButton href="/traveler/passport-map" icon="🗺️" variant="ghost">
                          Map
                        </CompactButton>
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
            marginTop: 16,
            borderRadius: 24,
            background: "rgba(15,23,42,0.94)",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 20px 44px rgba(15,23,42,0.18)",
            padding: 14,
          }}
        >
          <div style={{ fontSize: 9.8, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase", color: "#67e8f9" }}>
            Step 3
          </div>

          <h2 style={{ margin: "5px 0 0", fontSize: 19, lineHeight: 1.08, fontWeight: 950 }}>Draft itinerary</h2>

          <p style={{ margin: "7px 0 0", fontSize: 11.5, lineHeight: 1.4, color: "rgba(255,255,255,0.72)", fontWeight: 700 }}>
            {draftItems.length
              ? `${draftItems.length} item${draftItems.length > 1 ? "s" : ""} in your local planning draft.`
              : "Add suggested tours or stops above to create a local planning draft."}
          </p>

          <div style={{ marginTop: 10, display: "grid", gap: 7 }}>
            {draftItems.length ? (
              draftItems.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: 9,
                    alignItems: "center",
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    padding: "9px 10px",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 25,
                      height: 25,
                      borderRadius: 999,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(103,232,249,0.16)",
                      color: "#67e8f9",
                      fontSize: 10.5,
                      fontWeight: 950,
                    }}
                  >
                    {index + 1}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 900 }}>{item.title}</div>
                    <div style={{ marginTop: 1, fontSize: 10.3, color: "rgba(255,255,255,0.62)", fontWeight: 700 }}>
                      {item.support} • {item.priceMode}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  padding: "11px 10px",
                  fontSize: 11.5,
                  lineHeight: 1.4,
                  color: "rgba(255,255,255,0.70)",
                  fontWeight: 700,
                }}
              >
                No draft items yet.
              </div>
            )}
          </div>

          {savedNotice ? (
            <div
              style={{
                marginTop: 10,
                borderRadius: 14,
                background: "rgba(22,163,74,0.14)",
                border: "1px solid rgba(34,197,94,0.22)",
                padding: "9px 10px",
                color: "#bbf7d0",
                fontSize: 11.2,
                fontWeight: 850,
              }}
            >
              {savedNotice}
            </div>
          ) : null}

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <CompactButton onClick={saveLocalDraft} icon="💾" disabled={!draftItems.length}>
              Save draft
            </CompactButton>
            <CompactButton href="/traveler/passport-trails/diy-trail-builder/summary" icon="📋" variant="secondary" disabled={!draftItems.length}>
              Summary
            </CompactButton>
          </div>

          <p style={{ margin: "10px 0 0", fontSize: 10.8, lineHeight: 1.35, color: "rgba(255,255,255,0.58)", fontWeight: 650 }}>
            Saved draft is local to this browser only. No booking, payment, guide assignment, QR validation, or Passport Stamp progress is created.
          </p>
        </section>

        <section
          aria-label="Sticky actions"
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 20,
            padding: "9px 12px 13px",
            background: "linear-gradient(180deg, rgba(248,250,252,0), rgba(248,250,252,0.98) 28%, rgba(248,250,252,1))",
          }}
        >
          <div
            style={{
              maxWidth: 460,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 7,
            }}
          >
            <CompactButton href="#builder" icon="🧩" variant="secondary">
              Builder
            </CompactButton>
            <CompactButton onClick={saveLocalDraft} icon="💾" disabled={!draftItems.length}>
              Save
            </CompactButton>
            <CompactButton href="/traveler/passport-trails/diy-trail-builder/summary" icon="📋" variant="dark">
              Summary
            </CompactButton>
          </div>
        </section>
      </div>
      <div aria-hidden="true" style={{ height: 118 }} />
      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
    </main>
  );
}
