import Link from "next/link";
import { SpmFunctionalJourneyMap } from "../../../../src/spm/functional-map/SpmFunctionalJourneyMap";
import { notFound } from "next/navigation";

type StopStatus = "STAMP_UNLOCKED" | "READY_TO_VERIFY" | "LOCKED";

type TrailStop = {
  name: string;
  shortCode: string;
  note: string;
  status: StopStatus;
  source: "QR" | "Pending";
};

type TrailDetail = {
  title: string;
  eyebrow: string;
  subtitle: string;
  progressLabel: string;
  statusLabel: string;
  nextStop: string;
  nextStopReason: string;
  stops: TrailStop[];
};

const TRAILS: Record<string, TrailDetail> = {
  "island-hopping": {
    eyebrow: "PASSPORT TRAILS™",
    title: "Island Hopping Trail",
    subtitle:
      "Follow official Island Hopping nodes through OSP/SPM verification. Stamps count only after verified QR / Passport records.",
    progressLabel: "1/5 Core Stops",
    statusLabel: "Live Trail",
    nextStop: "Daku Island",
    nextStopReason:
      "Guyam is already stamped. Daku is the next ready-to-verify official Island Hopping node. Corregidor, Mam-on, and Secret Island stay locked until governed package or progress rules apply.",
    stops: [
      {
        name: "Guyam Island",
        shortCode: "GU",
        note: "Official QR stamp node. Stamp record verified from verified OSP/SPM validation.",
        status: "STAMP_UNLOCKED",
        source: "QR",
      },
      {
        name: "Daku Island",
        shortCode: "DA",
        note: "Official QR stamp node. Ready for QR-based stop verification.",
        status: "READY_TO_VERIFY",
        source: "Pending",
      },
      {
        name: "Naked Island",
        shortCode: "NA",
        note: "Official QR stamp node. Ready for QR-based stop verification.",
        status: "READY_TO_VERIFY",
        source: "Pending",
      },
      {
        name: "Corregidor Island",
        shortCode: "CO",
        note: "Official QR stamp node. Locked until selected route/package progress allows it.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Mam-on Island",
        shortCode: "MO",
        note: "Official QR stamp node. Locked until selected route/package progress allows it.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Secret Island",
        shortCode: "SI",
        note: "Conditional package-only node. Hidden or locked until governed package rules apply.",
        status: "LOCKED",
        source: "Pending",
      },
    ],
  },
  "surf-explorer": {
    eyebrow: "PASSPORT TRAILS™",
    title: "Surf Explorer Trail",
    subtitle:
      "Cloud 9 is the approved surf anchor. Other surf nodes stay pending-review until local validation is completed.",
    progressLabel: "1 approved anchor",
    statusLabel: "Presentation Trail",
    nextStop: "Cloud 9",
    nextStopReason:
      "Cloud 9 is the approved Surf Explorer anchor. Jacking Horse, Quicksilver, Tuason Point, Stimpy’s, and Pacifico Surf Area are shown as pending-review surf nodes, not approved completion nodes.",
    stops: [
      {
        name: "Cloud 9",
        shortCode: "C9",
        note: "Approved Surf Explorer anchor node.",
        status: "STAMP_UNLOCKED",
        source: "QR",
      },
      {
        name: "Jacking Horse",
        shortCode: "JH",
        note: "Pending-review beginner surf-side node.",
        status: "READY_TO_VERIFY",
        source: "Pending",
      },
      {
        name: "Quicksilver",
        shortCode: "QS",
        note: "Pending-review surf break candidate.",
        status: "READY_TO_VERIFY",
        source: "Pending",
      },
      {
        name: "Tuason Point",
        shortCode: "TP",
        note: "Pending-review advanced surf candidate.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Stimpy’s",
        shortCode: "ST",
        note: "Pending-review reef / offshore surf candidate.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Pacifico Surf Area",
        shortCode: "PF",
        note: "Pending-review north surf expansion node.",
        status: "LOCKED",
        source: "Pending",
      },
    ],
  },
  "north-siargao": {
    eyebrow: "PASSPORT TRAILS™",
    title: "North Siargao Trail",
    subtitle:
      "Follow the approved North Siargao route through Pacifico, Alegria Beach, and Taktak Falls. Burgos and Coconut Road remain pending-review corridor nodes.",
    progressLabel: "3 approved nodes",
    statusLabel: "Presentation Trail",
    nextStop: "Alegria Beach",
    nextStopReason:
      "Pacifico is the approved north anchor. Alegria Beach and Taktak Falls are approved QR nodes. Burgos and Coconut Road stay locked until final local validation is completed.",
    stops: [
      {
        name: "Pacifico",
        shortCode: "PF",
        note: "Approved North Siargao place / north route anchor. Separate from Pacifico Surf Area.",
        status: "STAMP_UNLOCKED",
        source: "QR",
      },
      {
        name: "Alegria Beach",
        shortCode: "AL",
        note: "Approved scenic North Siargao QR node.",
        status: "READY_TO_VERIFY",
        source: "Pending",
      },
      {
        name: "Taktak Falls",
        shortCode: "TF",
        note: "Approved safety-controlled scenic QR node. Verification must respect local access and safety rules.",
        status: "READY_TO_VERIFY",
        source: "Pending",
      },
      {
        name: "Burgos",
        shortCode: "BG",
        note: "Pending-review town / north corridor node.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Coconut Road",
        shortCode: "CR",
        note: "Pending-review scenic road corridor node.",
        status: "LOCKED",
        source: "Pending",
      },
    ],
  },

  "inland-discovery": {
    eyebrow: "PASSPORT TRAILS™",
    title: "Inland Discovery Trail",
    subtitle:
      "Inland route details are being prepared for approved node placement, tide/safety rules, and QR validation.",
    progressLabel: "Node setup pending",
    statusLabel: "Preparation Trail",
    nextStop: "Maasin River",
    nextStopReason:
      "Inland Discovery nodes must remain governed by safety, access, and QR validation rules before completion can be claimed.",
    stops: [
      {
        name: "Maasin River",
        shortCode: "MR",
        note: "Inland candidate / anchor stop pending final page map placement.",
        status: "READY_TO_VERIFY",
        source: "Pending",
      },
      {
        name: "Magpupungko Rock Pools",
        shortCode: "MP",
        note: "Tide and safety-sensitive node. Must not be treated as casual completion without validation.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Tayangban Cave Pool",
        shortCode: "TC",
        note: "Safety-controlled candidate node pending access validation.",
        status: "LOCKED",
        source: "Pending",
      },
    ],
  },

  "culture-community": {
    eyebrow: "PASSPORT TRAILS™",
    title: "Culture & Community Trail",
    subtitle:
      "Consent-first cultural participation surface. Public completion is not open until partner approval and community consent governance are complete.",
    progressLabel: "Governance locked",
    statusLabel: "Consent-first Trail",
    nextStop: "Boodle Fight Experience",
    nextStopReason:
      "Boodle Fight Experience is package-only, pending review, conditional, booking-led, operator-participation based, and not stamp-eligible. No public culture/community completion route is implied.",
    stops: [
      {
        name: "Boodle Fight Experience",
        shortCode: "BF",
        note: "Conditional package-only participation node. Requires booking and operator participation. Not stamp-eligible.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Partner Approval Required",
        shortCode: "PA",
        note: "Governance lock. Approved operator / partner participation is required before public behavior is exposed.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Community Consent Review",
        shortCode: "CR",
        note: "Governance lock. Community consent and review are required before completion logic is exposed.",
        status: "LOCKED",
        source: "Pending",
      },
    ],
  },

  "sunset-scenic": {
    eyebrow: "PASSPORT TRAILS™",
    title: "Sunset & Scenic Stops Trail",
    subtitle:
      "A focused golden-hour scenic route using approved Cloud 9 / Catangnan anchors and presentation-approved pending-review scenic stops.",
    progressLabel: "Functional map wired",
    statusLabel: "Presentation Trail",
    nextStop: "Catangnan Bridge / Sunset Bridge",
    nextStopReason:
      "Cloud 9 Sunset Zone is the approved scenic anchor. Catangnan Bridge is next. Malinao, Coconut Road Scenic Point, and Magpupungko Scenic Area remain pending DB review and must not be treated as active QR-completion nodes yet.",
    stops: [
      {
        name: "Cloud 9 Sunset Zone",
        shortCode: "C9",
        note: "DB-approved scenic anchor for Sunset & Scenic. Separate from the Surf Explorer Cloud 9 surf anchor.",
        status: "READY_TO_VERIFY",
        source: "QR",
      },
      {
        name: "Catangnan Bridge / Sunset Bridge",
        shortCode: "CB",
        note: "DB-approved scenic / sunset node. Next QR-ready candidate after final governed validation wiring.",
        status: "READY_TO_VERIFY",
        source: "QR",
      },
      {
        name: "Malinao Skate Area",
        shortCode: "MS",
        note: "Presentation-approved scenic road / skate-road stop. Pending DB review; not active QR-completion truth yet.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Coconut Road Scenic Point",
        shortCode: "CR",
        note: "Presentation-approved scenic corridor node. Separate from North Siargao Coconut Road. Pending DB review.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Magpupungko Scenic Area",
        shortCode: "MG",
        note: "Presentation-approved scenic/tide-sensitive node. Separate from Inland Discovery Magpupungko Rock Pools. Pending DB and safety review.",
        status: "LOCKED",
        source: "Pending",
      },
    ],
  },

  "adventure": {
    eyebrow: "PASSPORT TRAILS™",
    title: "Adventure Trail",
    subtitle:
      "Adventure nodes are safety-controlled, operator-backed, and not DIY-casual. Passport Stamp completion requires governed QR, operator, guide, or partner validation.",
    progressLabel: "Safety-controlled map wired",
    statusLabel: "Controlled Trail",
    nextStop: "Sugba Lagoon",
    nextStopReason:
      "Sugba Lagoon is the next adventure anchor, but completion must remain locked behind operator/access validation. Sohoton, Bucas Grande, Tayangban, Wakepark, and Calicoan remain controlled or pending review.",
    stops: [
      {
        name: "Sugba Lagoon",
        shortCode: "SL",
        note: "Safety-controlled lagoon/access node. Requires operator or access validation before Passport Stamp completion can activate.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Sohoton Cove",
        shortCode: "SC",
        note: "Operator-controlled Bucas Grande adventure cluster. Not DIY-completable and not active without governed booking/access validation.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Bucas Grande Island",
        shortCode: "BG",
        note: "Expedition island cluster tied to operator-controlled movement, manifest, vessel, and safety validation where applicable.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Tayangban Cave Pool",
        shortCode: "TC",
        note: "Safety-sensitive cave/pool candidate node. Must not be treated as casual QR completion without access and safety rules.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Siargao Wakepark",
        shortCode: "SW",
        note: "Partner/activity-style adventure node. QR/stamp behavior requires approved partner validation before activation.",
        status: "READY_TO_VERIFY",
        source: "Pending",
      },
      {
        name: "Calicoan Paddle Trail / Urban Legacy",
        shortCode: "CP",
        note: "Presentation/candidate paddle-adventure node only. Conditional and not active completion truth.",
        status: "LOCKED",
        source: "Pending",
      },
    ],
  },

  "return-traveler-continuity": {
    eyebrow: "PASSPORT TRAILS™",
    title: "Your Siargao Story Continues",
    subtitle:
      "Return Continuity is a gated journey-memory layer. First egress saves the first journey. Second ingress activates the Welcome Back experience. Second egress completes the return milestone.",
    progressLabel: "State-gated preview",
    statusLabel: "Ingress + Egress Required",
    nextStop: "Second ingress return mode",
    nextStopReason:
      "This page is accessible as a locked preview, but active return identity requires verified travel history. Ingress activates the return journey. Egress completes the milestone.",
    stops: [
      {
        name: "No Verified History",
        shortCode: "NH",
        note: "Traveler can preview the page, but Return Continuity is locked until a verified Siargao trip lifecycle exists.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "First Trip Active",
        shortCode: "IA",
        note: "Triggered when the traveler has ingress but no verified egress yet. The current trip is active, but return history is not completed.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "First Journey Saved",
        shortCode: "FE",
        note: "Unlock condition: first trip has verified egress, trip closeout, or approved completion fallback. This creates historical memory but not return-traveler completion.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Welcome Back / Return Journey Active",
        shortCode: "RI",
        note: "Triggered by second verified ingress after at least one completed past trip. The traveler is recognized as returning, but the Second Trip Return Explorer milestone is not complete yet.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Second Trip Return Explorer Completed",
        shortCode: "RE",
        note: "Unlock condition: second verified egress or completed second trip lifecycle. This is the first true return-traveler completion moment.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Multi-Return Traveler",
        shortCode: "MR",
        note: "Future state for multiple completed Siargao trip cycles and verified Passport Trail history. No reward, perk, or status is promised until governed rules exist.",
        status: "LOCKED",
        source: "Pending",
      },
    ],
  },

};

