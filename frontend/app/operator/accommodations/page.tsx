import OperatorShell from "../../../src/components/operator/OperatorShell";
import { getApiBaseUrl, requireAccessToken } from "../../../src/lib/server-auth";

export const dynamic = "force-dynamic";

type StatusChip = {
  label?: string;
  tone?: string;
  description?: string;
};

type OperatorAction = {
  label?: string;
  mode?: string;
  href?: string;
};

type AccommodationCard = {
  accommodationId?: string;
  displayTitle?: string;
  propertyReadinessChip?: StatusChip;
  roomReadinessChip?: StatusChip;
  inventoryReadinessChip?: StatusChip;
  qrCheckInReadinessChip?: StatusChip;
  requestQueueLabel?: string;
  stayQueueLabel?: string;
  voucherQueueLabel?: string;
  settlementWording?: string;
  primaryAction?: OperatorAction;
  secondaryAction?: OperatorAction;
};

async function safeAccommodationList(token: string): Promise<AccommodationCard[]> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/operator/accommodations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return [];

    const json = await res.json().catch(() => []);
    return Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

function chipToneStyle(tone?: string): React.CSSProperties {
  const normalized = String(tone || "").toUpperCase();

  if (normalized === "READY") {
    return {
      background: "#EAFBFA",
      color: "#013863",
      border: "1px solid rgba(5,150,165,0.35)",
    };
  }

  if (normalized === "INFO") {
    return {
      background: "#EFF6FF",
      color: "#003B66",
      border: "1px solid rgba(0,59,102,0.18)",
    };
  }

  return {
    background: "#FFF7E8",
    color: "#7A4A00",
    border: "1px solid rgba(243,174,38,0.38)",
  };
}

function StatusBlock(props: { title: string; chip?: StatusChip }) {
  const chip = props.chip || {};
  return (
    <article
      style={{
        border: "1px solid #E2E8F0",
        borderRadius: 18,
        padding: 16,
        background: "#FFFFFF",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 900, color: "#50668B", letterSpacing: 0.6, textTransform: "uppercase" }}>
        {props.title}
      </div>
      <div
        style={{
          ...chipToneStyle(chip.tone),
          display: "inline-flex",
          marginTop: 10,
          borderRadius: 999,
          padding: "7px 10px",
          fontSize: 13,
          fontWeight: 900,
        }}
      >
        {chip.label || "Not configured"}
      </div>
      <p style={{ margin: "10px 0 0", color: "#475569", fontSize: 14, lineHeight: 1.45 }}>
        {chip.description || "No readiness detail returned yet."}
      </p>
    </article>
  );
}

function QueuePill(props: { label?: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        borderRadius: 999,
        padding: "8px 11px",
        background: "#F8FAFC",
        border: "1px solid #CBD5E1",
        color: "#0F172A",
        fontSize: 13,
        fontWeight: 800,
      }}
    >
      {props.label || "0 records"}
    </span>
  );
}

