import Link from "next/link";
import { SpmFunctionalJourneyMap } from "../../../../src/spm/functional-map/SpmFunctionalJourneyMap";
import { notFound } from "next/navigation";
import PassportMapShortcut from "../../../../src/components/traveler/PassportMapShortcut";
import UniversalTravelerBottomTabBar from "../../../../src/components/traveler/UniversalTravelerBottomTabBar";

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
    eyebrow: "PASSPORT TRAILS™ · GL PORT",
    title: "Tri-Island Passport Trail",
    subtitle:
      "A classic General Luna island-hopping route usually completed in one scheduled tour day, depending on weather, clearance, payment, operator readiness, and departure conditions.",
    progressLabel: "One-day island route",
    statusLabel: "GL Port / DCS-related",
    nextStop: "General Luna Port readiness",
    nextStopReason:
      "Choose the route, book or reserve, pay or confirm, board from GL Port, complete the tour, then record Passport progress. Continue-later is not the normal behavior unless weather, cancellation, reassignment, or interruption occurs.",
    stops: [
      {
        name: "Guyam Island",
        shortCode: "GU",
        note: "Classic Tri-Island stop. Stamp or progress should follow verified OSP/SPM booking or QR records.",
        status: "READY_TO_VERIFY",
        source: "Pending",
      },
      {
        name: "Daku Island",
        shortCode: "DA",
        note: "Main island-hopping stop. Package inclusions, lunch, and operator handling depend on the selected tour product.",
        status: "READY_TO_VERIFY",
        source: "Pending",
      },
      {
        name: "Naked Island",
        shortCode: "NA",
        note: "Classic sandbar stop. Timing, weather, and sea conditions remain route-aware.",
        status: "READY_TO_VERIFY",
        source: "Pending",
      },
      {
        name: "GL Port Departure",
        shortCode: "GL",
        note: "Operational anchor for this trail. Boarding, payment, operator readiness, and DCS-related logic must remain booking-backed.",
        status: "LOCKED",
        source: "Pending",
      },
    ],
  },

  "sugba-lagoon": {
    eyebrow: "PASSPORT TRAILS™ · DEL CARMEN",
    title: "Sugba Lagoon Island Hopping",
    subtitle:
      "A governed lagoon route connected to official access, departure readiness, operator availability, and scheduled movement.",
    progressLabel: "Access-ready one-day route",
    statusLabel: "Route-supported",
    nextStop: "Del Carmen access readiness",
    nextStopReason:
      "Sugba Lagoon must not be treated as a casual land-tour stop. It may appear as a cross-linked highlight inside the land tour, but the deeper route should point to this official governed flow.",
    stops: [
      {
        name: "Del Carmen Access Flow",
        shortCode: "DC",
        note: "Operational access anchor. Future DCS / departure-control logic must connect here before full production movement.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Sugba Lagoon",
        shortCode: "SL",
        note: "Access-ready lagoon stop. Operator readiness, official access, and booking/payment readiness must be confirmed before live movement.",
        status: "READY_TO_VERIFY",
        source: "Pending",
      },
      {
        name: "Operator Readiness",
        shortCode: "OP",
        note: "Operator or route partner readiness is required before traveler payment and fulfillment should unlock.",
        status: "LOCKED",
        source: "Pending",
      },
    ],
  },

  "bucas-grande-sohoton": {
    eyebrow: "PASSPORT TRAILS™ · DAPA-SIDE",
    title: "Bucas Grande / Sohoton Official Trail",
    subtitle:
      "A future-ready governed route for Bucas Grande and Sohoton access, operator readiness, and Dapa-side scheduled movement.",
    progressLabel: "Future official route",
    statusLabel: "Reserved / future-ready",
    nextStop: "Route readiness review",
    nextStopReason:
      "Do not claim this route is fully bookable until backend route readiness, operator capacity, source attribution, and payment rules are wired.",
    stops: [
      {
        name: "Dapa-side Movement",
        shortCode: "DP",
        note: "Future governed movement anchor for Bucas Grande / Sohoton operations.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Sohoton Cove",
        shortCode: "SC",
        note: "Future official route stop. Must remain operator/governance-ready before public booking claims.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Bucas Grande",
        shortCode: "BG",
        note: "Future-ready route cluster. Do not fake availability until governed access is active.",
        status: "LOCKED",
        source: "Pending",
      },
    ],
  },

  "siargao-land-tour": {
    eyebrow: "PASSPORT TRAILS™ · LOCAL OPERATOR SUPPORT",
    title: "Siargao Land Tour Passport Trail",
    subtitle:
      "Choose South or North as a one-day route. Do both on separate days or request a custom private route.",
    progressLabel: "South / North one-day options",
    statusLabel: "Local operator support",
    nextStop: "Choose South or North route",
    nextStopReason:
      "South and North are separate one-day options. Combine them only as a custom private route.",
    stops: [
      {
        name: "South Tour Highlights",
        shortCode: "ST",
        note: "Scenic inland route with coconut views, Maasin River, Magpupungko, Secret Beach, and Malinao Skate Road.",
        status: "READY_TO_VERIFY",
        source: "Pending",
      },
      {
        name: "North Tour Highlights",
        shortCode: "NT",
        note: "North-coast route with Pacifico, Alegria, Taktak Falls, caves, beach stops, and scenic viewpoints.",
        status: "READY_TO_VERIFY",
        source: "Pending",
      },
      {
        name: "Guided Private DIY Option",
        shortCode: "GD",
        note: "Custom route support with guide, driver, vehicle, pickup, and optional photo or drone add-ons.",
        status: "LOCKED",
        source: "Pending",
      },
    ],
  },

  "surf-explorer": {
    eyebrow: "PASSPORT TRAILS™ · CONTINUE-LATER",
    title: "Explorer Surf Trail",
    subtitle:
      "Explore surf spots, lessons, and surf culture across Siargao. You do not need to finish this trail in one day.",
    progressLabel: "Continue-later surf path",
    statusLabel: "Beginner-safe / multi-session",
    nextStop: "Start with one surf stop",
    nextStopReason:
      "A beginner may visit Cloud 9, take one lesson, watch surfers, visit one surf school, and save the rest for later. That is still successful progress.",
    stops: [
      {
        name: "Cloud 9",
        shortCode: "C9",
        note: "Approved surf anchor. Can be a viewing stop, lesson context, or surf-culture start.",
        status: "READY_TO_VERIFY",
        source: "Pending",
      },
      {
        name: "Beginner Lesson / Surf School",
        shortCode: "LS",
        note: "Optional operator-supported action. Pricing and availability should be confirmed when a lesson or coach is involved.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Continue Later",
        shortCode: "CL",
        note: "Progress should remain saved during this trip or for a future Siargao visit.",
        status: "LOCKED",
        source: "Pending",
      },
    ],
  },

  "culture-community": {
    eyebrow: "PASSPORT TRAILS™ · LOCAL DISCOVERY",
    title: "Culture & Community Trail",
    subtitle:
      "A local discovery trail through community stops, food makers, cultural touchpoints, local stories, and island experiences that can usually be completed within the day.",
    progressLabel: "One-day local discovery",
    statusLabel: "Consent-first / partner-approved",
    nextStop: "Approved local stop",
    nextStopReason:
      "This trail should feel warm, human, and local — not bureaucratic. Community consent and partner readiness remain required before public completion claims.",
    stops: [
      {
        name: "Local Makers / Stories",
        shortCode: "LS",
        note: "Potential local maker, story, or community stop. Must remain partner-approved.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Community Café / Food Stop",
        shortCode: "CF",
        note: "Possible local stop category. Pricing and participation must follow approved partner rules.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Workshop / Market / Heritage Point",
        shortCode: "WH",
        note: "Possible future stop category. Do not expose as completed until partner approval is ready.",
        status: "LOCKED",
        source: "Pending",
      },
    ],
  },

  "food-wellness": {
    eyebrow: "PASSPORT TRAILS™ · MERCHANT-OPERATED",
    title: "Food & Wellness Trail",
    subtitle:
      "Discover restaurants, cafés, wellness spaces, recovery spots, and island care experiences operated by local merchants. Complete it in one day or across your stay.",
    progressLabel: "Flexible merchant trail",
    statusLabel: "Restaurants + wellness merchants",
    nextStop: "Choose food or wellness path",
    nextStopReason:
      "This trail must be operated by restaurants and wellness-related merchants, not generic attractions. It can support rewards, repeat visits, and local spend later.",
    stops: [
      {
        name: "Restaurant / Local Dining",
        shortCode: "FD",
        note: "Restaurant-operated stop category. Merchant payment and reward logic must be explicit before live commerce.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Café / Smoothie / Healthy Food",
        shortCode: "CF",
        note: "Food and beverage merchant category for flexible stops across the traveler stay.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Spa / Wellness / Recovery",
        shortCode: "WL",
        note: "Wellness merchant category including spa, massage, yoga, recovery, beauty, or health operators.",
        status: "LOCKED",
        source: "Pending",
      },
    ],
  },

  "return-traveler-continuity": {
    eyebrow: "PASSPORT TRAILS™ · CONTINUITY",
    title: "Return Traveler Continuity",
    subtitle:
      "Continue unfinished Passport Trails, revisit saved stops, and keep building your Siargao journey across future trips.",
    progressLabel: "Across-trip progress",
    statusLabel: "Saved progress layer",
    nextStop: "Continue saved progress",
    nextStopReason:
      "This is not a normal trail. It is a continuity mechanism for unfinished trails, saved stops, previous stamps, repeat visits, loyalty, and rewards later.",
    stops: [
      {
        name: "Saved Trail Progress",
        shortCode: "SP",
        note: "Traveler-owned progress should remain attached to the OSP account.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Return Visit Recognition",
        shortCode: "RV",
        note: "Future return-journey state. No reward, perk, or status is promised until governed rules exist.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Unfinished Stops",
        shortCode: "US",
        note: "Unfinished Passport progress should be available when the traveler returns to Siargao.",
        status: "LOCKED",
        source: "Pending",
      },
    ],
  },
};


function statusTone(status: StopStatus) {
  if (status === "STAMP_UNLOCKED") {
    return {
      label: "Verified stop",
      color: "#0F6B4F",
      background: "#DDF6F3",
      border: "#8BD8D5",
      glow: "0 16px 34px rgba(5,150,165,0.18)",
      shell: "linear-gradient(135deg, #BDEFE8 0%, #9FE3DB 100%)",
      shellBorder: "1px solid rgba(5,150,165,0.58)",
    };
  }

  if (status === "READY_TO_VERIFY") {
    return {
      label: "Next unlocked",
      color: "#047D8A",
      background: "#EAFBFA",
      border: "#AEE4EA",
      glow: "0 14px 30px rgba(5,150,165,0.12)",
      shell: "linear-gradient(135deg, #DDF8FA 0%, #C7EEF2 100%)",
      shellBorder: "1px solid rgba(5,150,165,0.42)",
    };
  }

  return {
    label: "Locked",
    color: "#50668B",
    background: "#F3F7FA",
    border: "#D7E4EC",
    glow: "0 15px 32px rgba(1,56,99,0.12)",
    shell: "linear-gradient(135deg, #EAFBFA 0%, #DCEAF4 100%)",
    shellBorder: "1px solid rgba(5,150,165,0.34)",
  };
}

