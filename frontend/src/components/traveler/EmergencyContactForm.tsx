"use client";

import { FormEvent, useState } from "react";

type SaveState = "idle" | "saving" | "saved" | "error";

type EmergencyContact = {
  fullName?: string | null;
  name?: string | null;
  mobileNumber?: string | null;
  phone?: string | null;
  relationship?: string | null;
} | null;

type EmergencyContactFormProps = {
  emergencyContact?: EmergencyContact;
};

export default function EmergencyContactForm({
  emergencyContact = null,
}: EmergencyContactFormProps) {
  const [fullName, setFullName] = useState(
    emergencyContact?.fullName || emergencyContact?.name || ""
  );
  const [mobileNumber, setMobileNumber] = useState(
    emergencyContact?.mobileNumber || emergencyContact?.phone || ""
  );
  const [relationship, setRelationship] = useState(
    emergencyContact?.relationship || ""
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName.trim() || !mobileNumber.trim() || !relationship.trim()) {
      setSaveState("error");
      return;
    }

    setSaveState("saving");

    try {
      const response = await fetch("/api/v1/traveler/emergency-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName: fullName.trim(),
          mobileNumber: mobileNumber.trim(),
          relationship: relationship.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Emergency contact save failed");
      }

      setSaveState("saved");
    } catch {
      /*
        UI-first fallback:
        If backend route is not available yet, do not destroy the traveler UI.
        This component remains production-grade visually while backend wiring is finalized.
      */
      setSaveState("error");
    }
  }

  const fieldStyle = {
    width: "100%",
    minHeight: "54px",
    borderRadius: "18px",
    border: "1px solid rgba(5, 150, 165, 0.30)",
    background: "linear-gradient(180deg, #FFFFFF 0%, #F2FFFD 100%)",
    color: "#013863",
    fontSize: "14px",
    fontWeight: 700,
    padding: "0 16px",
    outline: "none",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
  } as const;

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    color: "#50668B",
    fontSize: "10px",
    fontWeight: 900,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  } as const;

  return (
    <section
      aria-label="Emergency contact form"
      style={{
        width: "100%",
        marginTop: "16px",
        borderRadius: "30px",
        border: "1px solid rgba(5, 150, 165, 0.32)",
        background:
          "linear-gradient(145deg, #DDF7F5 0%, #EAFBFA 46%, #FFF4D8 100%)",
        boxShadow:
          "0 24px 55px rgba(1, 56, 99, 0.16), inset 0 1px 0 rgba(255,255,255,0.72)",
        padding: "16px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "14px",
          marginBottom: "16px",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              borderRadius: "999px",
              border: "1px solid rgba(5,150,165,0.20)",
              background: "#CFF3F0",
              padding: "6px 10px",
              color: "#0596A5",
              fontSize: "10px",
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "999px",
                background: "#F3AE26",
                boxShadow: "0 0 0 4px rgba(243,174,38,0.16)",
              }}
            />
            Emergency Contact
          </div>

          <h2
            style={{
              margin: "12px 0 0",
              color: "#013863",
              fontSize: "22px",
              lineHeight: 1.08,
              fontWeight: 900,
              letterSpacing: "-0.035em",
            }}
          >
            Save someone we can contact fast.
          </h2>

          <p
            style={{
              margin: "8px 0 0",
              color: "#50668B",
              fontSize: "13px",
              lineHeight: 1.38,
              fontWeight: 650,
            }}
          >
            Add a trusted person who can be reached by staff or responders during
            a safety situation.
          </p>
        </div>

        <div
          aria-hidden="true"
          style={{
            width: "48px",
            height: "48px",
            minWidth: "48px",
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(145deg, #FFF0C9 0%, #CFF3F0 100%)",
            border: "1px solid rgba(243,174,38,0.26)",
            boxShadow: "0 12px 24px rgba(1,56,99,0.10)",
            fontSize: "22px",
          }}
        >
          🛟
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div style={{ display: "grid", gap: "12px", width: "100%" }}>
          <label style={{ display: "block", width: "100%" }}>
            <span style={labelStyle}>Full Name</span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              type="text"
              placeholder="Enter full name"
              autoComplete="name"
              style={fieldStyle}
            />
          </label>

          <label style={{ display: "block", width: "100%" }}>
            <span style={labelStyle}>Mobile Number</span>
            <input
              value={mobileNumber}
              onChange={(event) => setMobileNumber(event.target.value)}
              type="tel"
              placeholder="+63 or local number"
              autoComplete="tel"
              style={fieldStyle}
            />
          </label>

          <label style={{ display: "block", width: "100%" }}>
            <span style={labelStyle}>Relationship</span>
            <input
              value={relationship}
              onChange={(event) => setRelationship(event.target.value)}
              type="text"
              placeholder="Family / Friend / Partner"
              autoComplete="off"
              style={fieldStyle}
            />
          </label>

          <button
            type="submit"
            disabled={saveState === "saving"}
            style={{
              width: "100%",
              minHeight: "56px",
              border: "0",
              borderRadius: "22px",
              marginTop: "4px",
              background:
                saveState === "saving"
                  ? "linear-gradient(135deg, #50668B 0%, #6F7F98 100%)"
                  : "linear-gradient(135deg, #013863 0%, #0596A5 100%)",
              color: "#FFFFFF",
              fontSize: "14px",
              fontWeight: 900,
              letterSpacing: "-0.01em",
              cursor: saveState === "saving" ? "wait" : "pointer",
              boxShadow:
                "0 18px 32px rgba(1,56,99,0.24), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
          >
            {saveState === "saving" ? "Saving contact..." : "Save emergency contact"}
          </button>
        </div>

        {saveState === "saved" && (
          <div
            role="status"
            style={{
              marginTop: "12px",
              borderRadius: "18px",
              background: "rgba(234,251,250,0.95)",
              border: "1px solid rgba(5,150,165,0.22)",
              padding: "12px 14px",
              color: "#013863",
              fontSize: "12px",
              lineHeight: 1.35,
              fontWeight: 800,
            }}
          >
            Emergency contact saved for this traveler profile.
          </div>
        )}

        {saveState === "error" && (
          <div
            role="alert"
            style={{
              marginTop: "12px",
              borderRadius: "18px",
              background: "rgba(255,247,231,0.98)",
              border: "1px solid rgba(243,174,38,0.34)",
              padding: "12px 14px",
              color: "#7A4B00",
              fontSize: "12px",
              lineHeight: 1.35,
              fontWeight: 800,
            }}
          >
            Please complete the contact name, mobile number, and relationship before saving.
          </div>
        )}

        <div
          style={{
            marginTop: "13px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.90)",
            border: "1px solid rgba(1,56,99,0.08)",
            padding: "12px 14px",
            display: "flex",
            gap: "10px",
            alignItems: "flex-start",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "26px",
              height: "26px",
              minWidth: "26px",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#FFF7E7",
              color: "#A45F00",
              fontSize: "13px",
              fontWeight: 900,
            }}
          >
            !
          </span>
          <p
            style={{
              margin: 0,
              color: "#50668B",
              fontSize: "11.5px",
              lineHeight: 1.36,
              fontWeight: 750,
            }}
          >
            This does not replace local emergency services. In urgent danger, call
            local emergency help first.
          </p>
        </div>
      </form>
    </section>
  );
}
