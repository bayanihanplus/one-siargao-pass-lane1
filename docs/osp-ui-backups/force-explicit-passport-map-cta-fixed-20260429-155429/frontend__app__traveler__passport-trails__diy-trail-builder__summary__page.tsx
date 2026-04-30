"use client";

import { useEffect, useState } from "react";
import UniversalTravelerBottomTabBar from "../../../../../src/components/traveler/UniversalTravelerBottomTabBar";
import PassportMapShortcut from "../../../../../src/components/traveler/PassportMapShortcut";

const DRAFT_STORAGE_KEY = "osp-spm-diy-passport-trail-draft-v1";

type DraftItem = {
  id: string;
  icon: string;
  title: string;
  category: string;
  area: string;
  support: string;
  priceMode: string;
  note: string;
};

type DraftPayload = {
  savedAt: string;
  selectedStyle: string;
  supportLevel: string;
  items: DraftItem[];
  disclaimer: string;
};

function MiniButton(props: { href: string; icon: string; children: string; variant?: "primary" | "secondary" }) {
  const primary = props.variant !== "secondary";
  return (
    <a
      href={props.href}
      style={{
        minHeight: 38,
        borderRadius: 14,
        padding: "9px 11px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        textDecoration: "none",
        fontSize: 11.5,
        fontWeight: 900,
        background: primary ? "linear-gradient(135deg, #078da0, #0f766e)" : "rgba(255,255,255,0.88)",
        color: primary ? "#ffffff" : "#075985",
        border: primary ? "1px solid rgba(7,141,160,0.24)" : "1px solid rgba(14,116,144,0.16)",
        boxShadow: primary ? "0 10px 22px rgba(7,141,160,0.20)" : "0 8px 18px rgba(15,23,42,0.07)",
      }}
    >
      <span aria-hidden="true">{props.icon}</span>
      {props.children}
    </a>
  );
}

export default function DiyTrailSummaryPage() {
  const [draft, setDraft] = useState<DraftPayload | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      setDraft(stored ? JSON.parse(stored) : null);
    } catch {
      setDraft(null);
    }
  }, []);

  const items = draft?.items ?? [];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 15% 0%, rgba(45,212,191,0.18), transparent 34%), radial-gradient(circle at 96% 4%, rgba(251,191,36,0.15), transparent 30%), linear-gradient(180deg, #f8fdff 0%, #eefbf7 46%, #f8fafc 100%)",
        padding: "14px 12px 86px",
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
          <a
            href="/traveler/passport-trails/diy-trail-builder"
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
            aria-label="Back to builder"
          >
            ←
          </a>

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
              Draft itinerary summary
            </div>
            <h1 style={{ margin: "7px 0 0", fontSize: 29, lineHeight: 1, letterSpacing: "-0.045em", fontWeight: 950 }}>
              Your Passport Trail Draft
            </h1>
            <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.82)", fontSize: 12.2, lineHeight: 1.45, fontWeight: 680 }}>
              Review the locally saved draft before asking Kuya Tala™ or moving to a future fulfillment request.
            </p>
          </div>
        </header>

        <section
          style={{
            marginTop: 12,
            borderRadius: 24,
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(14,116,144,0.13)",
            boxShadow: "0 16px 36px rgba(15,23,42,0.08)",
            padding: 13,
          }}
        >
          <div style={{ fontSize: 9.8, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase", color: "#078da0" }}>
            Draft status
          </div>
          <h2 style={{ margin: "4px 0 0", fontSize: 19, lineHeight: 1.08, fontWeight: 950 }}>
            {items.length ? `${items.length} draft item${items.length > 1 ? "s" : ""}` : "No saved draft yet"}
          </h2>

          {draft ? (
            <p style={{ margin: "8px 0 0", fontSize: 11.5, lineHeight: 1.4, color: "rgba(15,23,42,0.62)", fontWeight: 700 }}>
              Style: {draft.selectedStyle} • Support: {draft.supportLevel}
            </p>
          ) : (
            <p style={{ margin: "8px 0 0", fontSize: 11.5, lineHeight: 1.4, color: "rgba(15,23,42,0.62)", fontWeight: 700 }}>
              Go back to the builder, add suggested stops, then save a local draft.
            </p>
          )}
        </section>

        <section style={{ marginTop: 12, display: "grid", gap: 9 }}>
          {items.map((item, index) => (
            <article
              key={item.id}
              style={{
                borderRadius: 22,
                background: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(14,116,144,0.13)",
                boxShadow: "0 12px 28px rgba(15,23,42,0.07)",
                padding: 12,
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 14,
                    background: "linear-gradient(135deg, #e0f7fa, #ecfdf5)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 17,
                    flex: "0 0 auto",
                  }}
                  aria-hidden="true"
                >
                  {item.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 950, color: "#078da0" }}>STOP {index + 1}</div>
                  <h3 style={{ margin: "3px 0 0", fontSize: 14.5, lineHeight: 1.12, fontWeight: 950 }}>{item.title}</h3>
                  <p style={{ margin: "4px 0 0", fontSize: 10.8, color: "rgba(15,23,42,0.55)", fontWeight: 780 }}>
                    {item.category} • {item.area}
                  </p>
                  <p style={{ margin: "8px 0 0", fontSize: 11.2, lineHeight: 1.38, color: "rgba(15,23,42,0.64)", fontWeight: 690 }}>
                    {item.support} • {item.priceMode}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section
          style={{
            marginTop: 12,
            borderRadius: 22,
            background: "rgba(15,23,42,0.94)",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.10)",
            padding: 13,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 950 }}>Important boundary</h2>
          <p style={{ margin: "7px 0 0", fontSize: 11.4, lineHeight: 1.42, color: "rgba(255,255,255,0.70)", fontWeight: 700 }}>
            This is a local draft summary only. No booking, payment, operator assignment, guide assignment, QR validation, or Passport Stamp progress has been created.
          </p>
        </section>

        <section
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
          <div style={{ maxWidth: 460, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
            <MiniButton href="/traveler/passport-trails/diy-trail-builder" icon="🧩" variant="secondary">
              Edit draft
            </MiniButton>
            <MiniButton href="/traveler/settings?panel=assistant&topic=trail" icon="✨">
              Ask Kuya Tala
            </MiniButton>
          </div>
        </section>
      </div>
      <div aria-hidden="true" style={{ height: 118 }} />
            <PassportMapShortcut compact title="Review your route on the Passport Map" body="Open the map to compare your planned route with Passport Trails and nearby stops." />
      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
    </main>
  );
}