function ShellCard(props: { children: React.ReactNode; ariaLabel?: string }) {
  return (
    <section
      aria-label={props.ariaLabel}
      style={{
        border: "1px solid #bfe7ee",
        borderRadius: 22,
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
      tone: "teal2",
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
      icon: "linear-gradient(135deg, #f59e0b, #0596A5)",
      shadow: "0 16px 34px rgba(245,158,11,0.13)",
    },
    teal2: {
      shell: "linear-gradient(145deg, rgba(234,251,250,0.98), rgba(255,255,255,0.96))",
      border: "rgba(191,231,238,0.95)",
      icon: "linear-gradient(135deg, #0596A5, #0891b2)",
      shadow: "0 16px 34px rgba(5,150,165,0.08)",
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
            borderRadius: 22,
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
              href="/traveler/passport-trails"
              aria-label="View Passport Trails"
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
              <span>View Passport Trails</span>
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


function DiscoverOtherPassportTrails({
  currentTrailSlug,
}: {
  currentTrailSlug: string;
}) {
  const otherTrails = [
    {
      slug: "island-hopping",
      label: "Tri-Island",
      meta: "GL Port • one-day island route",
      badge: "GL Port",
    },
    {
      slug: "sugba-lagoon",
      label: "Sugba Lagoon",
      meta: "Del Carmen • governed route",
      badge: "Route-supported",
    },
    {
      slug: "bucas-grande-sohoton",
      label: "Bucas / Sohoton",
      meta: "Dapa-side • future official route",
      badge: "Future",
    },
    {
      slug: "siargao-land-tour",
      label: "Land Tour",
      meta: "South or North • guide + TukTuk",
      badge: "Operator",
    },
    {
      slug: "surf-explorer",
      label: "Explorer Surf",
      meta: "Continue later • surf support",
      badge: "Surf",
    },
    {
      slug: "culture-community",
      label: "Culture",
      meta: "Local stories • community stops",
      badge: "Local",
    },
    {
      slug: "food-wellness",
      label: "Food & Wellness",
      meta: "Restaurants • cafés • recovery",
      badge: "Merchant",
    },
    {
      slug: "return-traveler-continuity",
      label: "Return Continuity",
      meta: "Saved progress • repeat journey",
      badge: "Progress",
    },
  ].filter((trail) => trail.slug !== currentTrailSlug);

  const featuredTrails = otherTrails.slice(0, 4);

  return (
    <section
      aria-label="Discover other Passport Trails"
      style={{
        margin: "14px auto 0",
        width: "100%",
        maxWidth: 430,
        padding: "0 12px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          borderRadius: 24,
          background: "linear-gradient(135deg, #FFFFFF 0%, #F4FEFF 100%)",
          border: "1px solid rgba(5,150,165,0.18)",
          boxShadow: "0 16px 34px rgba(1,56,99,0.09)",
          padding: 13,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div>
            <div
              style={{
                color: "#0596A5",
                fontSize: 9,
                fontWeight: 950,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Discover other Trails
            </div>
            <h2
              style={{
                margin: "5px 0 0",
                color: "#013863",
                fontSize: 18,
                lineHeight: 1.05,
                fontWeight: 950,
                letterSpacing: "-0.04em",
              }}
            >
              Continue your Passport journey.
            </h2>
          </div>

          <Link
            href="/traveler/passport-trails"
            style={{
              flex: "0 0 auto",
              minHeight: 34,
              borderRadius: 999,
              background: "#EAFBFA",
              color: "#047D8A",
              WebkitTextFillColor: "#047D8A",
              border: "1px solid rgba(5,150,165,0.18)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 11px",
              fontSize: 10.5,
              fontWeight: 950,
              whiteSpace: "nowrap",
            }}
          >
            View all
          </Link>
        </div>

        <div
          style={{
            marginTop: 11,
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 8,
          }}
        >
          {featuredTrails.map((trail) => (
            <Link
              key={trail.slug}
              href={`/traveler/passport-trails/${trail.slug}`}
              style={{
                minHeight: 156,
                borderRadius: 18,
                background:
                  "linear-gradient(135deg, rgba(234,251,250,0.92), rgba(255,255,255,0.98))",
                border: "1px solid rgba(5,150,165,0.16)",
                boxShadow: "0 10px 22px rgba(1,56,99,0.06)",
                padding: 10,
                textDecoration: "none",
                color: "#013863",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              <div>
                <div
                  aria-label={`Admin photo placeholder for ${trail.label}`}
                  style={{
                    minHeight: 68,
                    borderRadius: 14,
                    background:
                      "linear-gradient(145deg, rgba(5,150,165,0.18), rgba(1,56,99,0.10)), linear-gradient(135deg, #F4FEFF 0%, #EAFBFA 100%)",
                    border: "1px solid rgba(5,150,165,0.18)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.42)",
                    padding: 8,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.84)",
                        color: "#047D8A",
                        border: "1px solid rgba(5,150,165,0.14)",
                        padding: "4px 6px",
                        fontSize: 8,
                        fontWeight: 950,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      Admin Photo
                    </span>

                    <span
                      aria-hidden="true"
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.82)",
                        border: "1px solid rgba(5,150,165,0.14)",
                        display: "grid",
                        placeItems: "center",
                        color: "#0596A5",
                        fontSize: 10,
                        fontWeight: 950,
                      }}
                    >
                      ◼
                    </span>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 10.5,
                        lineHeight: 1.1,
                        fontWeight: 900,
                        color: "#013863",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {trail.label}
                    </div>
                    <div
                      style={{
                        marginTop: 3,
                        fontSize: 8.8,
                        lineHeight: 1.2,
                        fontWeight: 700,
                        color: "#50668B",
                      }}
                    >
                      Approved media slot
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 9 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      borderRadius: 999,
                      background: "rgba(243,174,38,0.16)",
                      color: "#A95B00",
                      padding: "5px 7px",
                      fontSize: 8.4,
                      fontWeight: 950,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {trail.badge}
                  </span>

                  <div
                    style={{
                      marginTop: 7,
                      fontSize: 13.1,
                      lineHeight: 1.08,
                      fontWeight: 950,
                      letterSpacing: "-0.03em",
                      color: "#013863",
                    }}
                  >
                    {trail.label}
                  </div>

                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 10.1,
                      lineHeight: 1.25,
                      fontWeight: 700,
                      color: "#50668B",
                    }}
                  >
                    {trail.meta}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  color: "#0596A5",
                  fontSize: 10.5,
                  fontWeight: 950,
                }}
              >
                <span>Open trail</span>
                <span aria-hidden="true">›</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function OfficialTrailMediaPreview({
  trailSlug,
  trailTitle,
}: {
  trailSlug: string;
  trailTitle: string;
}) {
  const mediaByTrail: Record<
    string,
    {
      badge: string;
      headline: string;
      subline: string;
      primaryFrame: string;
      secondaryFrames: string[];
      proofLine: string;
    }
  > = {
    "island-hopping": {
      badge: "GL Port route",
      headline: "Tri-Island Passport Trail Preview",
      subline: "Approved GL Port route video, island photos, and operator media appear here once enabled by Admin.",
      primaryFrame: "Guyam • Daku • Naked",
      secondaryFrames: ["GL Port", "Boat day", "Stamp record"],
      proofLine: "Admin-approved island-hopping media only",
    },
    "sugba-lagoon": {
      badge: "Access-ready lagoon route",
      headline: "Sugba Lagoon Island Hopping Preview",
      subline: "Del Carmen route photos and operator/access media appear after governed route readiness.",
      primaryFrame: "Sugba Lagoon route preview",
      secondaryFrames: ["Del Carmen", "Lagoon route", "Operator readiness"],
      proofLine: "Approved governed route media only",
    },
    "bucas-grande-sohoton": {
      badge: "Future governed route",
      headline: "Bucas Grande / Sohoton Official Trail Preview",
      subline: "Dapa-side route photos and operator-approved media will appear once the governed route is activated.",
      primaryFrame: "Sohoton route preview",
      secondaryFrames: ["Bucas Grande", "Sohoton Cove", "Dapa-side movement"],
      proofLine: "Future approved route media only",
    },
    "siargao-land-tour": {
      badge: "Guide support",
      headline: "Land Tour Preview",
      subline: "Preview South or North route media before booking.",
      primaryFrame: "South or North route preview",
      secondaryFrames: ["Guide support", "TukTuk / motorcycle", "Drone/no-drone option"],
      proofLine: "Verified route media",
    },
    "surf-explorer": {
      badge: "Continue-later surf trail",
      headline: "Explorer Surf Trail Preview",
      subline: "Surf stop, surf school, and lesson media appears only after review and approval.",
      primaryFrame: "Cloud 9 surf flow",
      secondaryFrames: ["Beginner lesson", "Surf school", "Continue later"],
      proofLine: "Approved surf media only",
    },
    "culture-community": {
      badge: "Local discovery",
      headline: "Culture & Community Trail Preview",
      subline: "Local story, maker, food, and community media appears only after consent and partner approval.",
      primaryFrame: "Culture • Community • Local stories",
      secondaryFrames: ["Local host", "Maker stop", "Community stop"],
      proofLine: "Approved community/partner media only",
    },
    "food-wellness": {
      badge: "Merchant trail",
      headline: "Food & Wellness Trail Preview",
      subline: "Restaurant, café, wellness, spa, recovery, and island care media appears only after merchant approval.",
      primaryFrame: "Food and wellness flow",
      secondaryFrames: ["Restaurant stop", "Café stop", "Wellness stop"],
      proofLine: "Approved merchant media only",
    },
    "return-traveler-continuity": {
      badge: "Progress preview",
      headline: "Return Traveler Continuity Preview",
      subline: "Progress visuals will connect to verified Passport history and saved trail progress later.",
      primaryFrame: "Verified return progress",
      secondaryFrames: ["Past trails", "Unfinished stops", "Next journey"],
      proofLine: "Verified history only",
    },
  };
  const media = mediaByTrail[trailSlug] ?? {
    badge: "Trail preview",
    headline: `Preview ${trailTitle}`,
    subline: "Approved trail video, route photos, and partner media appear here once Admin enables public media.",
    primaryFrame: "Official Passport Trail",
    secondaryFrames: ["Route", "Experience", "Stamp"],
    proofLine: "Admin-approved media only",
  };

  return (
    <section
      aria-label="Official trail approved media preview"
      style={{
        margin: "12px auto 0",
        width: "100%",
        maxWidth: 430,
        padding: "0 12px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          borderRadius: 28,
          background: "linear-gradient(135deg, #FFFFFF 0%, #F4FCFA 58%, #EAFBFA 100%)",
          border: "1px solid rgba(1,56,99,0.10)",
          boxShadow: "0 22px 48px rgba(1,56,99,0.22)",
          padding: 14,
          color: "#013863",
          boxSizing: "border-box",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: -38,
            top: -44,
            width: 130,
            height: 130,
            borderRadius: 999,
            background: "rgba(243,174,38,0.18)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "grid",
            gap: 12,
          }}
        >
          <div
            style={{
              borderRadius: 23,
              minHeight: 178,
              background:
                "radial-gradient(circle at 20% 18%, rgba(255,255,255,0.28), transparent 24%), linear-gradient(145deg, rgba(234,251,250,0.25), rgba(1,56,99,0.28)), linear-gradient(135deg, #047D8A, #013863)",
              border: "1px solid rgba(255,255,255,0.20)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16), 0 16px 34px rgba(1,25,45,0.22)",
              padding: 14,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxSizing: "border-box",
            }}
          >
            <div
              data-osp-lock="OSP_MEDIA_TEXT_CONTRAST_LOCK"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.90)",
                  border: "1px solid rgba(1,56,99,0.10)",
                  padding: "6px 9px",
                  fontSize: 9.5,
                  fontWeight: 950,
                  letterSpacing: "0.11em",
                  textTransform: "uppercase",
                }}
              >
                {media.badge}
              </span>

              <span
                aria-hidden="true"
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #F3AE26, #D97706)",
                  color: "#013863",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 18,
                  fontWeight: 950,
                  boxShadow: "0 12px 24px rgba(217,119,6,0.28)",
                }}
              >
                ▶
              </span>
            </div>

            <div>
              <div
                style={{
                  display: "inline-flex",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.13)",
                  padding: "7px 9px",
                  fontSize: 11,
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                {media.primaryFrame}
              </div>

              <div
                style={{
                  marginTop: 10,
                  height: 5,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.92)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "42%",
                    height: "100%",
                    borderRadius: 999,
                    background: "linear-gradient(90deg, #F3AE26, #FFFFFF)",
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 999,
                background: "rgba(243,174,38,0.18)",
                color: "#9A6A08",
                padding: "6px 9px",
                fontSize: 9.2,
                fontWeight: 950,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {media.proofLine}
            </div>

            <h2
              style={{
                margin: "8px 0 0",
                fontSize: 22,
                lineHeight: 1.02,
                letterSpacing: "-0.055em",
                fontWeight: 950,
                color: "#013863",
                WebkitTextFillColor: "#013863",
                textShadow: "none",
              }}
            >
              {media.headline}
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#50668B",
                fontSize: 11.8,
                lineHeight: 1.34,
                fontWeight: 720,
              }}
            >
              {media.subline}
            </p>
          </div>

          <div>
            <div
              style={{
                marginBottom: 7,
                color: "rgba(255,255,255,0.78)",
                fontSize: 9,
                fontWeight: 950,
                letterSpacing: "0.11em",
                textTransform: "uppercase",
              }}
            >
              Approved trail media
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 7,
              }}
            >
              {media.secondaryFrames.map((item, index) => (
                <div
                  key={item}
                  aria-label={`Approved photo placeholder ${index + 1}: ${item}`}
                  style={{
                    minHeight: 72,
                    borderRadius: 16,
                    background:
                      index === 0
                        ? "linear-gradient(145deg, rgba(243,174,38,0.26), rgba(255,255,255,0.12))"
                        : index === 1
                          ? "linear-gradient(145deg, rgba(234,251,250,0.22), rgba(255,255,255,0.10))"
                          : "linear-gradient(145deg, rgba(255,255,255,0.18), rgba(5,150,165,0.20))",
                    border: "1px solid rgba(255,255,255,0.17)",
                    padding: "8px 7px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    color: "#013863",
                    fontSize: 10.5,
                    lineHeight: 1.12,
                    fontWeight: 850,
                    boxSizing: "border-box",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 9,
                      background: "rgba(255,255,255,0.90)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 11,
                      fontWeight: 950,
                    }}
                  >
                    ◼
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}






function LandTourMockupHeroHeader() {
  return (
    <section
      aria-label="Siargao Land Tour Passport Trail hero banner"
      style={{
        width: "100%",
        maxWidth: 460,
        margin: "10px auto 10px",
        padding: "0 16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "21 / 9",
          minHeight: 154,
          borderRadius: 28,
          overflow: "hidden",
          background: "#EAFBFA",
          boxShadow: "0 18px 42px rgba(1,56,99,0.14)",
          border: "1px solid rgba(5,150,165,0.12)",
        }}
      >
        <img
          src="/images/spm/siargao-land-tour-hero-banner.png"
          alt="Siargao Land Tour Passport Trail road trip banner"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
            objectPosition: "center center",
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(1,56,99,0.08) 0%, rgba(1,56,99,0.00) 42%, rgba(1,56,99,0.10) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </section>
  );
}


function OfficialTrailCommercialExposurePanel({
  trailSlug,
}: {
  trailSlug: string;
}) {
  const premium: Record<
    string,
    {
      descriptionTitle: string;
      description: string;
      heroChips: string[];
      featureCards: Array<{ title: string; body: string; icon: string }>;
      bookingFields: Array<{ label: string; value: string; helper: string }>;
      flowSteps: string[];
      priceHeadline: string;
      priceBody: string;
      paxRows: Array<{ pax: string; rule: string }>;
      supportHeadline: string;
      supportCards: Array<{ title: string; body: string }>;
      readinessLabel: string;
      readinessBody: string;
      primaryCta: string;
      secondaryCta: string;
      tone: "teal" | "gold" | "slate";
    }
  > = {
    "siargao-land-tour": {
      descriptionTitle: "Siargao Land Tour Passport Trail",
      description:
        "Choose South or North, set pax and pickup, then request local operator confirmation.",
      heroChips: ["South Tour", "North Tour", "Guide support", "Drone option"],
      featureCards: [
        {
          icon: "🛺",
          title: "South or North route",
          body: "South and North are separate one-day routes.",
        },
        {
          icon: "👥",
          title: "Pax-aware request",
          body: "Pax affects vehicle and support.",
        },
        {
          icon: "📍",
          title: "Pickup + route support",
          body: "Pickup and timing are checked.",
        },
        {
          icon: "📸",
          title: "Photo / drone option",
          body: "Photo or drone add-on if available.",
        },
      ],
      bookingFields: [
        {
          label: "Route",
          value: "South Tour or North Tour",
          helper: "Select one route first for a cleaner day plan.",
        },
        {
          label: "Pax",
          value: "Solo / 2–3 / 4–6 / 7–10",
          helper: "Pax controls vehicle, quote, and handling.",
        },
        {
          label: "Transport",
          value: "TukTuk / motorcycle / van",
          helper: "Matched after pax and pickup are known.",
        },
        {
          label: "Add-ons",
          value: "Guide / photo / drone",
          helper: "Optional support confirmed by operator.",
        },
      ],
      flowSteps: ["Choose tour type", "Set pax", "Confirm seats", "Continue checkout"],
      priceHeadline: "Price to confirm",
      priceBody:
        "Final price depends on route, pax, pickup, vehicle, and add-ons.",
      paxRows: [
        { pax: "Solo", rule: "Private support quote" },
        { pax: "2–3 pax", rule: "TukTuk / motorcycle review" },
        { pax: "4–6 pax", rule: "Vehicle + guide review" },
        { pax: "7–10 pax", rule: "Van / group handling" },
      ],
      supportHeadline: "Local operator support required",
      supportCards: [
        {
          title: "Guide / driver",
          body: "Route timing and stops are supported locally.",
        },
        {
          title: "Transport",
          body: "TukTuk, motorcycle, or van depends on pax and pickup point.",
        },
        {
          title: "Media support",
          body: "Photo or drone support is optional.",
        },
      ],
      readinessLabel: "Confirm before payment",
      readinessBody:
        "Payment opens after route and support are confirmed.",
      primaryCta: "Start Land Tour Booking",
      secondaryCta: "Ask Kuya Tala™",
      tone: "gold",
    },
    "island-hopping": {
      descriptionTitle: "Tri-Island Passport Trail",
      description:
        "A classic General Luna island-hopping route usually completed in one scheduled tour day from GL Port.",
      heroChips: ["GL Port", "Guyam", "Daku", "Naked"],
      featureCards: [
        { icon: "🚤", title: "Boat day route", body: "Built around the classic GL island-hopping flow." },
        { icon: "👥", title: "Joiner-ready", body: "Pax pricing starts from the joiner anchor." },
        { icon: "🌤️", title: "Weather-aware", body: "Departure remains route and condition dependent." },
        { icon: "🎫", title: "Passport record", body: "Progress depends on verified booking or QR records." },
      ],
      bookingFields: [
        { label: "Route", value: "Guyam • Daku • Naked", helper: "Classic GL island route." },
        { label: "Pax", value: "Solo / group", helper: "Pax affects booking and final total." },
        { label: "Departure", value: "GL Port", helper: "Operational anchor for this route." },
        { label: "Status", value: "Booking-backed", helper: "Payment follows route readiness." },
      ],
      flowSteps: ["Choose route", "Confirm pax", "Create booking", "Proceed to payment"],
      priceHeadline: "From ₱1,500 / pax",
      priceBody: "Joiner anchor starts at ₱1,500 per person. Final total follows selected pax and package rules.",
      paxRows: [
        { pax: "Solo", rule: "Joiner seat" },
        { pax: "2–3 pax", rule: "Regular joiner rate" },
        { pax: "4–6 pax", rule: "Group adjustment" },
        { pax: "7–10 pax", rule: "Group handling" },
      ],
      supportHeadline: "Boat/operator fulfillment",
      supportCards: [
        { title: "Boat coordination", body: "Operator readiness is required before departure." },
        { title: "Port conditions", body: "Weather and clearance remain part of the trip state." },
        { title: "Booking record", body: "Payment and progress stay attached to booking truth." },
      ],
      readinessLabel: "Booking-backed checkout",
      readinessBody: "Payment can proceed through the booking-backed island-hopping flow.",
      primaryCta: "Create Booking Record",
      secondaryCta: "Ask Kuya Tala™",
      tone: "teal",
    },
    "sugba-lagoon": {
      descriptionTitle: "Sugba Lagoon Island Hopping",
      description:
        "A governed Del Carmen lagoon route connected to official access, operator readiness, and scheduled movement.",
      heroChips: ["Del Carmen", "Access-ready", "Lagoon route", "Route-supported"],
      featureCards: [
        { icon: "🛶", title: "Lagoon route", body: "Handled as an official route, not a casual land stop." },
        { icon: "✅", title: "Access readiness", body: "Route access must be confirmed first." },
        { icon: "👥", title: "Operator capacity", body: "Availability and pax handling are checked." },
        { icon: "🎫", title: "Route-backed", body: "Booking and payment depend on readiness." },
      ],
      bookingFields: [
        { label: "Route", value: "Sugba Lagoon", helper: "Access-ready route flow." },
        { label: "Access", value: "To confirm", helper: "Official readiness first." },
        { label: "Operator", value: "Required", helper: "Capacity must be checked." },
        { label: "Payment", value: "After confirmation", helper: "No premature checkout." },
      ],
      flowSteps: ["Check route", "Confirm access", "Confirm operator", "Unlock payment"],
      priceHeadline: "Price to confirm",
      priceBody: "Final amount depends on route access, pax, operator capacity, and official readiness.",
      paxRows: [
        { pax: "Solo", rule: "Route quote" },
        { pax: "2–3 pax", rule: "Operator review" },
        { pax: "4–6 pax", rule: "Capacity review" },
        { pax: "7–10 pax", rule: "Group confirmation" },
      ],
      supportHeadline: "Access-ready route support",
      supportCards: [
        { title: "Access flow", body: "Official route readiness must be checked." },
        { title: "Operator readiness", body: "Operator capacity controls fulfillment." },
        { title: "Payment state", body: "Checkout opens only after confirmation." },
      ],
      readinessLabel: "Route confirmation required",
      readinessBody: "Payment unlocks only after governed route readiness is confirmed.",
      primaryCta: "Request Route Confirmation",
      secondaryCta: "Ask Kuya Tala™",
      tone: "teal",
    },
    "bucas-grande-sohoton": {
      descriptionTitle: "Bucas Grande / Sohoton Official Trail",
      description:
        "A future Dapa-side governed route for Bucas Grande and Sohoton access. This page is a route preview until operations are activated.",
      heroChips: ["Future route", "Dapa-side", "Sohoton", "Not live yet"],
      featureCards: [
        { icon: "⛰️", title: "Future official trail", body: "Reserved for governed Sohoton-side movement." },
        { icon: "🧭", title: "Dapa-side anchor", body: "Movement logic must be configured later." },
        { icon: "👥", title: "Operator readiness", body: "Capacity must be wired before live booking." },
        { icon: "₱", title: "No live checkout", body: "No payment collection until activated." },
      ],
      bookingFields: [
        { label: "Route", value: "Bucas / Sohoton", helper: "Future official route." },
        { label: "Status", value: "Preview", helper: "Not live-bookable." },
        { label: "Operator", value: "Pending", helper: "To be activated later." },
        { label: "Payment", value: "Disabled", helper: "No live checkout." },
      ],
      flowSteps: ["Preview route", "Wait activation", "Confirm operator later", "No checkout yet"],
      priceHeadline: "Future-ready",
      priceBody: "No live price claim. Pricing must be snapshot-backed before this route becomes bookable.",
      paxRows: [
        { pax: "Solo", rule: "Pending" },
        { pax: "2–3 pax", rule: "Pending" },
        { pax: "4–6 pax", rule: "Pending" },
        { pax: "7–10 pax", rule: "Pending" },
      ],
      supportHeadline: "Future operator readiness",
      supportCards: [
        { title: "Route rules", body: "Access-ready movement must be configured." },
        { title: "Operator capacity", body: "Fulfillment must be confirmed later." },
        { title: "Payment guard", body: "No checkout until route is operational." },
      ],
      readinessLabel: "Not live-bookable yet",
      readinessBody: "This trail is future-ready only. Payment stays closed until operational rules are wired.",
      primaryCta: "View Future Route",
      secondaryCta: "Ask Kuya Tala™",
      tone: "slate",
    },
    "surf-explorer": {
      descriptionTitle: "Explorer Surf Trail",
      description:
        "A continue-later surf trail where travelers can start with one surf stop, lesson, or surf school visit.",
      heroChips: ["Beginner-safe", "Lesson optional", "Save progress", "Continue later"],
      featureCards: [
        { icon: "🏄", title: "Surf moment first", body: "Start with a lesson, viewing stop, or surf school." },
        { icon: "🧑‍🏫", title: "Coach optional", body: "Instructor support applies when a lesson is selected." },
        { icon: "🎫", title: "Saved progress", body: "Progress can continue during this trip or later." },
        { icon: "🌊", title: "No pressure", body: "Travelers do not need to finish all surf stops in one day." },
      ],
      bookingFields: [
        { label: "Level", value: "Beginner / experienced", helper: "Choose comfort level." },
        { label: "Activity", value: "Lesson / viewing", helper: "Select surf action." },
        { label: "Support", value: "Optional", helper: "Coach if needed." },
        { label: "Progress", value: "Saved", helper: "Continue later." },
      ],
      flowSteps: ["Pick level", "Choose lesson/viewing", "Request support", "Save progress"],
      priceHeadline: "Price to confirm",
      priceBody: "Price depends on lesson type, coach or surf school availability, timing, and group size.",
      paxRows: [
        { pax: "Solo", rule: "Lesson quote" },
        { pax: "2–3 pax", rule: "Coach review" },
        { pax: "4–6 pax", rule: "Group session" },
        { pax: "7–10 pax", rule: "Group handling" },
      ],
      supportHeadline: "Surf support optional",
      supportCards: [
        { title: "Instructor", body: "Needed only when lesson is selected." },
        { title: "Surf school", body: "Availability depends on partner readiness." },
        { title: "Progress", body: "Stops can continue later." },
      ],
      readinessLabel: "Support-based payment",
      readinessBody: "No payment pressure unless a lesson, coach, or supported surf session is selected.",
      primaryCta: "Start Surf Trail",
      secondaryCta: "Ask Kuya Tala™",
      tone: "teal",
    },
    "culture-community": {
      descriptionTitle: "Culture & Community Trail",
      description:
        "A local discovery trail through community stops, food makers, cultural touchpoints, local stories, and island experiences.",
      heroChips: ["Local stories", "Makers", "Community stops", "Consent-first"],
      featureCards: [
        { icon: "🤝", title: "Local connection", body: "Built around approved local participation." },
        { icon: "🍲", title: "Food and makers", body: "May include local food, markets, or maker stops." },
        { icon: "📍", title: "One-day fit", body: "Can usually be completed within the day." },
        { icon: "✅", title: "Partner approval", body: "Public completion depends on approved participation." },
      ],
      bookingFields: [
        { label: "Interest", value: "Culture / food / stories", helper: "Choose local angle." },
        { label: "Partner", value: "Approval needed", helper: "Capacity check." },
        { label: "Group", value: "Pax review", helper: "Host capacity." },
        { label: "Visit", value: "Approved stops", helper: "Respectful flow." },
      ],
      flowSteps: ["Choose interest", "Check partner", "Confirm capacity", "Visit approved stops"],
      priceHeadline: "Price to confirm",
      priceBody: "Some stops may be free. Paid stops depend on approved partner offer and capacity.",
      paxRows: [
        { pax: "Solo", rule: "Partner approval" },
        { pax: "2–3 pax", rule: "Small group" },
        { pax: "4–6 pax", rule: "Host capacity" },
        { pax: "7–10 pax", rule: "Group review" },
      ],
      supportHeadline: "Local host / partner support",
      supportCards: [
        { title: "Host readiness", body: "Partner readiness controls availability." },
        { title: "Consent-first", body: "Community participation must be approved." },
        { title: "Local story", body: "Experience should stay human and local." },
      ],
      readinessLabel: "Partner readiness required",
      readinessBody: "Payment follows approved partner capacity, consent, and stop-level rules.",
      primaryCta: "Explore Local Stops",
      secondaryCta: "Ask Kuya Tala™",
      tone: "gold",
    },
    "food-wellness": {
      descriptionTitle: "Food & Wellness Trail",
      description:
        "A merchant-operated trail for restaurants, cafés, wellness spaces, recovery spots, spa, massage, beauty, health, and island care experiences.",
      heroChips: ["Restaurants", "Cafés", "Wellness", "Recovery"],
      featureCards: [
        { icon: "🥗", title: "Restaurant stops", body: "Local dining, cafés, and food partners." },
        { icon: "💆", title: "Wellness care", body: "Spa, massage, recovery, and island care." },
        { icon: "🛍️", title: "Merchant-led", body: "Availability depends on merchant offers." },
        { icon: "🎁", title: "Rewards-ready", body: "Strong future lane for repeat local spend." },
      ],
      bookingFields: [
        { label: "Category", value: "Food / wellness", helper: "Choose stop type." },
        { label: "Merchant", value: "Select stop", helper: "Offer availability." },
        { label: "Pax", value: "Group availability", helper: "Table/service capacity." },
        { label: "Payment", value: "Merchant rules", helper: "Offer dependent." },
      ],
      flowSteps: ["Choose category", "Select merchant", "Check offer", "Visit stop"],
      priceHeadline: "Free or merchant-priced",
      priceBody: "Price depends on merchant offer, table/service availability, wellness service, and group size.",
      paxRows: [
        { pax: "Solo", rule: "Merchant offer" },
        { pax: "2–3 pax", rule: "Table/service" },
        { pax: "4–6 pax", rule: "Group availability" },
        { pax: "7–10 pax", rule: "Merchant review" },
      ],
      supportHeadline: "Merchant-operated trail",
      supportCards: [
        { title: "Restaurants/cafés", body: "Food stops control their own offers." },
        { title: "Wellness operators", body: "Spa and recovery services depend on availability." },
        { title: "No generic attractions", body: "This lane is for merchant participation." },
      ],
      readinessLabel: "Merchant payment rules required",
      readinessBody: "Merchant payment and reward logic must be explicit before live commerce.",
      primaryCta: "Explore Food & Wellness",
      secondaryCta: "Ask Kuya Tala™",
      tone: "gold",
    },
    "return-traveler-continuity": {
      descriptionTitle: "Return Traveler Continuity",
      description:
        "A progress layer for unfinished Passport Trails, saved stops, previous stamps, repeat visits, loyalty, and future rewards.",
      heroChips: ["Saved trails", "Unfinished stops", "Return visits", "Progress layer"],
      featureCards: [
        { icon: "🎫", title: "Saved progress", body: "Keeps unfinished trail activity attached to the traveler." },
        { icon: "🔁", title: "Return visits", body: "Built for travelers who come back to Siargao." },
        { icon: "📍", title: "Unfinished stops", body: "Continue what was not completed before." },
        { icon: "₱", title: "No instant checkout", body: "Payment only applies if the selected trail requires it." },
      ],
      bookingFields: [
        { label: "Progress", value: "Saved", helper: "Review history." },
        { label: "Trail", value: "Unfinished", helper: "Pick what to continue." },
        { label: "Support", value: "Trail dependent", helper: "Based on selected trail." },
        { label: "Payment", value: "If needed", helper: "No continuity checkout." },
      ],
      flowSteps: ["Review progress", "Pick unfinished trail", "Continue later", "Keep history"],
      priceHeadline: "No instant checkout",
      priceBody: "Payment applies only when the selected continued trail or service requires it.",
      paxRows: [
        { pax: "Solo", rule: "Progress" },
        { pax: "Group", rule: "Trail dependent" },
        { pax: "Support", rule: "Service dependent" },
        { pax: "Payment", rule: "Only if required" },
      ],
      supportHeadline: "Depends on selected trail",
      supportCards: [
        { title: "Trail dependent", body: "Guide and support rules come from the trail continued." },
        { title: "History-based", body: "Progress is attached to OSP traveler identity." },
        { title: "No fake rewards", body: "Rewards only appear when governed rules exist." },
      ],
      readinessLabel: "Progress layer only",
      readinessBody: "No checkout from continuity alone. Payment depends on the selected trail or service.",
      primaryCta: "Review Saved Progress",
      secondaryCta: "Ask Kuya Tala™",
      tone: "slate",
    },
  };

  const item = premium[trailSlug];

  if (!item) {
    return null;
  }

  // LANDTOUR_MOCKUP_LOCK_UI_05F
  if (trailSlug === "siargao-land-tour") {
    const navy = "#013863";
    const teal = "#0596A5";
    const tealDeep = "#047F91";
    const gold = "#F3AE26";
    const softGold = "#FFF8E8";
    const mist = "#EAFBFA";
    const slate = "#50668B";

    const card: React.CSSProperties = {
      borderRadius: 30,
      background: "#FFFFFF",
      border: "1px solid rgba(1,56,99,0.08)",
      boxShadow: "0 18px 42px rgba(1,56,99,0.10)",
      padding: 14,
      boxSizing: "border-box",
      overflow: "hidden",
    };

    const sectionHead: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap: 9,
      color: tealDeep,
      fontSize: 13,
      lineHeight: 1,
      fontWeight: 950,
      letterSpacing: "0.055em",
      textTransform: "uppercase",
      marginBottom: 13,
    };

    const sectionIcon: React.CSSProperties = {
      width: 32,
      height: 32,
      borderRadius: 14,
      background: "rgba(5,150,165,0.10)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: tealDeep,
      fontSize: 17,
      flex: "0 0 auto",
    };

    const label: React.CSSProperties = {
      display: "block",
      color: navy,
      fontSize: 12,
      lineHeight: 1,
      fontWeight: 900,
      marginBottom: 8,
    };

    const info: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 14,
      height: 14,
      borderRadius: 999,
      border: "1px solid rgba(80,102,139,0.35)",
      color: slate,
      fontSize: 9,
      fontWeight: 950,
      marginLeft: 4,
      verticalAlign: "1px",
    };

    const input: React.CSSProperties = {
      width: "100%",
      minHeight: 50,
      borderRadius: 16,
      border: "1px solid rgba(1,56,99,0.16)",
      background: "#FFFFFF",
      color: navy,
      fontSize: 14,
      fontWeight: 780,
      padding: "0 13px",
      boxSizing: "border-box",
      outline: "none",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.88)",
    };

    const selectedRoute: React.CSSProperties = {
      minHeight: 54,
      borderRadius: 16,
      border: "1px solid rgba(5,150,165,0.28)",
      background: "linear-gradient(135deg, #0596A5, #08AFC0)",
      color: "#FFFFFF",
      WebkitTextFillColor: "#FFFFFF",
      fontSize: 14,
      fontWeight: 950,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "0 12px",
      boxShadow: "0 12px 24px rgba(5,150,165,0.22)",
      cursor: "pointer",
    };

    const routeOption: React.CSSProperties = {
      minHeight: 54,
      borderRadius: 16,
      border: "1px solid rgba(1,56,99,0.18)",
      background: "#FFFFFF",
      color: navy,
      WebkitTextFillColor: navy,
      fontSize: 14,
      fontWeight: 850,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "0 12px",
      cursor: "pointer",
    };

    const segmented: React.CSSProperties = {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      borderRadius: 16,
      border: "1px solid rgba(1,56,99,0.14)",
      overflow: "hidden",
      background: "#FFFFFF",
    };

    const selectCell = (active: boolean, isLast: boolean): React.CSSProperties => ({
      minHeight: 50,
      border: 0,
      borderRight: isLast ? 0 : "1px solid rgba(1,56,99,0.10)",
      background: active ? "rgba(5,150,165,0.10)" : "#FFFFFF",
      color: active ? tealDeep : slate,
      WebkitTextFillColor: active ? tealDeep : slate,
      fontSize: 9.5,
      fontWeight: 850,
      display: "grid",
      placeItems: "center",
      gap: 2,
      cursor: "pointer",
      padding: 5,
      textAlign: "center",
    });

    return (
      <section
        aria-label="Siargao Land Tour booking details"
        style={{
          margin: "0 auto",
          width: "100%",
          maxWidth: 460,
          padding: "0 16px",
          boxSizing: "border-box",
          background:
            "linear-gradient(180deg, rgba(234,251,250,0.60) 0%, rgba(255,255,255,0.98) 44%, rgba(255,248,232,0.46) 100%)",
          borderRadius: 38,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "grid", gap: 13 }}>
          <article
            aria-label="Siargao Land Tour Passport Trail summary"
            style={{
              ...card,
              width: "100%",
              maxWidth: "100%",
              display: "grid",
              gridTemplateColumns: "60px minmax(0, 1fr)",
              gap: 14,
              alignItems: "center",
              margin: "-14px auto 0",
              borderRadius: 24,
              background: "linear-gradient(145deg, #FFFFFF 0%, rgba(244,252,250,0.98) 100%)",
              padding: "16px 17px",
              boxShadow: "0 16px 38px rgba(1,56,99,0.10)",
              border: "1px solid rgba(5,150,165,0.10)",
              boxSizing: "border-box",
              position: "relative",
              zIndex: 2,
              minHeight: 104,
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 60,
                height: 60,
                borderRadius: 999,
                background: "linear-gradient(135deg, #0596A5, #047F91)",
                color: "#FFFFFF",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 14px 26px rgba(5,150,165,0.22)",
                alignSelf: "center",
                position: "relative",
                flex: "0 0 auto",
              }}
            >
              <svg
                width="38"
                height="38"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M9 47C15.5 43.5 22.5 43.5 29 47C35.5 50.5 42.5 50.5 49 47C52 45.4 54.5 44.7 57 44.7"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M14 53C20 50 26 50 32 53C38 56 44 56 50 53"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity="0.92"
                />
                <path
                  d="M33 43V24"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M33 25C29 18.5 23 15.5 17 16.5"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M34 25C39.5 18 46 15 53 17"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M33 24C31.5 16 33.2 10.5 38 7"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M32 24C27.5 17 27.6 11 31.5 7"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div
              style={{
                minWidth: 0,
                display: "grid",
                alignContent: "center",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#013863",
                  fontSize: "clamp(18.5px, 4.55vw, 21px)",
                  lineHeight: 1.08,
                  fontWeight: 820,
                  letterSpacing: "-0.028em",
                }}
              >
                Siargao Land Tour Passport Trail
              </h2>
              <p
                style={{
                  margin: "5px 0 0",
                  color: "#013863",
                  fontSize: "clamp(11.75px, 2.85vw, 12.75px)",
                  lineHeight: 1.34,
                  fontWeight: 560,
                }}
              >
                Choose a South Tour or North Tour route with local operator support. Built for guided island movement by road, with pax, pickup, vehicle, and support options confirmed before payment.
              </p>
            </div>
          </article>

          <article
            aria-label="Route and Tour Options"
            style={{
              ...card,
              borderRadius: 24,
              background: "linear-gradient(145deg, #FFFFFF 0%, rgba(234,251,250,0.72) 100%)",
              boxShadow: "0 16px 36px rgba(1,56,99,0.09)",
              border: "1px solid rgba(5,150,165,0.12)",
              padding: 16,
            }}
          >
            <div style={sectionHead}>
              <span style={sectionIcon}>📍</span>
              Route & Tour Options
            </div>

            <form
              id="siargao-land-tour-options"
              aria-label="Siargao Land Tour options and price form"
              style={{
                display: "grid",
                gap: 12,
                margin: 0,
              }}
            >
              
              <input type="hidden" name="productCode" value="SPM_LAND_TOUR_PRIVATE_MVP" />
              <input type="hidden" name="pricingVersion" value="LAND_TOUR_MVP_2026_05" />
              <input type="hidden" name="pricingMode" value="PAX_TIERED_PER_HEAD" />
              <input type="hidden" name="paymentTiming" value="AFTER_OPERATOR_CONFIRMATION" />
              <input type="hidden" name="currencyCode" value="PHP" />
              <input type="hidden" id="landTourSnapshotUnitPrice" name="unitPrice" value="1500" />
              <input type="hidden" id="landTourSnapshotEstimatedTotal" name="estimatedTotal" value="10500" />
              <input type="hidden" id="landTourSnapshotTierLabel" name="tierLabel" value="7–10 pax tier" />
<fieldset
                style={{
                  border: 0,
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) 112px",
                  gap: 10,
                  alignItems: "start",
                }}
              >
                <div>
                  <legend style={{ ...label, marginBottom: 7 }}>
                    Route <span style={info}>i</span>
                  </legend>

                  <div
                    aria-label="Land Tour route setup summary"
                    style={{
                      marginBottom: 10,
                      borderRadius: 20,
                      padding: 12,
                      background: "#F4FCFA",
                      border: "1px solid rgba(5,150,165,0.14)",
                      boxShadow: "0 10px 24px rgba(1,56,99,0.05)",
                    }}
                  >
                    <div
                      style={{
                        color: "#0596A5",
                        fontSize: 9,
                        lineHeight: 1,
                        fontWeight: 900,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      Route preview below
                    </div>
                    <strong
                      style={{
                        display: "block",
                        marginTop: 7,
                        color: "#013863",
                        fontSize: 14,
                        lineHeight: 1.12,
                        fontWeight: 930,
                      }}
                    >
                      Choose South or North in Choose Your Route.
                    </strong>
                    <p
                      style={{
                        margin: "7px 0 0",
                        color: "#50668B",
                        fontSize: 10.6,
                        lineHeight: 1.35,
                        fontWeight: 760,
                      }}
                    >
                      Review the route highlights first, then confirm pax and total below.
                    </p>
                  </div>

                  <div
                    style={{
                      display: "none",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                    }}
                  >
                    <label
                      aria-label="Select South Tour"
                      style={{
                        minHeight: 70,
                        borderRadius: 18,
                        border: "1px solid rgba(5,150,165,0.22)",
                        background: "linear-gradient(145deg, #0596A5 0%, #08AFC0 100%)",
                        color: "#FFFFFF",
                        WebkitTextFillColor: "#FFFFFF",
                        padding: "10px",
                        display: "grid",
                        gridTemplateColumns: "32px minmax(0, 1fr)",
                        gap: 8,
                        alignItems: "center",
                        textAlign: "left",
                        boxShadow: "0 12px 24px rgba(5,150,165,0.20)",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="landTourRoute"
                        value="south-tour"
                        defaultChecked
                        style={{
                          position: "absolute",
                          opacity: 0,
                          pointerEvents: "none",
                        }}
                      />
                      <span
                        aria-hidden="true"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.18)",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 17,
                        }}
                      >
                        🌴
                      </span>
                      <span>
                        <strong
                          style={{
                            display: "block",
                            fontSize: 13,
                            lineHeight: 1.05,
                            fontWeight: 900,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          South Tour
                        </strong>
                        <span
                          style={{
                            display: "block",
                            marginTop: 4,
                            fontSize: 9.2,
                            lineHeight: 1.15,
                            fontWeight: 750,
                            opacity: 0.92,
                          }}
                        >
                          Coconut road · Maasin
                        </span>
                      </span>
                    </label>

                    <label
                      aria-label="Select North Tour"
                      style={{
                        minHeight: 70,
                        borderRadius: 18,
                        border: "1px solid rgba(5,150,165,0.14)",
                        background: "rgba(255,255,255,0.97)",
                        color: "#013863",
                        WebkitTextFillColor: "#013863",
                        padding: "10px",
                        display: "grid",
                        gridTemplateColumns: "32px minmax(0, 1fr)",
                        gap: 8,
                        alignItems: "center",
                        textAlign: "left",
                        boxShadow: "0 10px 20px rgba(1,56,99,0.05)",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="landTourRoute"
                        value="north-tour"
                        style={{
                          position: "absolute",
                          opacity: 0,
                          pointerEvents: "none",
                        }}
                      />
                      <span
                        aria-hidden="true"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 999,
                          background: "rgba(234,251,250,0.95)",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 16,
                        }}
                      >
                        ⛰️
                      </span>
                      <span>
                        <strong
                          style={{
                            display: "block",
                            fontSize: 13,
                            lineHeight: 1.05,
                            fontWeight: 900,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          North Tour
                        </strong>
                        <span
                          style={{
                            display: "block",
                            marginTop: 4,
                            fontSize: 9.2,
                            lineHeight: 1.15,
                            fontWeight: 750,
                            color: "#50668B",
                          }}
                        >
                          Pacifico · Alegria
                        </span>
                      </span>
                    </label>
                  </div>

                  <label style={{ marginTop: 9, display: "block" }}>
                    <span style={{ ...label, marginBottom: 6 }}>
                      Tour timing
                    </span>
                    <select
                      name="landTourDayMode"
                      aria-label="Choose land tour day option"
                      defaultValue="single-day"
                      style={{
                        ...input,
                        minHeight: 45,
                        borderRadius: 16,
                        fontSize: 12.5,
                        fontWeight: 850,
                        background: "#FFFFFF",
                      }}
                    >
                      <option value="single-day">Single route today</option>
                      <option value="both-days">Both on separate days</option>
                      <option value="operator-plan">Let operator recommend</option>
                    </select>
                  </label>
                </div>

                <div>
                  <label>
                    <span style={{ ...label, marginBottom: 7 }}>
                      No. of pax <span style={info}>i</span>
                    </span>

                    <input
                      id="landTourPaxInput"
                      name="landTourPax"
                      aria-label="Number of passengers"
                      type="number"
                      min="1"
                      max="10"
                      defaultValue="7"
                      inputMode="numeric"
                      style={{
                        width: "100%",
                        minHeight: 58,
                        borderRadius: 20,
                        background: "linear-gradient(180deg, #FFFFFF 0%, rgba(234,251,250,0.82) 100%)",
                        border: "1px solid rgba(5,150,165,0.14)",
                        boxShadow: "0 10px 20px rgba(1,56,99,0.05)",
                        color: "#013863",
                        fontSize: 25,
                        fontWeight: 950,
                        textAlign: "center",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </label>

                  <div
                    aria-label="Unit price based on passenger count"
                    style={{
                      marginTop: 8,
                      borderRadius: 18,
                      background: "linear-gradient(145deg, rgba(255,248,232,0.98), #FFFFFF)",
                      border: "1px solid rgba(243,174,38,0.28)",
                      padding: "9px 8px",
                      textAlign: "center",
                      boxShadow: "0 8px 18px rgba(1,56,99,0.045)",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        color: "#50668B",
                        fontSize: 8.4,
                        lineHeight: 1.05,
                        fontWeight: 850,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      Unit price
                    </span>
                    <strong
                      id="landTourUnitPrice"
                      style={{
                        display: "block",
                        marginTop: 4,
                        color: "#0596A5",
                        fontSize: 16,
                        lineHeight: 1,
                        fontWeight: 950,
                        letterSpacing: "-0.035em",
                      }}
                    >
                      ₱1,500 / pax
                    </strong>
                    <span
                      id="landTourTierLabel"
                      style={{
                        display: "block",
                        marginTop: 4,
                        color: "#50668B",
                        fontSize: 8.4,
                        lineHeight: 1.15,
                        fontWeight: 740,
                      }}
                    >
                      7–10 pax tier
                    </span>
                  </div>
                </div>
              </fieldset>

                    <article
            aria-label="Siargao Land Tour trail stops"
            data-osp-marker="land-tour-stops-switch-06K"
            style={{
              ...card,
              borderRadius: 24,
              background: "#FFFFFF",
              boxShadow: "0 14px 34px rgba(1,56,99,0.07)",
              border: "1px solid rgba(5,150,165,0.12)",
              padding: 16,
            }}
          >
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  #land-tour-route-south-06k:checked ~ .land-tour-route-toggle-row label[for="land-tour-route-south-06k"],
                  #land-tour-route-north-06k:checked ~ .land-tour-route-toggle-row label[for="land-tour-route-north-06k"] {
                    background: #013863 !important;
                    color: #ffffff !important;
                    border-color: rgba(1,56,99,0.20) !important;
                    box-shadow: 0 12px 24px rgba(1,56,99,0.14) !important;
                  }

                  #land-tour-route-south-06k:checked ~ .land-tour-route-stops .land-tour-south-stops-06k {
                    display: block !important;
                  }

                  #land-tour-route-south-06k:checked ~ .land-tour-route-stops .land-tour-north-stops-06k {
                    display: none !important;
                  }

                  #land-tour-route-north-06k:checked ~ .land-tour-route-stops .land-tour-south-stops-06k {
                    display: none !important;
                  }

                  #land-tour-route-north-06k:checked ~ .land-tour-route-stops .land-tour-north-stops-06k {
                    display: block !important;
                  }
                `,
              }}
            />

            <div style={sectionHead}>
              <span style={sectionIcon}>🗺️</span>
              Choose Route
            </div>

            <p
              style={{
                margin: "8px 0 0",
                color: "#50668B",
                fontSize: 10.8,
                lineHeight: 1.35,
                fontWeight: 760,
              }}
            >
              Pick a route, then review the total.
            </p>

            <input
              id="land-tour-route-south-06k"
              name="land-tour-route-switch-06K"
              type="radio"
              defaultChecked
              style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
            />
            <input
              id="land-tour-route-north-06k"
              name="land-tour-route-switch-06K"
              type="radio"
              style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
            />

            <div
              className="land-tour-route-toggle-row"
              style={{
                marginTop: 12,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <label
                htmlFor="land-tour-route-south-06k"
                style={{
                  minHeight: 46,
                  borderRadius: 16,
                  padding: "10px 9px",
                  background: "#F4FCFA",
                  border: "1px solid rgba(5,150,165,0.14)",
                  color: "#013863",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: 11,
                  lineHeight: 1.1,
                  fontWeight: 900,
                }}
              >
                South Route
              </label>

              <label
                htmlFor="land-tour-route-north-06k"
                style={{
                  minHeight: 46,
                  borderRadius: 16,
                  padding: "10px 9px",
                  background: "#F4FCFA",
                  border: "1px solid rgba(5,150,165,0.14)",
                  color: "#013863",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: 11,
                  lineHeight: 1.1,
                  fontWeight: 900,
                }}
              >
                North Route
              </label>
            </div>

            <div className="land-tour-route-stops" style={{ marginTop: 10 }}>
              <div
                className="land-tour-south-stops-06k"
                style={{
                  display: "block",
                  borderRadius: 20,
                  background: "#F4FCFA",
                  border: "1px solid rgba(5,150,165,0.12)",
                  padding: 12,
                }}
              >
                <strong
                  style={{
                    display: "block",
                    color: "#013863",
                    fontSize: 13,
                    lineHeight: 1,
                    fontWeight: 930,
                  }}
                >
                  South Route
                </strong>
                <p
                  style={{
                    margin: "9px 0 0",
                    color: "#50668B",
                    fontSize: 11,
                    lineHeight: 1.45,
                    fontWeight: 760,
                  }}
                >
                  Coconut views · Maasin River · Magpupungko · Secret Beach
                </p>
                <p
                  style={{
                    margin: "7px 0 0",
                    color: "#50668B",
                    fontSize: 10.2,
                    lineHeight: 1.35,
                    fontWeight: 760,
                  }}
                >
                  Sugba Lagoon is handled as a separate official trail.
                </p>
              </div>

              <div
                className="land-tour-north-stops-06k"
                style={{
                  display: "none",
                  borderRadius: 20,
                  background: "#F4FCFA",
                  border: "1px solid rgba(5,150,165,0.12)",
                  padding: 12,
                }}
              >
                <strong
                  style={{
                    display: "block",
                    color: "#013863",
                    fontSize: 13,
                    lineHeight: 1,
                    fontWeight: 930,
                  }}
                >
                  North Route
                </strong>
                <p
                  style={{
                    margin: "9px 0 0",
                    color: "#50668B",
                    fontSize: 11,
                    lineHeight: 1.45,
                    fontWeight: 760,
                  }}
                >
                  Pacifico · Alegria · Taktak Falls · caves · beach stops
                </p>
              </div>
            </div>

            <p
              style={{
                margin: "11px 0 0",
                color: "#50668B",
                fontSize: 10.2,
                lineHeight: 1.35,
                fontWeight: 760,
              }}
            >
              Stamps unlock after verified stop visits.
            </p>
          </article>

<div
                aria-label="Pax tier reference"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: 6,
                }}
              >
                {[
                  ["Solo", "₱3,200"],
                  ["2–3 pax", "₱2,200"],
                  ["4–6 pax", "₱1,800"],
                  ["7–10 pax", "₱1,500"],
                ].map(([tier, price], index) => (
                  <div
                    key={tier}
                    style={{
                      minHeight: 46,
                      borderRadius: 15,
                      background:
                        index === 3
                          ? "rgba(234,251,250,0.96)"
                          : "rgba(255,255,255,0.94)",
                      border:
                        index === 3
                          ? "1px solid rgba(5,150,165,0.22)"
                          : "1px solid rgba(1,56,99,0.08)",
                      display: "grid",
                      placeItems: "center",
                      textAlign: "center",
                      padding: "6px 4px",
                    }}
                  >
                    <span
                      style={{
                        color: "#013863",
                        fontSize: 8.6,
                        lineHeight: 1.05,
                        fontWeight: 850,
                      }}
                    >
                      {tier}
                    </span>
                    <strong
                      style={{
                        marginTop: 3,
                        color: "#0596A5",
                        fontSize: 11.3,
                        lineHeight: 1,
                        fontWeight: 950,
                      }}
                    >
                      {price}
                    </strong>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <label>
                  <span style={label}>
                    Transport <span style={info}>i</span>
                  </span>
                  <select
                    name="landTourTransport"
                    aria-label="Choose transport mode"
                    defaultValue="TUKTUK"
                    style={{
                      ...input,
                      minHeight: 47,
                      borderRadius: 16,
                      fontSize: 12.8,
                      fontWeight: 850,
                      background: "#FFFFFF",
                    }}
                  >
                    <option value="TUKTUK">🛺 TukTuk</option>
                    <option value="MOTORCYCLE">🏍️ Motorcycle</option>
                    <option value="VAN_GROUP_TRANSPORT">🚐 Van / group transport</option>
                  </select>
                </label>

                <label>
                  <span style={label}>
                    Photo / drone <span style={info}>i</span>
                  </span>
                  <select
                    name="landTourMedia"
                    aria-label="Choose photo or drone option"
                    defaultValue="MOBILE_PHOTOGRAPHER"
                    style={{
                      ...input,
                      minHeight: 47,
                      borderRadius: 16,
                      fontSize: 12.8,
                      fontWeight: 850,
                      background: "#FFFFFF",
                    }}
                  >
                    <option value="NONE">No media add-on</option>
                    <option value="MOBILE_PHOTOGRAPHER">📷 Mobile photographer</option>
                    <option value="DRONE">🚁 Drone</option>
                    <option value="PHOTO_DRONE">📷 Photo + drone</option>
                  </select>
                </label>

                <label>
                  <span style={label}>
                    Guide support <span style={info}>i</span>
                  </span>
                  <select
                    name="landTourGuideSupport"
                    aria-label="Choose guide support"
                    defaultValue="DRIVER_LOCAL_SUPPORT"
                    style={{
                      ...input,
                      minHeight: 48,
                      borderRadius: 16,
                      fontSize: 12.8,
                      fontWeight: 850,
                      background: "#FFFFFF",
                    }}
                  >
                    <option value="DRIVER_LOCAL_SUPPORT">🧭 Driver + local support</option>
                    <option value="LICENSED_LOCAL_GUIDE">Licensed local guide</option>
                    <option value="OPERATOR_RECOMMENDED">Operator recommended</option>
                    <option value="NO_SEPARATE_GUIDE">No separate guide</option>
                  </select>
                </label>
              </div>

              <div
                data-osp-marker="land-tour-estimated-total-after-support-07A-R2"
                aria-label="Estimated total summary"
                style={{
                  borderRadius: 22,
                  background: "linear-gradient(135deg, #013863 0%, #045E78 100%)",
                  border: "1px solid rgba(5,150,165,0.16)",
                  boxShadow: "0 16px 30px rgba(1,56,99,0.16)",
                  padding: "13px 14px",
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) auto",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div>
                  <span
                    style={{
                      display: "block",
                      color: "rgba(255,255,255,0.72)",
                      fontSize: 9,
                      lineHeight: 1.05,
                      fontWeight: 900,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Estimated total
                  </span>
                  <strong
                    id="landTourFormulaLabel"
                    style={{
                      display: "block",
                      marginTop: 5,
                      color: "#FFFFFF",
                      fontSize: 12.4,
                      lineHeight: 1.15,
                      fontWeight: 850,
                    }}
                  >
                    7 pax × ₱1,500 / pax
                  </strong>
                </div>

                <strong
                  id="landTourTotalPrice"
                  style={{
                    color: "#F3AE26",
                    fontSize: 24,
                    lineHeight: 1,
                    fontWeight: 950,
                    letterSpacing: "-0.04em",
                    whiteSpace: "nowrap",
                  }}
                >
                  ₱10,500
                </strong>
              </div>

              <div
                aria-label="Price confirmation note"
                style={{
                  borderRadius: 17,
                  background: "rgba(255,255,255,0.92)",
                  border: "1px solid rgba(5,150,165,0.12)",
                  padding: 10,
                  color: "#50668B",
                  fontSize: 10,
                  lineHeight: 1.3,
                  fontWeight: 720,
                }}
              >
                Estimate updates by pax. Final amount is confirmed before payment.
              </div>
            </form>

            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (() => {
                    const root = document.getElementById("siargao-land-tour-options");
                    if (!root || root.dataset.priceBound === "true") return;
                    root.dataset.priceBound = "true";

                    const paxInput = document.getElementById("landTourPaxInput");
                    const unitPrice = document.getElementById("landTourUnitPrice");
                    const tierLabel = document.getElementById("landTourTierLabel");
                    const formulaLabel = document.getElementById("landTourFormulaLabel");
                    const totalPrice = document.getElementById("landTourTotalPrice");
                    const snapshotUnitPrice = document.getElementById("landTourSnapshotUnitPrice");
                    const snapshotEstimatedTotal = document.getElementById("landTourSnapshotEstimatedTotal");
                    const snapshotTierLabel = document.getElementById("landTourSnapshotTierLabel");
                    const transportSelect = root.querySelector('[name="landTourTransport"]');
                    const mediaSelect = root.querySelector('[name="landTourMedia"]');
                    const guideSupportSelect = root.querySelector('[name="landTourGuideSupport"]');

                    const fmt = new Intl.NumberFormat("en-PH");

                    function resolvePrice(pax) {
                      if (pax <= 1) return { unit: 3200, tier: "solo tier" };
                      if (pax <= 3) return { unit: 2200, tier: "2–3 pax tier" };
                      if (pax <= 6) return { unit: 1800, tier: "4–6 pax tier" };
                      return { unit: 1500, tier: "7–10 pax tier" };
                    }

                    function update() {
                      const raw = Number(paxInput?.value || 1);
                      const pax = Math.min(10, Math.max(1, Number.isFinite(raw) ? raw : 1));
                      if (paxInput && String(paxInput.value) !== String(pax)) paxInput.value = String(pax);

                      const price = resolvePrice(pax);
                      const total = pax * price.unit;
                      const transport = transportSelect?.value || "TUKTUK";
                      const media = mediaSelect?.value || "MOBILE_PHOTOGRAPHER";
                      const guideSupport = guideSupportSelect?.value || "DRIVER_LOCAL_SUPPORT";

                      if (unitPrice) unitPrice.textContent = "₱" + fmt.format(price.unit) + " / pax";
                      if (tierLabel) tierLabel.textContent = price.tier;
                      if (formulaLabel) formulaLabel.textContent = pax + " pax × ₱" + fmt.format(price.unit) + " / pax";
                      if (totalPrice) totalPrice.textContent = "₱" + fmt.format(total);
                      if (snapshotUnitPrice) snapshotUnitPrice.value = String(price.unit);
                      if (snapshotEstimatedTotal) snapshotEstimatedTotal.value = String(total);
                      if (snapshotTierLabel) snapshotTierLabel.value = price.tier;
                      root.dataset.landTourSnapshot = JSON.stringify({
                        productCode: "SPM_LAND_TOUR_PRIVATE_MVP",
                        pricingVersion: "LAND_TOUR_MVP_2026_05",
                        pricingMode: "PAX_TIERED_PER_HEAD",
                        currencyCode: "PHP",
                        paymentTiming: "AFTER_OPERATOR_CONFIRMATION",
                        pax,
                        unitPrice: price.unit,
                        estimatedTotal: total,
                        tierLabel: price.tier,
                        transportMode: transport,
                        mediaAddOn: media,
                        guideSupport,
                      });
                    }

                    paxInput?.addEventListener("input", update);
                    paxInput?.addEventListener("change", update);
                    transportSelect?.addEventListener("change", update);
                    mediaSelect?.addEventListener("change", update);
                    guideSupportSelect?.addEventListener("change", update);
                    update();
                  })();
                `,
              }}
            />
          </article>

          <article
            aria-label="Booking Flow"
            style={{
              ...card,
              borderRadius: 24,
              background: "linear-gradient(145deg, #FFFFFF 0%, rgba(234,251,250,0.66) 100%)",
              boxShadow: "0 16px 36px rgba(1,56,99,0.085)",
              border: "1px solid rgba(5,150,165,0.12)",
              padding: 16,
            }}
          >
            <div style={sectionHead}>
              <span style={sectionIcon}>🗓️</span>
              Booking Details
            </div>

            <form
              id="siargao-land-tour-booking-handoff"
              aria-label="Siargao Land Tour booking handoff form"
              style={{
                display: "grid",
                gap: 12,
                margin: 0,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <label>
                  <span style={label}>
                    Pickup area <span style={info}>i</span>
                  </span>
                  <select
                    name="pickupArea"
                    aria-label="Choose pickup area"
                    defaultValue="general-luna"
                    style={{
                      ...input,
                      minHeight: 48,
                      borderRadius: 16,
                      fontSize: 13,
                      fontWeight: 850,
                      background: "#FFFFFF",
                    }}
                  >
                    <option value="general-luna">📍 General Luna</option>
                    <option value="cloud-9">Cloud 9 / Catangnan</option>
                    <option value="malinao">Malinao</option>
                    <option value="dapa">Dapa</option>
                    <option value="other">Other / confirm with operator</option>
                  </select>
                </label>

                <label>
                  <span style={label}>Preferred date</span>
                  <input
                    name="preferredDate"
                    aria-label="Preferred land tour date"
                    type="date"
                    defaultValue="2026-05-22"
                    style={{
                      ...input,
                      minHeight: 48,
                      borderRadius: 16,
                      fontSize: 13,
                      fontWeight: 850,
                      background: "#FFFFFF",
                    }}
                  />
                </label>
              </div>

              <label>
                <span style={label}>Support package</span>
                <select
                  name="supportPackage"
                  aria-label="Choose support package"
                  defaultValue="standard"
                  style={{
                    ...input,
                    minHeight: 48,
                    borderRadius: 16,
                    fontSize: 13,
                    fontWeight: 850,
                    background: "#FFFFFF",
                  }}
                >
                  <option value="standard">🛡️ Standard — driver / local support</option>
                  <option value="driver-guide">Driver + local guide</option>
                  <option value="photo">Guide + mobile photographer</option>
                  <option value="full-media">Guide + photo / drone support</option>
                </select>
              </label>

              <label style={{ display: "block" }}>
                <span style={label}>
                  Notes for operator <span style={{ color: "#50668B", fontWeight: 760 }}>(optional)</span>
                </span>

                <div style={{ position: "relative" }}>
                  <textarea
                    name="operatorNotes"
                    aria-label="Notes for land tour operator"
                    defaultValue={"We’d love scenic stops and local food spots.\nPlease include Coconut View Deck if possible."}
                    rows={3}
                    maxLength={200}
                    style={{
                      ...input,
                      minHeight: 84,
                      borderRadius: 18,
                      paddingTop: 13,
                      paddingLeft: 42,
                      paddingBottom: 18,
                      resize: "vertical",
                      fontFamily: "inherit",
                      lineHeight: 1.35,
                      fontSize: 12.5,
                      fontWeight: 650,
                      background: "#FFFFFF",
                    }}
                  />
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: 14,
                      top: 14,
                      color: "#50668B",
                      fontSize: 17,
                    }}
                  >
                    📝
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      right: 12,
                      bottom: 9,
                      color: "#50668B",
                      fontSize: 9.5,
                      fontWeight: 760,
                    }}
                  >
                    73/200
                  </span>
                </div>
              </label>

              <div
                aria-label="Booking handoff summary"
                style={{
                  borderRadius: 18,
                  background: "rgba(255,248,232,0.82)",
                  border: "1px solid rgba(243,174,38,0.24)",
                  padding: 11,
                  display: "grid",
                  gap: 7,
                }}
              >
                <strong
                  style={{
                    color: "#013863",
                    fontSize: 12,
                    lineHeight: 1.1,
                    fontWeight: 950,
                  }}
                >
                  Handoff prepared for operator confirmation
                </strong>
                <span
                  style={{
                    color: "#50668B",
                    fontSize: 10.5,
                    lineHeight: 1.34,
                    fontWeight: 720,
                  }}
                >
                  Your choices are sent for confirmation before payment opens.
                </span>
              </div>
            </form>
          </article>

          <article
            aria-label="Guide and Support Selection"
            style={{
              ...card,
              borderRadius: 24,
              background: "linear-gradient(145deg, #FFFFFF 0%, rgba(234,251,250,0.70) 100%)",
              boxShadow: "0 16px 36px rgba(1,56,99,0.085)",
              border: "1px solid rgba(5,150,165,0.12)",
              padding: 16,
            }}
          >
            <div style={sectionHead}>
              <span style={sectionIcon}>👥</span>
              Guide & Support Inclusions
            </div>

            <form
              id="siargao-land-tour-guide-support"
              aria-label="Siargao Land Tour guide and support selection form"
              style={{
                display: "grid",
                gap: 12,
                margin: 0,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <label>
                  <span style={label}>
                    Guide support <span style={info}>i</span>
                  </span>
                  <select
                    name="guideSupport"
                    aria-label="Choose guide support"
                    defaultValue="driver-local-support"
                    style={{
                      ...input,
                      minHeight: 48,
                      borderRadius: 16,
                      fontSize: 12.8,
                      fontWeight: 850,
                      background: "#FFFFFF",
                    }}
                  >
                    <option value="driver-local-support">🧭 Driver + local support</option>
                    <option value="licensed-guide">Licensed local guide</option>
                    <option value="operator-recommended">Operator recommended</option>
                    <option value="no-separate-guide">No separate guide</option>
                  </select>
                </label>

                <label>
                  <span style={label}>
                    Support level <span style={info}>i</span>
                  </span>
                  <select
                    name="supportLevel"
                    aria-label="Choose support level"
                    defaultValue="standard"
                    style={{
                      ...input,
                      minHeight: 48,
                      borderRadius: 16,
                      fontSize: 12.8,
                      fontWeight: 850,
                      background: "#FFFFFF",
                    }}
                  >
                    <option value="standard">Standard route support</option>
                    <option value="assisted">Assisted route planning</option>
                    <option value="premium">Premium guided support</option>
                    <option value="custom-review">Custom operator review</option>
                  </select>
                </label>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <label>
                  <span style={label}>
                    Photo / drone <span style={info}>i</span>
                  </span>
                  <select
                    name="mediaSupport"
                    aria-label="Choose photo or drone support"
                    defaultValue="mobile-photographer"
                    style={{
                      ...input,
                      minHeight: 48,
                      borderRadius: 16,
                      fontSize: 12.8,
                      fontWeight: 850,
                      background: "#FFFFFF",
                    }}
                  >
                    <option value="none">No media support</option>
                    <option value="mobile-photographer">📷 Mobile photographer</option>
                    <option value="drone">🚁 Drone support</option>
                    <option value="photo-drone">📷 Photo + drone</option>
                  </select>
                </label>

                <label>
                  <span style={label}>
                    Vehicle support <span style={info}>i</span>
                  </span>
                  <select
                    name="vehicleSupport"
                    aria-label="Choose vehicle support"
                    defaultValue="operator-match"
                    style={{
                      ...input,
                      minHeight: 48,
                      borderRadius: 16,
                      fontSize: 12.8,
                      fontWeight: 850,
                      background: "#FFFFFF",
                    }}
                  >
                    <option value="operator-match">Matched by operator</option>
                    <option value="tuktuk">TukTuk preferred</option>
                    <option value="motorcycle">Motorcycle preferred</option>
                    <option value="van">Van preferred</option>
                  </select>
                </label>
              </div>

              <div
                aria-label="Selected support summary"
                style={{
                  borderRadius: 28,
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(234,251,250,0.72) 100%)",
                  border: "1px solid rgba(5,150,165,0.18)",
                  boxShadow: "0 18px 42px rgba(1,56,99,0.10)",
                  padding: 14,
                  display: "grid",
                  gap: 12,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: -36,
                    bottom: -28,
                    width: 140,
                    height: 90,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(5,150,165,0.10) 0%, rgba(5,150,165,0.00) 70%)",
                    pointerEvents: "none",
                  }}
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: 8,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {[
                    [
                      "LOCAL SUPPORT",
                      "Local support",
                      "Driver / guide",
                      (
                        <svg
                          width="31"
                          height="31"
                          viewBox="0 0 64 64"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <circle cx="32" cy="32" r="22" stroke="#FFFFFF" strokeWidth="4" />
                          <path d="M39 25L35 39L25 43L29 29L39 25Z" stroke="#FFFFFF" strokeWidth="4" strokeLinejoin="round" />
                          <circle cx="32" cy="32" r="3" fill="#FFFFFF" />
                          <path d="M32 8V14" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                          <path d="M32 50V56" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                          <path d="M8 32H14" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                          <path d="M50 32H56" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                      ),
                    ],
                    [
                      "TRANSPORT",
                      "Transport",
                      "Route matched",
                      (
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 64 64"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="M13 25H47C50.3 25 53 27.7 53 31V43H11V27C11 25.9 11.9 25 13 25Z" stroke="#FFFFFF" strokeWidth="4" strokeLinejoin="round" />
                          <path d="M18 25L23 15H44L49 25" stroke="#FFFFFF" strokeWidth="4" strokeLinejoin="round" />
                          <path d="M20 32H29" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                          <path d="M35 32H45" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                          <circle cx="21" cy="45" r="5" stroke="#FFFFFF" strokeWidth="4" />
                          <circle cx="44" cy="45" r="5" stroke="#FFFFFF" strokeWidth="4" />
                          <path d="M14 18C19 13 25 11 32 11C39 11 45 13 50 18" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
                        </svg>
                      ),
                    ],
                    [
                      "MEDIA",
                      "Media",
                      "Optional add-on",
                      (
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 64 64"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="M18 24H25L29 18H36L40 24H47C50.3 24 53 26.7 53 30V45C53 48.3 50.3 51 47 51H18C14.7 51 12 48.3 12 45V30C12 26.7 14.7 24 18 24Z" stroke="#FFFFFF" strokeWidth="4" strokeLinejoin="round" />
                          <circle cx="32.5" cy="37.5" r="8.5" stroke="#FFFFFF" strokeWidth="4" />
                          <path d="M46 31H46.1" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
                          <path d="M37 33L29 42" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
                        </svg>
                      ),
                    ],
                  ].map(([eyebrow, title, sub, icon]) => (
                    <div
                      key={String(title)}
                      style={{
                        minHeight: 124,
                        borderRadius: 24,
                        background:
                          "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.96) 100%)",
                        border: "1px solid rgba(5,150,165,0.13)",
                        boxShadow: "0 14px 26px rgba(1,56,99,0.08)",
                        padding: "11px 8px 12px",
                        display: "grid",
                        justifyItems: "center",
                        alignContent: "start",
                        gap: 7,
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          borderRadius: 999,
                          background:
                            "linear-gradient(180deg, rgba(234,251,250,0.98), rgba(255,255,255,0.96))",
                          border: "1px solid rgba(5,150,165,0.20)",
                          color: "#0596A5",
                          padding: "5px 8px",
                          fontSize: 7.2,
                          lineHeight: 1,
                          fontWeight: 950,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          maxWidth: "100%",
                          whiteSpace: "nowrap",
                          boxShadow: "0 6px 12px rgba(1,56,99,0.04)",
                        }}
                      >
                        {eyebrow}
                      </span>

                      <span
                        aria-hidden="true"
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 999,
                          background:
                            "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.20), rgba(255,255,255,0.00) 32%), linear-gradient(135deg, #0596A5, #047F91)",
                          color: "#FFFFFF",
                          display: "grid",
                          placeItems: "center",
                          boxShadow:
                            "0 12px 24px rgba(5,150,165,0.25), inset 0 0 0 2px rgba(255,255,255,0.20)",
                          border: "2px solid rgba(255,255,255,0.92)",
                        }}
                      >
                        {icon}
                      </span>

                      <strong
                        style={{
                          color: "#013863",
                          fontSize: 12,
                          lineHeight: 1.08,
                          fontWeight: 950,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {title}
                      </strong>

                      <span
                        style={{
                          width: 16,
                          height: 3,
                          borderRadius: 999,
                          background: "#0596A5",
                        }}
                      />

                      <span
                        style={{
                          color: "#50668B",
                          fontSize: 9.4,
                          lineHeight: 1.12,
                          fontWeight: 780,
                        }}
                      >
                        {sub}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    borderRadius: 22,
                    background:
                      "linear-gradient(135deg, rgba(234,251,250,0.96), rgba(255,255,255,0.94))",
                    border: "1px solid rgba(5,150,165,0.18)",
                    boxShadow: "0 10px 22px rgba(1,56,99,0.055)",
                    padding: "12px 12px",
                    display: "grid",
                    gridTemplateColumns: "42px minmax(0, 1fr)",
                    gap: 11,
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.92)",
                      border: "1px solid rgba(5,150,165,0.16)",
                      color: "#0596A5",
                      display: "grid",
                      placeItems: "center",
                      boxShadow: "0 8px 16px rgba(1,56,99,0.05)",
                    }}
                  >
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M32 7L52 15V29C52 42 44 53 32 57C20 53 12 42 12 29V15L32 7Z" stroke="#0596A5" strokeWidth="4" strokeLinejoin="round" />
                      <path d="M22 32L29 39L43 24" stroke="#0596A5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>

                  <strong
                    style={{
                      color: "#013863",
                      fontSize: 12.4,
                      lineHeight: 1.34,
                      fontWeight: 850,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Support options are confirmed before payment.
                  </strong>

                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      right: 12,
                      bottom: 8,
                      color: "#F3AE26",
                      fontSize: 15,
                      opacity: 0.8,
                    }}
                  >
                    ✦
                  </span>
                </div>
              </div>

              </form>
          </article>

          <article
            aria-label="Payment Readiness"
            style={{
              ...card,
              borderRadius: 28,
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.99) 0%, rgba(255,248,232,0.72) 100%)",
              boxShadow: "0 18px 42px rgba(1,56,99,0.10)",
              border: "1px solid rgba(243,174,38,0.24)",
              padding: 16,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                right: -42,
                top: -48,
                width: 140,
                height: 140,
                borderRadius: 999,
                background:
                  "radial-gradient(circle, rgba(243,174,38,0.16) 0%, rgba(243,174,38,0.00) 70%)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "grid",
                gridTemplateColumns: "60px minmax(0, 1fr)",
                gap: 13,
                alignItems: "start",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 22,
                  background:
                    "linear-gradient(135deg, rgba(234,251,250,0.98), rgba(255,255,255,0.96))",
                  border: "1px solid rgba(5,150,165,0.16)",
                  boxShadow: "0 12px 24px rgba(1,56,99,0.06)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M32 7L52 15V29C52 42 44 53 32 57C20 53 12 42 12 29V15L32 7Z"
                    stroke="#0596A5"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 32L29 39L43 24"
                    stroke="#0596A5"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    borderRadius: 999,
                    background: "rgba(243,174,38,0.16)",
                    color: "#A26200",
                    padding: "5px 9px",
                    fontSize: 8.8,
                    lineHeight: 1,
                    fontWeight: 950,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Ready for operator confirmation
                </span>

                <h2
                  style={{
                    margin: "9px 0 0",
                    color: "#013863",
                    fontSize: 20,
                    lineHeight: 1.12,
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                  }}
                >
                  Confirm your Land Tour slot
                </h2>

                <p
                  style={{
                    margin: "7px 0 0",
                    color: "#50668B",
                    fontSize: 11.7,
                    lineHeight: 1.4,
                    fontWeight: 720,
                  }}
                >
                  Send your choices for confirmation. Pay once your Land Tour slot is accepted.
                </p>
              </div>
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "grid",
                gap: 9,
                marginTop: 14,
              }}
            >
              <a
                href="/traveler/passport-trails/siargao-land-tour/book?productCode=SPM_LAND_TOUR_PRIVATE_MVP&pricingVersion=LAND_TOUR_MVP_2026_05&pricingMode=PAX_TIERED_PER_HEAD&paymentTiming=AFTER_OPERATOR_CONFIRMATION"
                aria-label="Start Land Tour Booking"
                style={{
                  minHeight: 54,
                  borderRadius: 18,
                  background:
                    "linear-gradient(135deg, #F3AE26 0%, #F59E0B 100%)",
                  color: "#FFFFFF",
                  WebkitTextFillColor: "#FFFFFF",
                  display: "grid",
                  placeItems: "center",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 950,
                  letterSpacing: "-0.01em",
                  boxShadow: "0 14px 28px rgba(243,174,38,0.26)",
                  border: "1px solid rgba(255,255,255,0.44)",
                }}
              >
                Start Land Tour Booking
              </a>

              <a
                href="/traveler/assistant?topic=siargao-land-tour"
                aria-label="Ask Kuya Tala about Siargao Land Tour"
                style={{
                  minHeight: 48,
                  borderRadius: 18,
                  background: "#FFFFFF",
                  color: "#0596A5",
                  WebkitTextFillColor: "#0596A5",
                  display: "grid",
                  placeItems: "center",
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 900,
                  border: "1px solid rgba(5,150,165,0.22)",
                  boxShadow: "0 8px 18px rgba(1,56,99,0.045)",
                }}
              >
                💬 Ask Kuya Tala™
              </a>
            </div>

            <div
              aria-label="Payment readiness state"
              style={{
                position: "relative",
                zIndex: 1,
                marginTop: 12,
                borderRadius: 18,
                background: "rgba(255,255,255,0.84)",
                border: "1px solid rgba(5,150,165,0.12)",
                padding: 10,
                display: "grid",
                gap: 7,
              }}
            >
              {[
                ["Route + pax", "Ready to send"],
                ["Guide/support", "To confirm"],
                ["Payment", "Opens after acceptance"],
              ].map(([labelText, valueText], index) => (
                <div
                  key={labelText}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) auto",
                    gap: 8,
                    alignItems: "center",
                    paddingTop: index === 0 ? 0 : 7,
                    borderTop:
                      index === 0 ? "0" : "1px solid rgba(1,56,99,0.07)",
                  }}
                >
                  <span
                    style={{
                      color: "#50668B",
                      fontSize: 10.2,
                      fontWeight: 800,
                      lineHeight: 1.15,
                    }}
                  >
                    {labelText}
                  </span>
                  <strong
                    style={{
                      color: index === 2 ? "#A26200" : "#013863",
                      fontSize: 10.4,
                      fontWeight: 900,
                      lineHeight: 1.15,
                      textAlign: "right",
                    }}
                  >
                    {valueText}
                  </strong>
                </div>
              ))}
            </div>
          </article>
        </div>
      
      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