function AccommodationCardView({ item }: { item: AccommodationCard }) {
  return (
    <article
      style={{
        background: "#FFFFFF",
        border: "1px solid #DDE7F0",
        borderRadius: 24,
        padding: 22,
        boxShadow: "0 12px 34px rgba(1, 56, 99, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 18,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: "#0596A5",
              fontSize: 12,
              fontWeight: 950,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            Accommodation profile
          </p>
          <h2 style={{ margin: "8px 0 0", fontSize: 26, lineHeight: 1.08, color: "#013863" }}>
            {item.displayTitle || "Untitled accommodation"}
          </h2>
          <p style={{ margin: "8px 0 0", color: "#64748B", fontSize: 13 }}>
            ID: {item.accommodationId || "Not returned"}
          </p>
        </div>

        <div
          style={{
            borderRadius: 18,
            padding: "12px 14px",
            background: "#013863",
            color: "#FFFFFF",
            minWidth: 220,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 900, color: "#F3AE26", textTransform: "uppercase" }}>
            Settlement status
          </div>
          <p style={{ margin: "7px 0 0", fontSize: 13, lineHeight: 1.4 }}>
            {item.settlementWording || "Payment and payout readiness are not enabled yet."}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          marginTop: 20,
        }}
      >
        <StatusBlock title="Profile" chip={item.propertyReadinessChip} />
        <StatusBlock title="Rooms" chip={item.roomReadinessChip} />
        <StatusBlock title="Availability" chip={item.inventoryReadinessChip} />
        <StatusBlock title="QR Check-in" chip={item.qrCheckInReadinessChip} />
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
        <QueuePill label={item.requestQueueLabel} />
        <QueuePill label={item.stayQueueLabel} />
        <QueuePill label={item.voucherQueueLabel} />
      </div>

      <div
        style={{
          marginTop: 18,
          paddingTop: 18,
          borderTop: "1px solid #E2E8F0",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            borderRadius: 14,
            padding: "11px 14px",
            background: "#0596A5",
            color: "#FFFFFF",
            fontWeight: 900,
            fontSize: 14,
          }}
        >
          {item.primaryAction?.label || "Review accommodation"}
        </span>
        <span
          style={{
            borderRadius: 14,
            padding: "11px 14px",
            background: "#F3AE26",
            color: "#013863",
            fontWeight: 950,
            fontSize: 14,
          }}
        >
          {item.secondaryAction?.label || "Manage rooms"}
        </span>
      </div>

      <p style={{ margin: "12px 0 0", color: "#64748B", fontSize: 12, lineHeight: 1.45 }}>
        Read-only console view. Profile, room, media, booking, and payment mutations remain separate lanes.
      </p>
    </article>
  );
}

export default async function OperatorAccommodationsPage() {
  const token = await requireAccessToken();
  const accommodations = await safeAccommodationList(token);

  return (
    <OperatorShell
      title="Accommodation Console"
      subtitle="Read-only operator view for accommodation profile readiness, rooms, availability, media readiness, and setup queues."
      currentPath="/operator/accommodations"
    >
      <section
        style={{
          display: "grid",
          gap: 18,
        }}
      >
        <div
          style={{
            borderRadius: 24,
            padding: 22,
            background: "linear-gradient(135deg, #013863, #0596A5)",
            color: "#FFFFFF",
            boxShadow: "0 14px 36px rgba(1, 56, 99, 0.18)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#F3AE26",
              fontSize: 12,
              fontWeight: 950,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            ACCOM-23A · Read integration
          </p>
          <h2 style={{ margin: "8px 0 0", fontSize: 30, lineHeight: 1.05 }}>
            Your accommodation setup state, without pretending publishing is ready.
          </h2>
          <p style={{ margin: "10px 0 0", maxWidth: 760, color: "#EAFBFA", lineHeight: 1.55 }}>
            This page reads the backend accommodation operator API only. Draft creation, profile editing, room pricing, media upload, and admin approval remain controlled backend lanes.
          </p>
        </div>

        {accommodations.length ? (
          accommodations.map((item) => (
            <AccommodationCardView key={item.accommodationId || item.displayTitle} item={item} />
          ))
        ) : (
          <article
            style={{
              background: "#FFFFFF",
              border: "1px solid #DDE7F0",
              borderRadius: 24,
              padding: 26,
              boxShadow: "0 12px 34px rgba(1, 56, 99, 0.06)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#0596A5",
                fontSize: 12,
                fontWeight: 950,
                letterSpacing: 0.8,
                textTransform: "uppercase",
              }}
            >
              No accommodation profile returned
            </p>
            <h2 style={{ margin: "8px 0 0", fontSize: 26, color: "#013863" }}>
              No operator-owned accommodations are visible yet.
            </h2>
            <p style={{ margin: "10px 0 0", color: "#475569", lineHeight: 1.55 }}>
              Backend read integration is active. The next mutation UI lane can add draft creation, but this page intentionally does not create records.
            </p>
          </article>
        )}
      </section>
    </OperatorShell>
  );
}
