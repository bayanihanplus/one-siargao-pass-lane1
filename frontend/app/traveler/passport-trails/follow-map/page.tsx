"use client";

import { useEffect, useState } from "react";
import SpmTravelerBottomTabBar from "../../../../src/components/traveler/SpmTravelerBottomTabBar";

const OSP = {
  navy: "#013863",
  deepNavy: "#003B66",
  teal: "#0596A5",
  tealDark: "#047D8A",
  gold: "#F3AE26",
  mist: "#EAFBFA",
  white: "#FFFFFF",
  slate: "#50668B",
  ink: "#102F57",
};

type MapPin = {
  key: string;
  title: string;
  zone: string;
  description: string;
  x: number;
  y: number;
  href: string;
  status: string;
  routeType: string;
};

const mapPins: MapPin[] = [
  {
    key: "cloud-9",
    title: "Cloud 9",
    zone: "Surf belt",
    description: "Official surf anchor for Surf Explorer. Open the Surf Explorer trail page before following this route.",
    x: 33,
    y: 64,
    href: "/traveler/passport-trails/surf-explorer?pin=cloud-9",
    status: "QR-ready",
    routeType: "Official Trail",
  },
  {
    key: "general-luna",
    title: "General Luna",
    zone: "Tourism core",
    description: "The main traveler base zone and orientation point before selecting an official trail.",
    x: 48,
    y: 73,
    href: "/traveler/passport-trails?zone=general-luna",
    status: "Active zone",
    routeType: "Journey Base",
  },
  {
    key: "island-hopping",
    title: "Island Hopping",
    zone: "Guyam • Daku • Naked Island",
    description: "Follow the official Island Hopping trail page for governed QR stamp and route readiness logic.",
    x: 69,
    y: 78,
    href: "/traveler/passport-trails/island-hopping?pin=island-hopping",
    status: "Live",
    routeType: "Official Trail",
  },
  {
    key: "north-siargao",
    title: "North Siargao",
    zone: "Pacifico • Alegria • Taktak Falls",
    description: "Open the North Siargao trail page to view the official route description and mapped trail nodes.",
    x: 53,
    y: 31,
    href: "/traveler/passport-trails/north-siargao?pin=north-siargao",
    status: "Preview",
    routeType: "Official Trail",
  },
  {
    key: "sugba-lagoon",
    title: "Sugba Lagoon",
    zone: "Adventure route",
    description: "A partner-led adventure route. Continue through partner tour context, not casual self-claiming.",
    x: 22,
    y: 47,
    href: "/traveler/partner-tours?focus=sugba-lagoon-adventure",
    status: "Partner-led",
    routeType: "Partner Tour",
  },
];

const officialTrails = [
  {
    title: "Island Hopping Trail",
    body: "Official island-hopping route with governed QR stamp logic.",
    href: "/traveler/passport-trails/island-hopping",
    status: "Live",
  },
  {
    title: "Surf Explorer Trail",
    body: "Surf-oriented trail anchored by Cloud 9 and surf-side discovery nodes.",
    href: "/traveler/passport-trails/surf-explorer",
    status: "Preview",
  },
  {
    title: "North Siargao Trail",
    body: "North route through Pacifico, Alegria Beach, and Taktak Falls.",
    href: "/traveler/passport-trails/north-siargao",
    status: "Preview",
  },
];

function getInitialPinFromBrowser() {
  if (typeof window === "undefined") return "island-hopping";

  const params = new URLSearchParams(window.location.search);
  const requested = params.get("pin") || params.get("zone") || "island-hopping";
  return mapPins.find((pin) => pin.key === requested)?.key || "island-hopping";
}

