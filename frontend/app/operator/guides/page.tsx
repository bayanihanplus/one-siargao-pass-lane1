import OperatorShell from "../../../src/components/operator/OperatorShell";
import { revalidatePath } from "next/cache";
import { getApiBaseUrl, requireAccessToken } from "../../../src/lib/server-auth";

async function getProfile() {
  const token = await requireAccessToken();
  const res = await fetch(`${getApiBaseUrl()}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return await res.json().catch(() => null);
}

async function getAssignments() {
  const token = await requireAccessToken();
  const res = await fetch(`${getApiBaseUrl()}/guides/assignments`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json().catch(() => ({ data: [] }));
  return Array.isArray(json?.data) ? json.data : [];
}

async function getActivityInstances() {
  const token = await requireAccessToken();
  const res = await fetch(`${getApiBaseUrl()}/guides/assignable-activities`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json().catch(() => ({ data: [] }));
  return Array.isArray(json?.data) ? json.data : [];
}

async function createGuideAssignmentAction(formData: FormData) {
  "use server";

  const token = await requireAccessToken();
  const guideNameSnapshot = String(formData.get("guideNameSnapshot") || "").trim();

  if (!guideNameSnapshot) throw new Error("Guide name is required.");

  const profileRes = await fetch(`${getApiBaseUrl()}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const profile = profileRes.ok ? await profileRes.json().catch(() => null) : null;
  const role = profile?.primaryRole || "";
  const canManageMoney = role === "ADMIN" || role === "OPERATOR_OWNER";

  const payload = {
    guideNameSnapshot,
    activityInstanceId: String(formData.get("activityInstanceId") || "").trim(),
    basePayAmount: canManageMoney ? String(formData.get("basePayAmount") || "").trim() : "",
    tipAmount: canManageMoney ? String(formData.get("tipAmount") || "").trim() : "",
    commissionAmount: canManageMoney ? String(formData.get("commissionAmount") || "").trim() : "",
    paymentStatus: canManageMoney ? String(formData.get("paymentStatus") || "PENDING").trim() : "PENDING",
    paymentMethod: canManageMoney ? String(formData.get("paymentMethod") || "").trim() : "",
    notes: String(formData.get("notes") || "").trim(),
  };

  const res = await fetch(`${getApiBaseUrl()}/guides/assignments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Unable to create guide assignment.");
  revalidatePath("/operator/guides");
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-PH", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function money(value: any) {
  const n = Number(value || 0);
  return `₱${n.toLocaleString("en-PH")}`;
}

function Card(props: { title: string; subtitle?: string; children: any }) {
  return (
    <section style={{ border: "1px solid #e2e8f0", borderRadius: 18, background: "#ffffff", padding: 22 }}>
      <h2 style={{ marginTop: 0, marginBottom: 8 }}>{props.title}</h2>
      {props.subtitle ? <p style={{ marginTop: 0, marginBottom: 16, color: "#475569" }}>{props.subtitle}</p> : null}
      {props.children}
    </section>
  );
}

function Input(props: { label: string; name: string; placeholder?: string; type?: string }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={{ fontWeight: 900 }}>{props.label}</span>
      <input
        name={props.name}
        type={props.type || "text"}
        placeholder={props.placeholder || ""}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px 14px",
          borderRadius: 10,
          border: "1px solid #334155",
          color: "#0f172a",
          fontWeight: 700,
        }}
      />
    </label>
  );
}

export default async function OperatorGuidesPage() {
  const profile = await getProfile();
  const role = profile?.primaryRole || "";
  const canManageMoney = role === "ADMIN" || role === "OPERATOR_OWNER";

  const assignments = await getAssignments();
  const activityInstances = await getActivityInstances();

  const pending = canManageMoney ? assignments.filter((row: any) => row.paymentStatus === "PENDING").length : "Hidden";
  const paid = canManageMoney ? assignments.filter((row: any) => row.paymentStatus === "PAID").length : "Hidden";
  const totalDue = canManageMoney
    ? assignments.reduce((sum: number, row: any) => sum + Number(row.basePayAmount || 0) + Number(row.tipAmount || 0) + Number(row.commissionAmount || 0), 0)
    : null;

  return (
    <OperatorShell currentPath="/operator/guides" title="Guides" subtitle="Guide assignments and operations tracking.">
      <div style={{ display: "grid", gap: 20 }}>
        <section style={{ border: "1px solid #fde68a", borderRadius: 18, background: "#fffbeb", padding: 18, color: "#78350f" }}>
          <strong>Access rule:</strong> On-site operations staff can assign guides and add notes, but guide pay, tips, commission, and payment method are restricted to owner/admin roles.
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
          <Card title="Assignments"><div style={{ fontSize: 34, fontWeight: 900 }}>{assignments.length}</div></Card>
          <Card title="Pending"><div style={{ fontSize: 28, fontWeight: 900 }}>{pending}</div></Card>
          <Card title="Paid"><div style={{ fontSize: 28, fontWeight: 900 }}>{paid}</div></Card>
          <Card title="Total Tracked"><div style={{ fontSize: 28, fontWeight: 900 }}>{canManageMoney ? money(totalDue) : "Hidden"}</div></Card>
        </section>

        <Card title="Create Guide Assignment" subtitle="Assign a guide to a created activity departure.">
          <form action={createGuideAssignmentAction} style={{ display: "grid", gap: 14 }}>
            <Input label="Guide Name" name="guideNameSnapshot" placeholder="Example: Juan Dela Cruz" />

            <label style={{ display: "grid", gap: 8 }}>
              <span style={{ fontWeight: 900 }}>Activity Departure</span>
              <select
                name="activityInstanceId"
                defaultValue=""
                style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 10, border: "1px solid #334155", color: "#0f172a", fontWeight: 800 }}
              >
                <option value="">No activity selected</option>
                {activityInstances.map((row: any) => (
                  <option key={row.id} value={row.id}>
                    {row.activityTemplate?.title || row.activityTemplateId || row.id} | {formatDate(row.scheduledDate)} | {row.instanceStatus}
                  </option>
                ))}
              </select>
            </label>

            {canManageMoney ? (
              <>
                <Input label="Base Pay Amount" name="basePayAmount" type="number" placeholder="Example: 1500" />
                <Input label="Tip Amount" name="tipAmount" type="number" placeholder="Example: 200" />
                <Input label="Commission Amount" name="commissionAmount" type="number" placeholder="Example: 300" />

                <label style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontWeight: 900 }}>Payment Status</span>
                  <select name="paymentStatus" defaultValue="PENDING" style={{ padding: 12, borderRadius: 10, border: "1px solid #334155", fontWeight: 800 }}>
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="DISPUTED">DISPUTED</option>
                  </select>
                </label>

                <Input label="Payment Method" name="paymentMethod" placeholder="Cash, GCash, Bank, etc." />
              </>
            ) : (
              <section style={{ border: "1px solid #fde68a", borderRadius: 14, background: "#fffbeb", padding: 14, color: "#78350f" }}>
                Payment fields are hidden for operations staff.
              </section>
            )}

            <label style={{ display: "grid", gap: 8 }}>
              <span style={{ fontWeight: 900 }}>Notes</span>
              <textarea name="notes" rows={3} style={{ padding: 12, borderRadius: 10, border: "1px solid #334155" }} />
            </label>

            <button type="submit" style={{ padding: "12px 16px", borderRadius: 10, border: "none", background: "#0f172a", color: "#ffffff", fontWeight: 900 }}>
              Save Guide Assignment
            </button>
          </form>
        </Card>

        <Card title="Guide Assignment Records" subtitle="Operational guide assignment history.">
          {assignments.length === 0 ? (
            <p style={{ margin: 0, color: "#475569" }}>No guide assignments yet.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {assignments.map((row: any) => (
                <div key={row.id} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <strong>{row.guideNameSnapshot}</strong>
                    <strong>{canManageMoney ? row.paymentStatus : "Assigned"}</strong>
                  </div>

                  {canManageMoney ? (
                    <div style={{ marginTop: 8, color: "#475569" }}>
                      Base: {money(row.basePayAmount)} · Tip: {money(row.tipAmount)} · Commission: {money(row.commissionAmount)}
                    </div>
                  ) : null}

                  <div style={{ marginTop: 8, color: "#475569" }}>
                    {canManageMoney ? `Method: ${row.paymentMethod || "—"} · ` : ""}
                    Activity: {activityInstances.find((item: any) => item.id === row.activityInstanceId)?.activityTemplate?.title || row.activityInstanceId || "—"}
                  </div>

                  {row.notes ? <div style={{ marginTop: 8, color: "#475569" }}>Notes: {row.notes}</div> : null}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </OperatorShell>
  );
}
