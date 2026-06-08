"use client";

import { useMemo, useState } from "react";

type ReviewStatus = "UNDER_REVIEW" | "APPROVED" | "EDIT_REQUESTED" | "CANCELLED";
type RouteOption = "GL_TRI_ISLAND_CLASSIC" | "GL_MAM_ON" | "GL_CORREGIDOR";
type SourceOption = "OPERATOR_WORKSPACE" | "ACCOMMODATION_DESK" | "OTA_PARTNER_INTAKE";

const OSP = {
  navy: "#013863",
  teal: "#0596A5",
  gold: "#F3AE26",
  mist: "#EAFBFA",
  slate: "#50668B",
  white: "#FFFFFF",
};

const routes: Record<RouteOption, { label: string; trip: string; time: string; capacity: number }> = {
  GL_TRI_ISLAND_CLASSIC: {
    label: "Guyam · Daku · Naked",
    trip: "DOT-GL-GDN-20260608-0800",
    time: "08:00 AM",
    capacity: 12,
  },
  GL_MAM_ON: {
    label: "Guyam · Daku · Mam-On",
    trip: "DOT-GL-GDM-20260608-1000",
    time: "10:00 AM",
    capacity: 12,
  },
  GL_CORREGIDOR: {
    label: "Guyam · Daku · Naked · Corregidor",
    trip: "DOT-GL-GDNC-20260608-1100",
    time: "11:00 AM",
    capacity: 16,
  },
};

const sourceLabels: Record<SourceOption, string> = {
  OPERATOR_WORKSPACE: "Approved operator workspace",
  ACCOMMODATION_DESK: "Accommodation desk submission",
  OTA_PARTNER_INTAKE: "Travel partner / OTA intake",
};

const statusCopy: Record<ReviewStatus, { label: string; tone: string; bg: string; helper: string }> = {
  UNDER_REVIEW: {
    label: "Under review",
    tone: "#8A5A00",
    bg: "rgba(243,174,38,0.14)",
    helper: "LGU/DOT is reviewing route, trip, pax count, and boarding readiness.",
  },
  APPROVED: {
    label: "Approved for boarding readiness",
    tone: "#067647",
    bg: "rgba(16,185,129,0.13)",
    helper: "Sample status updated. In production this would create an audited approval event.",
  },
  EDIT_REQUESTED: {
    label: "Edit requested",
    tone: "#B54708",
    bg: "rgba(255,248,232,0.92)",
    helper: "Sample status updated. Operator must correct passenger details before final clearance.",
  },
  CANCELLED: {
    label: "Cancelled / returned",
    tone: "#B42318",
    bg: "rgba(254,242,242,0.96)",
    helper: "Sample status updated. Manifest is returned and cannot proceed to boarding readiness.",
  },
};

function FieldLabel({ children }: { children: string }) {
  return (
    <p
      style={{
        margin: 0,
        color: "#6B7FA1",
        fontSize: 10,
        fontWeight: 950,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </p>
  );
}

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label
      style={{
        display: "grid",
        gap: 7,
        borderRadius: 18,
        border: "1px solid rgba(5,150,165,0.16)",
        background: "rgba(255,255,255,0.86)",
        padding: "12px 13px",
      }}
    >
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          minHeight: 40,
          borderRadius: 14,
          border: "1px solid rgba(5,150,165,0.18)",
          background: "#FFFFFF",
          color: OSP.navy,
          padding: "0 12px",
          fontSize: 13,
          fontWeight: 850,
          outline: "none",
        }}
      >
        {children}
      </select>
    </label>
  );
}

function ActionButton({
  children,
  tone,
  onClick,
}: {
  children: string;
  tone: "approve" | "edit" | "cancel";
  onClick: () => void;
}) {
  const styles =
    tone === "approve"
      ? { bg: "linear-gradient(135deg, #013863, #0596A5)", color: "#FFFFFF", border: "rgba(5,150,165,0.28)" }
      : tone === "edit"
        ? { bg: "rgba(255,248,232,0.98)", color: "#8A5A00", border: "rgba(243,174,38,0.36)" }
        : { bg: "rgba(254,242,242,0.98)", color: "#B42318", border: "rgba(180,35,24,0.22)" };

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: 46,
        borderRadius: 999,
        border: `1px solid ${styles.border}`,
        background: styles.bg,
        color: styles.color,
        padding: "0 16px",
        fontSize: 13,
        fontWeight: 950,
        cursor: "pointer",
        boxShadow: tone === "approve" ? "0 14px 28px rgba(1,56,99,0.18)" : "0 10px 22px rgba(1,56,99,0.06)",
      }}
    >
      {children}
    </button>
  );
}

