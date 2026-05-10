"use client";

/*
 * ADMIN-CT-27 naming doctrine:
 * - User-facing/admin-facing product name: One Siargao Pass Command Center.
 * - Engineering/code lane name remains ControlTower / ADMIN-CT to avoid route/module churn.
 * - Do not rename folders, routes, DTOs, backend modules, or contracts in this lane.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { controlTowerNav } from "./controlTowerNav";
import styles from "./controlTower.module.css";
import type { CSSProperties } from "react";


const sidebarHardStyle: CSSProperties = {
  background: "linear-gradient(180deg, #013863 0%, #01466d 48%, #012f58 100%)",
  borderRight: "1px solid rgba(255,255,255,0.18)",
  boxShadow: "22px 0 58px rgba(1,56,99,0.24)",
  color: "#ffffff",
  opacity: 1,
  filter: "none",
};

const brandHardStyle: CSSProperties = {
  background: "linear-gradient(135deg, rgba(1,56,99,0.98), rgba(5,150,165,0.86))",
  border: "1px solid rgba(255,255,255,0.16)",
  borderRadius: 28,
  boxShadow: "0 18px 44px rgba(0,0,0,0.18)",
};

const navItemHardStyle: CSSProperties = {
  background: "linear-gradient(135deg, rgba(1,56,99,0.72), rgba(5,150,165,0.42))",
  border: "1px solid rgba(255,255,255,0.22)",
  color: "#ffffff",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 10px 26px rgba(0,0,0,0.18)",
};

const navItemActiveHardStyle: CSSProperties = {
  background: "linear-gradient(135deg, #ffffff 0%, #f4fcfa 100%)",
  border: "1px solid rgba(243,174,38,0.78)",
  color: "#013863",
  boxShadow: "0 18px 42px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.92)",
};

const navCodeHardStyle: CSSProperties = {
  background: "rgba(243,174,38,0.18)",
  border: "1px solid rgba(243,174,38,0.42)",
  color: "#f3ae26",
};

const navCodeActiveHardStyle: CSSProperties = {
  background: "#f3ae26",
  border: "1px solid rgba(243,174,38,0.72)",
  color: "#013863",
};

const navLabelHardStyle: CSSProperties = {
  color: "#ffffff",
  fontWeight: 820,
  letterSpacing: "-0.01em",
  textShadow: "0 1px 10px rgba(0,0,0,0.28)",
};

const navLabelActiveHardStyle: CSSProperties = {
  color: "#013863",
  fontWeight: 800,
};

const navStatusHardStyle: CSSProperties = {
  color: "rgba(255,255,255,0.92)",
};

const navStatusActiveHardStyle: CSSProperties = {
  color: "#50668b",
};

const sidebarFootHardStyle: CSSProperties = {
  background: "linear-gradient(135deg, rgba(1,47,88,0.98), rgba(5,150,165,0.76))",
  borderTop: "1px solid rgba(255,255,255,0.18)",
  color: "rgba(255,255,255,0.92)",
};

type Props = {
  children: React.ReactNode;
};

function isActive(pathname: string, href: string, key: string) {
  if (key === "command-center") {
    return pathname === "/admin/control-tower" || pathname === "/admin/control-tower/command-center";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ControlTowerShell({ children }: Props) {
  const pathname = usePathname();
  const safePathname = pathname ?? '';

  return (
    <div className={styles.page}>
      <div className={styles.frame}>
        <aside className={styles.sidebar} style={sidebarHardStyle}>
          <div className={styles.sidebarInner}>
            <div className={styles.brand} style={brandHardStyle}>
              <p className={styles.brandEyebrow} style={{ color: "#f3ae26" }}>One Siargao Pass</p>
              <h1 className={styles.brandTitle} style={{ color: "#ffffff" }}>One Siargao Pass Command Center</h1>
              <p className={styles.brandText} style={{ color: "rgba(255,255,255,0.90)" }}>
                Govern OSP, SPM, commercial lanes, compliance, AI, pricing,
                exposure, and intelligence from one protected command spine.
              </p>
            </div>

            <nav className={styles.nav}>
              <div className={styles.navList}>
                {controlTowerNav.map((item) => {
                  const active = isActive(safePathname, item.href, item.key);

                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                    >
                      <span className={styles.navCode}>{item.code}</span>
                      <span>
                        <span className={styles.navLabel}>{item.label}</span>
                        <span className={styles.navStatus}>{item.readiness}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className={styles.sidebarFoot} style={sidebarFootHardStyle}>
              <p>
                Protected Super Admin shell. No LGU, operator, traveler, or
                public discovery controls should be mixed into this surface.
              </p>
            </div>
          </div>
        </aside>

        <main className={styles.main}>
          <div className={styles.mobileNav}>
            <p className={styles.mobileTitle}>One Siargao Pass Command Center</p>
            <div className={styles.mobileScroll}>
              {controlTowerNav.map((item) => {
                const active = isActive(safePathname, item.href, item.key);

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`${styles.mobilePill} ${active ? styles.mobilePillActive : ""}`}
                  >
                    <span>{item.code}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
