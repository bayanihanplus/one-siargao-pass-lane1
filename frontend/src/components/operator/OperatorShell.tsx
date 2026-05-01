import React from "react";

type OperatorShellProps = {
  title: string;
  subtitle?: string;
  currentPath: string;
  children: React.ReactNode;
};

const navItems = [
  { href: "/operator", label: "Dashboard" },
  { href: "/operator/activities", label: "Activities" },
  { href: "/operator/manifests", label: "Manifests" },
  { href: "/operator/access-scan", label: "Access Scan" },
  { href: "/operator/records", label: "Records" },
  { href: "/operator/commercial", label: "Commercial" },
  { href: "/operator/guides", label: "Guides" },
  { href: "/operator/settings", label: "Settings" },
];

function isActive(currentPath: string, href: string) {
  if (href === "/operator") return currentPath === "/operator";
  return currentPath === href || currentPath.startsWith(href + "/");
}

export default function OperatorShell({
  title,
  subtitle,
  currentPath,
  children,
}: OperatorShellProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "260px minmax(0, 1fr)",
          minHeight: "100vh",
        }}
      >
        <aside
          style={{
            borderRight: "1px solid #e2e8f0",
            background: "#ffffff",
            padding: 20,
            position: "sticky",
            top: 0,
            alignSelf: "start",
            minHeight: "100vh",
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1,
                color: "#64748b",
                marginBottom: 8,
              }}
            >
              OPERATOR WORKSPACE
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.1 }}>
              One Siargao Pass
            </div>
            <div style={{ marginTop: 6, fontSize: 14, color: "#475569" }}>
              Simple operator dashboard for daily activity operations.
            </div>
          </div>

          <nav style={{ display: "grid", gap: 8 }}>
            {navItems.map((item) => {
              const active = isActive(currentPath, item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    textDecoration: "none",
                    padding: "12px 14px",
                    borderRadius: 12,
                    fontWeight: 800,
                    fontSize: 15,
                    background: active ? "#0f172a" : "#ffffff",
                    color: active ? "#ffffff" : "#0f172a",
                    border: active ? "1px solid #0f172a" : "1px solid #94a3b8",
                    boxShadow: active ? "0 8px 20px rgba(15,23,42,0.10)" : "none",
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div
            style={{
              marginTop: 28,
              paddingTop: 18,
              borderTop: "1px solid #e2e8f0",
              display: "grid",
              gap: 8,
            }}
          >
            <a href="/" style={{ textDecoration: "none", color: "#334155", fontWeight: 700 }}>
              ← Dev Entry
            </a>
            <a href="/logout" style={{ textDecoration: "none", color: "#334155", fontWeight: 700 }}>
              Logout
            </a>
          </div>
        </aside>

        <section style={{ padding: 28 }}>
          <header
            style={{
              marginBottom: 20,
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 20,
              padding: 22,
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
            }}
          >
            <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.05 }}>{title}</h1>
            {subtitle ? (
              <p style={{ marginTop: 10, marginBottom: 0, color: "#475569", fontSize: 15 }}>
                {subtitle}
              </p>
            ) : null}
          </header>

          {children}
        </section>
      </div>
    </div>
  );
}
