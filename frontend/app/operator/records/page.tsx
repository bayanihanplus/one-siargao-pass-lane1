import OperatorShell from "../../../src/components/operator/OperatorShell";

export default function OperatorRecordsPage() {
  return (
    <OperatorShell
      currentPath="/operator/records"
      title="Records"
      subtitle="Review access records, statuses, and operator activity history."
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
          Records list shell is ready for the next hardening lane.
        </p>
      </section>
    </OperatorShell>
  );
}
