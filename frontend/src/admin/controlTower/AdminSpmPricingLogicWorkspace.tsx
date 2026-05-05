'use client';

import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';

const OSP = {
  navy: '#013863',
  deepNavy: '#003B66',
  teal: '#0596A5',
  tealDark: '#007B88',
  gold: '#F3AE26',
  mist: '#EAFBFA',
  white: '#FFFFFF',
  slate: '#50668B',
  softSlate: '#6C7FA5',
  line: 'rgba(1,56,99,0.10)',
  danger: '#B54708',
  green: '#16846F',
};

type TravelerPriceDisplayMode =
  | 'FIXED_PRICE'
  | 'FROM_PRICE'
  | 'PRICE_RANGE'
  | 'PRICE_ON_REQUEST'
  | 'HIDDEN_UNTIL_CONFIRMED';

type BookingMode =
  | 'INSTANT_BOOK'
  | 'REQUEST_TO_CONFIRM'
  | 'ADMIN_ASSISTED'
  | 'NOT_BOOKABLE';

type ProductSurface =
  | 'TRAVELER_PARTNER_TOURS'
  | 'TRAVELER_PASSPORT_TRAILS'
  | 'TRAVELER_EXPLORE'
  | 'TRAVELER_DIY_BUILDER';

type PublishState = 'DRAFT' | 'READY_FOR_REVIEW' | 'APPROVED_FOR_FRONTEND' | 'LIVE' | 'SUSPENDED';

type TourType = 'JOINER_TOUR' | 'PRIVATE_TOUR' | 'PRIVATE_PREMIUM' | 'PRIVATE_VVIP' | 'TRANSFER';

const products = [
  {
    code: 'TRI_ISLAND_JOINER',
    title: 'Tri-Island Passport Trail — Joiner',
    family: 'Island Hopping Trail',
    tourType: 'JOINER_TOUR' as TourType,
    surface: 'TRAVELER_PASSPORT_TRAILS' as ProductSurface,
    mode: 'FROM_PRICE' as TravelerPriceDisplayMode,
    displayPrice: 'From ₱1,500 / traveler',
    shortPrice: 'From ₱1,500',
    bookingMode: 'REQUEST_TO_CONFIRM' as BookingMode,
    publishState: 'READY_FOR_REVIEW' as PublishState,
    priceNote: 'Shared island-hopping slot. Final availability is confirmed before payment.',
    trustNote: 'Includes Guyam, Naked, Daku, and Secret Island when tide allows.',
  },
  {
    code: 'CORREGIDOR_TRI_ISLAND',
    title: 'Corregidor + Tri-Island Joiner',
    family: 'Island Hopping / Adventure Extended',
    tourType: 'JOINER_TOUR' as TourType,
    surface: 'TRAVELER_PARTNER_TOURS' as ProductSurface,
    mode: 'FROM_PRICE' as TravelerPriceDisplayMode,
    displayPrice: 'From ₱2,300 / traveler',
    shortPrice: 'From ₱2,300',
    bookingMode: 'REQUEST_TO_CONFIRM' as BookingMode,
    publishState: 'READY_FOR_REVIEW' as PublishState,
    priceNote: 'Extended island route. Staff confirms weather, capacity, and route sequence.',
    trustNote: 'Best for travelers who want Corregidor plus classic island hopping.',
  },
  {
    code: 'LAND_TOUR_PRIVATE',
    title: 'Private DIY Land Tour',
    family: 'North Siargao / Inland Discovery',
    tourType: 'PRIVATE_TOUR' as TourType,
    surface: 'TRAVELER_DIY_BUILDER' as ProductSurface,
    mode: 'PRICE_RANGE' as TravelerPriceDisplayMode,
    displayPrice: '₱1,700–₱10,000 / traveler',
    shortPrice: 'Price varies by group size',
    bookingMode: 'ADMIN_ASSISTED' as BookingMode,
    publishState: 'DRAFT' as PublishState,
    priceNote: 'Private route pricing depends on group size, route selection, pickup area, and support requirements.',
    trustNote: 'Use this when staff must review stops and logistics before traveler confirmation.',
  },
  {
    code: 'TRI_ISLAND_PREMIUM',
    title: 'Tri-Island Private Premium',
    family: 'Island Hopping Premium',
    tourType: 'PRIVATE_PREMIUM' as TourType,
    surface: 'TRAVELER_PARTNER_TOURS' as ProductSurface,
    mode: 'FROM_PRICE' as TravelerPriceDisplayMode,
    displayPrice: 'From ₱2,000 / traveler',
    shortPrice: 'Premium private',
    bookingMode: 'REQUEST_TO_CONFIRM' as BookingMode,
    publishState: 'READY_FOR_REVIEW' as PublishState,
    priceNote: 'Premium private route with richer inclusions and optional party boat add-on.',
    trustNote: 'Use premium label only when inclusions, food menu, and media support are verified.',
  },
  {
    code: 'TRI_ISLAND_VVIP',
    title: 'Tri-Island Private VVIP',
    family: 'Island Hopping VVIP',
    tourType: 'PRIVATE_VVIP' as TourType,
    surface: 'TRAVELER_PARTNER_TOURS' as ProductSurface,
    mode: 'FIXED_PRICE' as TravelerPriceDisplayMode,
    displayPrice: '₱60,000 private package',
    shortPrice: '₱60,000 package',
    bookingMode: 'ADMIN_ASSISTED' as BookingMode,
    publishState: 'READY_FOR_REVIEW' as PublishState,
    priceNote: 'Flat private package. Staff must confirm inclusions, capacity, timing, and pickup scope before booking.',
    trustNote: 'Do not show as per-head pricing unless a max-pax rule is later approved.',
  },
];

