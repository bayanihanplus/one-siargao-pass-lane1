import Link from "next/link";

const footerLinks = [
  { href: "/traveler/start", label: "Get Your Pass" },
  { href: "/explore", label: "Explore" },
  { href: "/operators", label: "Local Partners" },
  { href: "/ota", label: "Partners" },
  { href: "/developers", label: "Developers" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/support", label: "Support" },
  { href: "/operator-terms", label: "Operator Terms" },
  { href: "/ota-terms", label: "Partner Terms" },
  { href: "/api-terms", label: "API Terms" },
];

export default function OspPublicFooter() {
  return (
    <footer className="osp-public-footer" aria-label="One Siargao Pass public footer">
      <div className="osp-public-footer-shell">
        <div className="osp-public-footer-brand">
          <span className="osp-public-footer-logo" aria-hidden="true">
            <img src="/osp/osp-public-header-logo-clean.png" alt="" />
          </span>

          <div className="osp-public-footer-copy">
            <strong>One Siargao Pass™</strong>
            <p>
              Premium public trust gateway for Siargao traveler access, local bookings,
              and connected journeys.
            </p>
            <small>Powered by: SAKATAYO VENTURES CORPORATION</small>
            <address>
              749 Tourism Road, General Luna, Siargao, General Luna, Philippines, 8419
            </address>
            <a className="osp-public-footer-phone" href="tel:+639277216212">
              0927 721 6212
            </a>
          </div>
        </div>

        <nav className="osp-public-footer-links" aria-label="Footer navigation">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
