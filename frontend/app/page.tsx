"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type BookingLane = {
  key: string;
  label: string;
  shortLabel: string;
  eyebrow: string;
  placeholder: string;
  dateLabel: string;
  paxLabel: string;
  typeLabel: string;
  defaultType: string;
  cta: string;
  route: string;
};

const bookingLanes: BookingLane[] = [
  {
    key: "trails",
    label: "Trails",
    shortLabel: "Trails",
    eyebrow: "Passport Trails™",
    placeholder: "Search Tri-Island, Surf, Land Tour, Food & Wellness",
    dateLabel: "Trail date",
    paxLabel: "Travelers",
    typeLabel: "Trail type",
    defaultType: "Official Trail",
    cta: "Explore Trails",
    route: "/passport-trails",
  },
  {
    key: "tours",
    label: "Tours",
    shortLabel: "Tours",
    eyebrow: "Local tours",
    placeholder: "Search island hopping, land tour, Sugba, Sohoton",
    dateLabel: "Tour date",
    paxLabel: "Travelers",
    typeLabel: "Tour type",
    defaultType: "Joiner / Private",
    cta: "Find Tours",
    route: "/traveler/explore/tours",
  },
  {
    key: "stays",
    label: "Stays",
    shortLabel: "Stays",
    eyebrow: "Places to stay",
    placeholder: "Search General Luna, Cloud 9, Malinao, Pacifico",
    dateLabel: "Check-in",
    paxLabel: "Guests",
    typeLabel: "Stay type",
    defaultType: "Hotel / Homestay",
    cta: "Find Stays",
    route: "/traveler/explore/stays",
  },
  {
    key: "site-access",
    label: "Site Access",
    shortLabel: "Access",
    eyebrow: "Verified access",
    placeholder: "Search Cloud 9 or approved site access",
    dateLabel: "Visit date",
    paxLabel: "Visitors",
    typeLabel: "Access type",
    defaultType: "Site Access",
    cta: "Check Access",
    route: "/traveler/site-access/cloud-9",
  },
  {
    key: "surf-rentals",
    label: "Surf & Rentals",
    shortLabel: "Surf",
    eyebrow: "Surf, gear, mobility",
    placeholder: "Search surf lesson, board rental, motorbike, van",
    dateLabel: "Service date",
    paxLabel: "Travelers",
    typeLabel: "Service type",
    defaultType: "Surf / Rental",
    cta: "Find Services",
    route: "/traveler/explore/search",
  },
  {
    key: "food-wellness",
    label: "Food & Wellness",
    shortLabel: "Food",
    eyebrow: "Food, cafés, wellness",
    placeholder: "Search cafés, restaurants, massage, wellness, care",
    dateLabel: "Visit date",
    paxLabel: "Guests",
    typeLabel: "Partner type",
    defaultType: "Food / Wellness",
    cta: "Explore Partners",
    route: "/traveler/explore/food-culture",
  },
  {
    key: "online-boarding",
    label: "Online Boarding",
    shortLabel: "Boarding",
    eyebrow: "Selected island routes",
    placeholder: "Search Tri-Island, Sugba Lagoon, Sohoton",
    dateLabel: "Route date",
    paxLabel: "Travelers",
    typeLabel: "Route",
    defaultType: "Island Route",
    cta: "Check Routes",
    route: "/traveler/passport-trails/island-hopping/book",
  },
];

const connectedItems = [
  "QR Identity",
  "Site Access",
  "Passport Trails™",
  "Local Tours",
  "Stays",
  "Surf & Rentals",
  "Food & Wellness",
  "Online Boarding",
  "Vouchers",
  "Saved Progress",
  "Partners",
];

const trailHighlights = [
  {
    title: "Tri-Island Passport Trail",
    meta: "Usually one scheduled island-hopping day from General Luna Port.",
    tag: "One-day route",
    image: "/osp/spm/trails/island-hopping/sand-bar.png",
  },
  {
    title: "Sugba Lagoon Island Hopping",
    meta: "Governed lagoon access with route readiness and local operator support.",
    tag: "Lagoon route",
    image: "/osp/spm/trails/sugba-lagoon/lagoon.png",
  },
  {
    title: "Siargao Land Tour Passport Trail",
    meta: "Choose South, North, or supported private DIY route planning.",
    tag: "Local partner supported",
    image: "/osp/spm/trails/siargao-land-tour/south-route.png",
  },
  {
    title: "Explorer Surf Trail",
    meta: "Start with one lesson or surf stop, then continue later.",
    tag: "Continue later",
    image: "/osp/spm/trails/surf-explorer/cloud-9.png",
  },
];

