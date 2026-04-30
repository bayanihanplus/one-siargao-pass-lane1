import Link from "next/link";

export const metadata = {
  title: "Siargao Passport Map | One Siargao Pass",
  description:
    "Siargao Passport Map is the public journey product page for Passport Trails, verified stops, QR-linked progress, and trip continuity inside One Siargao Pass.",
};

const trailFamilies = [
  "Island Hopping Trail",
  "Surf Explorer Trail",
  "North Siargao Trail",
  "Inland Discovery Trail",
  "Culture & Community Trail",
  "Sunset & Scenic Stops Trail",
  "Adventure Trail",
  "Return Traveler Continuity Trail",
];

const productPillars = [
  {
    icon: "🗺️",
    title: "Map-first journey planning",
    body: "Explore Siargao through structured trail families instead of scattered recommendations, random pins, or disconnected lists.",
  },
  {
    icon: "✅",
    title: "Verified destination progress",
    body: "Passport activity is designed around QR-linked visits, governed checkpoints, and real trip movement — not fake badge gamification.",
  },
  {
    icon: "🧭",
    title: "Trail continuity",
    body: "Travelers can continue unfinished routes, revisit meaningful stops, and build a stronger Siargao journey over time.",
  },
  {
    icon: "🤝",
    title: "Local operator connection",
    body: "Tours and trail experiences are intended to connect with approved local partners, operators, and structured fulfillment flows.",
  },
];

const trailModes = [
  {
    title: "Siargao Partner Tour",
    body: "Operated by approved local partners. Built for travelers who want a structured local tour with Passport stamp eligibility where available.",
  },
  {
    title: "Passport Trails™ Curated Tour",
    body: "A curated trail experience with verified stops, guided flow, and stronger continuity between the traveler’s trip and Passport progress.",
  },
  {
    title: "Build Your Own Passport Trail",
    body: "A flexible route-building mode for travelers who want to shape their own Siargao journey while staying inside governed trail logic.",
  },
];

function ArrowIcon() {
  return (
    <span aria-hidden="true" className="inline-flex h-5 w-5 items-center justify-center">
      →
    </span>
  );
}

function CheckIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-sm font-black text-white shadow-sm"
    >
      ✓
    </span>
  );
}

