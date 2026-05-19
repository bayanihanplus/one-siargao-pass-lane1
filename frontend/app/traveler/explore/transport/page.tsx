import Link from "next/link";
import UniversalTravelerBottomTabBar from "../../../../src/components/traveler/UniversalTravelerBottomTabBar";

const transportOptions = [
  {
    title: "Airport pickup / drop-off",
    note: "Sayak airport movement support with approved local partners.",
  },
  {
    title: "Dapa seaport pickup / drop-off",
    note: "Port arrival support for travelers heading to General Luna or nearby stays.",
  },
  {
    title: "Private van or car with driver",
    note: "Group-friendly movement support, subject to confirmation.",
  },
  {
    title: "Tuk-tuk and local point-to-point support",
    note: "Local movement requests for short island hops and activity pickups.",
  },
];

export default function TravelerExploreTransportPage() {
  return (
    <main className="osp-transport-lane-page osp-traveler-bottom-tab-safe-page">
      <section className="osp-transport-lane-shell">
        <div className="osp-transport-lane-topbar">
          <Link href="/traveler/explore" className="osp-transport-back">
            ← Explore
          </Link>
          <span className="osp-transport-status">REQUEST TO CONFIRM</span>
        </div>

        <section className="osp-transport-hero">
          <div className="osp-transport-hero-copy">
            <span className="osp-transport-kicker">ONE SIARGAO PASS</span>
            <h1>Transport support for Siargao movement</h1>
            <p>
              Pickup, drop-off, and local movement support from approved local partners.
              Transport is separate from rentals because a driver or service provider supports the journey.
            </p>
          </div>
        </section>

        <section className="osp-transport-panel">
          <h2>Transport options</h2>
          <div className="osp-transport-option-grid">
            {transportOptions.map((item) => (
              <article key={item.title} className="osp-transport-option-card">
                <span className="osp-transport-option-icon">🚐</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.note}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="osp-transport-request-card">
          <span>Partner-supported lane</span>
          <h2>Request transport support</h2>
          <p>
            This lane is prepared for approved tour operators and local partners who offer
            transport services such as airport pickup, seaport pickup, tuk-tuk, van, or car-with-driver support.
          </p>
          <button type="button" disabled>
            Request flow coming soon
          </button>
        </section>
      </section>

      <UniversalTravelerBottomTabBar activeTab="explore" />
    </main>
  );
}