function statusTone(status: StopStatus) {
  if (status === "STAMP_UNLOCKED") {
    return {
      label: "Stamp record verified",
      color: "#138a58",
      background: "#d8fbef",
      border: "#1fa45b",
    };
  }

  if (status === "READY_TO_VERIFY") {
    return {
      label: "Ready to verify",
      color: "#067889",
      background: "#dff8ff",
      border: "#13a8b7",
    };
  }

  return {
    label: "Locked",
    color: "#53657d",
    background: "#edf2f5",
    border: "#a0aec0",
  };
}

function ShellCard(props: { children: React.ReactNode; ariaLabel?: string }) {
  return (
    <section
      aria-label={props.ariaLabel}
      style={{
        border: "1px solid #bfe7ee",
        borderRadius: 26,
        background: "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(244,253,255,0.88))",
        padding: 13,
        boxShadow: "0 14px 36px rgba(15,23,42,0.06)",
      }}
    >
      {props.children}
    </section>
  );
}

function SectionEyebrow(props: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 9,
        fontWeight: 820,
        letterSpacing: "0.13em",
        textTransform: "uppercase",
        color: "#0796a6",
      }}
    >
      {props.children}
    </div>
  );
}


function ReturnContinuityPremiumPanel() {
  const lifecycleCards = [
    {
      number: "01",
      eyebrow: "Current",
      title: "First Trip Active",
      body:
        "Ingress means the traveler is already inside Siargao. The story has started, but it is not saved as historical memory until verified egress or trip closeout.",
      tone: "teal",
    },
    {
      number: "02",
      eyebrow: "Required",
      title: "Egress Saves Memory",
      body:
        "First egress turns the current trip into Passport history. This is the first real unlock condition for Return Continuity.",
      tone: "gold",
    },
    {
      number: "03",
      eyebrow: "Later",
      title: "Second Ingress Welcomes Back",
      body:
        "A second verified ingress after one completed trip activates the Welcome Back experience, but not the completed milestone yet.",
      tone: "green",
    },
    {
      number: "04",
      eyebrow: "Milestone",
      title: "Second Egress Completes Return",
      body:
        "Second verified egress completes the Second Trip Return Explorer milestone. Until then, completion stays locked.",
      tone: "blue",
    },
  ];

  const toneStyle = {
    teal: {
      shell: "linear-gradient(145deg, rgba(224,252,255,0.98), rgba(255,255,255,0.96))",
      border: "rgba(103,232,249,0.82)",
      icon: "linear-gradient(135deg, #12b8c7, #078da0)",
      shadow: "0 16px 34px rgba(7,141,160,0.16)",
    },
    gold: {
      shell: "linear-gradient(145deg, rgba(255,248,231,0.98), rgba(255,255,255,0.96))",
      border: "rgba(253,224,138,0.9)",
      icon: "linear-gradient(135deg, #f59e0b, #14b8a6)",
      shadow: "0 16px 34px rgba(245,158,11,0.13)",
    },
    green: {
      shell: "linear-gradient(145deg, rgba(240,253,244,0.98), rgba(255,255,255,0.96))",
      border: "rgba(187,247,208,0.95)",
      icon: "linear-gradient(135deg, #16a34a, #0891b2)",
      shadow: "0 16px 34px rgba(22,163,74,0.13)",
    },
    blue: {
      shell: "linear-gradient(145deg, rgba(239,246,255,0.98), rgba(255,255,255,0.96))",
      border: "rgba(191,219,254,0.96)",
      icon: "linear-gradient(135deg, #2563eb, #14b8c6)",
      shadow: "0 16px 34px rgba(37,99,235,0.12)",
    },
  } as const;

  return (
    <section
      aria-label="Return Traveler Continuity premium journey shell"
      style={{
        marginTop: 14,
        borderRadius: 34,
        padding: 12,
        background:
          "linear-gradient(145deg, rgba(236,254,255,0.96), rgba(240,253,250,0.92) 45%, rgba(255,251,235,0.84))",
        border: "1px solid rgba(125,211,252,0.76)",
        boxShadow:
          "0 24px 70px rgba(8,61,103,0.14), inset 0 1px 0 rgba(255,255,255,0.92)",
      }}
    >
      <div
        style={{
          borderRadius: 29,
          padding: 15,
          background:
            "radial-gradient(circle at 15% 0%, rgba(20,184,198,0.22), transparent 35%), radial-gradient(circle at 92% 12%, rgba(245,158,11,0.16), transparent 31%), linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,253,255,0.92))",
          border: "1px solid rgba(191,231,238,0.92)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <SectionEyebrow>Journey Memory Layer</SectionEyebrow>
            <h2
              style={{
                margin: "7px 0 7px",
                fontSize: 25,
                lineHeight: 1,
                fontWeight: 780,
                letterSpacing: "-0.065em",
                color: "#10234a",
              }}
            >
              You are here. Your first Siargao story has started.
            </h2>
          </div>

          <div
            style={{
              borderRadius: 999,
              padding: "8px 10px",
              background: "linear-gradient(135deg, #ecfeff, #ffffff)",
              border: "1px solid rgba(125,211,252,0.84)",
              color: "#078da0",
              fontSize: 9.4,
              fontWeight: 950,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              boxShadow: "0 10px 24px rgba(8,61,103,0.08)",
            }}
          >
            First Visit Active
          </div>
        </div>

        <p
          style={{
            margin: "0 0 13px",
            fontSize: 12.7,
            lineHeight: 1.48,
            fontWeight: 650,
            color: "#53657d",
          }}
        >
          This page should feel different because it is not a place trail. It is
          the traveler&apos;s continuity layer. First ingress starts the journey.
          First egress saves it. Second ingress activates the welcome-back
          experience. Second egress completes the return milestone.
        </p>

        <div
          style={{
            borderRadius: 26,
            padding: 14,
            background:
              "linear-gradient(135deg, rgba(8,145,178,0.94), rgba(20,184,166,0.88))",
            color: "#ffffff",
            boxShadow: "0 18px 42px rgba(7,141,160,0.22)",
            border: "1px solid rgba(255,255,255,0.35)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 48,
                height: 48,
                borderRadius: 19,
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.35)",
                fontSize: 24,
                fontWeight: 950,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
              }}
            >
              ↗
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 950,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  opacity: 0.86,
                }}
              >
                Current state
              </div>
              <div
                style={{
                  marginTop: 3,
                  fontSize: 19,
                  lineHeight: 1.05,
                  fontWeight: 920,
                  letterSpacing: "-0.04em",
                }}
              >
                First ingress detected. Egress required to save memory.
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 13,
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 9,
            }}
          >
            <Link
              href="/traveler/passport-map"
              aria-label="View Siargao Passport Map"
              style={{
                minHeight: 52,
                borderRadius: 18,
                background: "rgba(255,255,255,0.96)",
                color: "#10234a",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                padding: "0 13px",
                textDecoration: "none",
                fontSize: 12.4,
                fontWeight: 920,
                boxShadow: "0 12px 28px rgba(15,23,42,0.12)",
              }}
            >
              <span>View Passport Map</span>
              <span aria-hidden="true">›</span>
            </Link>

            <Link
              href="/traveler/trips"
              aria-label="View my trips"
              style={{
                minHeight: 52,
                borderRadius: 18,
                background: "rgba(255,255,255,0.18)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                padding: "0 13px",
                textDecoration: "none",
                fontSize: 12.4,
                fontWeight: 920,
                border: "1px solid rgba(255,255,255,0.35)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              <span>View Trip Status</span>
              <span aria-hidden="true">›</span>
            </Link>
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 10,
          }}
        >
          {lifecycleCards.map((card) => {
            const style = toneStyle[card.tone as keyof typeof toneStyle];

            return (
              <article
                key={card.number}
                style={{
                  minHeight: 146,
                  borderRadius: 24,
                  padding: 13,
                  background: style.shell,
                  border: `1px solid ${style.border}`,
                  boxShadow: style.shadow,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 16,
                      display: "grid",
                      placeItems: "center",
                      background: style.icon,
                      color: "#ffffff",
                      fontWeight: 950,
                      fontSize: 12,
                      boxShadow: style.shadow,
                    }}
                  >
                    {card.number}
                  </div>

                  <div
                    style={{
                      borderRadius: 999,
                      padding: "6px 8px",
                      background: "rgba(255,255,255,0.78)",
                      border: `1px solid ${style.border}`,
                      color: "#078da0",
                      fontSize: 8.6,
                      fontWeight: 950,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {card.eyebrow}
                  </div>
                </div>

                <h3
                  style={{
                    margin: "11px 0 0",
                    fontSize: 14.6,
                    lineHeight: 1.08,
                    fontWeight: 920,
                    letterSpacing: "-0.035em",
                    color: "#10234a",
                  }}
                >
                  {card.title}
                </h3>

                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: 10.8,
                    lineHeight: 1.36,
                    fontWeight: 650,
                    color: "#53657d",
                  }}
                >
                  {card.body}
                </p>
              </article>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 12,
            display: "grid",
            gap: 9,
          }}
        >
          <div
            style={{
              borderRadius: 24,
              padding: 13,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(240,253,250,0.9))",
              border: "1px solid rgba(191,231,238,0.9)",
              boxShadow: "0 14px 34px rgba(8,61,103,0.07)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#078da0",
              }}
            >
              What remains locked
            </div>
            <div
              style={{
                marginTop: 7,
                display: "flex",
                flexWrap: "wrap",
                gap: 7,
              }}
            >
              {[
                "Return identity",
                "Second-trip milestone",
                "Rewards",
                "Perks",
                "Historical progress",
              ].map((item) => (
                <span
                  key={item}
                  style={{
                    borderRadius: 999,
                    padding: "8px 10px",
                    background: "#f8fafc",
                    border: "1px solid #dbeafe",
                    color: "#53657d",
                    fontSize: 10.5,
                    fontWeight: 820,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              borderRadius: 24,
              padding: 13,
              background:
                "linear-gradient(135deg, rgba(255,251,235,0.95), rgba(255,255,255,0.96))",
              border: "1px solid rgba(253,230,138,0.92)",
              boxShadow: "0 14px 34px rgba(245,158,11,0.09)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#b45309",
              }}
            >
              Compliance truth
            </div>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 11.5,
                lineHeight: 1.42,
                fontWeight: 650,
                color: "#53657d",
              }}
            >
              This screen may preview the return journey, but only verified
              trip lifecycle records can unlock historical memory or return
              milestones. No QR stamp, reward, or status is created from viewing
              this page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


export default function PassportTrailDetailPage({
  params,
}: {
  params: { trailSlug: string };
}) {
  const trail = TRAILS[params.trailSlug];

  if (!trail) {
    notFound();
  }

  const isReturnContinuity =
    params.trailSlug === "return-traveler-continuity";

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(19,168,183,0.16), transparent 34%), linear-gradient(180deg, #f6fbfc 0%, #ffffff 72%)",
        color: "#14264b",
        fontFamily:
          '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif',
        padding: "18px 14px 110px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <div>
            <SectionEyebrow>{trail.eyebrow}</SectionEyebrow>
            <h1
              style={{
                margin: "5px 0 0",
                fontSize: 30,
                lineHeight: 1.02,
                fontWeight: 690,
                letterSpacing: "-0.045em",
              }}
            >
              {trail.title}
            </h1>
          </div>

          <Link
            href="/traveler/passport-trails"
            style={{
              textDecoration: "none",
              border: "1px solid rgba(191,231,238,0.92)",
              borderRadius: 999,
              background: "rgba(255,255,255,0.9)",
              color: "#0796a6",
              padding: "10px 14px",
              fontSize: 11.6,
              fontWeight: 820,
              whiteSpace: "nowrap",
            }}
          >
            ← Trails
          </Link>
        </header>

        <section
          aria-label="Trail hero"
          style={{
            borderRadius: 28,
            background:
              "linear-gradient(135deg, rgba(10,115,145,0.94), rgba(19,168,183,0.88), rgba(132,184,101,0.86))",
            color: "#ffffff",
            padding: 20,
            overflow: "hidden",
            boxShadow: "0 18px 44px rgba(15,23,42,0.14)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              borderRadius: 999,
              padding: "6px 10px",
              background: "rgba(255,255,255,0.16)",
              fontSize: 9,
              fontWeight: 820,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {trail.statusLabel}
          </div>

          <h2
            style={{
              margin: "12px 0 8px",
              fontSize: 20,
              lineHeight: 1.08,
              fontWeight: 690,
              letterSpacing: "-0.035em",
            }}
          >
            Verify stops. Unlock stamps. Continue.
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: 13,
              lineHeight: 1.45,
              fontWeight: 600,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            {trail.subtitle}
          </p>

          <div
            style={{
              marginTop: 10,
              display: "inline-flex",
              borderRadius: 999,
              padding: "7px 11px",
              background: "linear-gradient(135deg, #ffffff, #f4fdff)",
              color: "#14264b",
              fontSize: 11,
              fontWeight: 820,
            }}
          >
            {trail.progressLabel}
          </div>
        </section>

        <SpmFunctionalJourneyMap trailSlug={params.trailSlug} />

        {isReturnContinuity ? <ReturnContinuityPremiumPanel /> : null}

        <section
          aria-label="Scan site QR"
          style={{
            marginTop: 14,
            border: "1px solid #bfe7ee",
            borderRadius: 26,
            background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(232,251,255,0.92))",
            padding: 14,
            display: isReturnContinuity ? "none" : "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: 12,
            alignItems: "center",
            boxShadow: "0 14px 34px rgba(8,61,103,0.08)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: 48,
              height: 48,
              borderRadius: 18,
              background: "linear-gradient(135deg, #14b8c6, #11843d)",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              fontSize: 24,
              fontWeight: 950,
              boxShadow: "0 10px 22px rgba(7,141,160,0.18)",
            }}
          >
            ▣
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#0891b2",
              }}
            >
              At Operator Site
            </div>
            <div
              style={{
                marginTop: 3,
                fontSize: 16,
                lineHeight: 1.08,
                fontWeight: 950,
                color: "#14264b",
              }}
            >
              Scan site QR
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 12,
                lineHeight: 1.3,
                fontWeight: 720,
                color: "#53657d",
              }}
            >
              Use governed QR validation when available. Stamps count only after approved OSP/SPM records.
            </div>
          </div>

          <Link
            href={`/traveler/scan?source=passport-trails&trail=${params.trailSlug}`}
            style={{
              minHeight: 46,
              borderRadius: 17,
              background: "linear-gradient(135deg, #14b8c6, #11843d)",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              textDecoration: "none",
              padding: "0 15px",
              fontSize: 13,
              fontWeight: 950,
              whiteSpace: "nowrap",
              boxShadow: "0 8px 18px rgba(7,141,160,0.18)",
            }}
          >
            Scan
          </Link>
        </section>



        <div
          style={{
            marginTop: 16,
            display: isReturnContinuity ? "none" : "block",
          }}
        >
          <ShellCard ariaLabel="Trail verification actions">
            <SectionEyebrow>Verify Your Stop</SectionEyebrow>
            <h2
              style={{
                margin: "7px 0 8px",
                fontSize: 20,
                lineHeight: 1.08,
                fontWeight: 690,
                letterSpacing: "-0.035em",
              }}
            >
              Use your OSP QR for Passport Stamp validation.
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 12.1,
                lineHeight: 1.42,
                fontWeight: 600,
                color: "#53657d",
              }}
            >
              At each verified stop, open your OSP Pass QR and present it for
              validation. A stamp only counts after the stop is verified by
              OSP/SPM records.
            </p>

            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 8,
              }}
            >
              <Link
                href="/traveler/pass"
                aria-label="Show my OSP QR pass"
                style={{
                  textDecoration: "none",
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #14b8c6, #078da0)",
                  color: "#ffffff",
                  padding: 14,
                  minHeight: 104,
                  boxShadow: "0 14px 30px rgba(7,141,160,0.24)",
                }}
              >
                <div style={{ fontSize: 18, lineHeight: 1 }}>▦</div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                    fontWeight: 820,
                    lineHeight: 1.12,
                  }}
                >
                  ▣ Show QR
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 10.2,
                    fontWeight: 600,
                    opacity: 0.86,
                    lineHeight: 1.25,
                  }}
                >
                  Open your OSP Pass.
                </div>
              </Link>

              <Link
                href="/traveler/settings?panel=assistant&topic=trail"
                aria-label="Ask Passport Assistant about this trail"
                style={{
                  textDecoration: "none",
                  border: "1px solid rgba(191,231,238,0.92)",
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #ffffff, #f4fdff)",
                  color: "#14264b",
                  padding: 14,
                  minHeight: 104,
                  boxShadow: "0 10px 24px rgba(8,61,103,0.07)",
                }}
              >
                <div style={{ fontSize: 18, lineHeight: 1 }}>✦</div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                    fontWeight: 820,
                    lineHeight: 1.12,
                  }}
                >
                  Ask Assistant
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 10.2,
                    fontWeight: 600,
                    color: "#53657d",
                    lineHeight: 1.25,
                  }}
                >
                  Ask route and stamp questions.
                </div>
              </Link>
            </div>
          </ShellCard>
        </div>

        <section style={{ marginTop: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <div>
              <SectionEyebrow>
                {isReturnContinuity ? "Continuity States" : "Trail Stops"}
              </SectionEyebrow>
              <h2
                style={{
                  margin: "5px 0 0",
                  fontSize: 20,
                  lineHeight: 1.08,
                  fontWeight: 690,
                  letterSpacing: "-0.04em",
                }}
              >
                {isReturnContinuity
                  ? "Follow the return lifecycle."
                  : "Verify each stop."}
              </h2>
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {trail.stops.map((stop, index) => {
              const tone = statusTone(stop.status);

              return (
                <article
                  key={stop.name}
                  style={{
                    border: "1px solid #bfe7ee",
                    borderLeft: `5px solid ${tone.border}`,
                    borderRadius: 22,
                    background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,253,255,0.94))",
                    padding: 13,
                    boxShadow: "0 12px 30px rgba(8,61,103,0.075)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 9,
                          fontWeight: 820,
                          letterSpacing: "0.13em",
                          textTransform: "uppercase",
                          color: tone.color,
                        }}
                      >
                        {isReturnContinuity
                          ? `State ${index + 1}`
                          : `Stop ${index + 1}`}
                      </div>
                      <h3
                        style={{
                          margin: "5px 0 0",
                          fontSize: 18,
                          lineHeight: 1.1,
                          fontWeight: 820,
                        }}
                      >
                        {stop.name}
                      </h3>
                    </div>

                    <span
                      style={{
                        borderRadius: 999,
                        padding: "6px 9px",
                        background: tone.background,
                        color: tone.color,
                        fontSize: 9,
                        fontWeight: 900,
                        whiteSpace: "nowrap",
                        border: `1px solid ${tone.border}33`,
                      }}
                    >
                      {tone.label}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: "9px 0 0",
                      fontSize: 11.6,
                      lineHeight: 1.4,
                      fontWeight: 600,
                      color: "#53657d",
                    }}
                  >
                    {stop.note}
                  </p>

                  <div
                    style={{
                      marginTop: 10,
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        borderRadius: 15,
                        border: "1px solid rgba(191,231,238,0.58)",
                        background: "linear-gradient(135deg, #ffffff, #f4fdff)",
                        padding: "10px 10px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 8,
                          fontWeight: 820,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#7b8aa0",
                        }}
                      >
                        Stamp
                      </div>
                      <div
                        style={{
                          marginTop: 3,
                          fontSize: 11,
                          fontWeight: 820,
                        }}
                      >
                        {tone.label}
                      </div>
                    </div>

                    <div
                      style={{
                        borderRadius: 15,
                        border: "1px solid rgba(191,231,238,0.58)",
                        background: "linear-gradient(135deg, #ffffff, #f4fdff)",
                        padding: "10px 10px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 8,
                          fontWeight: 820,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#7b8aa0",
                        }}
                      >
                        Source
                      </div>
                      <div
                        style={{
                          marginTop: 3,
                          fontSize: 11,
                          fontWeight: 820,
                        }}
                      >
                        {stop.source}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <div style={{ marginTop: 16 }}>
          <ShellCard ariaLabel="AI Passport Assistant trail detail prompt chips">
            <SectionEyebrow>✦ Ask Passport Assistant</SectionEyebrow>
            <div
              style={{
                marginTop: 8,
                fontSize: 14.4,
                fontWeight: 820,
                lineHeight: 1.14,
              }}
            >
              Need help at this trail?
            </div>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 11.5,
                lineHeight: 1.38,
                fontWeight: 600,
                color: "#53657d",
              }}
            >
              Ask about stops, QR verification, stamp rules, and your next move. The assistant cannot confirm booking, payment, guide, or manifest status unless the system proves it.
            </p>

            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 7 }}>
              {[
                "How do I verify this stop?",
                "What stamp can I unlock?",
                "Which Island Hopping node is next?",
                "Why is this not yet stamped?",
              ].map((prompt) => (
                <Link
                  key={prompt}
                  href="/traveler/settings?panel=assistant&topic=trail"
                  style={{
                    textDecoration: "none",
                    border: "1px solid rgba(11,151,166,0.18)",
                    borderRadius: 999,
                    background: "linear-gradient(135deg, #ffffff, #f4fdff)",
                    padding: "8px 10px",
                    boxShadow: "0 6px 14px rgba(8,61,103,0.045)",
                    color: "#067889",
                    fontSize: 10.2,
                    fontWeight: 820,
                    lineHeight: 1,
                  }}
                >
                  {prompt}
                </Link>
              ))}
            </div>
          </ShellCard>
        </div>

        <div style={{ marginTop: 16 }}>
          <ShellCard ariaLabel="Passport stamp rules">
            <SectionEyebrow>Stamp Rules</SectionEyebrow>
            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
              {[
                "Unlocked stamps must come from verified OSP/SPM records.",
                "Ready-to-verify stops are not counted until validation is complete.",
                "Your OSP QR is your traveler identity for stop validation.",
                "Payment, booking, guide, and manifest status are not changed on this page.",
              ].map((rule) => (
                <div
                  key={rule}
                  style={{
                    border: "1px solid rgba(11,151,166,0.12)",
                    borderRadius: 16,
                    background: "linear-gradient(135deg, #ffffff, #f8fbfc)",
                    padding: "9px 10px",
                    fontSize: 11.5,
                    lineHeight: 1.35,
                    fontWeight: 600,
                    color: "#355071",
                  }}
                >
                  {rule}
                </div>
              ))}
            </div>
          </ShellCard>
        </div>

        <nav
          aria-label="Passport Trail bottom navigation"
          style={{
            position: "fixed",
            left: "50%",
            bottom: 18,
            transform: "translateX(-50%)",
            width: "min(392px, calc(100vw - 28px))",
            border: "1px solid #dbeef2",
            borderRadius: 26,
            background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,253,255,0.94))",
            boxShadow: "0 14px 36px rgba(15,23,42,0.08)",
            padding: 10,
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 8,
          }}
        >
          {[
            { label: "Map", href: "/traveler/passport-map", icon: "⌖" },
            { label: "Trails", href: "/traveler/passport-trails", icon: "⌁" },
            { label: "Pass", href: "/traveler/pass", icon: "▣" },
            { label: "Profile", href: "/traveler/settings", icon: "◉" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                textDecoration: "none",
                borderRadius: 18,
                padding: "9px 6px",
                textAlign: "center",
                color: item.label === "Trails" ? "#0796a6" : "#607089",
                background: item.label === "Trails" ? "linear-gradient(135deg, #dff8ff, #ffffff)" : "transparent",
                fontSize: 10,
                fontWeight: 820,
              }}
            >
              <div style={{ fontSize: 16, lineHeight: 1 }}>{item.icon}</div>
              <div style={{ marginTop: 4 }}>{item.label}</div>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
