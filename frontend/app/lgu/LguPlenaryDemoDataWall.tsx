"use client";

import { useMemo, useState } from "react";

type Variant = "feeExceptions" | "receipts" | "paymentAudit" | "feePrograms" | "reports" | "notifications" | "access";

type DemoRecord = {
  id: string;
  title: string;
  eyebrow: string;
  status: string;
  amount?: string;
  route?: string;
  note: string;
  meta: Array<[string, string]>;
};

const OSP = {
  navy: "#013863",
  teal: "#0596A5",
  gold: "#F3AE26",
  mist: "#EAFBFA",
  slate: "#50668B",
  white: "#FFFFFF",
  danger: "#B42318",
  green: "#067647",
};

const DATA: Record<Variant, {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryAction: string;
  secondaryAction: string;
  caution: string;
  filters: string[];
  records: DemoRecord[];
}> = {
  feeExceptions: {
    eyebrow: "Sample fee-clearance pressure",
    title: "Fee Exceptions Watchlist",
    subtitle: "Shows how LGU/DOT staff can see fee-related clearance blockers before a trip moves to boarding readiness.",
    primaryAction: "Mark reviewed",
    secondaryAction: "Escalate to cashier",
    caution: "Demo only. Production resolution must write an audit event and preserve payment/fee references.",
    filters: ["All exceptions", "Entrance fee", "Voucher mismatch", "Resident rate review"],
    records: [
      {
        id: "FEE-GL-0800-01",
        eyebrow: "Entrance fee review",
        title: "Cloud 9 / site-access fee pending confirmation",
        status: "Needs cashier review",
        amount: "₱1,200",
        route: "GL Island Hopping · 08:00",
        note: "Passenger group has QR-ready trip but one fee line is not reconciled.",
        meta: [["Trip", "DOT-GL-GDN-20260608-0800"], ["Pax affected", "4"], ["Owner", "LGU Cashier"], ["Risk", "Boarding hold"]],
      },
      {
        id: "FEE-GL-1000-02",
        eyebrow: "Voucher mismatch",
        title: "Operator voucher amount does not match pax count",
        status: "Operator correction",
        amount: "₱800",
        route: "Mam-On Route · 10:00",
        note: "Submitted manifest count changed after voucher issue. Requires correction before clearance.",
        meta: [["Trip", "DOT-GL-GDM-20260608-1000"], ["Pax affected", "2"], ["Owner", "Operator desk"], ["Risk", "Delay watch"]],
      },
    ],
  },
  receipts: {
    eyebrow: "Sample official receipt visibility",
    title: "Issued Receipts Trail",
    subtitle: "Shows how staff can inspect receipt readiness without changing payment records from this panel.",
    primaryAction: "Open receipt trail",
    secondaryAction: "Flag for audit",
    caution: "Demo only. Production receipt numbers must come from governed payment/receipt services.",
    filters: ["All receipts", "Paid", "Pending issuance", "Audit flagged"],
    records: [
      {
        id: "OR-GL-20260608-00041",
        eyebrow: "Receipt issued",
        title: "General Luna island-hopping environmental/port fee",
        status: "Paid",
        amount: "₱3,600",
        route: "GL Island Hopping · 08:00",
        note: "Receipt visible for LGU audit and trip payment traceability.",
        meta: [["Receipt", "OR-GL-00041"], ["Trip", "DOT-GL-GDN-20260608-0800"], ["Pax", "12"], ["Channel", "OSP checkout"]],
      },
      {
        id: "OR-GL-20260608-00042",
        eyebrow: "Receipt pending",
        title: "Counter payment awaiting official receipt issue",
        status: "Pending issuance",
        amount: "₱900",
        route: "Corregidor Extension · 11:00",
        note: "Cashier lane needs final receipt confirmation before finance export.",
        meta: [["Receipt", "Pending"], ["Trip", "DOT-GL-GDNC-20260608-1100"], ["Pax", "3"], ["Channel", "Cashier desk"]],
      },
    ],
  },
  paymentAudit: {
    eyebrow: "Sample payment visibility",
    title: "Payment Audit Timeline",
    subtitle: "Shows payment state, voucher state, and boarding impact in one review surface.",
    primaryAction: "Review payment trail",
    secondaryAction: "Hold boarding",
    caution: "Demo only. Production mutation must remain governed by payment authority and audit logs.",
    filters: ["All payments", "Voucher issued", "Pending confirmation", "Hold"],
    records: [
      {
        id: "PAY-GL-0800-1442",
        eyebrow: "Voucher issued",
        title: "Trip voucher connected to manifest and Boarding QR",
        status: "Voucher issued",
        amount: "₱8,400",
        route: "Classic Tri-Island · 08:00",
        note: "Payment proof exists. LGU can inspect relation between voucher, manifest, and QR readiness.",
        meta: [["Intent", "pi_gl_0800_1442"], ["Voucher", "Issued"], ["Boarding QR", "Ready"], ["Manifest", "12/12"]],
      },
      {
        id: "PAY-GL-1000-1178",
        eyebrow: "Pending confirmation",
        title: "Request-to-confirm booking has pending payment state",
        status: "Pending",
        amount: "To confirm",
        route: "Mam-On Route · 10:00",
        note: "Trip can stay scheduled but cannot move to final boarding readiness until payment proof is resolved.",
        meta: [["Intent", "pending"], ["Voucher", "Pending"], ["Boarding QR", "Blocked"], ["Manifest", "Not open"]],
      },
    ],
  },
  feePrograms: {
    eyebrow: "Sample fee program rules",
    title: "Fee Program Governance",
    subtitle: "Shows how LGU-defined rate rules can be visible without letting unauthorized users mutate them.",
    primaryAction: "Preview rule",
    secondaryAction: "Request rule update",
    caution: "Demo only. Production fee programs are governed configuration and require authorized LGU/DOT action.",
    filters: ["All rules", "Resident rate", "Senior / child", "Tourist standard"],
    records: [
      {
        id: "RULE-GL-RESIDENT",
        eyebrow: "Resident rate",
        title: "General Luna resident fee handling",
        status: "Active",
        amount: "Configured",
        route: "Site access + island-hopping lanes",
        note: "Resident, senior, child, and exempt categories should be resolved before QR validation.",
        meta: [["Rule", "Resident rate"], ["Applies to", "LGU fee points"], ["Proof", "ID review"], ["State", "Active"]],
      },
      {
        id: "RULE-GL-STANDARD",
        eyebrow: "Tourist standard",
        title: "Visitor fee collection and receipt trail",
        status: "Active",
        amount: "Standard rate",
        route: "OSP checkout / cashier desk",
        note: "Standard visitor fee should connect to receipt, voucher, and trip readiness where relevant.",
        meta: [["Rule", "Standard"], ["Applies to", "Visitors"], ["Receipt", "Required"], ["State", "Active"]],
      },
    ],
  },
  reports: {
    eyebrow: "Sample report outputs",
    title: "LGU Report Export Desk",
    subtitle: "Shows the kind of daily operating reports SB/DOT can expect from DCS and manifest records.",
    primaryAction: "Generate preview",
    secondaryAction: "Record print audit",
    caution: "Demo only. Production exports must stamp generation time, actor, scope, and source dataset.",
    filters: ["Today", "Manifest approvals", "Departure summary", "Fee exceptions"],
    records: [
      {
        id: "RPT-GL-DAILY-20260608",
        eyebrow: "Daily departure summary",
        title: "General Luna island-hopping operating report",
        status: "Preview ready",
        amount: "6 trips",
        route: "General Luna Port",
        note: "Summarizes trips, pax listed, boarded count, delay watch, and exception pressure.",
        meta: [["Trips", "6"], ["Travelers", "64"], ["Boarded", "11"], ["Exceptions", "2"]],
      },
      {
        id: "RPT-GL-MANIFEST-20260608",
        eyebrow: "Manifest approval audit",
        title: "Submitted manifest review log",
        status: "Draft",
        amount: "3 records",
        route: "LGU/DOT review",
        note: "Captures approval, edit request, cancellation, reviewer, and timestamp trail.",
        meta: [["Visible", "3"], ["Under review", "1"], ["Approved", "2"], ["Role lock", "On"]],
      },
    ],
  },
  notifications: {
    eyebrow: "Sample operational alert routing",
    title: "LGU Notification Routing Desk",
    subtitle: "Shows how alerts support operator attention, fee-clearance pressure, delays, and manifest review without replacing the official LGU queue.",
    primaryAction: "Acknowledge sample alert",
    secondaryAction: "Route to owner",
    caution: "Demo only. Production notifications must create delivery logs, recipients, timestamps, and acknowledgement history.",
    filters: ["All alerts", "Manifest review", "Fee clearance", "Delay watch", "Operator action"],
    records: [
      {
        id: "ALERT-GL-MANIFEST-0800",
        eyebrow: "Manifest review alert",
        title: "Submitted manifest waiting for LGU/DOT action",
        status: "Open",
        amount: "1 review",
        route: "General Luna · 08:00",
        note: "Operator submitted passenger list. LGU/DOT reviewer must approve, request edit, or return before boarding readiness.",
        meta: [["Owner", "LGU reviewer"], ["Trip", "DOT-GL-GDN-20260608-0800"], ["Priority", "High"], ["Channel", "Console alert"]],
      },
      {
        id: "ALERT-GL-FEE-1000",
        eyebrow: "Fee exception alert",
        title: "Voucher mismatch may block boarding readiness",
        status: "Needs cashier",
        amount: "₱800",
        route: "Mam-On Route · 10:00",
        note: "Fee exception is visible so staff can coordinate payment correction before departure pressure escalates.",
        meta: [["Owner", "Cashier"], ["Trip", "DOT-GL-GDM-20260608-1000"], ["Priority", "Medium"], ["Channel", "LGU desk"]],
      },
    ],
  },
  access: {
    eyebrow: "Sample governed access control",
    title: "Role Access and Guardrails",
    subtitle: "Shows who can inspect, approve, export, configure, and mutate LGU/DOT operating records.",
    primaryAction: "Preview role scope",
    secondaryAction: "Flag access review",
    caution: "Demo only. Production access must be enforced server-side through authenticated roles, audit logs, and least-privilege policy.",
    filters: ["All roles", "LGU viewer", "LGU approver", "Admin", "Operator"],
    records: [
      {
        id: "ACCESS-LGU-APPROVER",
        eyebrow: "LGU approver scope",
        title: "Can approve or return manifest submissions",
        status: "Governed",
        amount: "Approve / return",
        route: "Manifest Submissions",
        note: "Approval authority belongs to authorized LGU/DOT users, not operators or accommodations.",
        meta: [["Role", "LGU_APPROVER"], ["Can approve", "Yes"], ["Can configure", "No"], ["Audit", "Required"]],
      },
      {
        id: "ACCESS-OPERATOR-WORKSPACE",
        eyebrow: "Operator scope",
        title: "Can submit manifests but cannot self-clear departures",
        status: "Restricted",
        amount: "Submit only",
        route: "Operator workspace",
        note: "Operators manage fulfillment readiness and submit passenger lists; LGU/DOT controls queue, clearance, and exception posture.",
        meta: [["Role", "OPERATOR"], ["Can submit", "Yes"], ["Can approve", "No"], ["DCS authority", "LGU/DOT"]],
      },
    ],
  },
};

