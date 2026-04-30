# OSP ROOT PAGE BEHAVIOR CHECK

Generated at: Wed Apr 29 20:15:27 PST 2026

## Root page route/string references

2:import { getPreferredTravelerTrip } from "../src/lib/travelerTripSelection";
4:import { QRCodeSVG } from "qrcode.react";
5:import UniversalTravelerBottomTabBar from "../src/components/traveler/UniversalTravelerBottomTabBar";
6:import PassportMapShortcut from "../src/components/traveler/PassportMapShortcut";
29:          <a href={item.href}>{item.label}</a>
40:async function getTravelerLatestTrip() {
47:    const listRes = await fetch(`${baseUrl}/trips`, {
56:      return { trip: null, error: `Failed to load latest traveler trip: HTTP ${listRes.status}` };
60:    const trips = Array.isArray(rows) ? rows : [];
61:    const preferredTrip = getPreferredTravelerTrip(trips);
63:    if (!preferredTrip?.id) {
64:      return { trip: null, error: null };
67:    const detailRes = await fetch(`${baseUrl}/trips/${preferredTrip.id}`, {
77:        trip: null,
78:        error: `Failed to load latest traveler trip detail: HTTP ${detailRes.status}`,
82:    const trip = await detailRes.json();
83:    return { trip, error: null };
86:      trip: null,
87:      error: error?.message || "Unknown traveler trip load failure",
92:async function getTravelerDictionary(languageCode: string): Promise<Record<string, string>> {
94:    "home.hero.title": "Trip Active. Pass Ready.",
95:    "home.cta.showQr": "Show My QR",
96:    "home.cta.passportMap": "Open Passport Map",
100:    const res = await fetch(`${getApiBaseUrl()}/language-packs/${encodeURIComponent(languageCode || "en")}/dictionary?scope=traveler`, {
128:function isRootPreviewTrip(trip: any) {
129:  return trip?.id === "osp-root-preview-trip";
132:function rootPublicHref(trip: any, authenticatedHref: string, publicHref: string) {
133:  return isRootPreviewTrip(trip) ? publicHref : authenticatedHref;
136:function getHomeHeroDictionaryBase(title: string) {
137:  if (title === "Trip Active. Pass Ready.") return "home.hero.active";
138:  if (title === "Trip On File. Registration Required.") return "home.hero.registrationRequired";
139:  if (title === "Trip On File. Review Pending.") return "home.hero.reviewPending";
140:  if (title === "Trip Found. Pass Pending.") return "home.hero.passPending";
141:  if (title === "Trip On File. Clearance Pending.") return "home.hero.clearancePending";
142:  if (title === "Trip On File. Payment Pending.") return "home.hero.paymentPending";
150:    "Trip Active. Pass Ready.": "Trip Active.\nPass Ready.",
151:    "Trip On File. Registration Required.": "Trip On File.\nRegistration Required.",
152:    "Trip On File. Review Pending.": "Trip On File.\nReview Pending.",
153:    "Trip Found. Pass Pending.": "Trip Found.\nPass Pending.",
154:    "Trip On File. Clearance Pending.": "Trip On File.\nClearance Pending.",
155:    "Trip On File. Payment Pending.": "Trip On File.\nPayment Pending.",
189:function getTripPass(trip: any) {
190:  return trip?.pass ?? null;
193:function getTripPassIssued(trip: any) {
194:  return Boolean(getTripPass(trip));
197:function getTripPassStatusRaw(trip: any) {
198:  return trip?.pass?.passStatus ?? null;
201:function getTripPassCodeRaw(trip: any) {
202:  return trip?.pass?.passCode ?? null;
205:function getTripPaymentStateRaw(trip: any) {
206:  return trip?.currentPaymentState?.state ?? null;
209:function getTripRegistrationStatusRaw(trip: any) {
210:  return trip?.registrationStatus ?? null;
213:function getTripManifestListedRaw(trip: any) {
214:  return trip?.manifestReadiness?.isManifestListed ?? null;
217:function getTripArrivalDateRaw(trip: any) {
218:  return trip?.arrivalDate ?? null;
221:function getTripDepartureDateRaw(trip: any) {
222:  return trip?.departureDate ?? null;
245:function getHeroState(trip: any) {
246:  const passIssued = getTripPassIssued(trip);
247:  const passStatus = String(getTripPassStatusRaw(trip) || "").toLowerCase();
248:  const clearanceStatus = String(trip?.clearanceStatus || "").toLowerCase();
249:  const paymentState = String(getTripPaymentStateRaw(trip) || "").toLowerCase();
250:  const hasTrip = Boolean(trip);
253:    hasTrip &&
261:      travelerLabel: "Verified Traveler",
262:      title: "Trip Active. Pass Ready.",
263:      body: "Access your trip status, pass, clearance, and payment in one place.",
268:  const registrationStatus = String(getTripRegistrationStatusRaw(trip) || "").toLowerCase();
269:  if (hasTrip && !passIssued) {
273:        travelerLabel: "Traveler On File",
274:        title: "Trip On File. Registration Required.",
275:        body: "Complete your traveler trip registration first so your pass can move forward.",
282:      travelerLabel: "Traveler On File",
283:      title: "Trip Found. Pass Pending.",
284:      body: "Your registration is on file. Keep checking your latest trip status as your pass moves forward.",
289:  if (hasTrip && clearanceStatus && clearanceStatus !== "approved") {
292:      travelerLabel: "Traveler On File",
293:      title: "Trip On File. Clearance Pending.",
294:      body: "Your pass may be issued, but clearance is still under review before trip readiness is confirmed.",
299:  if (hasTrip && paymentState && paymentState !== "paid") {
302:      travelerLabel: "Payment Pending",
303:      title: "Trip On File. Payment Pending.",
304:      body: "Access your trip status, pass, clearance, and payment in one place.",
311:    travelerLabel: "Traveler Access",
313:    body: "Access your trip status, pass, clearance, and payment in one place.",
318:function getTravelerNameForPassCard(user: any) {
319:  return user?.fullName || user?.email || user?.id || "Traveler";
322:function getPassCardValidDates(trip: any) {
323:  const startLabel = formatDate(getTripArrivalDateRaw(trip));
324:  const endLabel = formatDate(getTripDepartureDateRaw(trip));
337:function getPassCardTripMeta(trip: any) {
338:  const arrivalValue = getTripArrivalDateRaw(trip);
339:  const departureValue = getTripDepartureDateRaw(trip);
364:  if (trip?.currentBooking?.bookingReference) {
365:    return String(trip.currentBooking.bookingReference);
368:  if (trip?.declaredAccommodationName) {
369:    return String(trip.declaredAccommodationName);
372:  if (trip?.originLocation) {
373:    return String(trip.originLocation);
379:function getPassCardPassCode(trip: any) {
380:  const passCode = getTripPassCodeRaw(trip);
384:function getPassCardPassStatus(trip: any) {
385:  const passStatus = getTripPassStatusRaw(trip);
387:  return getTripPassIssued(trip) ? "Issued" : "Not Issued";
390:function getPassCardBadgeColor(trip: any) {
391:  const passIssued = getTripPassIssued(trip);
392:  const passStatus = String(getTripPassStatusRaw(trip) || "").toLowerCase();
393:  const clearanceStatus = String(trip?.clearanceStatus || "").toLowerCase();
394:  const paymentState = String(getTripPaymentStateRaw(trip) || "").toLowerCase();
395:  const hasTrip = Boolean(trip);
398:    hasTrip &&
407:  if (hasTrip && !passIssued) {
411:  if (hasTrip && clearanceStatus && clearanceStatus !== "approved") {
415:  if (hasTrip && paymentState && paymentState !== "paid") {
422:function getPassCardVerificationLabel(trip: any) {
423:  const passIssued = getTripPassIssued(trip);
424:  const passStatus = String(getTripPassStatusRaw(trip) || "").toLowerCase();
425:  const clearanceStatus = String(trip?.clearanceStatus || "").toLowerCase();
426:  const paymentState = String(getTripPaymentStateRaw(trip) || "").toLowerCase();
460:function PassCardQrShell(props: { qrToken?: string | null }) {
461:  const hasQr = Boolean(props.qrToken);
465:      aria-label={hasQr ? "OSP active pass QR code" : "OSP active pass QR unavailable"}
540:          <QRCodeSVG
541:            value={props.qrToken as string}
559:            QR not available yet
578:        {hasQr ? "Scan to verify" : "Awaiting QR issuance"}
584:function getStatusRowTripDates(trip: any) {
585:  const startValue = getTripArrivalDateRaw(trip);
586:  const endValue = getTripDepartureDateRaw(trip);
612:function getStatusRowPassStatus(trip: any) {
613:  const passIssued = getTripPassIssued(trip);
614:  const passStatus = getTripPassStatusRaw(trip);
620:function getStatusRowClearanceStatus(trip: any) {
621:  return normalizeLabel(trip?.clearanceStatus);
624:function getStatusRowPaymentStatus(trip: any) {
625:  return normalizeLabel(getTripPaymentStateRaw(trip));
652:function getTravelerReassuranceMessage(trip: any) {
653:  const passIssued = getTripPassIssued(trip);
654:  const passStatus = String(getTripPassStatusRaw(trip) || "").toLowerCase();
655:  const clearanceStatus = String(trip?.clearanceStatus || "").toLowerCase();
656:  const paymentState = String(getTripPaymentStateRaw(trip) || "").toLowerCase();
657:  const hasTrip = Boolean(trip);
660:    hasTrip &&
667:      message: "You’re all set! Enjoy your trip and keep your pass handy.",
672:  const registrationStatus = String(getTripRegistrationStatusRaw(trip) || "").toLowerCase();
673:  if (hasTrip && !passIssued) {
676:        message: "Complete your traveler registration first so your pass can move forward.",
681:      message: "Your trip is on file. Complete the remaining requirements before your pass is issued.",
686:  if (hasTrip && clearanceStatus && clearanceStatus !== "approved") {
688:      message: "Clearance is still under review. Keep checking your latest trip status.",
693:  if (hasTrip && paymentState && paymentState !== "paid") {
695:      message: "Payment is still pending. Settle it to keep your trip moving.",
701:    message: "You do not have an active trip yet. Start from your traveler trip record.",
706:function TravelerStatusRowCard(props: {
774:function TravelerJourneyCard(props: {
786:      href={props.href}
859:function TravelerBottomNavLink(props: {
870:      href={props.href}
948:      <a className={props.className} href={props.href} aria-label={props.ariaLabel} style={style}>
961:function TravelerShellFrame(props: {
962:  latestTravelerTrip: any;
966:  const hero = getHeroState(props.latestTravelerTrip);
967:  const heroBaseKey = getHomeHeroDictionaryBase(hero.title);
970:  const heroTravelerLabel = t(props.dictionary, `${heroBaseKey}.travelerLabel`, hero.travelerLabel);
971:  const showQrLabel = t(props.dictionary, "home.cta.showQr", "Show My QR");
972:  const passportMapLabel = t(props.dictionary, "home.cta.passportMap", "Open Passport Map");
973:  const officialTravelerPassLabel = t(props.dictionary, "home.header.officialTravelerPass", "Official Traveler Pass");
979:  const rootPreview = isRootPreviewTrip(props.latestTravelerTrip);
1039:              <span>{officialTravelerPassLabel}</span>
1068:          <HeaderControlButton label={languageLabel} ariaLabel={languageAriaLabel} href={rootPreview ? "/login?mode=returning" : "/traveler/settings?panel=language"} icon="language" />
1069:          <HeaderControlButton label="PHP" ariaLabel={currencyAriaLabel} href={rootPreview ? "/login?mode=returning" : "/traveler/settings?panel=currency"} icon="currency" />
1070:          <HeaderControlButton className="osp-phone-secondary-control" label="AI" ariaLabel={assistantAriaLabel} href={rootPreview ? "/login?mode=returning" : "/traveler/settings?panel=assistant"} icon="assistant" />
1074:            href={rootPreview ? "/login?mode=returning" : "/traveler/settings?panel=notifications"}
1190:                {heroTravelerLabel}
1223:                href={rootPreview ? "/traveler/start" : "/traveler/pass"}
1263:                href={rootPreview ? "/traveler/start" : "/traveler/passport-map"}
1292:                {passportMapLabel}
1302:function TravelerPassCard(props: {
1304:  latestTravelerTrip: any;
1307:  const travelerName = getTravelerNameForPassCard(props.user);
1308:  const passCode = getPassCardPassCode(props.latestTravelerTrip);
1309:  const passStatus = getPassCardPassStatus(props.latestTravelerTrip);
1310:  const validDates = getPassCardValidDates(props.latestTravelerTrip);
1311:  const tripMeta = getPassCardTripMeta(props.latestTravelerTrip);
1312:  const verificationLabel = getPassCardVerificationLabel(props.latestTravelerTrip);
1313:  const badgeColor = getPassCardBadgeColor(props.latestTravelerTrip);
1360:            {travelerName}
1428:            {tripMeta}
1455:            <PassCardQrShell qrToken={props.latestTravelerTrip?.pass?.qrCredential?.qrToken} />
1492:function TravelerCompactStatusRow(props: {
1493:  latestTravelerTrip: any;
1496:  const clearanceStatus = getStatusRowClearanceStatus(props.latestTravelerTrip);
1497:  const paymentStatus = getStatusRowPaymentStatus(props.latestTravelerTrip);
1498:  const passStatus = getStatusRowPassStatus(props.latestTravelerTrip);
1499:  const tripDates = getStatusRowTripDates(props.latestTravelerTrip);
1503:  const tripDatesTitle = t(props.dictionary, "home.status.tripDates", "Trip Dates");
1514:      <TravelerStatusRowCard
1529:      <TravelerStatusRowCard
1544:      <TravelerStatusRowCard
1570:      <TravelerStatusRowCard
1571:        title={tripDatesTitle}
1572:        value={tripDates}
1588:function TravelerReassuranceAndJourney(props: {
1589:  latestTravelerTrip: any;
1592:  const reassurance = getTravelerReassuranceMessage(props.latestTravelerTrip);
1595:  const tripsTitle = t(props.dictionary, "home.journey.trips.title", "Trips");
1596:  const tripsSubtitle = t(props.dictionary, "home.journey.trips.subtitle", "Plans & records");
1599:  const passportMapTitle = t(props.dictionary, "home.journey.passportMap.title", "Passport Map");
1600:  const passportMapSubtitle = t(props.dictionary, "home.journey.passportMap.subtitle", "Trails & stamps");
1602:  const checkpointsSubtitle = t(props.dictionary, "home.journey.checkpoints.subtitle", "QR & access state");
1604:  const rootPreview = isRootPreviewTrip(props.latestTravelerTrip);
1662:          <TravelerJourneyCard
1663:            href={rootPreview ? "/traveler/start" : "/traveler/trips"}
1664:            title={tripsTitle}
1665:            subtitle={tripsSubtitle}
1679:          <TravelerJourneyCard
1680:            href={rootPreview ? "/traveler/start" : "/traveler/trips"}
1695:          <TravelerJourneyCard
1696:            href={rootPreview ? "/traveler/start" : "/traveler/passport-map"}
1697:            title={passportMapTitle}
1698:            subtitle={passportMapSubtitle}
1718:          <TravelerJourneyCard
1719:            href={rootPreview ? "/traveler/start" : "/traveler/pass"}
1739:function TravelerBottomNav(props: {
1743:  const homeLabel = t(props.dictionary, "home.bottomNav.home", "Home");
1744:  const tripsLabel = t(props.dictionary, "home.bottomNav.trips", "Trips");
1747:  const openQrAriaLabel = t(props.dictionary, "home.pass.openQr.ariaLabel", "Open active pass QR");
1762:        <TravelerBottomNavLink
1763:          href="/"
1773:        <TravelerBottomNavLink
1774:          href={rootPreview ? "/traveler/start" : "/traveler/trips"}
1775:          label={tripsLabel}
1785:          href={rootPreview ? "/traveler/start" : "/traveler/pass"}
1810:        <TravelerBottomNavLink
1811:          href={rootPreview ? "/login?mode=returning" : "/traveler/trips"}
1821:        <TravelerBottomNavLink
1822:          href={rootPreview ? "/login?mode=returning" : "/traveler/pass"}
1836:function TravelerShell(props: {
1838:  latestTravelerTrip: any;
1855:            .osp-traveler-shell {
1865:            .osp-pass-qr-card {
1889:      <TravelerShellFrame
1890:        latestTravelerTrip={props.latestTravelerTrip}
1894:      <TravelerPassCard user={props.user} latestTravelerTrip={props.latestTravelerTrip} dictionary={props.dictionary} />
1895:      <TravelerCompactStatusRow latestTravelerTrip={props.latestTravelerTrip} dictionary={props.dictionary} />
1896:            <PassportMapShortcut compact title="Open Siargao Passport Map" body="Jump to your map, Passport Trails, verified stops, and next island movement path." />
1897:      <TravelerReassuranceAndJourney latestTravelerTrip={props.latestTravelerTrip} dictionary={props.dictionary} />
1899:      <UniversalTravelerBottomTabBar activeTab="home" fixed />
1904:export default async function HomePage() {
1906:  const dictionary = await getTravelerDictionary(user?.preferredLanguage || "en");
1991:                  <span>Official Traveler Pass</span>
2023:                href="/login?mode=returning"
2030:                href="/login?mode=returning"
2038:                href="/login?mode=returning"
2043:                href="/login?mode=returning"
2166:                    Verified Traveler
2196:                  Create your official One Siargao Pass or continue an existing trip when you are ready.
2201:                    href="/traveler/start"
2221:                    href="/siargao-passport-map"
2237:                    Open Passport Map
2265:                New Traveler
2283:                Created after trip setup
2307:                  aria-label="Preview QR pattern"
2320:            ["Trip Setup", "Start", "#dcfce7", "#16a34a"],
2348:          Start your OSP access first, then your pass, trip records, payment status, and QR actions will unlock after setup.
2357:            <TravelerJourneyCard
2358:              title="Trips"
2360:              href="/login?mode=returning"
2373:            <TravelerJourneyCard
2376:              href="/login?mode=returning"
2389:            <TravelerJourneyCard
2390:              title="Passport Map"
2392:              href="/siargao-passport-map"
2405:            <TravelerJourneyCard
2407:              subtitle="QR & access state"
2408:              href="/login?mode=returning"
2437:            <TravelerBottomNavLink
2438:              href="/"
2439:              label="Home"
2448:            <TravelerBottomNavLink
2449:              href="/login?mode=returning"
2450:              label="Trips"
2460:              href="/traveler/start"
2461:              aria-label="Open OSP QR"
2483:            <TravelerBottomNavLink
2484:              href="/login?mode=returning"
2494:            <TravelerBottomNavLink
2495:              href="/login?mode=returning"
2511:  const travelerTripResult =
2512:    user.primaryRole === "TRAVELER" ? await getTravelerLatestTrip() : { trip: null, error: null };
2514:  const latestTravelerTrip = travelerTripResult.trip;
2520:          {travelerTripResult.error ? (
2521:            <Section title="Traveler Trip Load Error">
2522:              <div>{travelerTripResult.error}</div>
2526:          <TravelerShell user={user} latestTravelerTrip={latestTravelerTrip} dictionary={dictionary} />
2546:                  { href: "/admin/manifest-approvals", label: "Manifest Approval Queue" },
2547:                  { href: "/admin/manifests/history", label: "Manifest History" },
2561:                  { href: "/operator/manifests", label: "Operator Manifests" },

## Traveler lower tab references

frontend/app/admin/activities/page.tsx:160:        <a href="/" style={{ textDecoration: "none" }}>← Dev Entry</a>
frontend/app/admin/manifests/history/page.tsx:128:        <a href="/" style={{ textDecoration: "none" }}>← Dev Entry</a>
frontend/app/admin/manifest-approvals/page.tsx:195:        <a href="/" style={{ textDecoration: "none" }}>← Dev Entry</a>
frontend/app/traveler/settings/page.tsx:5:import UniversalTravelerBottomTabBar from "../../../src/components/traveler/UniversalTravelerBottomTabBar";
frontend/app/traveler/settings/page.tsx:125:  revalidatePath("/traveler/settings");
frontend/app/traveler/settings/page.tsx:126:  redirect("/traveler/settings?panel=language&saved=1");
frontend/app/traveler/settings/page.tsx:155:  revalidatePath("/traveler/settings");
frontend/app/traveler/settings/page.tsx:157:  redirect("/traveler/settings?panel=currency&saved=1");
frontend/app/traveler/settings/page.tsx:502:    redirect("/traveler/settings?panel=assistant&assistantStatus=empty");
frontend/app/traveler/settings/page.tsx:529:    redirect(`/traveler/settings?${params.toString()}`);
frontend/app/traveler/settings/page.tsx:537:    redirect(`/traveler/settings?${params.toString()}`);
frontend/app/traveler/settings/page.tsx:966:    { key: "language", label: "Language", href: "/traveler/settings?panel=language" },
frontend/app/traveler/settings/page.tsx:967:    { key: "currency", label: "Currency", href: "/traveler/settings?panel=currency" },
frontend/app/traveler/settings/page.tsx:968:    { key: "assistant", label: "AI Guide", href: "/traveler/settings?panel=assistant" },
frontend/app/traveler/settings/page.tsx:969:    { key: "notifications", label: "Alerts", href: "/traveler/settings?panel=notifications" },
frontend/app/traveler/settings/page.tsx:986:          href="/"
frontend/app/traveler/settings/page.tsx:1282:      <UniversalTravelerBottomTabBar activeTab="profile" fixed />
frontend/app/traveler/payments/[intentId]/page.tsx:520:        <AppLink href="/" label={navHomeLabel} icon={<Icon kind="home" />} />
frontend/app/traveler/payments/[intentId]/page.tsx:660:              <AppLink href="/" label="Home" icon={<Icon kind="home" />} />
frontend/app/traveler/partner-tours/page.tsx:1:import UniversalTravelerBottomTabBar from "../../../src/components/traveler/UniversalTravelerBottomTabBar";
frontend/app/traveler/partner-tours/page.tsx:229:                href="/traveler/passport-trails"
frontend/app/traveler/partner-tours/page.tsx:295:              <CompactLink href="/traveler/passport-trails/diy-trail-builder" icon="🧩" variant="secondary">
frontend/app/traveler/partner-tours/page.tsx:422:                    <CompactLink href="/traveler/passport-trails/diy-trail-builder" icon="+" variant="primary">
frontend/app/traveler/partner-tours/page.tsx:535:            <CompactLink href="/traveler/settings?panel=assistant&topic=trail" icon="✨">Ask Kuya Tala</CompactLink>
frontend/app/traveler/partner-tours/page.tsx:536:            <CompactLink href="/traveler/passport-trails" icon="🏝️" variant="secondary">Passport Trails</CompactLink>
frontend/app/traveler/partner-tours/page.tsx:562:            <CompactLink href="/traveler/passport-trails" icon="🏝️" variant="secondary">
frontend/app/traveler/partner-tours/page.tsx:565:            <CompactLink href="/traveler/passport-trails/diy-trail-builder" icon="🧩">
frontend/app/traveler/partner-tours/page.tsx:575:      <UniversalTravelerBottomTabBar activeTab="explore" fixed />
frontend/app/traveler/pass/page.tsx:5:import UniversalTravelerBottomTabBar from "../../../src/components/traveler/UniversalTravelerBottomTabBar";
frontend/app/traveler/pass/page.tsx:853:      <UniversalTravelerBottomTabBar fixed />
frontend/app/traveler/passport-map/page.tsx:2:import UniversalTravelerBottomTabBar from "../../../src/components/traveler/UniversalTravelerBottomTabBar";
frontend/app/traveler/passport-map/page.tsx:61:              href="/"
frontend/app/traveler/passport-map/page.tsx:135:                href="/traveler/settings?panel=notifications"
frontend/app/traveler/passport-map/page.tsx:182:                href="/traveler/settings?panel=assistant&topic=map"
frontend/app/traveler/passport-map/page.tsx:393:      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
frontend/app/traveler/passport-map/page.tsx:604:      href: "/traveler/passport-trails",
frontend/app/traveler/passport-map/page.tsx:892:      href: "/traveler/passport-trails/island-hopping",
frontend/app/traveler/passport-map/page.tsx:900:      href: "/traveler/passport-trails",
frontend/app/traveler/passport-map/page.tsx:908:      href: "/traveler/passport-trails",
frontend/app/traveler/passport-map/page.tsx:920:        href: trail.href ?? fallbackTrails[index]?.href ?? "/traveler/passport-trails",
frontend/app/traveler/passport-map/page.tsx:947:          href="/traveler/passport-trails"
frontend/app/traveler/passport-map/page.tsx:975:              href={trail.href ?? "/traveler/passport-trails"}
frontend/app/traveler/passport-map/page.tsx:1065:      href="/traveler/passport-trails"
frontend/app/traveler/passport-map/page.tsx:1719:          href="/traveler/passport-trails/island-hopping"
frontend/app/traveler/passport-map/page.tsx:1982:      href: "/traveler/partner-tours",
frontend/app/traveler/passport-map/page.tsx:1993:      href: "/traveler/passport-trails",
frontend/app/traveler/passport-map/page.tsx:2004:      href: "/traveler/passport-trails",
frontend/app/traveler/passport-map/page.tsx:2034:          href="/traveler/passport-trails"
frontend/app/traveler/passport-map/page.tsx:2134:      href: "/traveler/passport-trails/island-hopping",
frontend/app/traveler/passport-map/page.tsx:2145:      href: "/traveler/passport-trails/surf-explorer",
frontend/app/traveler/passport-map/page.tsx:2156:      href: "/traveler/passport-trails/north-siargao",
frontend/app/traveler/passport-map/page.tsx:2167:      href: "/traveler/passport-trails/inland-discovery",
frontend/app/traveler/passport-map/page.tsx:2178:      href: "/traveler/passport-trails/culture-community",
frontend/app/traveler/passport-map/page.tsx:2189:      href: "/traveler/passport-trails/sunset-scenic",
frontend/app/traveler/passport-map/page.tsx:2200:      href: "/traveler/passport-trails/adventure",
frontend/app/traveler/passport-map/page.tsx:2211:      href: "/traveler/passport-trails/return-traveler-continuity",
frontend/app/traveler/passport-map/page.tsx:2246:          href="/traveler/passport-trails"
frontend/app/traveler/passport-map/page.tsx:2437:        href="/traveler/passport-trails/diy-trail-builder"
frontend/app/traveler/passport-map/page.tsx:2544:          href="/traveler/passport-trails"
frontend/app/traveler/passport-map/page.tsx:2639:      href: "/traveler/partner-tours",
frontend/app/traveler/passport-map/page.tsx:2649:      href: "/traveler/passport-trails",
frontend/app/traveler/passport-map/page.tsx:2659:      href: "/traveler/passport-trails/diy-trail-builder",
frontend/app/traveler/scan/page.tsx:5:import UniversalTravelerBottomTabBar from "../../../src/components/traveler/UniversalTravelerBottomTabBar";
frontend/app/traveler/scan/page.tsx:88:            href="/traveler/passport-trails"
frontend/app/traveler/scan/page.tsx:346:      <UniversalTravelerBottomTabBar activeTab="pass" fixed />
frontend/app/traveler/emergency-safety/page.tsx:217:            href="/traveler/settings"
frontend/app/traveler/emergency-safety/page.tsx:237:            href="/traveler/settings?panel=assistant&topic=emergency"
frontend/app/traveler/emergency-safety/page.tsx:327:            <ActionButton href="/traveler/settings?panel=assistant&topic=emergency" label="Ask Kuya Tala™" note="Get safety guidance and find your OSP records." primary />
frontend/app/traveler/trips/[tripId]/page.tsx:886:        <AppLink href="/" label={navHomeLabel} icon={<Icon kind="home" />} />
frontend/app/traveler/trips/page.tsx:385:          href="/"
frontend/app/traveler/trips/page.tsx:434:        <PillLink href="/" label={navHome} icon={<TripsNavIcon kind="HOME" />} />
frontend/app/traveler/passport-trails/diy-trail-builder/page.tsx:4:import UniversalTravelerBottomTabBar from "../../../../src/components/traveler/UniversalTravelerBottomTabBar";
frontend/app/traveler/passport-trails/diy-trail-builder/page.tsx:317:              href="/traveler/passport-trails"
frontend/app/traveler/passport-trails/diy-trail-builder/page.tsx:366:            <CompactButton href="/traveler/passport-trails/diy-trail-builder/summary" icon="📋" variant="secondary">
frontend/app/traveler/passport-trails/diy-trail-builder/page.tsx:645:            <CompactButton href="/traveler/passport-trails/diy-trail-builder/summary" icon="📋" variant="secondary" disabled={!draftItems.length}>
frontend/app/traveler/passport-trails/diy-trail-builder/page.tsx:682:            <CompactButton href="/traveler/passport-trails/diy-trail-builder/summary" icon="📋" variant="dark">
frontend/app/traveler/passport-trails/diy-trail-builder/page.tsx:690:      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
frontend/app/traveler/passport-trails/diy-trail-builder/summary/page.tsx:4:import UniversalTravelerBottomTabBar from "../../../../../src/components/traveler/UniversalTravelerBottomTabBar";
frontend/app/traveler/passport-trails/diy-trail-builder/summary/page.tsx:91:            href="/traveler/passport-trails/diy-trail-builder"
frontend/app/traveler/passport-trails/diy-trail-builder/summary/page.tsx:231:            <MiniButton href="/traveler/passport-trails/diy-trail-builder" icon="🧩" variant="secondary">
frontend/app/traveler/passport-trails/diy-trail-builder/summary/page.tsx:234:            <MiniButton href="/traveler/settings?panel=assistant&topic=trail" icon="✨">
frontend/app/traveler/passport-trails/diy-trail-builder/summary/page.tsx:242:      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
frontend/app/traveler/passport-trails/[trailSlug]/page.tsx:996:            href="/traveler/passport-trails"
frontend/app/traveler/passport-trails/[trailSlug]/page.tsx:1154:            href={`/traveler/scan?source=passport-trails&trail=${params.trailSlug}`}
frontend/app/traveler/passport-trails/[trailSlug]/page.tsx:1255:                href="/traveler/settings?panel=assistant&topic=trail"
frontend/app/traveler/passport-trails/[trailSlug]/page.tsx:1511:                  href="/traveler/settings?panel=assistant&topic=trail"
frontend/app/traveler/passport-trails/[trailSlug]/page.tsx:1582:            { label: "Trails", href: "/traveler/passport-trails", icon: "⌁" },
frontend/app/traveler/passport-trails/[trailSlug]/page.tsx:1584:            { label: "Profile", href: "/traveler/settings", icon: "◉" },
frontend/app/traveler/passport-trails/page.tsx:3:import UniversalTravelerBottomTabBar from "../../../src/components/traveler/UniversalTravelerBottomTabBar";
frontend/app/traveler/passport-trails/page.tsx:10:    href: "/traveler/partner-tours",
frontend/app/traveler/passport-trails/page.tsx:18:    href: "/traveler/passport-trails/island-hopping",
frontend/app/traveler/passport-trails/page.tsx:28:    href: "/traveler/passport-trails/surf-explorer",
frontend/app/traveler/passport-trails/page.tsx:38:    href: "/traveler/passport-trails/north-siargao",
frontend/app/traveler/passport-trails/page.tsx:48:    href: "/traveler/passport-trails/inland-discovery",
frontend/app/traveler/passport-trails/page.tsx:58:    href: "/traveler/passport-trails/culture-community",
frontend/app/traveler/passport-trails/page.tsx:68:    href: "/traveler/passport-trails/sunset-scenic",
frontend/app/traveler/passport-trails/page.tsx:78:    href: "/traveler/passport-trails/adventure",
frontend/app/traveler/passport-trails/page.tsx:88:    href: "/traveler/passport-trails/return-traveler-continuity",
frontend/app/traveler/passport-trails/page.tsx:434:            href="/traveler/passport-trails/diy-trail-builder"
frontend/app/traveler/passport-trails/page.tsx:456:      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
frontend/app/page.tsx:5:import UniversalTravelerBottomTabBar from "../src/components/traveler/UniversalTravelerBottomTabBar";
frontend/app/page.tsx:1068:          <HeaderControlButton label={languageLabel} ariaLabel={languageAriaLabel} href={rootPreview ? "/login?mode=returning" : "/traveler/settings?panel=language"} icon="language" />
frontend/app/page.tsx:1069:          <HeaderControlButton label="PHP" ariaLabel={currencyAriaLabel} href={rootPreview ? "/login?mode=returning" : "/traveler/settings?panel=currency"} icon="currency" />
frontend/app/page.tsx:1070:          <HeaderControlButton className="osp-phone-secondary-control" label="AI" ariaLabel={assistantAriaLabel} href={rootPreview ? "/login?mode=returning" : "/traveler/settings?panel=assistant"} icon="assistant" />
frontend/app/page.tsx:1074:            href={rootPreview ? "/login?mode=returning" : "/traveler/settings?panel=notifications"}
frontend/app/page.tsx:1763:          href="/"
frontend/app/page.tsx:1899:      <UniversalTravelerBottomTabBar activeTab="home" fixed />
frontend/app/page.tsx:2438:              href="/"
frontend/app/login/page.tsx:490:                href="/"
frontend/src/spm/scan/SpmScanQrCta.tsx:16:  return `/traveler/scan?${params.toString()}`;
frontend/src/spm/scan/SpmScanQrCta.tsx:182:          { href: "/traveler/scan?source=partner-tours", label: "Partner" },
frontend/src/spm/scan/SpmScanQrCta.tsx:183:          { href: "/traveler/scan?source=official-trails", label: "Trails" },
frontend/src/spm/scan/SpmScanQrCta.tsx:184:          { href: "/traveler/scan?source=diy-trail-builder", label: "DIY" },
frontend/src/traveler-assistant/KuyaTalaEntryButton.tsx:80:  const href = `/traveler/settings?panel=assistant&topic=${encodeURIComponent(props.topic)}`;
frontend/src/traveler-assistant/KuyaTalaChatBox.tsx:120:    return "/traveler/passport-trails";
frontend/src/traveler-assistant/KuyaTalaChatBox.tsx:131:  return "/traveler/settings?panel=assistant";
frontend/src/components/traveler/UniversalTravelerBottomTabBar.tsx:15:  { key: "trails", label: "Trails", href: "/traveler/passport-trails", icon: "◇", ariaLabel: "Open Passport Trails" },
frontend/src/components/traveler/UniversalTravelerBottomTabBar.tsx:16:  { key: "pass", label: "QR", href: "/traveler/scan", icon: "▦", ariaLabel: "Open scanner camera" },
frontend/src/components/traveler/UniversalTravelerBottomTabBar.tsx:17:  { key: "explore", label: "Explore", href: "/traveler/partner-tours", icon: "✦", ariaLabel: "Open Siargao partner tours and local experiences" },
frontend/src/components/traveler/UniversalTravelerBottomTabBar.tsx:18:  { key: "profile", label: "Profile", href: "/traveler/settings", icon: "♙", ariaLabel: "Open traveler profile and settings" },
frontend/src/components/traveler/UniversalTravelerBottomTabBar.tsx:21:export default function UniversalTravelerBottomTabBar(props: {
frontend/src/components/operator/OperatorShell.tsx:113:            <a href="/" style={{ textDecoration: "none", color: "#334155", fontWeight: 700 }}>
