"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import OspPublicHeader from "../components/OspPublicHeader";
import OspPublicFooter from "../components/OspPublicFooter";

type PassForm = {
  fullName: string;
  email: string;
  mobileNumber: string;
  countryOrNationality: string;
  arrivalDate: string;
  departureDate: string;
  mainArea: string;
  travelPurpose: string;
  referralSource: string;
  referralDetails: string;
};

type PassErrors = Partial<Record<keyof PassForm, string>>;

const initialForm: PassForm = {
  fullName: "",
  email: "",
  mobileNumber: "",
  countryOrNationality: "",
  arrivalDate: "",
  departureDate: "",
  mainArea: "GENERAL_LUNA",
  travelPurpose: "VACATION",
  referralSource: "NO_REFERRAL",
  referralDetails: "",
};

const areaOptions = [
  { value: "GENERAL_LUNA", label: "General Luna" },
  { value: "CLOUD_9_CATANGNAN", label: "Cloud 9 / Catangnan" },
  { value: "MALINAO", label: "Malinao" },
  { value: "DAPA", label: "Dapa" },
  { value: "PACIFICO", label: "Pacifico" },
  { value: "BURGOS", label: "Burgos" },
  { value: "DEL_CARMEN", label: "Del Carmen" },
  { value: "SOCORRO_BUCAS_GRANDE", label: "Socorro / Bucas Grande" },
  { value: "NOT_SURE_YET", label: "Not sure yet" },
];

const purposeOptions = [
  { value: "VACATION", label: "Vacation" },
  { value: "PASSPORT_TRAILS", label: "Passport Trails" },
  { value: "ISLAND_HOPPING", label: "Island hopping" },
  { value: "SURFING", label: "Surfing" },
  { value: "WORK_DIGITAL_NOMAD", label: "Work / digital nomad" },
  { value: "FAMILY_GROUP_TRIP", label: "Family / group trip" },
  { value: "EVENT_SPECIAL_OCCASION", label: "Event / special occasion" },
  { value: "OTHER", label: "Other" },
];

const referralOptions = [
  { value: "NO_REFERRAL", label: "No referral" },
  { value: "HOTEL_RESORT", label: "Hotel / resort" },
  { value: "TRAVEL_AGENCY", label: "Travel agency" },
  { value: "TOUR_DESK", label: "Tour desk" },
  { value: "OTA_BOOKING_PARTNER", label: "OTA / booking partner" },
  { value: "LOCAL_OPERATOR", label: "Local operator" },
  { value: "FRIEND_FAMILY", label: "Friend / family" },
  { value: "OTHER", label: "Other" },
];

const passBenefits = [
  {
    title: "QR identity",
    body: "Start your OSP-linked traveler identity for connected Siargao flows.",
  },
  {
    title: "Site access readiness",
    body: "Prepare for selected QR-supported access points where available.",
  },
  {
    title: "Passport Trails",
    body: "Connect your pass to official trails, stamps, and saved progress.",
  },
  {
    title: "Local bookings",
    body: "Keep tours, stays, vouchers, and service readiness connected where available.",
  },
];

const nextSteps = [
  "Submit traveler and trip details",
  "Receive your next-step confirmation",
  "Continue into OSP Pass readiness",
];

function validateForm(form: PassForm): PassErrors {
  const errors: PassErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form.fullName.trim()) errors.fullName = "Enter your full name.";
  if (!form.email.trim() || !emailPattern.test(form.email.trim())) errors.email = "Enter a valid email address.";
  if (!form.mobileNumber.trim()) errors.mobileNumber = "Enter your mobile or WhatsApp number.";
  if (!form.arrivalDate) errors.arrivalDate = "Select your arrival date.";
  if (!form.departureDate) errors.departureDate = "Select your departure date.";

  if (form.arrivalDate && form.departureDate && form.departureDate < form.arrivalDate) {
    errors.departureDate = "Departure date must be after arrival date.";
  }

  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="osp-pass-action-error">{message}</p>;
}