</section>
    );
  }



  const accent =
    item.tone === "gold"
      ? "#F3AE26"
      : item.tone === "slate"
        ? "#50668B"
        : "#0596A5";

  const deep =
    item.tone === "gold"
      ? "#9A5F0C"
      : item.tone === "slate"
        ? "#344055"
        : "#047f91";

  const shell =
    item.tone === "gold"
      ? "linear-gradient(145deg, rgba(255,255,255,0.99), rgba(255,248,232,0.92))"
      : item.tone === "slate"
        ? "linear-gradient(145deg, rgba(255,255,255,0.99), rgba(80,102,139,0.075))"
        : "linear-gradient(145deg, rgba(255,255,255,0.99), rgba(234,251,250,0.94))";

  const primaryGradient =
    item.tone === "gold"
      ? "linear-gradient(135deg, #F3AE26, #F59E0B)"
      : item.tone === "slate"
        ? "linear-gradient(135deg, #50668B, #344055)"
        : "linear-gradient(135deg, #047f91, #08a6b4)";

  const blockStyle: React.CSSProperties = {
    borderRadius: 26,
    background: shell,
    border: "1px solid rgba(5,150,165,0.14)",
    boxShadow: "0 14px 32px rgba(1,56,99,0.065)",
    padding: 14,
  };

  const labelStyle: React.CSSProperties = {
    color: deep,
    fontSize: 9,
    fontWeight: 950,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  };

  return null;
}