const surfaceLabels: Record<ProductSurface, string> = {
  TRAVELER_PARTNER_TOURS: 'Traveler Partner Tours',
  TRAVELER_PASSPORT_TRAILS: 'Traveler Passport Trails',
  TRAVELER_EXPLORE: 'Traveler Explore',
  TRAVELER_DIY_BUILDER: 'Traveler DIY Builder',
};

const displayModeLabels: Record<TravelerPriceDisplayMode, string> = {
  FIXED_PRICE: 'Fixed price',
  FROM_PRICE: 'From-price',
  PRICE_RANGE: 'Price range',
  PRICE_ON_REQUEST: 'Price on request',
  HIDDEN_UNTIL_CONFIRMED: 'Hidden until confirmed',
};

const bookingModeLabels: Record<BookingMode, string> = {
  INSTANT_BOOK: 'Instant Book',
  REQUEST_TO_CONFIRM: 'Request to Confirm',
  ADMIN_ASSISTED: 'Admin Assisted',
  NOT_BOOKABLE: 'Not Bookable',
};

const publishStateLabels: Record<PublishState, string> = {
  DRAFT: 'Draft',
  READY_FOR_REVIEW: 'Ready for Review',
  APPROVED_FOR_FRONTEND: 'Approved for Frontend',
  LIVE: 'Live',
  SUSPENDED: 'Suspended',
};

const tourTypeLabels: Record<TourType, string> = {
  JOINER_TOUR: 'Joiner Tour',
  PRIVATE_TOUR: 'Private Tour',
  PRIVATE_PREMIUM: 'Premium Private',
  PRIVATE_VVIP: 'VVIP Package',
  TRANSFER: 'Transfer',
};

function Pill({
  children,
  tone = 'teal',
}: {
  children: ReactNode;
  tone?: 'teal' | 'gold' | 'navy' | 'danger' | 'muted' | 'green';
}) {
  const palette = {
    teal: { background: 'rgba(5,150,165,0.13)', color: OSP.navy },
    gold: { background: 'rgba(243,174,38,0.22)', color: '#7A5200' },
    navy: { background: 'rgba(1,56,99,0.10)', color: OSP.navy },
    danger: { background: 'rgba(181,71,8,0.12)', color: OSP.danger },
    muted: { background: 'rgba(80,102,139,0.10)', color: OSP.slate },
    green: { background: 'rgba(22,132,111,0.12)', color: OSP.green },
  }[tone];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 999,
        minHeight: 23,
        padding: '0 10px',
        fontSize: 10,
        fontWeight: 950,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...palette,
      }}
    >
      {children}
    </span>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label style={{ display: 'block', marginBottom: 6, color: OSP.navy, fontSize: 11, fontWeight: 900 }}>
      {children}
    </label>
  );
}

