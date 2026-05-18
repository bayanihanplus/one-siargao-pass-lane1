import Link from "next/link";

const gatewayLinks = [
  { href: "/osp-pass", label: "Get Your Pass" },
  { href: "/explore", label: "Explore" },
  { href: "/passport-trails", label: "Passport Trails" },
];

const partnerLinks = [
  { href: "/operators", label: "Local Partners" },
  { href: "/ota", label: "Travel Partners" },
  { href: "/developers", label: "Developers" },
];

const trustLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/support", label: "Support" },
  { href: "/operator-terms", label: "Operator Terms" },
  { href: "/ota-terms", label: "Partner Terms" },
  { href: "/api-terms", label: "API Terms" },
];

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div className="osp-public-footer-column">
      <h3>{title}</h3>
      <nav aria-label={`${title} footer links`}>
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default function OspPublicFooter() {
  return (
    <footer className="osp-public-footer" aria-label="One Siargao Pass public footer">
      <div className="osp-public-footer-shell">
        <div className="osp-public-footer-card">
          <div className="osp-public-footer-top">
            <section className="osp-public-footer-brand-panel" aria-label="One Siargao Pass operator information">
              <div className="osp-public-footer-brand-row">
                <span className="osp-public-footer-logo" aria-hidden="true">
                  <img src="/osp/osp-public-header-logo-clean.png" alt="" />
                </span>

                <div>
                  <strong>One Siargao Pass™</strong>
                  <p>Digital travel gateway for Siargao traveler access, local bookings, and connected journeys.</p>
                </div>
              </div>

              <div className="osp-public-footer-operator">
                <span>Operated by</span>
                <strong>Sakatayo Ventures Corporation</strong>
              </div>
            </section>

            <div className="osp-public-footer-link-grid">
              <FooterLinkColumn title="Gateway" links={gatewayLinks} />
              <FooterLinkColumn title="Partners" links={partnerLinks} />
              <FooterLinkColumn title="Trust & Legal" links={trustLinks} />
            </div>
          </div>

          <div className="osp-public-footer-bottom">
            <div className="osp-public-footer-business">
              <span>Business Office</span>
              <strong>749 Tourism Road, General Luna, Siargao, Philippines 8419</strong>
            </div>

            <div className="osp-public-footer-business">
              <span>Contact</span>
              <strong>0927 721 6212</strong>
            </div>

            <div className="osp-public-footer-business osp-public-footer-copyright">
              <span>Public Trust Gateway</span>
              <strong>© One Siargao Pass™</strong>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