function TrailPaymentGatewayCta({
  trailSlug,
  trailTitle,
}: {
  trailSlug: string;
  trailTitle: string;
}) {
  const encodedTrail = encodeURIComponent(trailSlug);

  const DIRECT_SPM_OFFICIAL_TRAIL_PRICING: Record<
    string,
    {
      source: "DIRECT_SPM";
      productLabel: string;
      priceLabel: string;
      pricingModeLabel: string;
      paxModeLabel: string;
      paxTiers: Array<{ label: string; price: string; note: string }>;
      includes: string[];
      paymentStateLabel: string;
      primaryCtaLabel: string;
      toneBadge: string;
      shortValueLine: string;
    }
  > = {
    "island-hopping": {
      source: "DIRECT_SPM",
      productLabel: "Official Passport Trail",
      priceLabel: "₱1,500 / person",
      pricingModeLabel: "Joiner island-hopping package",
      paxModeLabel: "Solo, joiner, and group pax pricing",
      paxTiers: [
        { label: "Solo", price: "₱1,500", note: "Joiner seat" },
        { label: "2–3 pax", price: "₱1,500 / head", note: "Regular joiner rate" },
        { label: "4–6 pax", price: "₱1,470 / head", note: "₱30 off per head" },
        { label: "7–10 pax", price: "₱1,450 / head", note: "₱50 off per head" },
      ],
      includes: [
        "GL Port island-hopping route",
        "Guyam • Daku • Naked route flow",
        "Approved local operator fulfillment",
        "Passport progress available after verified records",
      ],
      paymentStateLabel: "Booking-backed checkout",
      primaryCtaLabel: "Create Booking Record",
      toneBadge: "Most Popular",
      shortValueLine: "Classic one-day island-hopping route from General Luna Port.",
    },
    "sugba-lagoon": {
      source: "DIRECT_SPM",
      productLabel: "Official Passport Trail",
      priceLabel: "Price to confirm",
      pricingModeLabel: "Access-ready lagoon route request",
      paxModeLabel: "Route and operator readiness required",
      paxTiers: [
        { label: "Solo", price: "Quote", note: "Route readiness review" },
        { label: "2–3 pax", price: "Quote", note: "Operator availability" },
        { label: "4–6 pax", price: "Quote", note: "Group handling review" },
        { label: "7–10 pax", price: "Quote", note: "Capacity confirmation" },
      ],
      includes: [
        "Del Carmen governed route logic",
        "Sugba Lagoon official access readiness",
        "Operator readiness required",
        "Payment unlock after route confirmation",
      ],
      paymentStateLabel: "Operator/access confirmation required",
      primaryCtaLabel: "Request Route Confirmation",
      toneBadge: "Route-supported",
      shortValueLine: "Access-ready lagoon route connected to official access and departure readiness.",
    },
    "bucas-grande-sohoton": {
      source: "DIRECT_SPM",
      productLabel: "Future Official Passport Trail",
      priceLabel: "Future-ready",
      pricingModeLabel: "Dapa-side governed route",
      paxModeLabel: "No live checkout until route activation",
      paxTiers: [
        { label: "Solo", price: "Pending", note: "Future activation" },
        { label: "2–3 pax", price: "Pending", note: "Future operator readiness" },
        { label: "4–6 pax", price: "Pending", note: "Future capacity rules" },
        { label: "7–10 pax", price: "Pending", note: "Future group rules" },
      ],
      includes: [
        "Bucas Grande / Sohoton route preview",
        "Dapa-side future movement logic",
        "Operator readiness required later",
        "No fake live booking claim",
      ],
      paymentStateLabel: "Future route pending",
      primaryCtaLabel: "View Future Route",
      toneBadge: "Future Ready",
      shortValueLine: "Reserved governed route. Do not claim bookable until operationally wired.",
    },
    "siargao-land-tour": {
      source: "DIRECT_SPM",
      productLabel: "Official Passport Trail",
      priceLabel: "Price to confirm",
      pricingModeLabel: "Guide / TukTuk / local operator request",
      paxModeLabel: "South, North, or private DIY route affects pricing",
      paxTiers: [
        { label: "Solo", price: "Quote", note: "Private support likely" },
        { label: "2–3 pax", price: "Quote", note: "TukTuk / motorcycle review" },
        { label: "4–6 pax", price: "Quote", note: "Vehicle / guide review" },
        { label: "7–10 pax", price: "Quote", note: "Van / group handling" },
      ],
      includes: [
        "South or North one-day land route",
        "Guide / driver / TukTuk / motorcycle support",
        "Drone or no-drone package option",
        "SPM / Operator / OTA source attribution required",
      ],
      paymentStateLabel: "Operator confirmation required",
      primaryCtaLabel: "Choose Land Tour Mode",
      toneBadge: "Guide support",
      shortValueLine: "South or North can be one day. Full route is better split across days.",
    },
    "surf-explorer": {
      source: "DIRECT_SPM",
      productLabel: "Official Passport Trail",
      priceLabel: "Price to confirm",
      pricingModeLabel: "Surf lesson / surf support request",
      paxModeLabel: "Lesson, coach, and timing affect pricing",
      paxTiers: [
        { label: "Solo", price: "Quote", note: "Lesson type required" },
        { label: "2–3 pax", price: "Quote", note: "Coach availability" },
        { label: "4–6 pax", price: "Quote", note: "Group session review" },
        { label: "7–10 pax", price: "Quote", note: "Group handling required" },
      ],
      includes: [
        "Cloud 9 surf trail context",
        "Beginner-safe continue-later behavior",
        "Surf school or lesson support where required",
        "Progress can stay saved across days",
      ],
      paymentStateLabel: "Operator confirmation required",
      primaryCtaLabel: "Request Surf Support",
      toneBadge: "Continue Later",
      shortValueLine: "Start with one surf stop or lesson. Progress can continue later.",
    },
    "culture-community": {
      source: "DIRECT_SPM",
      productLabel: "Official Passport Trail",
      priceLabel: "Price to confirm",
      pricingModeLabel: "Partner-approved local discovery",
      paxModeLabel: "Partner capacity and consent required",
      paxTiers: [
        { label: "Solo", price: "Quote", note: "Partner approval required" },
        { label: "2–3 pax", price: "Quote", note: "Small group experience" },
        { label: "4–6 pax", price: "Quote", note: "Host capacity review" },
        { label: "7–10 pax", price: "Quote", note: "Group consent/capacity" },
      ],
      includes: [
        "Local stories and makers",
        "Community stops and island experiences",
        "Consent-first participation",
        "Eligible Passport progress after approval",
      ],
      paymentStateLabel: "Partner pricing required",
      primaryCtaLabel: "Explore Local Discovery",
      toneBadge: "Local Discovery",
      shortValueLine: "A one-day local discovery trail when partner readiness is approved.",
    },
    "food-wellness": {
      source: "DIRECT_SPM",
      productLabel: "Merchant Passport Trail",
      priceLabel: "Free or merchant-priced",
      pricingModeLabel: "Restaurant / wellness merchant logic",
      paxModeLabel: "Merchant offer or stop-level pricing",
      paxTiers: [
        { label: "Solo", price: "Free/Pay", note: "Depends on merchant offer" },
        { label: "2–3 pax", price: "Free/Pay", note: "Restaurant/wellness stop" },
        { label: "4–6 pax", price: "Merchant", note: "Group/table availability" },
        { label: "7–10 pax", price: "Merchant", note: "Merchant confirmation" },
      ],
      includes: [
        "Restaurants and cafés",
        "Spa / massage / wellness / recovery",
        "Merchant-operated trail stops",
        "Future rewards and local spend logic",
      ],
      paymentStateLabel: "Merchant payment logic required",
      primaryCtaLabel: "Explore Food & Wellness",
      toneBadge: "Merchant Trail",
      shortValueLine: "Restaurant and wellness merchants operate this trail, not generic attractions.",
    },
    "return-traveler-continuity": {
      source: "DIRECT_SPM",
      productLabel: "Continuity Layer",
      priceLabel: "No instant checkout",
      pricingModeLabel: "Progress / retention layer",
      paxModeLabel: "Not pax-priced",
      paxTiers: [
        { label: "Solo", price: "Progress", note: "Based on verified history" },
        { label: "2–3 pax", price: "N/A", note: "Not group-priced" },
        { label: "4–6 pax", price: "N/A", note: "Not group-priced" },
        { label: "7–10 pax", price: "N/A", note: "Not group-priced" },
      ],
      includes: [
        "Saved trail progress",
        "Unfinished Passport stops",
        "Return traveler memory",
        "Cross-trip continuity",
      ],
      paymentStateLabel: "History-based unlock",
      primaryCtaLabel: "Review Saved Progress",
      toneBadge: "Progress Layer",
      shortValueLine: "This is not a normal paid route. It protects progress across trips.",
    },
  };
  const pricing = DIRECT_SPM_OFFICIAL_TRAIL_PRICING[trailSlug] ?? {
    source: "DIRECT_SPM" as const,
    productLabel: "Official Passport Trail",
    priceLabel: "Price to confirm",
    pricingModeLabel: "Request-based trail",
    paxModeLabel: "Pax pricing reviewed after request",
    paxTiers: [
      { label: "Solo", price: "Quote", note: "Request required" },
      { label: "2–3 pax", price: "Quote", note: "Small group review" },
      { label: "4–6 pax", price: "Quote", note: "Group review" },
      { label: "7–10 pax", price: "Quote", note: "Capacity review" },
    ],
    includes: [
      "Official trail route",
      "Approved partner support where required",
      "Booking-backed payment flow",
      "Passport stamps available",
    ],
    paymentStateLabel: "Request-based checkout",
    primaryCtaLabel: "Request Trail Price",
    toneBadge: "Official Trail",
    shortValueLine: "A structured Passport Trail prepared through SPM.",
  };

  return (
    <section
      aria-label="Direct SPM official trail pricing"
      style={{
        margin: "12px auto 0",
        width: "100%",
        maxWidth: 430,
        padding: "0 12px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          borderRadius: 26,
          background: "linear-gradient(135deg, #FFFFFF 0%, #FFF7E6 45%, #EAFBFA 100%)",
          border: "1px solid rgba(243,174,38,0.34)",
          boxShadow: "0 18px 42px rgba(1,56,99,0.12)",
          padding: 14,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 999,
                background: "rgba(243,174,38,0.16)",
                color: "#A95B00",
                padding: "6px 9px",
                fontSize: 9.5,
                fontWeight: 950,
                letterSpacing: "0.11em",
                textTransform: "uppercase",
              }}
            >
              {pricing.toneBadge}
            </div>

            <h2
              style={{
                margin: "8px 0 0",
                fontSize: 24,
                lineHeight: 1,
                letterSpacing: "-0.06em",
                fontWeight: 950,
                color: "#013863",
              }}
            >
              {pricing.priceLabel}
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                color: "#50668B",
                fontSize: 11.7,
                lineHeight: 1.32,
                fontWeight: 760,
              }}
            >
              {pricing.shortValueLine}
            </p>
          </div>

          <div
            style={{
              flex: "0 0 auto",
              width: 74,
              minHeight: 70,
              borderRadius: 20,
              background: "linear-gradient(135deg, #F3AE26, #D97706)",
              color: "#FFFFFF",
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              boxShadow: "0 13px 28px rgba(217,119,6,0.24)",
              padding: 8,
              boxSizing: "border-box",
            }}
          >
            <div>
              <div style={{ fontSize: 8.5, fontWeight: 950, opacity: 0.86 }}>
                PAX
              </div>
              <div style={{ marginTop: 2, fontSize: 13, lineHeight: 1, fontWeight: 950 }}>
                3–10
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          <div
            style={{
              borderRadius: 16,
              background: "rgba(255,255,255,0.80)",
              border: "1px solid rgba(5,150,165,0.14)",
              padding: "9px 10px",
            }}
          >
            <div
              style={{
                color: "#0596A5",
                fontSize: 8.5,
                fontWeight: 950,
                letterSpacing: "0.11em",
                textTransform: "uppercase",
              }}
            >
              Product
            </div>
            <div
              style={{
                marginTop: 3,
                color: "#013863",
                fontSize: 11.6,
                lineHeight: 1.25,
                fontWeight: 860,
              }}
            >
              {pricing.productLabel}
            </div>
          </div>

          <div
            style={{
              borderRadius: 16,
              background: "rgba(255,255,255,0.80)",
              border: "1px solid rgba(5,150,165,0.14)",
              padding: "9px 10px",
            }}
          >
            <div
              style={{
                color: "#0596A5",
                fontSize: 8.5,
                fontWeight: 950,
                letterSpacing: "0.11em",
                textTransform: "uppercase",
              }}
            >
              Pricing
            </div>
            <div
              style={{
                marginTop: 3,
                color: "#013863",
                fontSize: 11.6,
                lineHeight: 1.25,
                fontWeight: 860,
              }}
            >
              {pricing.pricingModeLabel}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 10,
            borderRadius: 18,
            background: "linear-gradient(135deg, #FFFDF7 0%, #FFFFFF 100%)",
            border: "1px solid rgba(243,174,38,0.24)",
            padding: 11,
          }}
        >
          <div
            style={{
              color: "#A95B00",
              fontSize: 9,
              fontWeight: 950,
              letterSpacing: "0.11em",
              textTransform: "uppercase",
            }}
          >
            {pricing.paxModeLabel}
          </div>

          <div
            style={{
              marginTop: 8,
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 7,
            }}
          >
            {pricing.paxTiers.map((tier) => (
              <div
                key={tier.label}
                style={{
                  borderRadius: 15,
                  background: "rgba(255,255,255,0.86)",
                  border: "1px solid rgba(5,150,165,0.13)",
                  padding: "8px 9px",
                }}
              >
                <div
                  style={{
                    color: "#50668B",
                    fontSize: 8.4,
                    fontWeight: 950,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {tier.label}
                </div>
                <div
                  style={{
                    marginTop: 3,
                    color: "#013863",
                    fontSize: 12.2,
                    lineHeight: 1.05,
                    fontWeight: 950,
                  }}
                >
                  {tier.price}
                </div>
                <div
                  style={{
                    marginTop: 3,
                    color: "#A95B00",
                    fontSize: 9.5,
                    lineHeight: 1.15,
                    fontWeight: 780,
                  }}
                >
                  {tier.note}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 10,
            borderRadius: 18,
            background: "linear-gradient(135deg, #F4FEFF 0%, #FFFFFF 100%)",
            border: "1px solid rgba(5,150,165,0.16)",
            padding: 11,
          }}
        >
          <div
            style={{
              color: "#047D8A",
              fontSize: 9,
              fontWeight: 950,
              letterSpacing: "0.11em",
              textTransform: "uppercase",
            }}
          >
            Includes
          </div>

          <div
            style={{
              marginTop: 8,
              display: "grid",
              gap: 6,
            }}
          >
            {pricing.includes.map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  color: "#013863",
                  fontSize: 11.5,
                  lineHeight: 1.24,
                  fontWeight: 780,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 17,
                    height: 17,
                    borderRadius: 999,
                    background: "linear-gradient(135deg, #0596A5, #013863)",
                    color: "#FFFFFF",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 9,
                    fontWeight: 950,
                    flex: "0 0 auto",
                  }}
                >
                  ✓
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 10,
            borderRadius: 17,
            background: "rgba(255,255,255,0.82)",
            border: "1px solid rgba(243,174,38,0.24)",
            padding: "9px 10px",
          }}
        >
          <div
            style={{
              color: "#A95B00",
              fontSize: 8.5,
              fontWeight: 950,
              letterSpacing: "0.11em",
              textTransform: "uppercase",
            }}
          >
            Payment Status
          </div>
          <div
            style={{
              marginTop: 3,
              color: "#013863",
              fontSize: 11.8,
              lineHeight: 1.28,
              fontWeight: 880,
            }}
          >
            {pricing.paymentStateLabel}
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            display: "grid",
            gap: 8,
          }}
        >
          <a
            href={`/traveler/payments?source=passport-trails&trail=${encodedTrail}`}
            style={{
              minHeight: 50,
              borderRadius: 18,
              background: "linear-gradient(135deg, #F3AE26 0%, #F9B320 52%, #D97706 100%)",
              color: "#FFFFFF",
              WebkitTextFillColor: "#FFFFFF",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 14px",
              fontSize: 12.5,
              lineHeight: 1.1,
              fontWeight: 950,
              boxShadow: "0 15px 32px rgba(217,119,6,0.26)",
              boxSizing: "border-box",
            }}
          >
            {pricing.primaryCtaLabel}
          </a>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            <a
              href="/traveler/passport-trails/diy-trail-builder/summary"
              style={{
                minHeight: 44,
                borderRadius: 16,
                background: "#FFFFFF",
                color: "#013863",
                WebkitTextFillColor: "#013863",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "0 10px",
                fontSize: 11.2,
                lineHeight: 1.1,
                fontWeight: 950,
                border: "1px solid rgba(5,150,165,0.20)",
                boxShadow: "0 10px 22px rgba(1,56,99,0.07)",
                boxSizing: "border-box",
              }}
            >
              Existing Request
            </a>

            <a
              href="/traveler/settings?panel=assistant&topic=payment"
              style={{
                minHeight: 44,
                borderRadius: 16,
                background: "#EAFBFA",
                color: "#047D8A",
                WebkitTextFillColor: "#047D8A",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "0 10px",
                fontSize: 11.2,
                lineHeight: 1.1,
                fontWeight: 950,
                border: "1px solid rgba(5,150,165,0.18)",
                boxSizing: "border-box",
              }}
            >
              Ask Kuya Tala™
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}




