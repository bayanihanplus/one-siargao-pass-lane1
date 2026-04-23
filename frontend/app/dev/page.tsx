export default function DevPage() {
  const sectionStyle = {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  } as const;

  const listStyle = {
    margin: 0,
    paddingLeft: 18,
    lineHeight: 1.8,
  } as const;

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>One Siargao Pass — Dev Entry</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Temporary route index for operator, admin, and traveler dev-bridge surfaces.
      </p>

      <section style={sectionStyle}>
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>Operator Surfaces</h2>
        <ul style={listStyle}>
          <li><a href="/operator/activities">/operator/activities</a></li>
          <li><a href="/operator/manifests">/operator/manifests</a></li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>Admin Surfaces</h2>
        <ul style={listStyle}>
          <li><a href="/admin/activities">/admin/activities</a></li>
          <li><a href="/admin/manifest-approvals">/admin/manifest-approvals</a></li>
          <li><a href="/admin/manifests/history">/admin/manifests/history</a></li>
          <li><a href="/admin/checkpoint">/admin/checkpoint</a></li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>Traveler Surfaces</h2>
        <ul style={listStyle}>
          <li><a href="/traveler/pass">/traveler/pass</a></li>
          <li><a href="/traveler/trips/cmo77w9sl0001tx4nohfhue9k">/traveler/trips/cmo77w9sl0001tx4nohfhue9k</a></li>
        </ul>
      </section>
    </main>
  );
}