export default function SiargaoPassportMapProductPage() {
  return (
    <main className="min-h-screen bg-[#f3f8f3] text-slate-950">
      <section className="relative isolate overflow-hidden border-b border-emerald-900/10 bg-gradient-to-b from-[#e8f7ec] via-[#f7fbf4] to-[#f3f8f3]">
        <div className="absolute inset-0 -z-10 opacity-70">
          <div className="absolute left-[-10%] top-[-20%] h-72 w-72 rounded-full bg-emerald-200 blur-3xl" />
          <div className="absolute right-[-10%] top-[10%] h-80 w-80 rounded-full bg-cyan-100 blur-3xl" />
          <div className="absolute bottom-[-25%] left-[35%] h-72 w-72 rounded-full bg-yellow-100 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-8 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-14">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-900/15 bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-900 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-700" />
              Powered by Passport Trails™
            </div>

            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Siargao Passport Map
            </h1>

            <p className="mt-4 max-w-2xl text-xl font-semibold leading-8 text-emerald-950">
              Follow the Trails. Build the Journey.
            </p>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">
              A public product layer inside One Siargao Pass for map-first discovery,
              verified destination progress, QR-linked movement, and repeat-visit
              journey continuity across Siargao.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/traveler/start"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-800 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-300"
              >
                Start your journey <ArrowIcon />
              </Link>
              <Link
                href="/traveler/passport-trails"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-900/20 bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-emerald-950 shadow-sm transition hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-200"
              >
                View Passport Trails <ArrowIcon />
              </Link>
            </div>

            <div className="mt-6 rounded-3xl border border-emerald-900/10 bg-white/85 p-4 shadow-sm">
              <p className="text-sm font-semibold leading-6 text-slate-700">
                This is not a generic tourist map, random pin board, or badge toy.
                It is the traveler-facing progress and continuity layer for verified
                Siargao movement inside the One Siargao Pass ecosystem.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-emerald-900/10 bg-white p-4 shadow-2xl shadow-emerald-950/10">
              <div className="overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-[#e8f6ee]">
                <div className="relative min-h-[430px] p-5">
                  <div className="absolute inset-0 opacity-80">
                    <div className="absolute left-8 top-10 h-24 w-24 rounded-full border border-emerald-700/20 bg-white/45" />
                    <div className="absolute right-10 top-16 h-36 w-36 rounded-full border border-cyan-700/20 bg-cyan-100/40" />
                    <div className="absolute bottom-12 left-14 h-40 w-40 rounded-full border border-yellow-700/20 bg-yellow-100/60" />
                    <div className="absolute bottom-24 right-12 h-24 w-24 rounded-full border border-emerald-700/20 bg-white/50" />
                  </div>

                  <div className="relative z-10 flex h-full min-h-[390px] flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-900">
                          Passport Grid
                        </p>
                        <h2 className="mt-2 text-2xl font-black text-slate-950">
                          Progress Trail
                        </h2>
                      </div>
                      <div className="rounded-2xl bg-emerald-800 px-4 py-3 text-center text-white shadow-lg shadow-emerald-900/20">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em]">
                          OSP
                        </p>
                        <p className="text-lg font-black">QR</p>
                      </div>
                    </div>

                    <div className="my-8 grid gap-3">
                      {["Cloud 9", "Catangnan Bridge", "Coconut Road", "Magpupungko", "Malinao Skate Area"].map(
                        (stop, index) => (
                          <div
                            key={stop}
                            className="flex items-center gap-3 rounded-2xl border border-emerald-900/10 bg-white/85 px-4 py-3 shadow-sm"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-800 text-sm font-black text-white">
                              {index + 1}
                            </span>
                            <div>
                              <p className="text-sm font-black text-slate-950">{stop}</p>
                              <p className="text-xs font-semibold text-slate-600">
                                Trail stop candidate / governed verification layer
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    <div className="rounded-3xl bg-slate-950 p-5 text-white shadow-xl">
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200">
                        Journey status
                      </p>
                      <p className="mt-2 text-lg font-black">Trip-linked. QR-aware. Progress-ready.</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Final traveler progress must come from governed trip, QR, stamp,
                        and trail completion records — not hardcoded public-page numbers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-3 text-center text-xs font-semibold text-slate-500">
              Public product visualization. Live traveler progress belongs inside the authenticated app.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {productPillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                {pillar.icon}
              </div>
              <h3 className="text-lg font-black text-slate-950">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-650">{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-emerald-900/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-800">
              What it does
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              A product page for the journey system, not a fake live map.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700">
              The public page explains the product, the promise, and the Passport Trails
              experience. The authenticated traveler app should handle real QR identity,
              trip status, stamp records, booking-linked trails, and personal progress.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              "Public discovery explains the Passport Map product clearly.",
              "Authenticated traveler routes handle personal trip and QR state.",
              "Trail product modes stay separated from OTA distribution channels.",
              "Progress, stamps, and completion must come from governed backend truth.",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-3xl border border-emerald-900/10 bg-[#f7fbf4] p-5"
              >
                <CheckIcon />
                <p className="text-sm font-bold leading-7 text-slate-750">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-800">
            Trail families
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Explore Siargao by structured journey families.
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-700">
            Passport Trails organizes discovery into commercial and operationally useful
            families so the experience can scale beyond pretty content into booking,
            progress, partner fulfillment, and reactivation.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trailFamilies.map((trail) => (
            <div
              key={trail}
              className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-4 shadow-sm"
            >
              <p className="text-sm font-black text-slate-950">{trail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-emerald-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-200">
              Product modes
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Three traveler-facing ways to experience Passport Trails.
            </h2>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {trailModes.map((mode) => (
              <article
                key={mode.title}
                className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-sm"
              >
                <h3 className="text-xl font-black text-white">{mode.title}</h3>
                <p className="mt-4 text-sm leading-7 text-emerald-50/85">{mode.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-9 rounded-3xl border border-white/10 bg-white/10 p-6">
            <p className="text-sm font-semibold leading-7 text-emerald-50">
              OTA / Travel & Tours partners should be treated as distribution channels,
              not a separate traveler-facing product category. The traveler product stays
              focused on the Siargao Passport Map and Passport Trails experience.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-950/5 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-800">
                One Siargao Pass
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Built for a digital island journey.
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
                Siargao Passport Map should become the conversion bridge between
                traveler discovery, QR-linked movement, Passport Trails, verified stops,
                partner fulfillment, and future destination intelligence.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/traveler/start"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-800 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-300"
              >
                Start journey <ArrowIcon />
              </Link>
              <Link
                href="/traveler/passport-map"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-900/20 bg-[#f7fbf4] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-emerald-950 shadow-sm transition hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-200"
              >
                Open app map <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