function controlStyle(): CSSProperties {
  return {
    width: '100%',
    minHeight: 40,
    borderRadius: 13,
    border: `1px solid ${OSP.line}`,
    background: OSP.white,
    color: OSP.navy,
    padding: '0 12px',
    fontSize: 13,
    fontWeight: 850,
    outline: 'none',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.75)',
  };
}

function Card({
  children,
  tone = 'white',
  style,
}: {
  children: ReactNode;
  tone?: 'white' | 'mist' | 'gold' | 'navy';
  style?: CSSProperties;
}) {
  const background =
    tone === 'navy'
      ? `linear-gradient(135deg, ${OSP.deepNavy}, ${OSP.tealDark})`
      : tone === 'gold'
      ? 'linear-gradient(135deg, rgba(255,247,230,0.98), rgba(255,255,255,0.96))'
      : tone === 'mist'
      ? 'linear-gradient(135deg, rgba(234,251,250,0.88), rgba(255,255,255,0.98))'
      : OSP.white;

  return (
    <section
      style={{
        borderRadius: 22,
        border: tone === 'navy' ? '1px solid rgba(255,255,255,0.20)' : `1px solid ${OSP.line}`,
        background,
        padding: 14,
        boxShadow: tone === 'navy' ? '0 22px 54px rgba(1,56,99,0.24)' : '0 16px 34px rgba(1,56,99,0.055)',
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function SignalCard({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <article
      style={{
        borderRadius: 18,
        border: `1px solid ${OSP.line}`,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(234,251,250,0.72))',
        padding: 12,
        minHeight: 82,
        boxShadow: '0 14px 30px rgba(1,56,99,0.045)',
      }}
    >
      <div style={{ color: OSP.teal, fontSize: 10, fontWeight: 950, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        {title}
      </div>
      <strong
        style={{
          display: 'block',
          marginTop: 7,
          color: OSP.navy,
          fontSize: 15,
          lineHeight: 1.12,
          fontWeight: 900,
          maxHeight: 38,
          overflow: 'hidden',
        }}
      >
        {value}
      </strong>
      <p style={{ margin: '7px 0 0', color: OSP.slate, fontSize: 11.5, lineHeight: 1.3, fontWeight: 720 }}>
        {note}
      </p>
    </article>
  );
}

function TravelerPreview({
  productTitle,
  displayPrice,
  shortPrice,
  bookingMode,
  priceNote,
  trustNote,
  surface,
}: {
  productTitle: string;
  displayPrice: string;
  shortPrice: string;
  bookingMode: BookingMode;
  priceNote: string;
  trustNote: string;
  surface: ProductSurface;
}) {
  return (
    <Card tone="navy" style={{ padding: 10 }}>
      <div
        style={{
          borderRadius: 22,
          background: 'linear-gradient(180deg, #FFFFFF, #F4FCFA)',
          overflow: 'hidden',
          minHeight: 300,
        }}
      >
        <div
          style={{
            minHeight: 94,
            background: `linear-gradient(135deg, ${OSP.deepNavy}, ${OSP.teal})`,
            padding: 14,
            color: OSP.white,
          }}
        >
          <div style={{ fontSize: 10, letterSpacing: '0.14em', fontWeight: 950, color: OSP.gold }}>
            LIVE CARD PREVIEW
          </div>
          <h4 style={{ margin: '9px 0 0', fontSize: 19, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: 820 }}>
            {productTitle}
          </h4>
        </div>

        <div style={{ padding: 13 }}>
          <Pill tone="teal">{surfaceLabels[surface]}</Pill>

          <div style={{ marginTop: 12, borderRadius: 18, border: `1px solid ${OSP.line}`, background: OSP.white, padding: 13 }}>
            <div style={{ color: OSP.slate, fontSize: 11, fontWeight: 900 }}>Traveler sees</div>
            <strong style={{ display: 'block', marginTop: 5, color: OSP.navy, fontSize: 22, lineHeight: 1 }}>
              {displayPrice}
            </strong>
            <div style={{ marginTop: 8, color: OSP.softSlate, fontSize: 12, fontWeight: 800 }}>
              Card label {shortPrice}
            </div>
          </div>

          <div
            style={{
              marginTop: 10,
              borderRadius: 16,
              background: 'rgba(234,251,250,0.75)',
              border: `1px solid ${OSP.line}`,
              padding: 11,
              color: OSP.navy,
              fontSize: 12,
              lineHeight: 1.45,
              fontWeight: 760,
            }}
          >
            {priceNote}
          </div>

          <div style={{ marginTop: 9, color: OSP.slate, fontSize: 11.5, lineHeight: 1.35, fontWeight: 720 }}>
            {trustNote}
          </div>

          <button
            type="button"
            style={{
              marginTop: 13,
              width: '100%',
              minHeight: 44,
              border: 0,
              borderRadius: 999,
              background: OSP.gold,
              color: OSP.navy,
              fontWeight: 950,
              fontSize: 13,
              cursor: 'default',
            }}
          >
            {bookingMode === 'INSTANT_BOOK'
              ? 'Book Now'
              : bookingMode === 'REQUEST_TO_CONFIRM'
              ? 'Request Availability'
              : bookingMode === 'ADMIN_ASSISTED'
              ? 'Ask OSP to Assist'
              : 'Not Available Yet'}
          </button>
        </div>
      </div>
    </Card>
  );
}

export default function AdminSpmPricingLogicWorkspace() {
  const [selectedCode, setSelectedCode] = useState(products[0].code);
  const selected = products.find((item) => item.code === selectedCode) ?? products[0];

  const [surface, setSurface] = useState<ProductSurface>(selected.surface);
  const [displayMode, setDisplayMode] = useState<TravelerPriceDisplayMode>(selected.mode);
  const [displayPrice, setDisplayPrice] = useState(selected.displayPrice);
  const [shortPrice, setShortPrice] = useState(selected.shortPrice);
  const [bookingMode, setBookingMode] = useState<BookingMode>(selected.bookingMode);
  const [publishState, setPublishState] = useState<PublishState>(selected.publishState);
  const [priceNote, setPriceNote] = useState(selected.priceNote);
  const [trustNote, setTrustNote] = useState(selected.trustNote);
  const [inclusionsReady, setInclusionsReady] = useState(true);
  const [termsReady, setTermsReady] = useState(false);
  const [capacityReady, setCapacityReady] = useState(false);
  const [mappingReady, setMappingReady] = useState(true);
  const [showContract, setShowContract] = useState(false);

  const issues = useMemo(() => {
    const warnings: string[] = [];

    if (!displayPrice.trim()) warnings.push('Traveler displayed price is missing.');
    if (!shortPrice.trim()) warnings.push('Card price label is missing.');
    if (displayMode !== 'HIDDEN_UNTIL_CONFIRMED' && displayPrice.trim().length < 6) {
      warnings.push('Displayed price is too vague for traveler trust.');
    }
    if (bookingMode === 'INSTANT_BOOK' && displayMode === 'PRICE_ON_REQUEST') {
      warnings.push('Instant Book cannot use Price on Request.');
    }
    if (publishState === 'LIVE' && (!inclusionsReady || !termsReady || !capacityReady || !mappingReady)) {
      warnings.push('Live pricing requires inclusions, terms, capacity, and trail mapping readiness.');
    }
    if (!inclusionsReady) warnings.push('Inclusions are not ready.');
    if (!termsReady) warnings.push('Booking/cancellation terms are not ready.');
    if (!capacityReady) warnings.push('Capacity or availability handling is not ready.');
    if (!mappingReady) warnings.push('Passport Trail / Traveler surface mapping is not ready.');

    return warnings;
  }, [displayPrice, shortPrice, displayMode, bookingMode, publishState, inclusionsReady, termsReady, capacityReady, mappingReady]);

  const stateLabel = issues.length ? 'NEEDS REVIEW' : publishState === 'LIVE' ? 'LIVE READY' : 'READY FOR FRONTEND';

  function handleProductChange(nextCode: string) {
    const next = products.find((item) => item.code === nextCode) ?? products[0];

    setSelectedCode(next.code);
    setSurface(next.surface);
    setDisplayMode(next.mode);
    setDisplayPrice(next.displayPrice);
    setShortPrice(next.shortPrice);
    setBookingMode(next.bookingMode);
    setPublishState(next.publishState);
    setPriceNote(next.priceNote);
    setTrustNote(next.trustNote);
    setInclusionsReady(true);
    setTermsReady(false);
    setCapacityReady(false);
    setMappingReady(true);
  }

  const frontendContract = {
    lane: 'ADMIN-CT-SPM-09G-9',
    purpose: 'Configure traveler-facing price display per SPM product before VPS',
    backendWrite: false,
    dbWrite: false,
    commissionConfiguredAtBackend: true,
    internalCommercialsExcluded: true,
    travelerFrontendPricingConfig: {
      productCode: selectedCode,
      productTitle: selected.title,
      tourType: selected.tourType,
      travelerSurface: surface,
      priceDisplayMode: displayMode,
      displayPrice,
      shortPrice,
      bookingMode,
      publishState,
      priceNote,
      trustNote,
      readiness: {
        inclusionsReady,
        termsReady,
        capacityReady,
        mappingReady,
      },
      frontendWarnings: issues,
    },
  };

  return (
    <section
      style={{
        borderRadius: 30,
        border: `1px solid ${OSP.line}`,
        background:
          'radial-gradient(circle at top right, rgba(5,150,165,0.11), transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.99), rgba(234,251,250,0.96))',
        padding: 15,
        boxShadow: '0 30px 76px rgba(1,56,99,0.11)',
      }}
    >
      <Card tone="navy" style={{ padding: 15, overflow: 'hidden', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            right: -80,
            top: -90,
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'rgba(243,174,38,0.16)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 40,
            bottom: -80,
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'rgba(234,251,250,0.12)',
          }}
        />

        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: 14, alignItems: 'center' }}>
          <div>
            <p
              style={{
                margin: '0 0 8px',
                color: OSP.gold,
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: '0.17em',
                textTransform: 'uppercase',
              }}
            >
              ADMIN-CT-SPM-09G-9 / VPS-Ready Traveler Pricing Control
            </p>

            <h2
              style={{
                margin: 0,
                color: OSP.white,
                fontSize: 'clamp(1.45rem, 2.1vw, 2.05rem)',
                lineHeight: 1,
                letterSpacing: '-0.04em',
                fontWeight: 760,
                textShadow: '0 2px 18px rgba(0,0,0,0.34)',
              }}
            >
              Traveler Pricing Control Desk
            </h2>

            <p style={{ margin: '10px 0 0', color: 'rgba(255,255,255,0.88)', fontSize: 13, lineHeight: 1.5, maxWidth: 760 }}>
              Control the exact pricing language shown on Traveler UI cards and detail pages. Configure display mode,
              visible price copy, booking behavior, publish state, and readiness gates without exposing backend commercial logic.
            </p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              <Pill tone="gold">Frontend traveler pricing</Pill>
              <Pill tone="teal">Product price display</Pill>
              <Pill tone={issues.length ? 'gold' : 'green'}>{stateLabel}</Pill>
              <Pill tone="muted">Commission backend-owned</Pill>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
            <CommandBox label="Active Product" value={selected.title} />
            <CommandBox label="Frontend Surface" value={surfaceLabels[surface]} />
            <CommandBox label="Visible Price" value={displayPrice} />
          </div>
        </div>
      </Card>

      <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(145px, 1fr))', gap: 9 }}>
        <SignalCard title="Product Type" value={tourTypeLabels[selected.tourType]} note="Tour taxonomy" />
        <SignalCard title="Trail Mapping" value={selected.family} note="Destination product home" />
        <SignalCard title="Card Label" value={shortPrice} note="Frontend card copy" />
        <SignalCard title="Status" value={stateLabel} note="VPS readiness" />
      </div>

      <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 10, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 10 }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
              <div>
                <p
                  style={{
                    margin: '0 0 6px',
                    color: OSP.teal,
                    fontSize: 10,
                    fontWeight: 950,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                  }}
                >
                  Frontend Price Publishing Desk
                </p>
                <h3 style={{ margin: 0, color: OSP.navy, fontSize: 22, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: 820 }}>
                  Configure frontend price display
                </h3>
              </div>
              <Pill tone={issues.length ? 'gold' : 'green'}>{stateLabel}</Pill>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(180px, 1fr))', gap: 10, marginTop: 14 }}>
              <div>
                <FieldLabel>SPM product / package</FieldLabel>
                <select value={selectedCode} onChange={(event) => handleProductChange(event.target.value)} style={controlStyle()}>
                  {products.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel>Traveler frontend surface</FieldLabel>
                <select value={surface} onChange={(event) => setSurface(event.target.value as ProductSurface)} style={controlStyle()}>
                  <option value="TRAVELER_PARTNER_TOURS">Traveler Partner Tours</option>
                  <option value="TRAVELER_PASSPORT_TRAILS">Traveler Passport Trails</option>
                  <option value="TRAVELER_EXPLORE">Traveler Explore</option>
                  <option value="TRAVELER_DIY_BUILDER">Traveler DIY Builder</option>
                </select>
              </div>

              <div>
                <FieldLabel>Price display mode</FieldLabel>
                <select
                  value={displayMode}
                  onChange={(event) => setDisplayMode(event.target.value as TravelerPriceDisplayMode)}
                  style={controlStyle()}
                >
                  <option value="FIXED_PRICE">Fixed price</option>
                  <option value="FROM_PRICE">From-price</option>
                  <option value="PRICE_RANGE">Price range</option>
                  <option value="PRICE_ON_REQUEST">Price on request</option>
                  <option value="HIDDEN_UNTIL_CONFIRMED">Hidden until confirmed</option>
                </select>
              </div>

              <div>
                <FieldLabel>Traveler displayed price</FieldLabel>
                <input
                  value={displayPrice}
                  onChange={(event) => setDisplayPrice(event.target.value)}
                  placeholder="Example: From ₱1,500 / traveler"
                  style={controlStyle()}
                />
              </div>

              <div>
                <FieldLabel>Card price label</FieldLabel>
                <input
                  value={shortPrice}
                  onChange={(event) => setShortPrice(event.target.value)}
                  placeholder="Example: From ₱1,500"
                  style={controlStyle()}
                />
              </div>

              <div>
                <FieldLabel>Booking behavior</FieldLabel>
                <select value={bookingMode} onChange={(event) => setBookingMode(event.target.value as BookingMode)} style={controlStyle()}>
                  <option value="INSTANT_BOOK">Instant Book</option>
                  <option value="REQUEST_TO_CONFIRM">Request to Confirm</option>
                  <option value="ADMIN_ASSISTED">Admin Assisted</option>
                  <option value="NOT_BOOKABLE">Not Bookable</option>
                </select>
              </div>

              <div>
                <FieldLabel>Frontend publish state</FieldLabel>
                <select value={publishState} onChange={(event) => setPublishState(event.target.value as PublishState)} style={controlStyle()}>
                  <option value="DRAFT">Draft</option>
                  <option value="READY_FOR_REVIEW">Ready for Review</option>
                  <option value="APPROVED_FOR_FRONTEND">Approved for Frontend</option>
                  <option value="LIVE">Live</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>

              <div>
                <FieldLabel>Commission logic</FieldLabel>
                <input value="Configured in backend / Pricing Governance" readOnly style={controlStyle()} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <FieldLabel>Traveler price note</FieldLabel>
                <textarea
                  value={priceNote}
                  onChange={(event) => setPriceNote(event.target.value)}
                  style={{
                    ...controlStyle(),
                    minHeight: 72,
                    paddingTop: 12,
                    resize: 'vertical',
                    lineHeight: 1.45,
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <FieldLabel>Traveler trust note</FieldLabel>
                <textarea
                  value={trustNote}
                  onChange={(event) => setTrustNote(event.target.value)}
                  style={{
                    ...controlStyle(),
                    minHeight: 64,
                    paddingTop: 12,
                    resize: 'vertical',
                    lineHeight: 1.45,
                  }}
                />
              </div>
            </div>
          </Card>

          <Card>
            <p
              style={{
                margin: '0 0 6px',
                color: OSP.teal,
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Frontend Readiness Gates
            </p>
            <h3 style={{ margin: 0, color: OSP.navy, fontSize: 22, lineHeight: 1, letterSpacing: '-0.04em' }}>
              Frontend pricing cannot go live until these gates are clean
            </h3>
            <p style={{ margin: '8px 0 0', color: OSP.slate, fontSize: 12.5, lineHeight: 1.45 }}>
              These checks protect traveler trust before the price appears on Passport Trails, Partner Tours, Explore, or DIY Builder surfaces.
            </p>

            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              <ToggleCard title="Inclusions ready" checked={inclusionsReady} onChange={() => setInclusionsReady((value) => !value)} />
              <ToggleCard title="Terms ready" checked={termsReady} onChange={() => setTermsReady((value) => !value)} />
              <ToggleCard title="Capacity ready" checked={capacityReady} onChange={() => setCapacityReady((value) => !value)} />
              <ToggleCard title="Trail mapping ready" checked={mappingReady} onChange={() => setMappingReady((value) => !value)} />
            </div>

            <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
              {issues.length ? (
                issues.map((issue) => (
                  <div
                    key={issue}
                    style={{
                      borderRadius: 14,
                      background: 'rgba(243,174,38,0.18)',
                      border: '1px solid rgba(243,174,38,0.30)',
                      padding: 10,
                      color: OSP.navy,
                      fontSize: 12,
                      fontWeight: 820,
                      lineHeight: 1.45,
                    }}
                  >
                    {issue}
                  </div>
                ))
              ) : (
                <div
                  style={{
                    borderRadius: 14,
                    background: 'rgba(5,150,165,0.12)',
                    border: '1px solid rgba(5,150,165,0.22)',
                    padding: 12,
                    color: OSP.navy,
                    fontSize: 12,
                    fontWeight: 850,
                  }}
                >
                  Traveler price display is ready for frontend review.
                </div>
              )}
            </div>
          </Card>

          <Card tone="mist">
            <button
              type="button"
              onClick={() => setShowContract((value) => !value)}
              style={{
                width: '100%',
                minHeight: 46,
                borderRadius: 16,
                border: `1px solid ${OSP.line}`,
                background: OSP.white,
                color: OSP.navy,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 950,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 14px',
              }}
            >
              <span>Traveler Pricing UI Contract Preview</span>
              <span>{showContract ? 'Hide Preview' : 'Show Preview'}</span>
            </button>

            {showContract ? (
              <pre
                style={{
                  margin: '12px 0 0',
                  maxHeight: 300,
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  borderRadius: 18,
                  background: '#012B4A',
                  color: '#EAFBFA',
                  padding: 14,
                  fontSize: 11.5,
                  lineHeight: 1.55,
                }}
              >
                {JSON.stringify(frontendContract, null, 2)}
              </pre>
            ) : (
              <p style={{ margin: '10px 0 0', color: OSP.slate, fontSize: 12.5, lineHeight: 1.45 }}>
                Preview the future Traveler UI pricing contract shape. Backend commercial logic is intentionally excluded from this surface.
              </p>
            )}
          </Card>
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          <TravelerPreview
            productTitle={selected.title}
            displayPrice={displayPrice}
            shortPrice={shortPrice}
            bookingMode={bookingMode}
            priceNote={priceNote}
            trustNote={trustNote}
            surface={surface}
          />

          <Card tone="gold">
            <p
              style={{
                margin: '0 0 6px',
                color: '#7A5200',
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Boundary Lock
            </p>
            <h3 style={{ margin: 0, color: OSP.navy, fontSize: 20, lineHeight: 1.05 }}>
              This is not commission configuration
            </h3>
            <p style={{ margin: '8px 0 0', color: OSP.slate, fontSize: 12.5, lineHeight: 1.5 }}>
              This SPM tab controls the price shown in the Traveler UI. Commission rules, commercial calculations,
              refunds, and payment processing remain backend-governed.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}

function CommandBox({ label, value }: { label: string; value: string }) {
  return (
    <article
      style={{
        borderRadius: 18,
        background: 'rgba(255,255,255,0.96)',
        border: '1px solid rgba(255,255,255,0.28)',
        padding: 12,
        boxShadow: '0 12px 26px rgba(1,56,99,0.10)',
      }}
    >
      <div style={{ color: OSP.softSlate, fontSize: 10.5, fontWeight: 900 }}>{label}</div>
      <strong style={{ display: 'block', marginTop: 4, color: OSP.navy, fontSize: 15, lineHeight: 1.12 }}>
        {value}
      </strong>
    </article>
  );
}

function ToggleCard({
  title,
  checked,
  onChange,
}: {
  title: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        minHeight: 68,
        borderRadius: 16,
        border: `1px solid ${checked ? 'rgba(5,150,165,0.28)' : OSP.line}`,
        background: checked ? 'rgba(5,150,165,0.10)' : OSP.white,
        color: OSP.navy,
        cursor: 'pointer',
        textAlign: 'left',
        padding: 11,
      }}
    >
      <Pill tone={checked ? 'green' : 'muted'}>{checked ? 'Ready' : 'Missing'}</Pill>
      <strong style={{ display: 'block', marginTop: 8, fontSize: 12.5 }}>{title}</strong>
    </button>
  );
}
