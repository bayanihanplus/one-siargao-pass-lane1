import Link from "next/link";

type SpmScanQrCtaProps = {
  source: "partner-tours" | "official-trails" | "diy-trail-builder" | "passport-trails";
  trail?: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  cta?: string;
  compact?: boolean;
};

function buildScanHref(source: string, trail?: string) {
  const params = new URLSearchParams({ source });
  if (trail) params.set("trail", trail);
  return `/traveler/scan?${params.toString()}`;
}

export function SpmScanQrCta({
  source,
  trail,
  eyebrow = "Site QR Verification",
  title = "Scan site QR",
  body = "Open camera at approved operator sites or verified stops. Stamps unlock only after governed QR validation.",
  cta = "Scan QR",
  compact = false,
}: SpmScanQrCtaProps) {
  return (
    <section
      aria-label={`${title} CTA`}
      style={{
        marginTop: compact ? 10 : 14,
        border: "1px solid #bfe7ee",
        borderRadius: compact ? 20 : 26,
        background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(232,251,255,0.92))",
        padding: compact ? 11 : 14,
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: compact ? 9 : 12,
        alignItems: "center",
        boxShadow: "0 14px 34px rgba(8,61,103,0.08)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: compact ? 40 : 48,
          height: compact ? 40 : 48,
          borderRadius: compact ? 15 : 18,
          background: "linear-gradient(135deg, #14b8c6, #11843d)",
          color: "#ffffff",
          display: "grid",
          placeItems: "center",
          fontSize: compact ? 20 : 24,
          fontWeight: 950,
          boxShadow: "0 10px 22px rgba(7,141,160,0.18)",
        }}
      >
        ▣
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: compact ? 9 : 10,
            fontWeight: 950,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#0891b2",
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{
            marginTop: 3,
            fontSize: compact ? 14 : 16,
            lineHeight: 1.08,
            fontWeight: 950,
            color: "#14264b",
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 4,
            fontSize: compact ? 11 : 12,
            lineHeight: 1.3,
            fontWeight: 720,
            color: "#53657d",
          }}
        >
          {body}
        </div>
      </div>

      <Link
        href={buildScanHref(source, trail)}
        style={{
          minHeight: compact ? 40 : 46,
          borderRadius: compact ? 15 : 17,
          background: "linear-gradient(135deg, #14b8c6, #11843d)",
          color: "#ffffff",
          display: "grid",
          placeItems: "center",
          textDecoration: "none",
          padding: compact ? "0 12px" : "0 15px",
          fontSize: compact ? 12 : 13,
          fontWeight: 950,
          whiteSpace: "nowrap",
          boxShadow: "0 8px 18px rgba(7,141,160,0.18)",
        }}
      >
        {cta}
      </Link>
    </section>
  );
}

export function SpmThreeJourneyScanQrPanel() {
  return (
    <section
      aria-label="SPM Journey QR scan actions"
      style={{
        marginTop: 14,
        border: "1px solid #bfe7ee",
        borderRadius: 26,
        background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(232,251,255,0.9))",
        padding: 14,
        display: "grid",
        gap: 10,
        boxShadow: "0 14px 34px rgba(8,61,103,0.08)",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 950,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#0891b2",
          }}
        >
          SPM QR Verification
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 18,
            lineHeight: 1.08,
            fontWeight: 950,
            color: "#14264b",
          }}
        >
          Scan at approved sites
        </div>
        <p
          style={{
            margin: "5px 0 0",
            fontSize: 12,
            lineHeight: 1.35,
            fontWeight: 720,
            color: "#53657d",
          }}
        >
          Use this only at approved operator sites or verified stops. Passport stamps unlock after governed QR validation.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        {[
          { href: "/traveler/scan?source=partner-tours", label: "Partner" },
          { href: "/traveler/scan?source=official-trails", label: "Trails" },
          { href: "/traveler/scan?source=diy-trail-builder", label: "DIY" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              minHeight: 44,
              borderRadius: 16,
              background: "linear-gradient(135deg, #14b8c6, #11843d)",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 950,
              boxShadow: "0 8px 18px rgba(7,141,160,0.16)",
            }}
          >
            ▣ {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