function DemoButton({
  children,
  tone,
  onClick,
}: {
  children: string;
  tone: "primary" | "secondary";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: 42,
        borderRadius: 999,
        border: tone === "primary" ? "1px solid rgba(5,150,165,0.32)" : "1px solid rgba(243,174,38,0.34)",
        background: tone === "primary" ? "linear-gradient(135deg, #013863, #0596A5)" : "rgba(255,248,232,0.95)",
        color: tone === "primary" ? "#FFFFFF" : "#8A5A00",
        padding: "0 14px",
        fontSize: 12.5,
        fontWeight: 950,
        cursor: "pointer",
        boxShadow: tone === "primary" ? "0 14px 28px rgba(1,56,99,0.16)" : "0 10px 22px rgba(1,56,99,0.06)",
      }}
    >
      {children}
    </button>
  );
}

export default function LguPlenaryDemoDataWall({ variant }: { variant: Variant }) {
  const config = DATA[variant];
  const [filter, setFilter] = useState(config.filters[0]);
  const [selectedId, setSelectedId] = useState(config.records[0]?.id || "");
  const [status, setStatus] = useState("Ready for review");
  const [note, setNote] = useState("Select a sample record, change the filter, and trigger a demo action.");

  const selected = useMemo(
    () => config.records.find((record) => record.id === selectedId) || config.records[0],
    [config.records, selectedId],
  );

  return (
    <div
      style={{
        borderRadius: 28,
        border: "1px solid rgba(5,150,165,0.20)",
        background: "linear-gradient(135deg, rgba(234,251,250,0.98), rgba(255,255,255,0.98))",
        boxShadow: "0 20px 52px rgba(1,56,99,0.08)",
        padding: 20,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, color: OSP.teal, fontSize: 11, fontWeight: 950, letterSpacing: "0.16em", textTransform: "uppercase" }}>
            {config.eyebrow}
          </p>
          <h3 style={{ margin: "8px 0 0", color: OSP.navy, fontSize: 25, lineHeight: 1.05, letterSpacing: "-0.04em" }}>
            {config.title}
          </h3>
          <p style={{ margin: "8px 0 0", color: OSP.slate, fontSize: 14, lineHeight: 1.45, fontWeight: 740 }}>
            {config.subtitle}
          </p>
        </div>

        <div
          style={{
            borderRadius: 999,
            padding: "9px 12px",
            background: "rgba(243,174,38,0.14)",
            border: "1px solid rgba(243,174,38,0.34)",
            color: "#8A5A00",
            fontSize: 11,
            fontWeight: 950,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Plenary sample
        </div>
      </div>

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 12 }}>
        <label style={{ display: "grid", gap: 7 }}>
          <span style={{ color: "#6B7FA1", fontSize: 10, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Filter
          </span>
          <select
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value);
              setStatus(`Filtered: ${event.target.value}`);
            }}
            style={{
              minHeight: 44,
              borderRadius: 16,
              border: "1px solid rgba(5,150,165,0.18)",
              background: "#FFFFFF",
              color: OSP.navy,
              padding: "0 12px",
              fontSize: 13,
              fontWeight: 850,
              outline: "none",
            }}
          >
            {config.filters.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: 7 }}>
          <span style={{ color: "#6B7FA1", fontSize: 10, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Sample record
          </span>
          <select
            value={selectedId}
            onChange={(event) => {
              setSelectedId(event.target.value);
              setStatus("Record selected");
            }}
            style={{
              minHeight: 44,
              borderRadius: 16,
              border: "1px solid rgba(5,150,165,0.18)",
              background: "#FFFFFF",
              color: OSP.navy,
              padding: "0 12px",
              fontSize: 13,
              fontWeight: 850,
              outline: "none",
            }}
          >
            {config.records.map((record) => (
              <option key={record.id} value={record.id}>{record.id} · {record.status}</option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginTop: 16, borderRadius: 22, border: "1px solid rgba(5,150,165,0.16)", background: "rgba(255,255,255,0.88)", padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: OSP.teal, fontSize: 11, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              {selected.eyebrow}
            </p>
            <h4 style={{ margin: "7px 0 0", color: OSP.navy, fontSize: 20, lineHeight: 1.12, letterSpacing: "-0.03em" }}>
              {selected.title}
            </h4>
            <p style={{ margin: "8px 0 0", color: OSP.slate, fontSize: 13.5, lineHeight: 1.45, fontWeight: 720 }}>
              {selected.note}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, color: "#8A5A00", fontSize: 11, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {selected.status}
            </p>
            {selected.amount ? (
              <p style={{ margin: "8px 0 0", color: OSP.navy, fontSize: 22, fontWeight: 950 }}>{selected.amount}</p>
            ) : null}
          </div>
        </div>

        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 9 }}>
          {selected.meta.map(([label, value]) => (
            <div key={label} style={{ borderRadius: 16, border: "1px solid rgba(5,150,165,0.13)", background: OSP.mist, padding: "10px 11px", minHeight: 64 }}>
              <p style={{ margin: 0, color: "#6B7FA1", fontSize: 10, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</p>
              <p style={{ margin: "7px 0 0", color: OSP.navy, fontSize: 13, lineHeight: 1.25, fontWeight: 900 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 0.8fr", gap: 14 }}>
        <div style={{ borderRadius: 20, border: "1px solid rgba(1,56,99,0.10)", background: "rgba(255,255,255,0.76)", padding: 15 }}>
          <p style={{ margin: 0, color: OSP.navy, fontSize: 14, fontWeight: 950 }}>LGU / DOT note</p>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            style={{
              marginTop: 10,
              width: "100%",
              minHeight: 84,
              resize: "vertical",
              borderRadius: 16,
              border: "1px solid rgba(5,150,165,0.18)",
              background: "#FFFFFF",
              color: OSP.navy,
              padding: 12,
              fontSize: 13,
              lineHeight: 1.45,
              fontWeight: 720,
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>

        <div style={{ borderRadius: 20, border: "1px solid rgba(243,174,38,0.24)", background: "rgba(255,248,232,0.84)", padding: 15 }}>
          <p style={{ margin: 0, color: "#8A5A00", fontSize: 14, fontWeight: 950 }}>Demo actions</p>
          <p style={{ margin: "8px 0 12px", color: OSP.slate, fontSize: 13, lineHeight: 1.45, fontWeight: 720 }}>
            {config.caution}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <DemoButton tone="primary" onClick={() => setStatus(`${config.primaryAction}: sample action recorded`)}>
              {config.primaryAction}
            </DemoButton>
            <DemoButton tone="secondary" onClick={() => setStatus(`${config.secondaryAction}: sample action recorded`)}>
              {config.secondaryAction}
            </DemoButton>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, borderRadius: 18, border: "1px solid rgba(5,150,165,0.16)", background: "rgba(234,251,250,0.72)", padding: "12px 14px", color: OSP.slate, fontSize: 13, fontWeight: 760, lineHeight: 1.45 }}>
        <strong style={{ color: OSP.navy }}>Current demo state:</strong> {status}. Production behavior remains DB-backed, role-checked, and audit-logged.
      </div>
    </div>
  );
}
