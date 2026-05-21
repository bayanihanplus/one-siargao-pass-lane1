"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

const fieldStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  minHeight: 45,
  padding: "11px 44px 11px 12px",
  borderRadius: 15,
  border: "1px solid rgba(14,116,144,0.18)",
  backgroundColor: "rgba(255,255,255,0.96)",
  color: "#013863",
  fontSize: 14,
  fontWeight: 760,
  outline: "none",
  boxShadow: "0 8px 18px rgba(15,23,42,0.05)",
};

function FieldLabel(props: { label: string; required?: boolean }) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        marginBottom: 7,
        fontSize: 12.5,
        fontWeight: 920,
        color: "#334155",
      }}
    >
      <span>{props.label}</span>
      {props.required ? (
        <span style={{ fontSize: 10, fontWeight: 950, color: "#0596A5", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Required
        </span>
      ) : null}
    </span>
  );
}

export function PasswordField(props: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label htmlFor={props.id} style={{ display: "block" }}>
      <FieldLabel label={props.label} required={props.required} />
      <span style={{ position: "relative", display: "block" }}>
        <input
          id={props.id}
          name={props.name}
          type={visible ? "text" : "password"}
          placeholder={props.placeholder}
          required={props.required}
          autoComplete={props.autoComplete}
          style={fieldStyle}
        />
        <button
          type="button"
          aria-label={visible ? `Hide ${props.label}` : `Show ${props.label}`}
          onClick={() => setVisible((value) => !value)}
          style={{
            position: "absolute",
            top: "50%",
            right: 8,
            transform: "translateY(-50%)",
            width: 32,
            height: 32,
            borderRadius: 12,
            border: "1px solid rgba(5,150,165,0.18)",
            background: "#FFFFFF",
            color: "#013863",
            fontSize: 13,
            fontWeight: 950,
            cursor: "pointer",
            boxShadow: "0 6px 14px rgba(1,56,99,0.08)",
          }}
        >
          {visible ? "Hide" : "View"}
        </button>
      </span>
    </label>
  );
}

function ConsentCheckbox(props: {
  name: string;
  title: string;
  body: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        borderRadius: 18,
        padding: "11px 12px",
        background: props.checked ? "rgba(234,251,250,0.82)" : "rgba(255,255,255,0.84)",
        border: props.checked ? "1px solid rgba(5,150,165,0.22)" : "1px solid rgba(5,150,165,0.13)",
        boxShadow: props.checked ? "0 8px 18px rgba(1,56,99,0.06)" : "none",
      }}
    >
      <input
        type="checkbox"
        name={props.name}
        checked={props.checked}
        onChange={(event) => props.onChange(event.target.checked)}
        required
        style={{
          marginTop: 3,
          width: 18,
          height: 18,
          accentColor: "#0596A5",
          flex: "0 0 auto",
        }}
      />
      <span>
        <span style={{ display: "block", fontSize: 12.8, lineHeight: 1.22, fontWeight: 950, color: "#013863" }}>
          {props.title}
        </span>
        <span style={{ display: "block", marginTop: 3, fontSize: 11.6, lineHeight: 1.36, fontWeight: 720, color: "rgba(80,102,139,0.78)" }}>
          {props.body}
        </span>
      </span>
    </label>
  );
}

function UtilityLink(props: { href: string; icon: string; title: string }) {
  return (
    <a
      href={props.href}
      style={{
        minHeight: 40,
        borderRadius: 15,
        padding: "8px 10px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        textDecoration: "none",
        fontSize: 12.2,
        fontWeight: 920,
        background: "rgba(255,255,255,0.92)",
        color: "#013863",
        border: "1px solid rgba(5,150,165,0.16)",
        boxShadow: "0 8px 18px rgba(1,56,99,0.07)",
      }}
    >
      <span aria-hidden="true">{props.icon}</span>
      {props.title}
    </a>
  );
}

export function ConsentAndSubmit() {
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [rulesAcknowledgement, setRulesAcknowledgement] = useState(false);
  const [dataUsePurposeAcknowledgement, setDataUsePurposeAcknowledgement] = useState(false);

  const canSubmit = useMemo(
    () => privacyConsent && rulesAcknowledgement && dataUsePurposeAcknowledgement,
    [privacyConsent, rulesAcknowledgement, dataUsePurposeAcknowledgement],
  );

  return (
    <>
      <ConsentCheckbox
        name="privacyConsent"
        checked={privacyConsent}
        onChange={setPrivacyConsent}
        title="I accept the privacy consent."
        body="OSP may process my account, trip, QR, and safety details for registration, access, support, and service readiness."
      />
      <ConsentCheckbox
        name="rulesAcknowledgement"
        checked={rulesAcknowledgement}
        onChange={setRulesAcknowledgement}
        title="I agree to follow One Siargao rules."
        body="I will follow local laws, destination advisories, environmental rules, operator safety instructions, and community respect guidelines."
      />
      <ConsentCheckbox
        name="dataUsePurposeAcknowledgement"
        checked={dataUsePurposeAcknowledgement}
        onChange={setDataUsePurposeAcknowledgement}
        title="I understand the data-use purpose."
        body="My information supports QR access, trip readiness, check-ins, safety support, and aggregated destination planning."
      />

      <button
        type="submit"
        disabled={!canSubmit}
        aria-disabled={!canSubmit}
        style={{
          width: "100%",
          minHeight: 50,
          borderRadius: 18,
          border: canSubmit ? "1px solid rgba(5,150,165,0.24)" : "1px solid rgba(80,102,139,0.18)",
          background: canSubmit
            ? "linear-gradient(135deg, #013863 0%, #003B66 42%, #0596A5 100%)"
            : "linear-gradient(135deg, rgba(80,102,139,0.18), rgba(80,102,139,0.12))",
          color: canSubmit ? "#FFFFFF" : "rgba(80,102,139,0.72)",
          fontSize: 14.2,
          fontWeight: 950,
          cursor: canSubmit ? "pointer" : "not-allowed",
          boxShadow: canSubmit ? "0 16px 32px rgba(1,56,99,0.24)" : "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          transition: "160ms ease",
        }}
      >
        <span aria-hidden="true">▣</span>
        {canSubmit ? "Create My One Siargao QR" : "Accept consents to continue"}
        <span aria-hidden="true">→</span>
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <UtilityLink href="/traveler/login" icon="🧭" title="I already have account" />
        <UtilityLink href="/traveler/explore" icon="🗺️" title="Explore first" />
      </div>
    </>
  );
}