const ISLAND_HOPPING_TEMPLATE_OSP = {
  navy: "#013863",
  deepNavy: "#003B66",
  teal: "#0596A5",
  gold: "#F3AE26",
  goldSoft: "#FFF4D8",
  white: "#FFFFFF",
  mist: "#EAFBFA",
  mistSoft: "#F4FCFA",
  slate: "#50668B",
  line: "rgba(1,56,99,0.12)",
};


const islandHoppingDcsTruth = {
  trailSlug: "island-hopping",
  officialTrail: "Island Hopping",
  routeProductMapping: "Tri-Island Joiner fulfills Island Hopping Passport Trail",
  departureControl: true,
  dcsLinked: true,
  routeType: "GL_TRI_ISLAND_STANDARD",
  routeCode: "gl-tri-island-standard",
  defaultRouteProduct: "tri-island-joiner",
  tripNo: "GL-ISL-01",
  departurePort: "GENERAL_LUNA_PORT",
  departurePortLabel: "General Luna Port",
  movementLayer: "OSP_QR_COMPLIANCE_MOVEMENT",
  voucherRequired: true,
  onlineBoardingRequired: true,
  boardingQrRequired: true,
  manifestRequired: true,
  movementRecordRequired: true,
  paymentTiming: "PAY_AFTER_ROUTE_READINESS",
  fulfillment: "BOAT_GUIDE_OPERATOR_ASSIGNMENT",
  publicSrpMode: "COMMISSION_INCLUSIVE_PUBLIC_SRP",
} as const;

