import OperatorShell from "../../../src/components/operator/OperatorShell";

export default function OperatorGuidesPage() {
  return (
    <OperatorShell
      currentPath="/operator/guides"
      title="Guides"
      subtitle="Guide assignments, payment tracking, tips, and commission traceability will live here."
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
          Guides shell is ready. Guide payment tracking IA will be hardened in a later lane.
        </p>
      </section>
    </OperatorShell>
  );
}
