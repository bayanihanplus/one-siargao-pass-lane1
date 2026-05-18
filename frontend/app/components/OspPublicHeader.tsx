"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/passport-trails", label: "Passport Trails", match: ["/passport-trails"] },
  { href: "/explore", label: "Explore", match: ["/explore"] },
  { href: "/operators", label: "Local Partners", match: ["/operators"] },
  { href: "/ota", label: "Partners", match: ["/ota"] },
];

function isActive(pathname: string, matches: string[]) {
  return matches.some((match) => pathname === match || pathname.startsWith(`${match}/`));
}

export default function OspPublicHeader() {
  const pathname = usePathname() || "/";

  return (
    <header className="osp-public-header">
      <div className="osp-public-header-shell">
        <Link className="osp-public-brand" href="/" aria-label="Go to One Siargao Pass home">
          <span className="osp-public-logo-mark" aria-hidden="true">
            <img src="/osp/osp-public-header-logo-clean.png" alt="" />
          </span>
          <span className="osp-public-brand-copy">
            <strong>One Siargao Pass™</strong>
            <small>Siargao’s trusted travel gateway</small>
          </span>
        </Link>

        <nav className="osp-public-nav" aria-label="Public website navigation">
          {navItems.map((item) => {
            const active = isActive(pathname, item.match);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "is-active" : undefined}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="osp-public-actions">
          <Link className="osp-public-signin" href="/login?mode=returning">
            Sign in
          </Link>
          <Link className="osp-public-pass-cta" href="/traveler/start">
            Get Your Pass
          </Link>
        </div>
      </div>
    </header>
  );
}
