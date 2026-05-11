"use client";

import { useEffect, useMemo, useState } from "react";
import EmergencyContactForm from "../../../src/components/traveler/EmergencyContactForm";

type TravelerSnapshot = {
  name: string;
  passStatus: string;
  tripStatus: string;
  accommodation: string;
  mobile: string;
  emergencyContact: {
    fullName?: string | null;
    name?: string | null;
    mobileNumber?: string | null;
    phone?: string | null;
    relationship?: string | null;
  } | null;
};

const OSP = {
  navy: "#013863",
  teal: "#0596A5",
  gold: "#F3AE26",
  mist: "#EAFBFA",
  slate: "#50668B",
  white: "#FFFFFF",
  danger: "#D92D20",
};

function EmergencySafetyPage() {
  const [traveler, setTraveler] = useState<TravelerSnapshot>({
    name: "Traveler profile",
    passStatus: "Ready to show",
    tripStatus: "Active",
    accommodation: "To be added",
    mobile: "Not saved",
    emergencyContact: null,
  });

  useEffect(() => {
    let alive = true;

    async function loadTravelerSnapshot() {
      try {
        const response = await fetch("/api/v1/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();
        const user = data?.user || data?.traveler || data?.profile || data;

        if (!alive || !user) return;

        const name =
          user.fullName ||
          user.name ||
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          "Traveler profile";

        setTraveler((current) => ({
          ...current,
          name,
          mobile:
            user.mobileNumber ||
            user.phone ||
            user.contactNumber ||
            current.mobile,
          emergencyContact:
            user.emergencyContact ||
            user.profile?.emergencyContact ||
            current.emergencyContact,
        }));
      } catch {
        /*
          Silent UI fallback:
          Safety page remains usable even when auth/profile fetch is unavailable locally.
        */
      }
    }

    loadTravelerSnapshot();

    return () => {
      alive = false;
    };
  }, []);

  const safetyTiles = useMemo(
    () => [
      {
        label: "Traveler",
        value: traveler.name,
        tone: "blue",
      },
      {
        label: "OSP Pass / QR",
        value: traveler.passStatus,
        tone: "blue",
      },
      {
        label: "Trip",
        value: traveler.tripStatus,
        tone: "teal",
      },
      {
        label: "Accommodation",
        value: traveler.accommodation,
        tone: "gold",
      },
      {
        label: "Emergency Contact",
        value:
          traveler.emergencyContact?.fullName ||
          traveler.emergencyContact?.name ||
          "Not saved",
        tone: traveler.emergencyContact ? "teal" : "danger",
      },
      {
        label: "Mobile",
        value: traveler.mobile,
        tone: traveler.mobile !== "Not saved" ? "teal" : "danger",
      },
    ],
    [traveler]
  );

  function callEmergencyHelp() {
    window.location.href = "tel:911";
  }

  function openPassQr() {
    window.location.href = "/traveler/pass";
  }

  function openTripDetails() {
    window.location.href = "/traveler/trips";
  }

  function openSettings() {
    window.location.href = "/traveler/settings";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(234,251,250,0.96) 0%, rgba(255,255,255,0.98) 34%, rgba(244,252,250,1) 100%)",
        padding: "0 0 92px",
        color: OSP.navy,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          margin: "0 auto",
          padding: "14px 14px 24px",
        }}
      >
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            margin: "0 -14px",
            padding: "10px 14px 12px",
            backdropFilter: "blur(18px)",
            background: "rgba(244,252,250,0.88)",
            borderBottom: "1px solid rgba(1,56,99,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={openSettings}
              aria-label="Back to settings"
              style={{
                border: "1px solid rgba(1,56,99,0.10)",
                background: "rgba(255,255,255,0.92)",
                color: OSP.navy,
                minHeight: "38px",
                padding: "0 13px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 900,
                boxShadow: "0 8px 20px rgba(1,56,99,0.08)",
              }}
            >
              ← Settings
            </button>

            <div
              style={{
                border: "1px solid rgba(217,45,32,0.15)",
                background: "rgba(255,247,244,0.94)",
                color: OSP.danger,
                minHeight: "38px",
                padding: "0 13px",
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                fontSize: "11px",
                fontWeight: 950,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Safety
            </div>
          </div>
        </header>

        <section
          style={{
            marginTop: "14px",
            borderRadius: "34px",
            padding: "18px",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(255,245,242,0.98) 100%)",
            border: "1px solid rgba(217,45,32,0.16)",
            boxShadow:
              "0 26px 60px rgba(1,56,99,0.12), inset 0 1px 0 rgba(255,255,255,0.92)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "flex-start",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: "56px",
                height: "56px",
                minWidth: "56px",
                borderRadius: "22px",
                background:
                  "linear-gradient(145deg, rgba(255,229,226,1) 0%, rgba(255,247,244,1) 100%)",
                color: OSP.danger,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                fontWeight: 950,
                boxShadow: "0 16px 32px rgba(217,45,32,0.12)",
              }}
            >
              !
            </div>

            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  color: OSP.danger,
                  fontSize: "10px",
                  fontWeight: 950,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                Emergency & Safety
              </p>
              <h1
                style={{
                  margin: "7px 0 0",
                  color: OSP.navy,
                  fontSize: "28px",
                  lineHeight: 1,
                  fontWeight: 950,
                  letterSpacing: "-0.05em",
                }}
              >
                Emergency Help
              </h1>
              <p
                style={{
                  margin: "8px 0 0",
                  color: OSP.slate,
                  fontSize: "13px",
                  lineHeight: 1.38,
                  fontWeight: 750,
                }}
              >
                Use this screen to call help, show your OSP identity, and share
                key trip details quickly.
              </p>
            </div>
          </div>
        </section>

        <section
          aria-label="Emergency actions"
          style={{
            marginTop: "12px",
            borderRadius: "34px",
            padding: "16px",
            background: "linear-gradient(145deg, #F7FFFE 0%, #EAFBFA 100%)",
            border: "1px solid rgba(5,150,165,0.18)",
            boxShadow: "0 22px 50px rgba(1,56,99,0.11)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: OSP.danger,
              fontSize: "10px",
              fontWeight: 950,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            First action
          </p>
          <h2
            style={{
              margin: "5px 0 14px",
              color: OSP.navy,
              fontSize: "21px",
              lineHeight: 1.08,
              fontWeight: 950,
              letterSpacing: "-0.035em",
            }}
          >
            Choose the fastest safety action.
          </h2>

          <div style={{ display: "grid", gap: "10px" }}>
            <ActionButton
              icon="☎"
              title="Call Emergency Help"
              subtitle="Use the local emergency number where available."
              color={OSP.danger}
              background="#FFF4F2"
              border="rgba(217,45,32,0.22)"
              onClick={callEmergencyHelp}
            />

            <ActionButton
              icon="+"
              title={
                traveler.emergencyContact
                  ? "Emergency Contact Saved"
                  : "Add Emergency Contact"
              }
              subtitle={
                traveler.emergencyContact
                  ? "A trusted person is attached to your traveler profile."
                  : "Save someone staff can contact during a safety situation."
              }
              color="#A45F00"
              background="#FFF7E7"
              border="rgba(243,174,38,0.24)"
              onClick={openSettings}
            />

            <ActionButton
              icon="⌁"
              title="Show OSP Pass / QR"
              subtitle="Open your traveler identity and pass record."
              color={OSP.teal}
              background="#EAFBFA"
              border="rgba(5,150,165,0.24)"
              onClick={openPassQr}
            />
          </div>
        </section>

        <EmergencyContactForm emergencyContact={traveler.emergencyContact} />

        <section
          aria-label="Safety information"
          style={{
            marginTop: "12px",
            borderRadius: "34px",
            padding: "16px",
            background:
              "linear-gradient(145deg, #CFF3F0 0%, #EAFBFA 50%, #DDF7F5 100%)",
            border: "1px solid rgba(5,150,165,0.30)",
            boxShadow: "0 24px 54px rgba(1,56,99,0.14), inset 0 1px 0 rgba(255,255,255,0.66)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "14px",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: OSP.teal,
                  fontSize: "10px",
                  fontWeight: 950,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                Safety Snapshot
              </p>
              <h2
                style={{
                  margin: "5px 0 0",
                  color: OSP.navy,
                  fontSize: "21px",
                  lineHeight: 1.08,
                  fontWeight: 950,
                  letterSpacing: "-0.035em",
                }}
              >
                Details for staff or responders.
              </h2>
            </div>

            <div
              style={{
                width: "46px",
                height: "46px",
                minWidth: "46px",
                borderRadius: "18px",
                background: "#BCEDEA",
                color: OSP.teal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px",
                fontWeight: 950,
              }}
            >
              ID
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "9px",
            }}
          >
            {safetyTiles.map((tile) => (
              <InfoTile
                key={tile.label}
                label={tile.label}
                value={tile.value}
                tone={tile.tone}
              />
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginTop: "13px",
            }}
          >
            <CompactButton
              icon="⌁"
              label="Show QR"
              onClick={openPassQr}
              tone="teal"
            />
            <CompactButton
              icon="✦"
              label="Trip Details"
              onClick={openTripDetails}
              tone="navy"
            />
          </div>
        </section>

        <section
          aria-label="Safety steps"
          style={{
            marginTop: "12px",
            borderRadius: "34px",
            padding: "16px",
            background:
              "linear-gradient(145deg, #FFF0C9 0%, #FFF7E7 48%, #FFFFFF 100%)",
            border: "1px solid rgba(243,174,38,0.34)",
            boxShadow: "0 22px 50px rgba(1,56,99,0.08)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#A45F00",
              fontSize: "10px",
              fontWeight: 950,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            What to do first
          </p>
          <div style={{ display: "grid", gap: "10px", marginTop: "12px" }}>
            <Step number="1" text="Move to a safe, visible place." />
            <Step number="2" text="Call local emergency help or nearby staff." />
            <Step number="3" text="Show your OSP Pass / QR and trip details." />
          </div>
        </section>
      </div>
    </main>
  );
}

function ActionButton({
  icon,
  title,
  subtitle,
  color,
  background,
  border,
  onClick,
}: {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  background: string;
  border: string;
  onClick: () => void;
}) {
  const isEmergency = color === OSP.danger;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        minHeight: isEmergency ? "78px" : "70px",
        borderRadius: "26px",
        border: `1px solid ${border}`,
        background: isEmergency
          ? "linear-gradient(145deg, #FFF4F2 0%, #FFFFFF 58%, #FFF8F6 100%)"
          : `linear-gradient(145deg, ${background} 0%, rgba(255,255,255,0.96) 68%)`,
        display: "flex",
        alignItems: "center",
        gap: "13px",
        padding: isEmergency ? "13px 14px" : "12px 13px",
        textAlign: "left",
        boxShadow: isEmergency
          ? "0 18px 38px rgba(217,45,32,0.14), inset 0 1px 0 rgba(255,255,255,0.92)"
          : "0 14px 30px rgba(1,56,99,0.08), inset 0 1px 0 rgba(255,255,255,0.88)",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: isEmergency ? "46px" : "40px",
          height: isEmergency ? "46px" : "40px",
          minWidth: isEmergency ? "46px" : "40px",
          borderRadius: isEmergency ? "19px" : "17px",
          background: isEmergency
            ? "linear-gradient(145deg, #D92D20 0%, #FF6B57 100%)"
            : "rgba(255,255,255,0.76)",
          color: isEmergency ? "#FFFFFF" : color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isEmergency ? "20px" : "17px",
          fontWeight: 950,
          boxShadow: isEmergency
            ? "0 14px 24px rgba(217,45,32,0.22)"
            : "0 10px 20px rgba(1,56,99,0.08)",
        }}
      >
        {icon}
      </span>

      <span style={{ minWidth: 0, flex: 1 }}>
        <span
          style={{
            display: "block",
            color: isEmergency ? OSP.danger : color,
            fontSize: isEmergency ? "14px" : "13px",
            fontWeight: 950,
            lineHeight: 1.08,
            letterSpacing: "-0.018em",
          }}
        >
          {title}
        </span>
        <span
          style={{
            display: "block",
            marginTop: "4px",
            color: OSP.slate,
            fontSize: "11.5px",
            fontWeight: 760,
            lineHeight: 1.25,
          }}
        >
          {subtitle}
        </span>
      </span>

      <span
        aria-hidden="true"
        style={{
          width: "28px",
          height: "28px",
          minWidth: "28px",
          borderRadius: "999px",
          background: isEmergency ? "rgba(217,45,32,0.10)" : "rgba(1,56,99,0.06)",
          color: isEmergency ? OSP.danger : color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          fontWeight: 950,
        }}
      >
        ›
      </span>
    </button>
  );
}

function InfoTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  const toneColor =
    tone === "danger"
      ? OSP.danger
      : tone === "gold"
        ? "#A45F00"
        : tone === "teal"
          ? OSP.teal
          : "#1B64D8";

  const toneBackground =
    tone === "danger"
      ? "#FFE4DF"
      : tone === "gold"
        ? "#FFF0C9"
        : tone === "teal"
          ? "#CFF3F0"
          : "#DDEBFF";

  const tileBackground =
    tone === "danger"
      ? "linear-gradient(145deg, #FFF4F2 0%, #FFE4DF 100%)"
      : tone === "gold"
        ? "linear-gradient(145deg, #FFF7E7 0%, #FFF0C9 100%)"
        : tone === "teal"
          ? "linear-gradient(145deg, #EAFBFA 0%, #CFF3F0 100%)"
          : "linear-gradient(145deg, #EEF6FF 0%, #DDEBFF 100%)";

  return (
    <div
      style={{
        minHeight: "68px",
        borderRadius: "22px",
        background: tileBackground,
        border: "1px solid rgba(1,56,99,0.10)",
        padding: "11px 12px",
        boxShadow: "0 12px 26px rgba(1,56,99,0.08), inset 0 1px 0 rgba(255,255,255,0.72)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "-10px",
          top: "-12px",
          width: "50px",
          height: "50px",
          borderRadius: "999px",
          background: toneBackground,
        }}
      />
      <div
        style={{
          position: "relative",
          color: toneColor,
          fontSize: "9px",
          fontWeight: 950,
          letterSpacing: "0.13em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "relative",
          marginTop: "6px",
          color: OSP.navy,
          fontSize: "12.5px",
          fontWeight: 950,
          lineHeight: 1.13,
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function CompactButton({
  icon,
  label,
  onClick,
  tone,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  tone: "teal" | "navy";
}) {
  const color = tone === "teal" ? OSP.teal : OSP.navy;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: "54px",
        borderRadius: "23px",
        border: "1px solid rgba(1,56,99,0.08)",
        background: "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(244,252,250,0.96) 100%)",
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "9px",
        padding: "0 12px",
        boxShadow: "0 12px 26px rgba(1,56,99,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span
        style={{
          width: "32px",
          height: "32px",
          minWidth: "32px",
          borderRadius: "999px",
          background: tone === "teal" ? OSP.mist : "rgba(1,56,99,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px",
          fontWeight: 950,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)",
        }}
      >
        {icon}
      </span>
      <span
        style={{
          flex: 1,
          textAlign: "left",
          fontSize: "12.5px",
          fontWeight: 950,
          letterSpacing: "-0.015em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          width: "24px",
          height: "24px",
          minWidth: "24px",
          borderRadius: "999px",
          background: "rgba(1,56,99,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "15px",
          fontWeight: 950,
        }}
      >
        ›
      </span>
    </button>
  );
}

function Step({ number, text }: { number: string; text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        minHeight: "52px",
        borderRadius: "22px",
        background: "linear-gradient(145deg, rgba(255,255,255,0.94) 0%, rgba(255,247,231,0.52) 100%)",
        border: "1px solid rgba(243,174,38,0.16)",
        padding: "10px 12px",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      <span
        style={{
          width: "32px",
          height: "32px",
          minWidth: "32px",
          borderRadius: "999px",
          background: "linear-gradient(145deg, #FFF7E7 0%, #FFFFFF 100%)",
          color: "#A45F00",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px",
          fontWeight: 950,
          boxShadow: "0 8px 18px rgba(164,95,0,0.08)",
        }}
      >
        {number}
      </span>
      <span
        style={{
          color: OSP.navy,
          fontSize: "12.5px",
          fontWeight: 850,
          lineHeight: 1.25,
          letterSpacing: "-0.01em",
        }}
      >
        {text}
      </span>
    </div>
  );
}

export default EmergencySafetyPage;
