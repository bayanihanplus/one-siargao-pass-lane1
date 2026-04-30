import Link from "next/link";
import type { ReactNode } from "react";

type PublicCta = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "light";
};

type PublicCard = {
  title: string;
  body: string;
  href?: string;
  eyebrow?: string;
};

type OspPublicPageShellProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryCta?: PublicCta;
  secondaryCta?: PublicCta;
  children?: ReactNode;
};

const officialLogoPath = "/osp/osp-logo.png";

const navItems = [
  { label: "Travelers", href: "/travelers" },
  { label: "Passport Trails", href: "/passport-trails" },
  { label: "Operators", href: "/operators" },
  { label: "API", href: "/ota" },
  { label: "Government", href: "/government" },
  { label: "Support", href: "/support" },
];

export function OspPublicPageShell(props: OspPublicPageShellProps) {
  return (
    <main className="osp-public-root">
      <header className="osp-public-header">
        <div className="osp-public-header-inner">
          <Link href="/" className="osp-public-brand" aria-label="One Siargao Pass home">
            <span className="osp-public-brand-logo-wrap">
              <img src={officialLogoPath} alt="One Siargao Pass" className="osp-public-brand-logo" />
            </span>
            <span>
              <p className="osp-public-brand-title">ONE SIARGAO PASS</p>
              <p className="osp-public-brand-subtitle">Powering the Digital Island</p>
            </span>
          </Link>

          <nav className="osp-public-nav">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="osp-public-header-actions">
            <PublicButton label="Traveler App" href="/traveler/home" variant="secondary" />
            <PublicButton label="Create Pass" href="/traveler/start" variant="primary" />
          </div>
        </div>

        <nav className="osp-public-mobile-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="osp-public-hero">
        <div className="osp-public-hero-inner">
          <div>
            {props.eyebrow ? <p className="osp-public-eyebrow">{props.eyebrow}</p> : null}
            <h1 className="osp-public-title">{props.title}</h1>
            <p className="osp-public-subtitle">{props.subtitle}</p>

            {(props.primaryCta || props.secondaryCta) ? (
              <div className="osp-public-cta-row">
                {props.primaryCta ? <PublicButton {...props.primaryCta} variant="primary" /> : null}
                {props.secondaryCta ? <PublicButton {...props.secondaryCta} variant="secondary" /> : null}
              </div>
            ) : null}
          </div>

          <div className="osp-public-info-card">
            <div className="osp-public-info-card-main">
              <p className="osp-public-info-label">Platform Gateway</p>
              <p className="osp-public-info-title">Website outside. Mobile app inside.</p>
              <p className="osp-public-info-body">
                The public website explains and routes the ecosystem. The traveler app handles pass, QR, trips, Passport Map, and mobile-first journey actions.
              </p>
            </div>

            <div className="osp-public-quick-grid">
              {[
                ["Website", "/", "Public gateway"],
                ["Traveler App", "/traveler/home", "Mobile interface"],
                ["API", "/ota", "Partner access"],
                ["Government", "/government", "Governed visibility"],
              ].map(([label, href, body]) => (
                <Link key={href} href={href} className="osp-public-quick-card">
                  <strong>{label}</strong>
                  <span>{body}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {props.children}

      <footer className="osp-public-footer">
        <div className="osp-public-footer-inner">
          <div>
            <p className="osp-public-footer-title">ONE SIARGAO PASS</p>
            <p className="osp-public-footer-body">
              A governed digital gateway for Siargao travelers, local operators, booking partners, and authorized destination stakeholders.
            </p>
          </div>
          <div className="osp-public-footer-links">
            <Link href="/travelers">Travelers</Link>
            <Link href="/operators">Operators</Link>
            <Link href="/ota">API</Link>
            <Link href="/developers">Developers</Link>
            <Link href="/government">Government</Link>
            <Link href="/support">Support</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/data-governance">Data Governance</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

export function PublicButton(props: PublicCta) {
  const variant = props.variant || "primary";
  const variantClass =
    variant === "primary"
      ? "osp-public-button-primary"
      : variant === "light"
        ? "osp-public-button-light"
        : "osp-public-button-secondary";

  return (
    <Link href={props.href} className={`osp-public-button ${variantClass}`}>
      {props.label}
    </Link>
  );
}

export function PublicSection(props: {
  eyebrow?: string;
  title: string;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <section className="osp-public-section">
      {props.eyebrow ? <p className="osp-public-eyebrow">{props.eyebrow}</p> : null}
      <h2 className="osp-public-section-title">{props.title}</h2>
      {props.body ? <p className="osp-public-section-body">{props.body}</p> : null}
      {props.children}
    </section>
  );
}

export function PublicCardGrid(props: { cards: PublicCard[] }) {
  return (
    <div className="osp-public-card-grid">
      {props.cards.map((card) => (
        <article key={card.title} className="osp-public-card">
          {card.eyebrow ? <p className="osp-public-card-eyebrow">{card.eyebrow}</p> : null}
          <h3 className="osp-public-card-title">{card.title}</h3>
          <p className="osp-public-card-body">{card.body}</p>
          {card.href ? (
            <Link href={card.href} className="osp-public-card-link">
              Learn more →
            </Link>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function PublicTrustStrip() {
  return (
    <section className="osp-public-trust-strip">
      <div className="osp-public-trust-inner">
        <p>OSP-issued QR identity</p>
        <p>Approved partner access</p>
        <p>Role-scoped visibility</p>
        <p>Audit-ready records</p>
      </div>
    </section>
  );
}