export default function OspPassPage() {
  const [form, setForm] = useState<PassForm>(initialForm);
  const [errors, setErrors] = useState<PassErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const referralNeedsDetails = useMemo(
    () => !["NO_REFERRAL", "FRIEND_FAMILY"].includes(form.referralSource),
    [form.referralSource],
  );

  function updateField(field: keyof PassForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 450);
  }

  return (
    <main className="osp-pass-action-page">
      <OspPublicHeader />

      <section className="osp-pass-action-hero">
        <div className="osp-pass-action-shell osp-pass-action-grid">
          <div className="osp-pass-action-copy">
            <p className="osp-pass-action-eyebrow">OSP Pass Request</p>
            <h1>Get your OSP Pass for Siargao.</h1>
            <p className="osp-pass-action-lead">
              Start your QR identity and traveler readiness for site access, Passport Trails, local bookings, selected island routes, and saved journey progress.
            </p>

            <div className="osp-pass-action-chips" aria-label="OSP Pass readiness features">
              <span>QR identity</span>
              <span>Site access readiness</span>
              <span>Passport Trails</span>
              <span>Local bookings</span>
              <span>Email confirmation</span>
            </div>

            <div className="osp-pass-action-promise">
              <strong>Submit your details.</strong>
              <span>Receive your next step and continue your OSP Pass readiness.</span>
            </div>
          </div>

          <div className="osp-pass-action-form-card">
            {submitted ? (
              <div className="osp-pass-action-success" role="status">
                <div className="osp-pass-action-success-mark">✓</div>
                <p className="osp-pass-action-form-eyebrow">Request ready</p>
                <h2>Your OSP Pass request is ready to continue.</h2>
                <p>
                  Your traveler details are prepared for the next readiness step. Backend email confirmation will be connected in the next system lane.
                </p>

                <div className="osp-pass-action-summary">
                  <div>
                    <span>Traveler</span>
                    <strong>{form.fullName}</strong>
                  </div>
                  <div>
                    <span>Trip dates</span>
                    <strong>{form.arrivalDate} → {form.departureDate}</strong>
                  </div>
                  <div>
                    <span>Email</span>
                    <strong>{form.email}</strong>
                  </div>
                  <div>
                    <span>Status</span>
                    <strong>Ready for next step</strong>
                  </div>
                </div>

                <div className="osp-pass-action-submit-row">
                  <Link className="osp-pass-action-button osp-pass-action-button-primary" href="/traveler/start">
                    Continue Pass Setup
                  </Link>
                  <Link className="osp-pass-action-button osp-pass-action-button-secondary" href="/passport-trails">
                    Explore Passport Trails
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <p className="osp-pass-action-form-eyebrow">Traveler intake</p>
                <h2>Start your OSP Pass request</h2>
                <p className="osp-pass-action-form-note">
                  Tell us who is traveling and when you plan to visit Siargao.
                </p>

                <div className="osp-pass-action-form-grid">
                  <label className="osp-pass-action-field osp-pass-action-field-wide">
                    <span>Full name *</span>
                    <input
                      value={form.fullName}
                      onChange={(event) => updateField("fullName", event.target.value)}
                      placeholder="Juan Dela Cruz"
                      autoComplete="name"
                    />
                    <FieldError message={errors.fullName} />
                  </label>

                  <label className="osp-pass-action-field">
                    <span>Email address *</span>
                    <input
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="you@email.com"
                      type="email"
                      autoComplete="email"
                    />
                    <FieldError message={errors.email} />
                  </label>

                  <label className="osp-pass-action-field">
                    <span>Mobile / WhatsApp *</span>
                    <input
                      value={form.mobileNumber}
                      onChange={(event) => updateField("mobileNumber", event.target.value)}
                      placeholder="+63 900 000 0000"
                      autoComplete="tel"
                    />
                    <FieldError message={errors.mobileNumber} />
                  </label>

                  <label className="osp-pass-action-field">
                    <span>Country / nationality</span>
                    <input
                      value={form.countryOrNationality}
                      onChange={(event) => updateField("countryOrNationality", event.target.value)}
                      placeholder="Philippines"
                      autoComplete="country-name"
                    />
                  </label>

                  <label className="osp-pass-action-field">
                    <span>Main Siargao area</span>
                    <select value={form.mainArea} onChange={(event) => updateField("mainArea", event.target.value)}>
                      {areaOptions.map((option) => (
                        <option value={option.value} key={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </label>

                  <label className="osp-pass-action-field">
                    <span>Arrival date *</span>
                    <input
                      value={form.arrivalDate}
                      onChange={(event) => updateField("arrivalDate", event.target.value)}
                      type="date"
                    />
                    <FieldError message={errors.arrivalDate} />
                  </label>

                  <label className="osp-pass-action-field">
                    <span>Departure date *</span>
                    <input
                      value={form.departureDate}
                      onChange={(event) => updateField("departureDate", event.target.value)}
                      type="date"
                    />
                    <FieldError message={errors.departureDate} />
                  </label>

                  <label className="osp-pass-action-field">
                    <span>Travel purpose</span>
                    <select value={form.travelPurpose} onChange={(event) => updateField("travelPurpose", event.target.value)}>
                      {purposeOptions.map((option) => (
                        <option value={option.value} key={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </label>

                  <label className="osp-pass-action-field">
                    <span>Were you referred?</span>
                    <select value={form.referralSource} onChange={(event) => updateField("referralSource", event.target.value)}>
                      {referralOptions.map((option) => (
                        <option value={option.value} key={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </label>

                  {referralNeedsDetails ? (
                    <label className="osp-pass-action-field osp-pass-action-field-wide">
                      <span>Partner / hotel / agency name</span>
                      <input
                        value={form.referralDetails}
                        onChange={(event) => updateField("referralDetails", event.target.value)}
                        placeholder="Name of hotel, agency, tour desk, or partner"
                      />
                    </label>
                  ) : null}
                </div>

                <button className="osp-pass-action-submit" type="submit" disabled={loading}>
                  {loading ? "Preparing request..." : "Start My OSP Pass"}
                </button>

                <p className="osp-pass-action-disclaimer">
                  This starts your pass readiness request. OSP QR/pass issuance is completed only through the official OSP readiness flow.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="osp-pass-action-section">
        <div className="osp-pass-action-shell">
          <div className="osp-pass-action-section-head">
            <p className="osp-pass-action-eyebrow">Connected journey</p>
            <h2>What your OSP Pass helps connect.</h2>
          </div>

          <div className="osp-pass-action-benefits">
            {passBenefits.map((item) => (
              <article className="osp-pass-action-benefit" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="osp-pass-action-next">
        <div className="osp-pass-action-shell osp-pass-action-next-card">
          <div>
            <p className="osp-pass-action-eyebrow">What happens next</p>
            <h2>Simple steps. Clear result.</h2>
          </div>
          <div className="osp-pass-action-steps">
            {nextSteps.map((step, index) => (
              <div className="osp-pass-action-step" key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="osp-pass-action-returning">
        <div className="osp-pass-action-shell osp-pass-action-returning-card">
          <div>
            <p className="osp-pass-action-eyebrow">Returning traveler</p>
            <h2>Already have an OSP Pass?</h2>
            <p>Sign in to view your QR, trips, bookings, receipts, and saved trails.</p>
          </div>
          <Link className="osp-pass-action-button osp-pass-action-button-primary" href="/login?mode=returning">
            Continue With My Pass
          </Link>
        </div>
      </section>

      <OspPublicFooter />
    </main>
  );
}
