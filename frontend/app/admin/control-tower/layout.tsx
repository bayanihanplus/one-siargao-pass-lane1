import type { Metadata } from "next";
import { ControlTowerShell } from "../../../src/admin/controlTower/ControlTowerShell";

export const metadata: Metadata = {
  title: "Super Admin Control Tower | One Siargao Pass",
  description:
    "Protected Super Admin command spine for OSP, SPM, commercial governance, compliance, pricing, marketplace exposure, AI, API, intelligence, and settings.",
};

export default function AdminControlTowerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ControlTowerShell>{children}</ControlTowerShell>;
}