function PinButton({
  pin,
  selected,
  onSelect,
}: {
  pin: MapPin;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Select ${pin.title}`}
      style={{
        position: "absolute",
        left: `${pin.x}%`,
        top: `${pin.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: selected ? 8 : 5,
        border: "none",
        background: "transparent",
        padding: 0,
        cursor: "pointer",
      }}
    >
      <span
        style={{
          width: selected ? 30 : 22,
          height: selected ? 30 : 22,
          borderRadius: 999,
          display: "grid",
          placeItems: "center",
          background: selected ? OSP.gold : OSP.teal,
          border: "3px solid rgba(255,255,255,0.96)",
          boxShadow: selected
            ? "0 14px 32px rgba(243,174,38,0.38), 0 0 0 8px rgba(243,174,38,0.15)"
            : "0 10px 24px rgba(1,56,99,0.26)",
          color: "#ffffff",
          fontSize: 11,
          fontWeight: 950,
        }}
      >
        ●
      </span>
    </button>
  );
}

export default function FollowMapPage() {
  const [selectedPinKey, setSelectedPinKey] = useState("island-hopping");
  const [zoom, setZoom] = useState(1.18);

  useEffect(() => {
    setSelectedPinKey(getInitialPinFromBrowser());
  }, []);

  const selectedPin = mapPins.find((pin) => pin.key === selectedPinKey) || mapPins[2];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: `radial-gradient(circle at top left, rgba(5,150,165,0.16), transparent 30%), linear-gradient(180deg, ${OSP.mist} 0%, #FFFFFF 58%, #F4FCFA 100%)`,
        color: OSP.ink,
        fontFamily: 'Arial, "Helvetica Neue", sans-serif',
        padding: "16px 14px 114px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <header
          style={{
            borderRadius: 32,
            overflow: "hidden",
            background: `linear-gradient(145deg, ${OSP.deepNavy} 0%, ${OSP.navy} 44%, ${OSP.teal} 100%)`,
            color: "#ffffff",
            WebkitTextFillColor: "#ffffff",
            padding: "18px 16px 16px",
            boxShadow: "0 24px 60px rgba(1,56,99,0.24)",
            border: "1px solid rgba(255,255,255,0.18)",
            position: "relative",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at top right, rgba(255,255,255,0.26), transparent 34%), radial-gradient(circle at bottom left, rgba(243,174,38,0.24), transparent 30%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", gap: 10 }}>
            <div
              style={{
                display: "inline-flex",
                borderRadius: 999,
                padding: "7px 10px",
                background: "rgba(255,255,255,0.17)",
                border: "1px solid rgba(255,255,255,0.24)",
                color: "#ffffff",
                WebkitTextFillColor: "#ffffff",
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.11em",
                textTransform: "uppercase",
              }}
            >
              Follow Map
            </div>

            <a
              href="/traveler/passport-trails"
              aria-label="Back to Passport Trails"
              style={{
                minHeight: 36,
                borderRadius: 999,
                padding: "0 12px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                color: "#ffffff",
                WebkitTextFillColor: "#ffffff",
                border: "1px solid rgba(255,255,255,0.28)",
                background: "rgba(255,255,255,0.13)",
                fontSize: 11,
                fontWeight: 900,
              }}
            >
              ← Trails
            </a>
          </div>

          <div style={{ position: "relative", marginTop: 15 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.82)",
                WebkitTextFillColor: "rgba(255,255,255,0.82)",
              }}
            >
              Siargao Passport Map™
            </div>

            <h1
              style={{
                margin: "7px 0 0",
                fontSize: 33,
                lineHeight: 0.94,
                letterSpacing: "-0.075em",
                fontWeight: 950,
                color: "#ffffff",
                WebkitTextFillColor: "#ffffff",
                textShadow: "0 4px 22px rgba(0,18,42,0.62), 0 1px 3px rgba(0,18,42,0.52)",
              }}
            >
              Follow your trail across Siargao.
            </h1>

            <p
              style={{
                margin: "11px 0 0",
                fontSize: 13,
                lineHeight: 1.45,
                fontWeight: 720,
                color: "rgba(255,255,255,0.92)",
                WebkitTextFillColor: "rgba(255,255,255,0.92)",
              }}
            >
              Move across the island map, select pins, and open the official trail pages that explain what each route means before you continue.
            </p>
          </div>
        </header>

        <section
          aria-label="Follow your trail across Siargao map"
          style={{
            marginTop: 12,
            borderRadius: 30,
            background: "#FFFFFF",
            border: "1px solid rgba(5,150,165,0.18)",
            boxShadow: "0 18px 48px rgba(1,56,99,0.13)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 12px 10px",
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              alignItems: "center",
              borderBottom: "1px solid rgba(5,150,165,0.12)",
              background: "linear-gradient(135deg, #FFFFFF 0%, #F4FCFA 100%)",
            }}
          >
            <div>
              <div style={{ fontSize: 10, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase", color: OSP.teal }}>
                Interactive island view
              </div>
              <div style={{ marginTop: 3, fontSize: 15, lineHeight: 1.05, fontWeight: 950, color: OSP.ink }}>
                Pan, zoom, and select pins
              </div>
            </div>

            <div style={{ display: "inline-flex", gap: 5, flex: "0 0 auto" }}>
              {[
                [1, "1x"],
                [1.35, "1.3x"],
                [1.7, "1.7x"],
              ].map(([value, label]) => (
                <button
                  key={String(value)}
                  type="button"
                  onClick={() => setZoom(Number(value))}
                  style={{
                    width: 42,
                    minHeight: 34,
                    borderRadius: 999,
                    border: Number(value) === zoom ? `1px solid ${OSP.teal}` : "1px solid rgba(80,102,139,0.16)",
                    background: Number(value) === zoom ? OSP.teal : "#FFFFFF",
                    color: Number(value) === zoom ? "#FFFFFF" : OSP.slate,
                    fontSize: 10,
                    fontWeight: 950,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-x pan-y",
              cursor: "grab",
              background: "linear-gradient(180deg, #DDF6F7 0%, #F8FCFC 100%)",
              maxHeight: 520,
            }}
          >
            <div
              style={{
                position: "relative",
                width: `${100 * zoom}%`,
                minWidth: zoom === 1 ? "100%" : 520,
                aspectRatio: "1448 / 1086",
                margin: "0 auto",
              }}
            >
              <img
                src="/spm/spm-own-map-canvas.png"
                alt="Siargao Passport Map route-following canvas"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "cover",
                  filter: "saturate(1.02) contrast(0.99)",
                }}
              />

              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(1,56,99,0.04) 0%, rgba(255,255,255,0.02) 45%, rgba(234,251,250,0.28) 100%)",
                }}
              />

              {mapPins.map((pin) => (
                <PinButton
                  key={pin.key}
                  pin={pin}
                  selected={selectedPin.key === pin.key}
                  onSelect={() => setSelectedPinKey(pin.key)}
                />
              ))}
            </div>
          </div>

          <div style={{ padding: 12, display: "grid", gap: 10, background: "#FFFFFF" }}>
            <div
              style={{
                borderRadius: 22,
                background: `linear-gradient(135deg, ${OSP.mist} 0%, #FFFFFF 100%)`,
                border: "1px solid rgba(5,150,165,0.18)",
                padding: 12,
              }}
            >
              <div style={{ fontSize: 9.5, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase", color: OSP.teal }}>
                Selected pin
              </div>

              <h2 style={{ margin: "5px 0 0", fontSize: 22, lineHeight: 1.02, letterSpacing: "-0.055em", fontWeight: 950, color: OSP.ink }}>
                {selectedPin.title}
              </h2>

              <p style={{ margin: "5px 0 0", fontSize: 12.2, lineHeight: 1.35, fontWeight: 720, color: OSP.slate }}>
                {selectedPin.zone} · {selectedPin.routeType} · {selectedPin.status}
              </p>

              <p style={{ margin: "8px 0 0", fontSize: 12, lineHeight: 1.42, fontWeight: 680, color: OSP.slate }}>
                {selectedPin.description}
              </p>

              <a
                href={selectedPin.href}
                aria-label={`Open ${selectedPin.title}`}
                style={{
                  marginTop: 11,
                  minHeight: 48,
                  borderRadius: 18,
                  background: `linear-gradient(135deg, ${OSP.deepNavy} 0%, ${OSP.teal} 100%)`,
                  color: "#FFFFFF",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12.5,
                  fontWeight: 950,
                  boxShadow: "0 14px 30px rgba(1,56,99,0.22)",
                }}
              >
                Open official trail page →
              </a>
            </div>
          </div>
        </section>

        <section
          aria-label="Official trail description pages"
          style={{
            marginTop: 12,
            borderRadius: 28,
            background: "#FFFFFF",
            border: "1px solid rgba(5,150,165,0.18)",
            padding: 12,
            boxShadow: "0 16px 42px rgba(1,56,99,0.10)",
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase", color: OSP.teal }}>
            Official trail pages
          </div>

          <h2 style={{ margin: "5px 0 0", fontSize: 24, lineHeight: 1.02, letterSpacing: "-0.06em", fontWeight: 950, color: OSP.ink }}>
            Read the route before following it.
          </h2>

          <div style={{ marginTop: 11, display: "grid", gap: 9 }}>
            {officialTrails.map((trail) => (
              <a
                key={trail.title}
                href={trail.href}
                aria-label={`Open ${trail.title}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 76px",
                  alignItems: "center",
                  gap: 10,
                  borderRadius: 20,
                  background: "linear-gradient(135deg, #FFFFFF 0%, #F4FCFA 100%)",
                  border: "1px solid rgba(5,150,165,0.16)",
                  padding: 11,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div>
                  <div style={{ fontSize: 15, lineHeight: 1.05, fontWeight: 950, color: OSP.ink }}>{trail.title}</div>
                  <div style={{ marginTop: 4, fontSize: 11.2, lineHeight: 1.26, fontWeight: 720, color: OSP.slate }}>{trail.body}</div>
                </div>

                <div
                  style={{
                    minHeight: 42,
                    borderRadius: 15,
                    display: "grid",
                    placeItems: "center",
                    background: trail.status === "Live" ? OSP.gold : OSP.mist,
                    color: trail.status === "Live" ? OSP.deepNavy : OSP.tealDark,
                    fontSize: 10,
                    fontWeight: 950,
                  }}
                >
                  {trail.status}
                </div>
              </a>
            ))}
          </div>
        </section>

        <section
          aria-label="Follow map actions"
          style={{
            marginTop: 12,
            borderRadius: 30,
            background: `linear-gradient(135deg, ${OSP.deepNavy} 0%, ${OSP.tealDark} 100%)`,
            color: "#FFFFFF",
            WebkitTextFillColor: "#FFFFFF",
            padding: 15,
            boxShadow: "0 20px 48px rgba(1,56,99,0.18)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: OSP.gold,
              WebkitTextFillColor: OSP.gold,
            }}
          >
            Need a custom path?
          </div>

          <h2
            style={{
              margin: "6px 0 0",
              fontSize: 24,
              lineHeight: 1.02,
              letterSpacing: "-0.06em",
              fontWeight: 950,
              color: "#ffffff",
              WebkitTextFillColor: "#ffffff",
              textShadow: "0 4px 22px rgba(0,18,42,0.62), 0 1px 3px rgba(0,18,42,0.52)",
            }}
          >
            Build your own Passport Trail.
          </h2>

          <p
            style={{
              margin: "7px 0 0",
              fontSize: 12.4,
              lineHeight: 1.4,
              fontWeight: 700,
              color: "rgba(255,255,255,0.88)",
              WebkitTextFillColor: "rgba(255,255,255,0.88)",
            }}
          >
            Start from verified stops and request support only where operator or guide fulfillment is required.
          </p>

          <a
            href="/traveler/passport-trails/diy-trail-builder?support=available"
            style={{
              marginTop: 12,
              minHeight: 50,
              borderRadius: 18,
              background: OSP.gold,
              color: OSP.deepNavy,
              WebkitTextFillColor: OSP.deepNavy,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 950,
            }}
          >
            Plan a curated route request →
          </a>
        </section>
      </div>

      <div aria-hidden="true" style={{ height: 118 }} />
      <SpmTravelerBottomTabBar activeTab="trails" fixed />
    </main>
  );
}
