import { getCurrentUser } from "../src/lib/server-auth";

function Section(props: { title: string; children: any }) {
  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 12 }}>{props.title}</h2>
      {props.children}
    </section>
  );
}

function LinkList(props: { items: Array<{ href: string; label: string }> }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
      {props.items.map((item) => (
        <li key={item.href}>
          <a href={item.href}>{item.label}</a>
        </li>
      ))}
    </ul>
  );
}

function isOperatorRole(role: string | null | undefined) {
  return ["OPERATOR_OWNER", "OPERATOR_MANAGER", "OPERATOR_STAFF"].includes(role || "");
}

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
        <h1 style={{ marginBottom: 8 }}>One Siargao Pass</h1>
        <p style={{ marginTop: 0, marginBottom: 24 }}>
          Role-aware landing flow is now active. Please log in to continue.
        </p>

        <Section title="Get Started">
          <LinkList
            items={[
              { href: "/login", label: "Login" },
              { href: "/dev", label: "Open Dev Route Index" },
            ]}
          />
        </Section>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>One Siargao Pass</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Welcome back, {user.fullName || user.email || user.id}.
      </p>

      <Section title="Session">
        <div style={{ marginBottom: 8 }}><strong>Email:</strong> {user.email ?? "—"}</div>
        <div style={{ marginBottom: 8 }}><strong>Role:</strong> {user.primaryRole ?? "—"}</div>
        <div style={{ marginBottom: 8 }}><strong>Status:</strong> {user.accountStatus ?? "—"}</div>
      </Section>

      {user.primaryRole === "ADMIN" ? (
        <Section title="Admin Landing">
          <LinkList
            items={[
              { href: "/admin/activities", label: "Admin Activities" },
              { href: "/admin/manifest-approvals", label: "Manifest Approval Queue" },
              { href: "/admin/manifests/history", label: "Manifest History" },
              { href: "/dev", label: "Dev Route Index" },
              { href: "/logout", label: "Logout" },
            ]}
          />
        </Section>
      ) : null}

      {isOperatorRole(user.primaryRole) ? (
        <Section title="Operator Landing">
          <LinkList
            items={[
              { href: "/operator/activities", label: "Operator Activities" },
              { href: "/operator/manifests", label: "Operator Manifests" },
              { href: "/dev", label: "Dev Route Index" },
              { href: "/logout", label: "Logout" },
            ]}
          />
        </Section>
      ) : null}

      {user.primaryRole === "TRAVELER" ? (
        <Section title="Traveler Landing">
          <LinkList
            items={[
              { href: "/traveler/pass", label: "Traveler Pass" },
              { href: "/traveler/trips/cmo77w9sl0001tx4nohfhue9k", label: "Traveler Trip Detail" },
              { href: "/dev", label: "Dev Route Index" },
              { href: "/logout", label: "Logout" },
            ]}
          />
        </Section>
      ) : null}
    </main>
  );
}
