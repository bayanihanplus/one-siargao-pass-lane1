import OperatorShell from "../../../src/components/operator/OperatorShell";

export default function OperatorSettingsPage() {
  return (
    <OperatorShell
      currentPath="/operator/settings"
      title="Settings"
      subtitle="Operator account and workspace settings will live here."
    >
      <section
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          background: "#ffffff",
          padding: 22,
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
        }}
      >
        <p style={{ margin: 0, color: "#475569", fontSize: 16 }}>
          Settings shell is ready for future hardening.
        </p>
      </section>
    </OperatorShell>
  );
}