const exploreCards = [
  ["Tours", "Island hopping, land tours, private routes, and partner-led experiences.", "/traveler/explore/tours"],
  ["Stays", "Traveler-ready stays with future OSP Pass and QR check-in connection.", "/traveler/explore/stays"],
  ["Site Access", "Check approved access points such as Cloud 9 and future site access locations.", "/traveler/site-access/cloud-9"],
  ["Surf Schools", "Lessons, instructors, beginner support, and surf-side services.", "/traveler/explore/surf-schools"],
  ["Rentals", "Transport, gear, mobility, and local rental partners.", "/traveler/explore/rentals"],
  ["Food & Wellness", "Restaurants, cafés, wellness, recovery, beauty, and care services.", "/traveler/explore/food-culture"],
];

function buildQuery(params: Record<string, string>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    const clean = value.trim();
    if (clean) query.set(key, clean);
  });

  const value = query.toString();
  return value ? `?${value}` : "";
}

export default function HomePage() {
  const router = useRouter();
  const [activeLaneKey, setActiveLaneKey] = useState("trails");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [pax, setPax] = useState("2");

  const activeLane = useMemo(
    () => bookingLanes.find((lane) => lane.key === activeLaneKey) || bookingLanes[0],
    [activeLaneKey],
  );

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = buildQuery({
      q: search,
      date,
      pax,
      lane: activeLane.key,
      type: activeLane.defaultType,
    });

    router.push(`${activeLane.route}${query}`);
  }

  return (
    <main className="osp-commercial-page osp-premium-v3">
      <section className="osp-premium-hero-shell">
        <header className="osp-commercial-header">
        <a className="osp-commercial-brand" href="/" aria-label="One Siargao Pass home">
          <span className="osp-commercial-brand-mark osp-brand-logo-mark">
              <img src="/osp/osp-public-header-logo-clean.png" alt="" aria-hidden="true" />
            </span>
          <span>
            <strong>One Siargao Pass™</strong>
            <small>Siargao’s trusted travel gateway</small>
          </span>
        </a>

        <nav className="osp-commercial-nav" aria-label="Public website navigation">
          <a href="/passport-trails">Passport Trails</a>
          <a href="/traveler/explore">Explore</a>
          <a href="/operators">Local Partners</a>
          <a href="/ota">Partners</a>
        </nav>

        <div className="osp-commercial-header-actions">
          <a className="osp-commercial-login" href="/login?mode=returning">Sign in</a>
          <a className="osp-commercial-pass-button" href="/traveler/start">Get Your Pass</a>
        </div>
      </header>

      <section className="osp-commercial-hero" aria-label="One Siargao Pass public booking gateway">
        <div className="osp-commercial-hero-bg" aria-hidden="true" />

        <div className="osp-commercial-hero-inner">
          <div className="osp-commercial-hero-copy">
            <p className="osp-commercial-eyebrow">One Siargao Pass™</p>
            <h1>One trusted pass for exploring Siargao.</h1>
            <p>
              Search official trails, local tours, stays, site access, surf, rentals, food,
              wellness, and online boarding routes — all connected to your One Siargao Pass.
            </p>

            <div className="osp-commercial-trust-row" aria-label="Trust highlights">
              <span>QR Identity</span>
              <span>Official Trails</span>
              <span>Local Partners</span>
              <span>Online Boarding</span>
              <span>Saved Journey</span>
            </div>

            <div className="osp-hero-identity-strip" aria-label="OSP identity and journey proof">
              <div className="osp-mini-pass-card">
                <span>OSP PASS</span>
                <strong>Traveler QR</strong>
                <small>Identity · Access · Bookings · Progress</small>
              </div>
              <div className="osp-mini-qr-mark" aria-hidden="true">
                {Array.from({ length: 9 }).map((_, index) => (
                  <i key={index} />
                ))}
              </div>
              <div className="osp-mini-route-line" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>

          <section className="osp-booking-card" aria-label="Traveler booking search">
            <div className="osp-booking-card-top">
              <span>{activeLane.eyebrow}</span>
              <strong>Search your Siargao journey</strong>
            </div>

            <div className="osp-booking-tabs" role="tablist" aria-label="Booking categories">
              {bookingLanes.map((lane) => (
                <button
                  key={lane.key}
                  type="button"
                  role="tab"
                  aria-selected={lane.key === activeLane.key}
                  className={lane.key === activeLane.key ? "is-active" : ""}
                  onClick={() => setActiveLaneKey(lane.key)}
                >
                  <span className="osp-booking-tab-full">{lane.label}</span>
                  <span className="osp-booking-tab-short">{lane.shortLabel}</span>
                </button>
              ))}
            </div>

            <form className="osp-booking-form" onSubmit={submitSearch}>
              <label className="osp-booking-field osp-booking-field-wide">
                <span>Where to?</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={activeLane.placeholder}
                />
              </label>

              <label className="osp-booking-field">
                <span>{activeLane.dateLabel}</span>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </label>

              <label className="osp-booking-field">
                <span>{activeLane.paxLabel}</span>
                <input
                  inputMode="numeric"
                  min="1"
                  value={pax}
                  onChange={(event) => setPax(event.target.value)}
                />
              </label>

              <label className="osp-booking-field">
                <span>{activeLane.typeLabel}</span>
                <input value={activeLane.defaultType} readOnly />
              </label>

              <button className="osp-booking-submit" type="submit">
                {activeLane.cta}
              </button>
            </form>

            <div className="osp-booking-auth-note">
              <span>Have an OSP Pass?</span>
              <a href="/login?mode=returning">Sign in</a>
              <span>to view saved trails, bookings, QR, and journey progress.</span>
            </div>

              <div className="osp-booking-pass-cue" aria-label="OSP Pass connection">
                <span>Connected to OSP Pass</span>
                <strong>Search first. Continue with QR identity when needed.</strong>
              </div>
          </section>
        </div>
      </section>

      </section>

      <section className="osp-commercial-section osp-connected-section">
        <div className="osp-section-heading">
          <p>Your Siargao Journey, Connected</p>
          <h2>One pass for the moments that shape your trip.</h2>
          <span>
            From QR identity and site access to local bookings, vouchers, online boarding,
            and saved progress, OSP keeps your traveler journey organized in one place.
          </span>
        </div>

        <div className="osp-ecosystem-panel" aria-label="Connected journey items">
          <div className="osp-ecosystem-core osp-gateway-core" aria-label="Download One Siargao Pass gateway QR">
            <span className="osp-pass-glow" aria-hidden="true" />
            <div className="osp-gateway-qr-shell">
              <img
                className="osp-gateway-qr-image"
                src="/osp/qr-registry/gateway/osp-gw-public-website-001.png"
                alt="Gateway QR code to download One Siargao Pass and start your journey"
              />
            </div>
            <div className="osp-gateway-copy">
              <strong>Download One Siargao Pass</strong>
              <small>Scan to start your journey</small>
            </div>
          </div>

          <div className="osp-ecosystem-groups">
            {[
              ["Identity & Access", ["QR Identity", "Site Access"]],
              ["Explore & Book", ["Passport Trails™", "Local Tours", "Stays"]],
              ["Island Services", ["Surf & Rentals", "Food & Wellness"]],
              ["Journey Proof", ["Vouchers", "Online Boarding", "Saved Progress"]],
              ["Partner Access", ["Partners"]],
            ].map(([groupTitle, groupItems]) => (
              <article key={String(groupTitle)} className="osp-ecosystem-group">
                <h3>{String(groupTitle)}</h3>
                <div>
                  {(groupItems as string[]).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="osp-commercial-section osp-steps-section">
        <div className="osp-section-heading">
          <p>How It Works</p>
          <h2>Search first. Sign in when your journey needs to continue.</h2>
        </div>

        <div className="osp-step-grid">
          {[
            ["01", "Get your OSP Pass", "Create or continue your traveler QR identity for Siargao."],
            ["02", "Search and choose", "Find official trails, local tours, stays, access, services, and routes."],
            ["03", "Book, scan, or board", "Use OSP for requests, vouchers, site access, and selected online boarding routes."],
            ["04", "Save your journey", "Keep Passport Stamps, receipts, trail progress, and return-trip continuity."],
          ].map(([number, title, body]) => (
            <article key={number} className="osp-step-card">
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="osp-commercial-section osp-trails-section">
        <div className="osp-section-heading">
          <p>Passport Trails™</p>
          <h2>Official Siargao trails with real journey behavior.</h2>
          <span>
            Some trails are one-day routes. Some are flexible across your stay. Some require
            approved local partner support. Some continue when you return.
          </span>
        </div>

        <div className="osp-passport-trails-asset-panel" aria-hidden="true">
          <img className="osp-passport-trails-banner" src="/osp/spm-passport-trails-hero-image-2.png" alt="" />
          <span className="osp-passport-trails-mark">
            <img src="/osp/spm-header-mark.png" alt="" />
          </span>
        </div>

        <div className="osp-trail-grid">
          {trailHighlights.map((trail) => (
            <a key={trail.title} className="osp-trail-card" href="/passport-trails">
              <span className="osp-trail-card-media" aria-hidden="true">
                <img src={trail.image} alt="" />
              </span>
              <span className="osp-trail-card-media-overlay" aria-hidden="true" />
              <i className="osp-trail-stamp-mark" aria-hidden="true">STAMP</i>
              <span>{trail.tag}</span>
              <h3>{trail.title}</h3>
              <p>{trail.meta}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="osp-commercial-section osp-explore-section">
        <div className="osp-section-heading">
          <p>Explore Siargao</p>
          <h2>Trusted local experiences connected to your pass.</h2>
        </div>

        <div className="osp-explore-grid">
          {exploreCards.map(([title, body, href]) => (
            <a key={title} className="osp-explore-card" href={href}>
              <strong>{title}</strong>
              <p>{body}</p>
              <span>Explore</span>
            </a>
          ))}
        </div>
      </section>

      <section className="osp-commercial-section osp-boarding-section">
        <div className="osp-boarding-panel">
          <div>
            <p className="osp-commercial-eyebrow">Online Boarding</p>
            <h2>For selected island routes, move from booking to voucher to Boarding QR.</h2>
            <p>
              OSP helps selected island routes move through a clearer traveler flow:
              choose route, book, receive voucher, get Boarding QR when ready, and scan at port.
            </p>
            <a className="osp-commercial-pass-button" href="/traveler/passport-trails/island-hopping/book">
              Check Routes
            </a>
          </div>

          <div className="osp-boarding-identity">
            <div className="osp-boarding-proof-card">
              <span>Voucher</span>
              <strong>GL Island Route</strong>
              <small>Booking proof before Boarding QR readiness.</small>
              <div className="osp-boarding-qr-mini" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>

            <div className="osp-boarding-flow" aria-label="Online boarding flow">
              {["Choose Route", "Book", "Voucher", "Boarding QR", "Port Scan"].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="osp-commercial-section osp-partner-section">
        <div className="osp-section-heading">
          <p>For Local Partners</p>
          <h2>Bring your approved local service into the OSP journey.</h2>
          <span>
            Local partners remain the people who operate, host, guide, transport, teach,
            serve, and fulfill the experience. OSP helps make those services easier to
            discover, book, validate, and continue through one trusted pass.
          </span>
          <a className="osp-commercial-pass-button osp-partner-cta" href="/operators">Join as a Local Partner</a>
        </div>

        <div className="osp-partner-grid">
          {[
            "Tour Operator",
            "Stay Partner",
            "Surf School",
            "Rental Partner",
            "Food & Wellness",
            "Health & Care",
            "Transport",
            "Travel Partner",
          ].map((role) => (
            <a key={role} href="/operators" className="osp-partner-role">
              {role}
            </a>
          ))}
        </div>
      </section>

      <section className="osp-commercial-final">
        <div>
          <p className="osp-commercial-eyebrow">Start with your pass</p>
          <h2>Get your pass. Explore trusted local experiences. Keep your Siargao journey connected.</h2>
        </div>
        <div className="osp-commercial-final-actions">
          <a className="osp-commercial-pass-button" href="/traveler/start">Get Your OSP Pass</a>
          <a className="osp-commercial-login" href="/ota">Partners</a>
          <a className="osp-commercial-login" href="/developers">Developers</a>
        </div>
      </section>

      <footer className="osp-commercial-footer">
        <div className="osp-footer-brand-block">
          <span className="osp-footer-logo-mark" aria-hidden="true">
            <img src="/osp/osp-public-header-logo-clean.png" alt="" />
          </span>
          <strong>One Siargao Pass™</strong>
          <span>Premium public trust gateway for Siargao traveler access, local bookings, and connected journeys.</span>
          <div className="osp-footer-contact">
            <span>749 Tourism Road, General Luna, Siargao, General Luna, Philippines, 8419</span>
            <a href="tel:+639277216212">0927 721 6212</a>
          </div>
        </div>
        <nav aria-label="Footer links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/support">Support</a>
          <a href="/operator-terms">Operator Terms</a>
          <a href="/ota-terms">Partner Terms</a>
          <a href="/api-terms">API Terms</a>
          <a href="/developers">Developers</a>
        </nav>
      </footer>
    </main>
  );
}