export default function LguManifestSubmissionDemo() {
  const [route, setRoute] = useState<RouteOption>("GL_TRI_ISLAND_CLASSIC");
  const [source, setSource] = useState<SourceOption>("OPERATOR_WORKSPACE");
  const [status, setStatus] = useState<ReviewStatus>("UNDER_REVIEW");
  const [pax, setPax] = useState(12);
  const [note, setNote] = useState("Passenger list received. Awaiting LGU/DOT route and trip review.");

  const selectedRoute = routes[route];
  const selectedStatus = statusCopy[status];

  const readiness = useMemo(() => {
    if (status === "APPROVED") return "Boarding QR can proceed";
    if (status === "EDIT_REQUESTED") return "Correction required";
    if (status === "CANCELLED") return "Boarding blocked";
    return "Pending LGU review";
  }, [status]);

  function approveManifest() {
    setStatus("APPROVED");
    setNote("DOT/LGU sample approval recorded for walkthrough. Production action must write audit logs and notify operator workspace.");
  }

  function requestEdit() {
    setStatus("EDIT_REQUESTED");
    setNote("Edit requested: verify passenger count, names, and trip assignment before final clearance.");
  }

  function cancelManifest() {
    setStatus("CANCELLED");
    setNote("Manifest returned/cancelled in sample mode. Production cancellation must preserve audit trail and reason.");
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div
        style={{
          borderRadius: 28,
          border: "1px solid rgba(5,150,165,0.20)",
          background: "linear-gradient(135deg, rgba(234,251,250,0.98), rgba(255,255,255,0.98))",
          boxShadow: "0 20px 52px rgba(1,56,99,0.09)",
          padding: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: OSP.teal, fontSize: 11, fontWeight: 950, letterSpacing: "0.16em", textTransform: "uppercase" }}>
              Sample submission for plenary walkthrough
            </p>
            <h3 style={{ margin: "8px 0 0", color: OSP.navy, fontSize: 25, lineHeight: 1.05, letterSpacing: "-0.04em" }}>
              General Luna Island Hopping Manifest
            </h3>
            <p style={{ margin: "8px 0 0", color: OSP.slate, fontSize: 14, lineHeight: 1.45, fontWeight: 760 }}>
              Working demo of how submitted passenger lists move from operator/accommodation intake into LGU/DOT review.
            </p>
          </div>

          <div
            style={{
              borderRadius: 999,
              padding: "9px 12px",
              background: selectedStatus.bg,
              border: `1px solid ${selectedStatus.tone}33`,
              color: selectedStatus.tone,
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {selectedStatus.label}
          </div>
        </div>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10 }}>
          <div style={{ borderRadius: 18, border: "1px solid rgba(5,150,165,0.16)", background: "rgba(255,255,255,0.86)", padding: "12px 13px", minHeight: 78 }}>
            <FieldLabel>Trip</FieldLabel>
            <p style={{ margin: "7px 0 0", color: OSP.navy, fontSize: 14, lineHeight: 1.2, fontWeight: 920 }}>{selectedRoute.trip}</p>
            <p style={{ margin: "5px 0 0", color: OSP.slate, fontSize: 12, fontWeight: 750 }}>{selectedRoute.time}</p>
          </div>

          <div style={{ borderRadius: 18, border: "1px solid rgba(5,150,165,0.16)", background: "rgba(255,255,255,0.86)", padding: "12px 13px", minHeight: 78 }}>
            <FieldLabel>Route</FieldLabel>
            <p style={{ margin: "7px 0 0", color: OSP.navy, fontSize: 14, lineHeight: 1.2, fontWeight: 920 }}>{selectedRoute.label}</p>
          </div>

          <div style={{ borderRadius: 18, border: "1px solid rgba(5,150,165,0.16)", background: "rgba(255,255,255,0.86)", padding: "12px 13px", minHeight: 78 }}>
            <FieldLabel>Pax listed</FieldLabel>
            <p style={{ margin: "7px 0 0", color: OSP.navy, fontSize: 14, lineHeight: 1.2, fontWeight: 920 }}>{pax} travelers / {selectedRoute.capacity} capacity</p>
          </div>

          <div style={{ borderRadius: 18, border: "1px solid rgba(5,150,165,0.16)", background: "rgba(255,255,255,0.86)", padding: "12px 13px", minHeight: 78 }}>
            <FieldLabel>Boarding QR</FieldLabel>
            <p style={{ margin: "7px 0 0", color: OSP.navy, fontSize: 14, lineHeight: 1.2, fontWeight: 920 }}>{readiness}</p>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 0.65fr", gap: 10 }}>
          <SelectField label="Submission source" value={source} onChange={(value) => setSource(value as SourceOption)}>
            <option value="OPERATOR_WORKSPACE">{sourceLabels.OPERATOR_WORKSPACE}</option>
            <option value="ACCOMMODATION_DESK">{sourceLabels.ACCOMMODATION_DESK}</option>
            <option value="OTA_PARTNER_INTAKE">{sourceLabels.OTA_PARTNER_INTAKE}</option>
          </SelectField>

          <SelectField label="Trip / route match" value={route} onChange={(value) => setRoute(value as RouteOption)}>
            <option value="GL_TRI_ISLAND_CLASSIC">08:00 · Classic Tri-Island</option>
            <option value="GL_MAM_ON">10:00 · Mam-On Route</option>
            <option value="GL_CORREGIDOR">11:00 · Corregidor Extension</option>
          </SelectField>

          <label style={{ display: "grid", gap: 7, borderRadius: 18, border: "1px solid rgba(5,150,165,0.16)", background: "rgba(255,255,255,0.86)", padding: "12px 13px" }}>
            <FieldLabel>Pax count</FieldLabel>
            <input
              type="number"
              min={0}
              max={selectedRoute.capacity}
              value={pax}
              onChange={(event) => setPax(Number(event.target.value || 0))}
              style={{ minHeight: 40, borderRadius: 14, border: "1px solid rgba(5,150,165,0.18)", background: "#FFFFFF", color: OSP.navy, padding: "0 12px", fontSize: 13, fontWeight: 850, outline: "none" }}
            />
          </label>
        </div>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ borderRadius: 20, border: "1px solid rgba(1,56,99,0.10)", background: "rgba(255,255,255,0.80)", padding: 15 }}>
            <p style={{ margin: 0, color: OSP.navy, fontSize: 14, fontWeight: 950 }}>DOT / LGU review notes</p>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              style={{ marginTop: 10, width: "100%", minHeight: 94, resize: "vertical", borderRadius: 16, border: "1px solid rgba(5,150,165,0.18)", background: "#FFFFFF", color: OSP.navy, padding: 12, fontSize: 13, lineHeight: 1.45, fontWeight: 720, boxSizing: "border-box", outline: "none" }}
            />
          </div>

          <div style={{ borderRadius: 20, border: "1px solid rgba(243,174,38,0.26)", background: "rgba(255,248,232,0.88)", padding: 15 }}>
            <p style={{ margin: 0, color: "#8A5A00", fontSize: 14, fontWeight: 950 }}>Approval controls</p>
            <p style={{ margin: "8px 0 12px", color: OSP.slate, fontSize: 13.5, lineHeight: 1.45, fontWeight: 720 }}>
              Demonstration controls only. Production approval must write audit logs, enforce role checks, and notify the submitting workspace.
            </p>
            <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
              <ActionButton tone="approve" onClick={approveManifest}>Approve manifest</ActionButton>
              <ActionButton tone="edit" onClick={requestEdit}>Request edit</ActionButton>
              <ActionButton tone="cancel" onClick={cancelManifest}>Cancel / return</ActionButton>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, borderRadius: 20, border: "1px solid rgba(5,150,165,0.16)", background: "rgba(234,251,250,0.74)", padding: 14 }}>
          <p style={{ margin: 0, color: OSP.teal, fontSize: 11, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Submission path
          </p>

          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 8 }}>
            {["Operator workspace", "Passenger list", "Trip matching", "LGU/DOT review", "Boarding readiness"].map((step, index) => (
              <div
                key={step}
                style={{
                  borderRadius: 16,
                  background: index === 3 ? OSP.navy : OSP.white,
                  border: "1px solid rgba(5,150,165,0.14)",
                  padding: "10px 11px",
                  minHeight: 66,
                }}
              >
                <strong style={{ color: index === 3 ? OSP.white : OSP.navy, fontSize: 12 }}>
                  {String(index + 1).padStart(2, "0")}
                </strong>
                <p style={{ margin: "8px 0 0", color: index === 3 ? OSP.white : OSP.navy, fontSize: 12.5, lineHeight: 1.25, fontWeight: 850 }}>
                  {step}
                </p>
              </div>
            ))}
          </div>

          <p style={{ margin: "12px 0 0", color: OSP.slate, fontSize: 12.5, lineHeight: 1.45, fontWeight: 720 }}>
            Current source: {sourceLabels[source]}. Current sample state: {selectedStatus.helper}
          </p>
        </div>
      </div>
    </div>
  );
}
