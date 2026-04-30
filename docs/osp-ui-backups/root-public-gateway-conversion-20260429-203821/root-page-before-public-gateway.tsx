import Link from "next/link";
import {
  OspPublicPageShell,
  PublicCardGrid,
  PublicSection,
} from "../src/components/public/OspPublicPageShell";

const platformCards = [
  {
    title: "Travelers",
    body: "Create your OSP Pass, keep your QR ready, explore Passport Trails, and continue your Siargao journey through one connected traveler app.",
    href: "/travelers",
    eyebrow: "Traveler Access",
  },
  {
    title: "Local Operators",
    body: "Activate verified services, validate guests through QR workflows, manage operational records, and connect approved experiences to the OSP ecosystem.",
    href: "/operators",
    eyebrow: "Supply Layer",
  },
  {
    title: "OTA / API Partners",
    body: "Connect confirmed booking records into OSP pass and QR workflows through approved, scoped, and audited partner access.",
    href: "/ota",
    eyebrow: "Partner Distribution",
  },
  {
    title: "LGU / DOT Stakeholders",
    body: "Support governed tourism visibility, manifest-linked activity, safety broadcasts, and compliance reporting through role-scoped access.",
    href: "/government",
    eyebrow: "Governance",
  },
  {
    title: "Passport Trails",
    body: "Discover Siargao Partner Tours, Passport Trails™ Curated Tours, and Build Your Own Passport Trail experiences.",
    href: "/passport-trails",
    eyebrow: "Destination Product",
  },
  {
    title: "Developers",
    body: "Explore approved API integration pathways for booking-to-pass intake, partner identity, QR status, and governed webhook workflows.",
    href: "/developers",
    eyebrow: "API Layer",
  },
];

const productCards = [
  {
    title: "OSP Pass + QR Identity",
    body: "A governed traveler identity anchor that connects pass, trip, eligible experiences, and QR-backed validation.",
  },
  {
    title: "Siargao Passport Map",
    body: "A destination journey map for discovery, trail progress, verified stops, and island continuity.",
    href: "/siargao-passport-map",
  },
  {
    title: "Passport Trails",
    body: "Structured Siargao trail products fulfilled by approved local partners where service is required.",
    href: "/passport-trails",
  },
  {
    title: "Operator Access Scan",
    body: "A controlled validation layer for approved operators and eligible OSP-enabled services.",
  },
  {
    title: "OTA / API Intake",
    body: "A governed partner layer for connecting external booking references into OSP-managed workflows.",
    href: "/ota",
  },
  {
    title: "LGU Compliance Visibility",
    body: "Role-scoped destination visibility for authorized stakeholders, without uncontrolled data exposure.",
    href: "/government",
  },
];

export default function PublicOspGatewayPage() {
  return (
    <OspPublicPageShell
      eyebrow="One Siargao Pass"
      title="Powering the Digital Island."
      subtitle="Create your traveler pass, access verified Siargao experiences, explore the Passport Map, follow Passport Trails, and connect island tourism movement through one governed digital platform."
      primaryCta={{ label: "Create OSP Pass", href: "/traveler/start" }}
      secondaryCta={{ label: "Open Traveler App", href: "/traveler/home" }}
    >
      <PublicSection
        eyebrow="Platform Gateway"
        title="One platform. Multiple governed access points."
        body="One Siargao Pass is the digital gateway for travelers, local operators, OTA/API partners, authorized government stakeholders, and OSP administrators. Each role enters through the correct surface, with its own access boundaries."
      >
        <PublicCardGrid cards={platformCards} />
      </PublicSection>

      <PublicSection
        eyebrow="What OSP Powers"
        title="The operating layer behind safer, more organized Siargao tourism."
        body="OSP connects traveler identity, QR validation, verified experiences, partner booking channels, compliance-ready records, and destination visibility without turning the system into an uncontrolled listing site or generic travel marketplace."
      >
        <PublicCardGrid cards={productCards} />
      </PublicSection>

      <section className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="grid gap-4 rounded-[2rem] bg-emerald-950 p-6 text-amber-50 shadow-sm md:grid-cols-[1fr_0.8fr] md:p-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-200">
              Traveler App
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] md:text-4xl">
              Already have an OSP Pass?
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-amber-100/85">
              Continue to your mobile-first traveler app to view your pass, open your QR, check trips, explore Passport Trails, and manage your Siargao journey.
            </p>
          </div>
          <div className="flex flex-col justify-end gap-3 sm:flex-row md:flex-col">
            <Link
              href="/traveler/home"
              className="rounded-full bg-amber-100 px-5 py-3 text-center text-sm font-black text-emerald-950 shadow-sm"
            >
              Open Traveler App
            </Link>
            <Link
              href="/traveler/start"
              className="rounded-full border border-amber-100/30 px-5 py-3 text-center text-sm font-black text-amber-50"
            >
              Create New Pass
            </Link>
          </div>
        </div>
      </section>
    </OspPublicPageShell>
  );
}