function islandHoppingDcsParams(extra: Record<string, string> = {}) {
  const params = new URLSearchParams({
    intent: "island-hopping-request",
    trail: islandHoppingDcsTruth.trailSlug,
    officialTrail: islandHoppingDcsTruth.officialTrail,
    routeType: islandHoppingDcsTruth.routeType,
    routeCode: islandHoppingDcsTruth.routeCode,
    routeProduct: islandHoppingDcsTruth.defaultRouteProduct,
    tripNo: islandHoppingDcsTruth.tripNo,
    departurePort: islandHoppingDcsTruth.departurePort,
    routeReadiness: "required",
    departureReadiness: "required",
    boardingFlow: "online",
    voucher: "required",
    onlineBoarding: "required",
    boardingQr: "required",
    manifest: "required",
    movementRecord: "required",
    paymentTiming: "after-route-readiness",
    fulfillment: "boat-guide-operator-assignment",
    ...extra,
  });

  return `/traveler/passport-trails/island-hopping/book?${params.toString()}`;
}

const islandHoppingBookingBaseUrl = islandHoppingDcsParams();

const islandHoppingAvailabilityUrl = islandHoppingDcsParams({
  step: "availability",
  product: "tri-island-joiner",
});

const islandHoppingDateUrl = islandHoppingDcsParams({
  step: "date",
  product: "tri-island-joiner",
});

const islandHoppingPaxUrl = islandHoppingDcsParams({
  step: "pax",
  product: "tri-island-joiner",
});


const officialDcsTrailFlowConfig = {
  "island-hopping": {
    trailSlug: "island-hopping",
    officialTrail: "Island Hopping",
    dcsMode: "CONFIRMED_SEAT_FLOW",
    operationalStatus: "BOOKABLE",
    routeType: "GL_TRI_ISLAND_STANDARD",
    routeCode: "gl-tri-island-standard",
    routeProduct: "tri-island-joiner",
    departurePort: "GENERAL_LUNA_PORT",
    focus: "tri-island",
    tripNo: "GL-ISL-01",
    paymentTiming: "after-route-readiness",
    fulfillment: "boat-guide-operator-assignment",
    primaryCtaLabel: "Start Island Hopping Booking",
    bookingStep: "availability",
    pricingMode: "per-head",
    routeReadiness: "required",
    departureReadiness: "required",
    boardingFlow: "online",
    voucher: "required",
    onlineBoarding: "required",
    boardingQr: "required",
    manifest: "required",
    movementRecord: "required",
  },
  "sugba-lagoon": {
    trailSlug: "sugba-lagoon",
    officialTrail: "Sugba Lagoon",
    dcsMode: "CONFIRMED_SEAT_FLOW",
    operationalStatus: "SEAT_CONFIRMATION_READY",
    routeType: "DEL_CARMEN_SUGBA_LAGOON",
    routeCode: "del-carmen-sugba-lagoon",
    routeProduct: "sugba-lagoon-seat",
    departurePort: "DEL_CARMEN_PORT",
    focus: "sugba-lagoon",
    tripNo: "DC-SUGBA-01",
    paymentTiming: "after-route-readiness",
    fulfillment: "boat-guide-operator-assignment",
    primaryCtaLabel: "Start Sugba Lagoon Seat Confirmation",
    bookingStep: "seat-confirmation",
    pricingMode: "route-product-plus-entrance-fees",
    routeReadiness: "required",
    departureReadiness: "required",
    boardingFlow: "online",
    voucher: "required",
    onlineBoarding: "required",
    boardingQr: "required",
    manifest: "required",
    movementRecord: "required",
  },
  "bucas-grande-sohoton": {
    trailSlug: "bucas-grande-sohoton",
    officialTrail: "Bucas Grande / Sohoton",
    dcsMode: "REQUEST_TO_CONFIRM_FLOW",
    operationalStatus: "ROUTE_CONFIRMATION_REQUIRED",
    routeType: "DAPA_BUCAS_GRANDE_SOHOTON",
    routeCode: "dapa-bucas-grande-sohoton",
    routeProduct: "sohoton-bucas-grande-route",
    departurePort: "DAPA_PORT",
    focus: "bucas-grande-sohoton",
    tripNo: "DAPA-SOHOTON-01",
    paymentTiming: "after-admin-or-operator-confirmation",
    fulfillment: "operator-confirmation-required",
    primaryCtaLabel: "Start Sohoton Seat Confirmation",
    bookingStep: "route-confirmation",
    pricingMode: "admin-confirmed-price",
    routeReadiness: "required",
    departureReadiness: "required",
    boardingFlow: "online",
    voucher: "required-after-confirmation",
    onlineBoarding: "required-after-confirmation",
    boardingQr: "required-after-confirmation",
    manifest: "required-after-confirmation",
    movementRecord: "required-after-confirmation",
  },
} as const;

type OfficialDcsTrailSlug = keyof typeof officialDcsTrailFlowConfig;

function getOfficialDcsTrailFlowConfig(trailSlug: string) {
  return officialDcsTrailFlowConfig[trailSlug as OfficialDcsTrailSlug] || null;
}

function buildOfficialDcsTrailBookingHref(trailSlug: OfficialDcsTrailSlug) {
  const flow = officialDcsTrailFlowConfig[trailSlug];
  const params = new URLSearchParams({
    intent: `${flow.trailSlug}-request`,
    trail: flow.trailSlug,
    officialTrail: flow.officialTrail,
    routeType: flow.routeType,
    routeCode: flow.routeCode,
    routeProduct: flow.routeProduct,
    tripNo: flow.tripNo,
    departurePort: flow.departurePort,
    routeReadiness: flow.routeReadiness,
    departureReadiness: flow.departureReadiness,
    boardingFlow: flow.boardingFlow,
    voucher: flow.voucher,
    onlineBoarding: flow.onlineBoarding,
    boardingQr: flow.boardingQr,
    manifest: flow.manifest,
    movementRecord: flow.movementRecord,
    paymentTiming: flow.paymentTiming,
    fulfillment: flow.fulfillment,
    step: flow.bookingStep,
    product: flow.routeProduct,
  });

  if (flow.trailSlug === "island-hopping") {
    return `/traveler/passport-trails/island-hopping/book?${params.toString()}`;
  }

  if (flow.trailSlug === "sugba-lagoon") {
    return `/traveler/passport-trails/sugba-lagoon/book?${params.toString()}`;
  }

  if (flow.trailSlug === "bucas-grande-sohoton") {
    return `/traveler/passport-trails/bucas-grande-sohoton/book?${params.toString()}`;
  }

  return `/traveler/passport-trails?${params.toString()}`;
}


