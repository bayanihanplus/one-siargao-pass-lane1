export type OspTrustEmailTemplateKey =
  | 'TRAVELER_QR_CREATED'
  | 'OPERATOR_ACCOUNT_READY'
  | 'ADMIN_ACCOUNT_READY'
  | 'AUTHORIZED_ACCESS_READY';

export type OspTrustEmailRoleFamily =
  | 'TRAVELER'
  | 'OPERATOR'
  | 'ADMIN'
  | 'AUTHORIZED_ACCESS';

export type OspTrustEmailTemplate = {
  key: OspTrustEmailTemplateKey;
  roleFamily: OspTrustEmailRoleFamily;
  subject: string;
  ctaLabel: string;
  ctaPath: string;
  eyebrow: string;
  bodyIntro: string;
  bodySupport: string;
};

export const OSP_TRUST_EMAIL_TEMPLATES: Record<OspTrustEmailTemplateKey, OspTrustEmailTemplate> = {
  TRAVELER_QR_CREATED: {
    key: 'TRAVELER_QR_CREATED',
    roleFamily: 'TRAVELER',
    subject: 'Welcome to One Siargao Pass',
    ctaLabel: 'Open My OSP App',
    ctaPath: '/traveler/home',
    eyebrow: 'Your OSP Pass is ready',
    bodyIntro: 'Your traveler account has been created, and your OSP Pass is now on record.',
    bodySupport:
      'Use your OSP Pass to access your traveler QR, trips, receipts, official Passport Trails, site access details, and saved Siargao journey progress.',
  },
  OPERATOR_ACCOUNT_READY: {
    key: 'OPERATOR_ACCOUNT_READY',
    roleFamily: 'OPERATOR',
    subject: 'Your One Siargao Pass partner access is ready',
    ctaLabel: 'Open Partner Dashboard',
    ctaPath: '/operator/commercial',
    eyebrow: 'Partner access ready',
    bodyIntro: 'Your approved local partner access is ready inside One Siargao Pass.',
    bodySupport:
      'Use your dashboard to manage eligible services, bookings, validation, and traveler support through one trusted pass.',
  },
  ADMIN_ACCOUNT_READY: {
    key: 'ADMIN_ACCOUNT_READY',
    roleFamily: 'ADMIN',
    subject: 'Your One Siargao Pass admin access is ready',
    ctaLabel: 'Open Admin Console',
    ctaPath: '/admin/control-tower/command-center',
    eyebrow: 'Admin access ready',
    bodyIntro: 'Your authorized One Siargao Pass admin access is ready.',
    bodySupport: 'Use your assigned console to continue platform operations and approved administrative workflows.',
  },
  AUTHORIZED_ACCESS_READY: {
    key: 'AUTHORIZED_ACCESS_READY',
    roleFamily: 'AUTHORIZED_ACCESS',
    subject: 'Your One Siargao Pass access is ready',
    ctaLabel: 'Open Authorized Access',
    ctaPath: '/lgu',
    eyebrow: 'Authorized access ready',
    bodyIntro: 'Your approved One Siargao Pass access is ready.',
    bodySupport:
      'Use your assigned access for approved operations, partner, and governance workflows.',
  },
};

export function buildOspTrustEmailUrl(appBaseUrl: string, ctaPath: string) {
  const base = appBaseUrl.replace(/\/+$/, '');
  const path = ctaPath.startsWith('/') ? ctaPath : `/${ctaPath}`;
  return `${base}${path}`;
}