// OSP_DCS_PREMIUM_DETAIL_COMPONENT_START
function OfficialDcsPremiumTrailDetail({
  flow,
}: {
  flow: (typeof officialDcsTrailFlowConfig)[OfficialDcsTrailSlug];
}) {
  const isSugba = flow.trailSlug === "sugba-lagoon";
  const ctaHref = buildOfficialDcsTrailBookingHref(flow.trailSlug);

  const OSP = {
    navy: "#013863",
    deepNavy: "#003B66",
    teal: "#0596A5",
    gold: "#F3AE26",
    white: "#FFFFFF",
    mist: "#EAFBFA",
    mistSoft: "#F4FCFA",
    slate: "#50668B",
    line: "rgba(1,56,99,0.12)",
  };

  const content = isSugba
    ? {
        eyebrow: "PASSPORT TRAILS™ · DEL CARMEN",
        title: "Sugba Lagoon Island Hopping",
        subtitle:
          "A calm Del Carmen lagoon escape shaped by turquoise water, limestone scenery, and soft island adventure.",
        mediaTitle: "Sugba Lagoon route preview",
        mediaBody:
          "Lagoon views, sandbar scenes, Del Carmen access, and approved operator media appear here once enabled.",
        descriptionTitle: "Description",
        description:
          "Glide into one of Siargao’s most iconic lagoon landscapes — quiet water, mangrove edges, sandbar options, and a scenic Del Carmen route designed for a full island-day experience.",
        features: [
          "Turquoise lagoon scenery",
          "Del Carmen access route",
          "Kawhagan / Pamomoan options",
          "Mangrove-side journey",
          "Boodle lunch package context",
          "Pickup from GL / Poblacion",
        ],
        bookingSteps: [
          ["01", "Choose route", "A, B, or B+."],
          ["02", "Confirm pickup", "GL / Poblacion zone first."],
          ["03", "Review total", "Route price + ₱100 entrance."],
          ["04", "Continue checkout", "Payment opens after route readiness."],
        ],
        guideTitle: "Guide / Support Logic",
        guideBody:
          "Boat support, guide handling, lunch, cottages, docking, and environmental fees follow the selected Sugba product. Add-ons stay package-specific.",
        routeFacts: [
          ["Route A", "₱2,750"],
          ["Route B", "₱3,300"],
          ["Route B+", "₱3,650"],
          ["Pickup", "GL / Poblacion"],
        ],
        ctaLabel: "Start Sugba Lagoon Booking",
      }
    : {
        eyebrow: "PASSPORT TRAILS™ · DAPA-SIDE",
        title: "Bucas Grande / Sohoton Official Trail",
        subtitle:
          "A reserved governed route for future Dapa-side confirmation, operator readiness, and protected access.",
        mediaTitle: "Bucas Grande / Sohoton route preview",
        mediaBody:
          "Future-ready route context only. This route must not unlock instant booking until official pricing, capacity, and operator readiness are confirmed.",
        descriptionTitle: "Description",
        description:
          "Sail beyond Siargao into Bucas Grande’s world-class water landscape — Sohoton Cove, cave passages, jellyfish sanctuary waters, quiet lakes, and limestone scenery built for a full-day island adventure.",
        features: [
          "Sohoton Cove passage",
          "Hagukan cave glow",
          "Magkukuob cliff exit",
          "Jellyfish sanctuary waters",
          "Tiktikan Lake scenery",
          "Crystal Cave stop",
        ],
        bookingSteps: [
          ["01", "Request route confirmation", "Submit preferred timing and pax."],
          ["02", "Operator/admin review", "Confirm route, availability, and official price."],
          ["03", "Payment later", "Checkout should unlock only after confirmation."],
        ],
        guideTitle: "Guide / Support Logic",
        guideBody:
          "Guide, vessel, timing, and route readiness must be confirmed before payment. This page must remain future-ready, not fake-bookable.",
        routeFacts: [
          ["Route type", "DAPA BUCAS GRANDE SOHOTON"],
          ["Port", "DAPA PORT"],
          ["Pricing", "Request to confirm"],
          ["Status", "Future-ready"],
        ],
        ctaLabel: "Start Sohoton Seat Confirmation",
      };

  const cardStyle = {
    background: "rgba(255,255,255,0.96)",
    border: `1px solid ${OSP.line}`,
    borderRadius: 28,
    boxShadow: "0 18px 50px rgba(1,56,99,0.08)",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 0% 0%, rgba(5,150,165,0.10), transparent 32%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 52%, #EAFBFA 100%)",
        color: OSP.navy,
        padding: "14px 14px 128px",
        fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif',
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div>
            <div
              style={{
                color: OSP.teal,
                fontSize: 10.5,
                fontWeight: 900,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
              }}
            >
              {content.eyebrow}
            </div>
            <h1
              style={{
                margin: "6px 0 0",
                color: OSP.deepNavy,
                fontSize: 25,
                lineHeight: 1.02,
                fontWeight: 760,
                letterSpacing: "-0.045em",
              }}
            >
              {content.title}
            </h1>
          </div>

          <Link
            href="/traveler/passport-trails"
            style={{
              textDecoration: "none",
              border: `1px solid ${OSP.line}`,
              borderRadius: 999,
              background: "rgba(255,255,255,0.92)",
              color: OSP.teal,
              padding: "10px 13px",
              fontSize: 11.5,
              fontWeight: 850,
              whiteSpace: "nowrap",
            }}
          >
            Trails
          </Link>
        </header>

        {/* Media */}
        <section
          aria-label="Sugba Lagoon media"
          style={{
            ...cardStyle,
            overflow: "hidden",
            background: "#F4FCFA",
            color: OSP.deepNavy,
          }}
        >
          <div
            style={{
              padding: 12,
              display: "grid",
              gap: 9,
            }}
          >
            <div
              aria-label="Main video placeholder"
              style={{
                minHeight: 212,
                borderRadius: 24,
                padding: 16,
                display: "grid",
                alignContent: "space-between",
                background:
                  "linear-gradient(180deg, #FFFFFF 0%, #EAFBFA 100%)",
                border: "1px solid rgba(1,56,99,0.10)",
                boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: 8,
                    borderRadius: 999,
                    padding: "7px 10px",
                    background: "#FFFFFF",
                    border: "1px solid rgba(5,150,165,0.18)",
                    color: OSP.teal,
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Main video
                </div>

                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    background: "#F3AE26",
                    color: OSP.deepNavy,
                    fontSize: 15,
                    fontWeight: 950,
                    boxShadow: "0 10px 24px rgba(243,174,38,0.24)",
                  }}
                >
                  ▶
                </div>
              </div>

              <div>
                <h2
                  style={{
                    margin: 0,
                    color: OSP.deepNavy,
                    fontSize: 26,
                    lineHeight: 1,
                    fontWeight: 760,
                    letterSpacing: "-0.045em",
                  }}
                >
                  {content.mediaTitle}
                </h2>
                <p
                  style={{
                    margin: "8px 0 0",
                    color: OSP.slate,
                    fontSize: 13.2,
                    lineHeight: 1.34,
                    maxWidth: 320,
                  }}
                >
                  
                </p>
              </div>
            </div>

            <div
              aria-label="Compact photo placeholders"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
              }}
            >
              {[
                ["Photo 01", isSugba ? "Access" : "Route"],
                ["Photo 02", isSugba ? "Lagoon" : "Operator"],
                ["Photo 03", isSugba ? "Support" : "Access"],
              ].map(([label, caption]) => (
                <div
                  key={label}
                  style={{
                    minHeight: 78,
                    borderRadius: 17,
                    padding: 9,
                    display: "grid",
                    alignContent: "space-between",
                    background: "#FFFFFF",
                    border: "1px solid rgba(1,56,99,0.10)",
                    boxShadow: "0 10px 24px rgba(1,56,99,0.06)",
                  }}
                >
                  <span
                    style={{
                      color: OSP.teal,
                      fontSize: 8.6,
                      fontWeight: 900,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      color: OSP.deepNavy,
                      fontSize: 11.2,
                      lineHeight: 1.05,
                      fontWeight: 850,
                    }}
                  >
                    {caption}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Description */}
        <section style={{ ...cardStyle, marginTop: 14, padding: 18 }}>
          <div
            style={{
              color: OSP.teal,
              fontSize: 10.5,
              fontWeight: 900,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
            }}
          >
            {content.descriptionTitle}
          </div>
          <p
            style={{
              margin: "9px 0 0",
              color: OSP.slate,
              fontSize: 14.5,
              lineHeight: 1.52,
            }}
          >
            {content.description}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginTop: 15,
            }}
          >
            {content.routeFacts.map(([label, value]) => (
              <div
                key={label}
                style={{
                  borderRadius: 18,
                  padding: 12,
                  background: OSP.mistSoft,
                  border: `1px solid ${OSP.line}`,
                }}
              >
                <div
                  style={{
                    color: OSP.slate,
                    fontSize: 9.5,
                    lineHeight: 1,
                    fontWeight: 850,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    color: OSP.deepNavy,
                    fontSize: 12.3,
                    lineHeight: 1.16,
                    fontWeight: 900,
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section style={{ ...cardStyle, marginTop: 14, padding: 18 }}>
          <div
            style={{
              color: OSP.teal,
              fontSize: 10.5,
              fontWeight: 900,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
            }}
          >
            Features
          </div>
          <div style={{ display: "grid", gap: 9, marginTop: 12 }}>
            {content.features.map((feature) => (
              <div
                key={feature}
                style={{
                  display: "grid",
                  gridTemplateColumns: "26px 1fr",
                  gap: 10,
                  alignItems: "center",
                  borderRadius: 18,
                  padding: 11,
                  background: "rgba(234,251,250,0.72)",
                  border: `1px solid ${OSP.line}`,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 26,
                    height: 26,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 999,
                    background: OSP.gold,
                    color: OSP.deepNavy,
                    fontSize: 12,
                    fontWeight: 950,
                  }}
                >
                  ✓
                </span>
                <span style={{ color: OSP.deepNavy, fontSize: 13.5, fontWeight: 820 }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Booking Flow */}
        <section style={{ ...cardStyle, marginTop: 14, padding: 18 }}>
          <div
            style={{
              color: OSP.teal,
              fontSize: 10.5,
              fontWeight: 900,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
            }}
          >
            Booking Flow
          </div>
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            {content.bookingSteps.map(([step, title, body]) => (
              <div
                key={step}
                style={{
                  display: "grid",
                  gridTemplateColumns: "36px 1fr",
                  gap: 11,
                  alignItems: "start",
                  padding: 12,
                  borderRadius: 19,
                  background: "#FFFFFF",
                  border: `1px solid ${OSP.line}`,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 14,
                    display: "grid",
                    placeItems: "center",
                    background: OSP.mist,
                    color: OSP.teal,
                    fontSize: 12,
                    fontWeight: 950,
                  }}
                >
                  {step}
                </div>
                <div>
                  <div style={{ color: OSP.deepNavy, fontSize: 14, fontWeight: 900 }}>
                    {title}
                  </div>
                  <p
                    style={{
                      margin: "4px 0 0",
                      color: OSP.slate,
                      fontSize: 12.8,
                      lineHeight: 1.38,
                    }}
                  >
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Guide / Support Logic */}
        <section style={{ ...cardStyle, marginTop: 14, padding: 18 }}>
          <div
            style={{
              color: OSP.teal,
              fontSize: 10.5,
              fontWeight: 900,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
            }}
          >
            {content.guideTitle}
          </div>
          <p
            style={{
              margin: "9px 0 0",
              color: OSP.slate,
              fontSize: 14,
              lineHeight: 1.48,
            }}
          >
            {content.guideBody}
          </p>
        </section>

        {/* Route Readiness CTA */}
        <section
          aria-label="Route readiness CTA"
          style={{
            ...cardStyle,
            marginTop: 14,
            padding: 12,
            display: "grid",
            gap: 10,
            background: "rgba(255,255,255,0.98)",
          }}
        >
          <div style={{ padding: "4px 6px 0" }}>
            <div
              style={{
                color: OSP.slate,
                fontSize: 10.5,
                fontWeight: 850,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Route readiness CTA
            </div>
            <div
              style={{
                marginTop: 5,
                color: OSP.deepNavy,
                fontSize: 15,
                fontWeight: 900,
              }}
            >
              Continue into the governed route flow.
            </div>
          </div>

          <Link
            href={ctaHref}
            style={{
              minHeight: 54,
              borderRadius: 19,
              background: `linear-gradient(135deg, ${OSP.deepNavy}, ${OSP.teal})`,
              color: OSP.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 14.5,
              fontWeight: 900,
              boxShadow: "0 16px 30px rgba(5,150,165,0.22)",
            }}
          >
            {content.ctaLabel}
          </Link>
        </section>

        <div aria-hidden="true" style={{ height: 118 }} />
      </div>

      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
    </main>
  );
}
// OSP_DCS_PREMIUM_DETAIL_COMPONENT_END


const islandHoppingPickupUrl = islandHoppingDcsParams({
  step: "pickup",
  product: "tri-island-joiner",
});

const islandHoppingProductUrl = islandHoppingDcsParams({
  step: "product",
  product: "tri-island-joiner",
});

const islandHoppingMapUrl =
  `/traveler/passport-map?trail=${islandHoppingDcsTruth.trailSlug}&routeType=${islandHoppingDcsTruth.routeType}&routeCode=${islandHoppingDcsTruth.routeCode}&departurePort=${islandHoppingDcsTruth.departurePort}&focus=tri-island`;

const islandHoppingKuyaTalaUrl =
  `/traveler/settings?panel=assistant&topic=island-hopping-booking&trail=${islandHoppingDcsTruth.trailSlug}&routeType=${islandHoppingDcsTruth.routeType}&departurePort=${islandHoppingDcsTruth.departurePort}`;

const islandHoppingInputTargets = {
  Date: islandHoppingDateUrl,
  Pax: islandHoppingPaxUrl,
  Pickup: islandHoppingPickupUrl,
  Product: islandHoppingProductUrl,
  Setup: islandHoppingProductUrl,
};

const islandHoppingProductHref = {
  "Tri-Island Joiner": islandHoppingDcsParams({
    step: "product",
    product: "tri-island-joiner",
    routeProduct: "tri-island-joiner",
    pricingMode: "per-head",
  }),
  "Private Island Route": islandHoppingDcsParams({
    step: "product",
    product: "private-island-route",
    routeProduct: "private-island-route",
    pricingMode: "pax-tiered",
  }),
  "Premium Private": islandHoppingDcsParams({
    step: "product",
    product: "premium-private",
    routeProduct: "premium-private",
    pricingMode: "pax-tiered-premium",
  }),
  "VVIP Party Boat": islandHoppingDcsParams({
    step: "product",
    product: "vvip-party-boat",
    routeProduct: "vvip-party-boat",
    pricingMode: "flat-package",
  }),
};

const islandHoppingStopMapHref = {
  "Naked Island": `${islandHoppingMapUrl}&stop=naked-island&movement=trail-stop`,
  "Daku Island": `${islandHoppingMapUrl}&stop=daku-island&movement=trail-stop`,
  "Guyam Island": `${islandHoppingMapUrl}&stop=guyam-island&movement=trail-stop`,
};



const islandHoppingMedia = [
  { label: "Boat route", hint: "Video slot" },
  { label: "Daku lunch", hint: "Photo" },
  { label: "Sandbar", hint: "Photo" },
];

const islandHoppingConfidence = [
  { label: "Route-ready", value: "GL Tri-Island" },
  { label: "Voucher", value: "After booking" },
  { label: "Support", value: "Boarding help" },
];

const islandHoppingProducts = [
  {
    title: "Tri-Island Joiner",
    cta: "Choose Joiner Seat",
    price: "From ₱1,500",
    meta: "Per traveler",
    note: "Shared island-hopping slot.",
    badge: "Best start",
  },
  {
    title: "Private Island Route",
    cta: "Choose Private Boat",
    price: "Pax-tiered",
    meta: "Private boat",
    note: "Price adjusts by group size.",
    badge: "Flexible",
  },
  {
    title: "Premium Private",
    cta: "View Premium Setup",
    price: "From ₱2,000",
    meta: "10+ pax rate",
    note: "Richer food route option.",
    badge: "Upgrade",
  },
  {
    title: "VVIP Party Boat",
    cta: "View VVIP Package",
    price: "₱60,000",
    meta: "Flat package",
    note: "Private premium island day.",
    badge: "VVIP",
  },
];

const islandHoppingReasons = [
  { title: "Classic island route", note: "Guyam, Naked, Daku, plus Secret Island when tide allows." },
  { title: "Easy tour day", note: "Typical 9 AM–4 PM island schedule." },
  { title: "Pickup support", note: "Poblacion / General Luna pickup boundary shown clearly." },
  { title: "Commercial package ready", note: "Joiner, private, premium, and VVIP can be sold cleanly." },
];

const islandHoppingInclusions = [
  "Boat",
  "Guide",
  "Drone shots",
  "Entrance fees",
  "Boodle fight lunch",
  "Cottages",
  "Docking fees",
  "Environmental fees",
  "GL pickup",
];

const islandHoppingExclusions = [
  "Snorkels not included",
  "Paddle boards not included",
  "Outside GL pickup may add charge",
];

const islandHoppingBookingInputs = [
  { label: "Date", value: "Choose on next step", icon: "📅" },
  { label: "Pax", value: "Set during booking", icon: "👥" },
  { label: "Pickup", value: "General Luna", icon: "📍" },
  { label: "Setup", value: "Joiner / Private", icon: "🛥️" },
];


const islandHoppingStops = [
  {
    name: "Naked Island",
    tag: "Sandbar",
    time: "Morning stop",
    note: "Open sandbar photo stop. Secret Island can be added when tide allows.",
  },
  {
    name: "Daku Island",
    tag: "Lunch stop",
    time: "Midday stop",
    note: "Main beach stop for boodle fight lunch, cottage time, and rest.",
  },
  {
    name: "Guyam Island",
    tag: "Final island",
    time: "Afternoon stop",
    note: "Compact island stop before return to General Luna.",
  },
];

const islandHoppingOtherTrails = [
  { title: "Corregidor + Tri-Island", href: "/traveler/partner-tours?focus=corregidor-tri-island", note: "Extended island route" },
  { title: "Sugba Lagoon", href: "/traveler/passport-trails/sugba-lagoon", note: "Lagoon route" },
];

function IslandHoppingCommercialTemplate() {
  const OSP = ISLAND_HOPPING_TEMPLATE_OSP;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% -10%, rgba(5,150,165,0.13), transparent 34%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 42%, #F4FCFA 100%)",
        color: OSP.navy,
        padding: "12px 14px calc(126px + env(safe-area-inset-bottom))",
      }}
    >
      <div style={{ width: "100%", maxWidth: 390, margin: "0 auto" }}>
        <header
          aria-label="Island Hopping media detail"
          style={{
            borderRadius: 30,
            padding: 10,
            background: "#FFFFFF",
            border: `1px solid ${OSP.line}`,
            boxShadow: "0 18px 44px rgba(1,56,99,0.10)",
          }}
        >
          <div
            style={{
              height: 238,
              borderRadius: 24,
              overflow: "hidden",
              position: "relative",
              background:
                "linear-gradient(145deg, rgba(1,56,99,0.88), rgba(5,150,165,0.66)), url('/osp/spm/maps/osp-spm-passport-map-preview-v1.png') center/cover",
              border: "1px solid rgba(255,255,255,0.56)",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(1,56,99,0.02), rgba(1,56,99,0.66))",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: 11,
                left: 11,
                right: 11,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <a
                href="/traveler/passport-trails"
                aria-label="Back to Passport Trails"
                style={{
                  width: 39,
                  height: 39,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.94)",
                  color: OSP.navy,
                  display: "grid",
                  placeItems: "center",
                  textDecoration: "none",
                  fontSize: 23,
                  fontWeight: 900,
                  boxShadow: "0 10px 22px rgba(1,56,99,0.16)",
                }}
              >
                ‹
              </a>

              <div style={{ display: "flex", gap: 7 }}>
                <span
                  style={{
                    minHeight: 39,
                    borderRadius: 999,
                    padding: "0 13px",
                    background: "rgba(255,255,255,0.94)",
                    color: OSP.navy,
                    display: "inline-flex",
                    alignItems: "center",
                    fontSize: 11.5,
                    fontWeight: 900,
                    boxShadow: "0 10px 22px rgba(1,56,99,0.14)",
                  }}
                >
                  PHP
                </span>
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                left: 12,
                right: 12,
                bottom: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    borderRadius: 999,
                    padding: "6px 9px",
                    background: "rgba(255,255,255,0.93)",
                    color: OSP.navy,
                    fontSize: 9,
                    lineHeight: 1,
                    fontWeight: 900,
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                  }}
                >
                  <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: "50%", background: OSP.gold }} />
                  Official Trail
                </span>

                <span
                  style={{
                    borderRadius: 999,
                    padding: "6px 9px",
                    background: OSP.gold,
                    color: OSP.navy,
                    fontSize: 9.5,
                    lineHeight: 1,
                    fontWeight: 900,
                  }}
                >
                  Route coordination
                </span>
              </div>

              <h1
                style={{
                  margin: "10px 0 0",
                  color: "#FFFFFF",
                  fontSize: 31,
                  lineHeight: 0.96,
                  letterSpacing: "-0.058em",
                  fontWeight: 900,
                  textShadow: "0 8px 22px rgba(1,56,99,0.34)",
                }}
              >
                Island Hopping
              </h1>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "rgba(255,255,255,0.86)",
                  fontSize: 11.8,
                  lineHeight: 1.2,
                  fontWeight: 740,
                  maxWidth: 286,
                }}
              >
                Tri-Island packages mapped to the official Passport Trail.
              </p>
            </div>

            <div
              aria-label="Video preview placeholder"
              style={{
                position: "absolute",
                right: 12,
                bottom: 12,
                borderRadius: 13,
                padding: "7px 9px",
                background: "rgba(1,56,99,0.80)",
                color: "#FFFFFF",
                fontSize: 10,
                lineHeight: 1,
                fontWeight: 850,
              }}
            >
              ▶ Video
            </div>
          </div>

          <div
            aria-label="Photo preview strip"
            style={{
              marginTop: 9,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 7,
            }}
          >
            {islandHoppingMedia.map((item) => (
              <div
                key={item.label}
                style={{
                  minHeight: 56,
                  borderRadius: 17,
                  background:
                    "linear-gradient(145deg, rgba(5,150,165,0.17), rgba(243,174,38,0.12))",
                  border: "1px solid rgba(1,56,99,0.08)",
                  padding: 8,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: OSP.slate, fontSize: 8.5, fontWeight: 850, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {item.hint}
                </span>
                <strong style={{ color: OSP.navy, fontSize: 10.6, lineHeight: 1, fontWeight: 880 }}>
                  {item.label}
                </strong>
              </div>
            ))}
          </div>
        </header>

        <section
          aria-label="Island Hopping quick summary"
          style={{
            marginTop: 12,
            borderRadius: 28,
            padding: 13,
            background: "#FFFFFF",
            border: `1px solid ${OSP.line}`,
            boxShadow: "0 16px 38px rgba(1,56,99,0.09)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {islandHoppingBookingInputs.map((item) => (
              <div
                key={item.label}
                style={{
                  minHeight: 56,
                  borderRadius: 18,
                  background: OSP.mistSoft,
                  border: "1px solid rgba(5,150,165,0.12)",
                  color: OSP.navy,
                  textDecoration: "none",
                  display: "grid",
                  gridTemplateColumns: "26px 1fr",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 10px",
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>{item.icon}</span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", color: OSP.slate, fontSize: 8.6, fontWeight: 820, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {item.label}
                  </span>
                  <strong style={{ display: "block", marginTop: 4, color: OSP.navy, fontSize: 11.5, lineHeight: 1, fontWeight: 880 }}>
                    {item.value}
                  </strong>
                </span>
              </div>
            ))}
          </div>

          <a
            href={islandHoppingAvailabilityUrl}
            style={{
              marginTop: 10,
              minHeight: 50,
              borderRadius: 18,
              background: OSP.navy,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 13.4,
              fontWeight: 920,
            }}
          >
            Start Island Hopping Booking
          </a>
        </section>

        <section
          aria-label="Island Hopping confidence"
          style={{
            marginTop: 10,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 7,
          }}
        >
          {islandHoppingConfidence.map((item) => (
            <div
              key={item.label}
              style={{
                minHeight: 52,
                borderRadius: 17,
                padding: "9px 8px",
                background: "#FFFFFF",
                border: "1px solid rgba(1,56,99,0.08)",
                boxShadow: "0 10px 22px rgba(1,56,99,0.055)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <span
                style={{
                  color: "#50668B",
                  fontSize: 8.2,
                  lineHeight: 1,
                  fontWeight: 860,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </span>
              <strong
                style={{
                  color: "#013863",
                  fontSize: 10.6,
                  lineHeight: 1,
                  fontWeight: 900,
                  letterSpacing: "-0.01em",
                }}
              >
                {item.value}
              </strong>
            </div>
          ))}
        </section>


        <section
          aria-label="Trail stops compact"
          style={{
            marginTop: 12,
            borderRadius: 26,
            padding: 14,
            background: "#FFFFFF",
            border: `1px solid ${OSP.line}`,
            boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
          }}
        >
          <div style={{ color: OSP.teal, fontSize: 9.4, lineHeight: 1, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Trail stops
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 9 }}>
            {islandHoppingStops.map((stop, index) => (
              <div
                key={stop.name}
                style={{
                  display: "grid",
                  textDecoration: "none",
                  cursor: "default",
                  gridTemplateColumns: "48px 1fr",
                  gap: 10,
                  alignItems: "center",
                  minHeight: 74,
                  borderRadius: 21,
                  padding: "10px",
                  background: index === 1 ? OSP.goldSoft : OSP.mistSoft,
                  border: index === 1 ? "1px solid rgba(243,174,38,0.24)" : "1px solid rgba(5,150,165,0.12)",
                }}
              >
                <span
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 18,
                    background: "#FFFFFF",
                    color: OSP.navy,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                    fontWeight: 900,
                    boxShadow: "0 8px 18px rgba(1,56,99,0.06)",
                  }}
                >
                  {index + 1}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "inline-flex", marginBottom: 5, borderRadius: 999, padding: "4px 7px", background: "#FFFFFF", color: OSP.slate, fontSize: 8.4, fontWeight: 840 }}>
                    {stop.tag} · {stop.time}
                  </span>
                  <strong style={{ display: "block", color: OSP.navy, fontSize: 13.4, lineHeight: 1, fontWeight: 890 }}>
                    {stop.name}
                  </strong>
                  <span style={{ display: "block", marginTop: 5, color: OSP.slate, fontSize: 10.2, lineHeight: 1.18, fontWeight: 700 }}>
                    {stop.note}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>
<section
          aria-label="Tour product options"
          style={{
            marginTop: 12,
            borderRadius: 26,
            padding: 12,
            background: "#FFFFFF",
            border: `1px solid ${OSP.line}`,
            boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
          }}
        >
          <div style={{ color: OSP.teal, fontSize: 9.4, lineHeight: 1, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Choose route setup
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            {islandHoppingProducts.map((product, index) => (
              <a
                key={product.title}
                href={islandHoppingProductHref[product.title as keyof typeof islandHoppingProductHref]}
                style={{
                  minHeight: 68,
                  borderRadius: 20,
                  padding: 10,
                  background: index === 0 ? OSP.goldSoft : OSP.mistSoft,
                  border: index === 0 ? "1px solid rgba(243,174,38,0.26)" : "1px solid rgba(5,150,165,0.12)",
                  color: OSP.navy,
                  textDecoration: "none",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ minWidth: 0 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      borderRadius: 999,
                      padding: "4px 7px",
                      background: "#FFFFFF",
                      color: OSP.slate,
                      fontSize: 8.2,
                      fontWeight: 850,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    {product.badge}
                  </span>
                  <strong style={{ display: "block", marginTop: 7, color: OSP.navy, fontSize: 13.4, lineHeight: 1, fontWeight: 890 }}>
                    {product.title}
                  </strong>
                  <span style={{ display: "block", marginTop: 5, color: OSP.slate, fontSize: 10.2, lineHeight: 1.15, fontWeight: 700 }}>
                    {product.note}
                  </span>

                  <span
                    style={{
                      display: "inline-flex",
                      marginTop: 9,
                      borderRadius: 999,
                      padding: "7px 9px",
                      background: "#013863",
                      color: "#FFFFFF",
                      fontSize: 9.8,
                      lineHeight: 1,
                      fontWeight: 900,
                    }}
                  >
                    {product.cta}
                  </span>
                </span>

                <span style={{ textAlign: "right", flexShrink: 0 }}>
                  <strong style={{ display: "block", color: OSP.navy, fontSize: 14.4, lineHeight: 1, fontWeight: 930 }}>
                    {product.price}
                  </strong>
                  <span style={{ display: "block", marginTop: 5, color: OSP.slate, fontSize: 9.2, lineHeight: 1, fontWeight: 740 }}>
                    {product.meta}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </section>

        <section
          aria-label="Route description"
          style={{
            marginTop: 12,
            borderRadius: 26,
            padding: 14,
            background: "#FFFFFF",
            border: `1px solid ${OSP.line}`,
            boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
          }}
        >
          <h2 style={{ margin: 0, color: OSP.navy, fontSize: 19, lineHeight: 1, letterSpacing: "-0.04em", fontWeight: 880 }}>
            Classic General Luna island route.
          </h2>
          <p style={{ margin: "7px 0 0", color: OSP.slate, fontSize: 12.2, lineHeight: 1.36, fontWeight: 710 }}>
            This official trail is fulfilled by commercial tour offers such as joiner, private, premium private, and VVIP island-hopping packages.
          </p>
        </section>

        <section
          aria-label="Features and highlights"
          style={{
            marginTop: 12,
            borderRadius: 26,
            padding: 12,
            background: "#FFFFFF",
            border: `1px solid ${OSP.line}`,
            boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
          }}
        >
          <div style={{ color: OSP.teal, fontSize: 9.4, lineHeight: 1, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Top reasons
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 9 }}>
            {islandHoppingReasons.map((item, index) => (
              <div key={item.title} style={{ display: "grid", gridTemplateColumns: "38px 1fr", gap: 10, alignItems: "center" }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 16,
                    background: index === 0 ? OSP.goldSoft : OSP.mist,
                    color: OSP.navy,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 16,
                    fontWeight: 900,
                  }}
                >
                  {index + 1}
                </span>
                <span>
                  <strong style={{ display: "block", color: OSP.navy, fontSize: 13, lineHeight: 1.05, fontWeight: 880 }}>
                    {item.title}
                  </strong>
                  <span style={{ display: "block", marginTop: 4, color: OSP.slate, fontSize: 10.6, lineHeight: 1.12, fontWeight: 700 }}>
                    {item.note}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label="Inclusions and exclusions"
          style={{
            marginTop: 12,
            borderRadius: 26,
            padding: 14,
            background: "#FFFFFF",
            border: `1px solid ${OSP.line}`,
            boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
          }}
        >
          <div style={{ color: OSP.teal, fontSize: 9.4, lineHeight: 1, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Included support
          </div>

          <div style={{ marginTop: 11, display: "flex", flexWrap: "wrap", gap: 7 }}>
            {islandHoppingInclusions.map((item) => (
              <span
                key={item}
                style={{
                  borderRadius: 999,
                  padding: "7px 9px",
                  background: OSP.mistSoft,
                  border: "1px solid rgba(5,150,165,0.12)",
                  color: OSP.navy,
                  fontSize: 10,
                  lineHeight: 1,
                  fontWeight: 820,
                }}
              >
                {item}
              </span>
            ))}
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 7 }}>
            {islandHoppingExclusions.map((item) => (
              <div
                key={item}
                style={{
                  borderRadius: 16,
                  padding: "9px 10px",
                  background: OSP.goldSoft,
                  border: "1px solid rgba(243,174,38,0.20)",
                  color: OSP.navy,
                  fontSize: 10.5,
                  lineHeight: 1.15,
                  fontWeight: 760,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label="Guide and support logic"
          style={{
            marginTop: 12,
            borderRadius: 26,
            padding: 14,
            background: "linear-gradient(145deg, #FFFFFF 0%, #FFF8E8 100%)",
            border: "1px solid rgba(243,174,38,0.24)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.07)",
          }}
        >
          <div style={{ color: OSP.teal, fontSize: 9.4, lineHeight: 1, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Guide support
          </div>
          <h2 style={{ margin: "7px 0 0", color: OSP.navy, fontSize: 18.5, lineHeight: 1, letterSpacing: "-0.04em", fontWeight: 880 }}>
            Confirm route conditions first.
          </h2>
          <p style={{ margin: "7px 0 0", color: OSP.slate, fontSize: 11.5, lineHeight: 1.3, fontWeight: 700 }}>
            Local support checks pickup, pax, boat readiness, product type, tide-sensitive stops, and departure timing.
          </p>
        </section>

        

        

        

        <section
          aria-label="Primary commercial action"
          style={{
            marginTop: 12,
            borderRadius: 28,
            padding: 14,
            background: `linear-gradient(145deg, ${OSP.navy} 0%, ${OSP.deepNavy} 100%)`,
            color: "#FFFFFF",
            boxShadow: "0 18px 44px rgba(1,56,99,0.18)",
          }}
        >
          <h2 style={{ margin: 0, color: "#FFFFFF", fontSize: 22, lineHeight: 1, letterSpacing: "-0.045em", fontWeight: 900 }}>
            Start your Island Hopping booking.
          </h2>
          <p style={{ margin: "7px 0 0", color: "rgba(255,255,255,0.76)", fontSize: 11.6, lineHeight: 1.3, fontWeight: 700 }}>
            Select date, pax, pickup, and route setup before checkout.
          </p>

          <a
            href={islandHoppingAvailabilityUrl}
            style={{
              marginTop: 13,
              minHeight: 52,
              borderRadius: 18,
              background: OSP.gold,
              color: OSP.navy,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 930,
            }}
          >
            Start Island Hopping Booking
          </a>
        </section>

        

        <section
          aria-label="Discover other trails"
          style={{
            marginTop: 12,
            borderRadius: 24,
            padding: 12,
            background: "#FFFFFF",
            border: `1px solid ${OSP.line}`,
            boxShadow: "0 12px 28px rgba(1,56,99,0.065)",
          }}
        >
          <div style={{ color: OSP.teal, fontSize: 9.4, lineHeight: 1, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Discover other trails
          </div>

          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {islandHoppingOtherTrails.map((trail) => (
              <a
                key={trail.href}
                href={trail.href}
                style={{
                  minHeight: 54,
                  borderRadius: 17,
                  background: OSP.mist,
                  color: OSP.navy,
                  border: "1px solid rgba(5,150,165,0.12)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  textAlign: "center",
                  gap: 4,
                }}
              >
                <strong style={{ fontSize: 11.3, lineHeight: 1, fontWeight: 880 }}>{trail.title}</strong>
                <span style={{ fontSize: 9.2, lineHeight: 1, fontWeight: 720, color: OSP.slate }}>{trail.note}</span>
              </a>
            ))}
          </div>
        </section>

        <section
          aria-label="Secondary support and map action"
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          <a
            href={islandHoppingMapUrl}
            style={{
              minHeight: 48,
              borderRadius: 17,
              background: OSP.mist,
              color: OSP.navy,
              border: "1px solid rgba(5,150,165,0.13)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 860,
            }}
          >
            View map
          </a>

          <a
            href="/traveler/passport-trails"
            style={{
              minHeight: 48,
              borderRadius: 17,
              background: "#FFFFFF",
              color: OSP.navy,
              border: "1px solid rgba(1,56,99,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 860,
            }}
          >
            All trails
          </a>
        </section>

        <section
          aria-label="Kuya Tala support"
          style={{
            marginTop: 12,
            borderRadius: 24,
            padding: 12,
            background: "linear-gradient(145deg, #FFFFFF 0%, #FFF8E8 100%)",
            border: "1px solid rgba(243,174,38,0.24)",
            boxShadow: "0 12px 28px rgba(1,56,99,0.065)",
          }}
        >
          <div style={{ color: OSP.teal, fontSize: 9.4, lineHeight: 1, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Kuya Tala™
          </div>

          <div style={{ marginTop: 9, display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center" }}>
            <div>
              <div style={{ color: OSP.navy, fontSize: 14.8, lineHeight: 1.05, letterSpacing: "-0.035em", fontWeight: 880 }}>
                Need help before booking?
              </div>
              <div style={{ marginTop: 4, color: OSP.slate, fontSize: 10.2, lineHeight: 1.15, fontWeight: 700 }}>
                Ask about route, product type, pickup, or pax.
              </div>
            </div>

            <a
              href={islandHoppingKuyaTalaUrl}
              style={{
                minHeight: 40,
                borderRadius: 15,
                background: OSP.navy,
                color: "#FFFFFF",
                padding: "0 13px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: 11.5,
                fontWeight: 860,
                whiteSpace: "nowrap",
              }}
            >
              Ask
            </a>
          </div>
        </section>
      </div>

      <div
        aria-label="Island Hopping bottom booking action"
        style={{
          position: "sticky",
          bottom: "calc(96px + env(safe-area-inset-bottom))",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(390px, calc(100vw - 28px))",
          zIndex: 35,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            borderRadius: 24,
            padding: 9,
            background: "rgba(255,255,255,0.94)",
            border: `1px solid ${OSP.line}`,
            boxShadow: "0 18px 44px rgba(1,56,99,0.16)",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 9,
            alignItems: "center",
            pointerEvents: "auto",
          }}
        >
          <div style={{ minWidth: 0, paddingLeft: 5 }}>
            <div style={{ color: OSP.slate, fontSize: 9, lineHeight: 1, fontWeight: 820 }}>
              Island Hopping
            </div>
            <div style={{ marginTop: 4, color: OSP.navy, fontSize: 13, lineHeight: 1, fontWeight: 900 }}>
              From ₱1,500/head
            </div>
          </div>

          <a
            href={islandHoppingAvailabilityUrl}
            style={{
              minHeight: 42,
              borderRadius: 16,
              background: OSP.gold,
              color: OSP.navy,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 16px",
              textDecoration: "none",
              fontSize: 12.2,
              fontWeight: 920,
              whiteSpace: "nowrap",
            }}
          >
            Start Island Hopping Booking
          </a>
        </div>
      </div>

      
    
      <div aria-hidden="true" style={{ height: 148 }} />
      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
    </main>
  );
}



export default function PassportTrailDetailPage({

  params,
}: {
  params: { trailSlug: string };
}) {
  const activeTrailSlug = params.trailSlug;

  if (activeTrailSlug === "sugba-lagoon" || activeTrailSlug === "bucas-grande-sohoton") {
    const officialDcsFlow = getOfficialDcsTrailFlowConfig(activeTrailSlug);

    if (officialDcsFlow) {
      return <OfficialDcsPremiumTrailDetail flow={officialDcsFlow} />;
    }
  }

  if (activeTrailSlug === "island-hopping") {
    return <IslandHoppingCommercialTemplate />;
  }


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
                fontSize: 23,
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

        <OfficialTrailMediaPreview trailSlug={params.trailSlug} trailTitle={trail.title} />

        {params.trailSlug === "siargao-land-tour" ? <LandTourMockupHeroHeader /> : null}

        <OfficialTrailCommercialExposurePanel trailSlug={params.trailSlug} />



        <SpmFunctionalJourneyMap trailSlug={params.trailSlug} />



        {params.trailSlug !== "siargao-land-tour" ? (
          <TrailPaymentGatewayCta trailSlug={params.trailSlug} trailTitle={trail.title} />
        ) : null}

        {isReturnContinuity ? <ReturnContinuityPremiumPanel /> : null}

<div
          style={{
            marginTop: 16,
            display: isReturnContinuity || params.trailSlug === "siargao-land-tour" ? "none" : "block",
          }}
        >
          <ShellCard ariaLabel="Trail verification actions">
            <SectionEyebrow>Stop Verification</SectionEyebrow>
            <h2
              style={{
                margin: "7px 0 8px",
                fontSize: 20,
                lineHeight: 1.08,
                fontWeight: 690,
                letterSpacing: "-0.035em",
              }}
            >
              Use your OSP QR at verified stops.
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
              Show your OSP QR only when a verified partner stop asks for it.
              Stamps appear after partner validation.
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
                  Open My QR
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
                  Show your official OSP QR.
                </div>
              </Link>

              <Link
                href="/traveler/settings?panel=assistant&topic=trail"
                aria-label="Ask about this trail"
                style={{
                  textDecoration: "none",
                  border: "1px solid rgba(191,231,238,0.92)",
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.68)",
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
                  Ask Kuya Tala
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
                  Need help choosing stops?
                </div>
              </Link>
            </div>
          </ShellCard>
        </div>

        <section style={{ marginTop: 18, display: params.trailSlug === "siargao-land-tour" ? "none" : "block" }}>
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
                  : "South or North Tour"}
              </h2>
            </div>
          </div>

          <div style={{ display: "grid", gap: params.trailSlug === "siargao-land-tour" ? 8 : 12 }}>
            {trail.stops.map((stop, index) => {
              const tone = statusTone(stop.status);

              return (
                <article
                  key={stop.name}
                  style={{
                    border: tone.shellBorder,
                    borderRadius: params.trailSlug === "siargao-land-tour" ? 18 : 22,
                    background: tone.shell,
                    padding: params.trailSlug === "siargao-land-tour" ? 10 : 13,
                    boxShadow: tone.glow,
                    position: "relative",
                    overflow: "hidden",
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
                          fontSize: params.trailSlug === "siargao-land-tour" ? 8.2 : 9,
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
                          margin: params.trailSlug === "siargao-land-tour" ? "3px 0 0" : "5px 0 0",
                          fontSize: params.trailSlug === "siargao-land-tour" ? 16.2 : 18,
                          lineHeight: 1.1,
                          fontWeight: 820,
                        }}
                      >
                        {stop.name}
                      </h3>
                    </div>

                    <span
                      style={{
                        display: params.trailSlug === "siargao-land-tour" ? "none" : "inline-flex",
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
                      display: params.trailSlug === "siargao-land-tour" ? "none" : "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        borderRadius: 15,
                        border: "1px solid rgba(191,231,238,0.58)",
                        background: "rgba(255,255,255,0.68)",
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
                        background: "rgba(255,255,255,0.68)",
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
<div style={{ marginTop: 16, display: params.trailSlug === "siargao-land-tour" ? "none" : "block" }}>
          <ShellCard ariaLabel="Passport stamp rules">
            <SectionEyebrow>✦ Stamp Rules</SectionEyebrow>
            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
              {[
                "Stamps come from verified visits.",
                "Stops count after validation.",
                "Use your QR only when a verified stop asks.",
                "",
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

        


      </div>
      <DiscoverOtherPassportTrails currentTrailSlug={params.trailSlug} />

      <PassportMapShortcut
        href="/traveler/settings?panel=assistant&topic=trail"
        eyebrow="Kuya Tala™"
        title="Talk to Kuya Tala"
        body="Ask about route, payment, or next step."
      />
    </main>
  );
}
