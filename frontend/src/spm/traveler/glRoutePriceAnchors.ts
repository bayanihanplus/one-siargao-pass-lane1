export type GlRoutePaymentSlug =
  | "tri-island-joiner"
  | "mam-on-island-route"
  | "corregidor-island-route";

export type GlRouteCode =
  | "gl-tri-island-standard"
  | "gl-guyam-daku-mam-on"
  | "gl-tri-island-corregidor";

export type GlRoutePriceAnchor = {
  routeCode: GlRouteCode;
  slug: GlRoutePaymentSlug;
  intentId: string;
  title: string;
  tripNo: string;
  packageLabel: string;
  route: string;
  port: string;
  amountLabel: string;
  matrixStartAmount: number;
  matrixLine: string;
  amountSubcopy: string;
  feeLine: string;
  image: string;
};

export const GL_ROUTE_PRICE_ANCHORS: Record<GlRoutePaymentSlug, GlRoutePriceAnchor> = {
  "tri-island-joiner": {
    routeCode: "gl-tri-island-standard",
    slug: "tri-island-joiner",
    intentId: "tour_sandbox_tri-island-joiner_3000",
    title: "Classic Tri-Island Joiner",
    tripNo: "GL-ISL-01",
    packageLabel: "Package 1",
    route: "Guyam · Daku · Naked Island",
    port: "General Luna Port",
    amountLabel: "PHP 1,500 / person",
    matrixStartAmount: 3000,
    matrixLine: "Package 1 starts at PHP 3,000 for Class A, 1–5 pax.",
    amountSubcopy:
      "Final total updates after pax, route fees, OSP service fee, QR/voucher processing, and payment processing are confirmed.",
    feeLine:
      "Final checkout must show the Package 1 matrix, island fees, port charge, OSP service fee, QR/voucher processing, and payment processing before payment.",
    image: "/osp/temp-tour-posters/tri-island-joiner.png",
  },
  "mam-on-island-route": {
    routeCode: "gl-guyam-daku-mam-on",
    slug: "mam-on-island-route",
    intentId: "tour_sandbox_mam-on-island-route_6000",
    title: "Mam-On Island Route",
    tripNo: "GL-ISL-02",
    packageLabel: "Package 2",
    route: "Guyam · Daku · Naked · Mam-On",
    port: "General Luna Port",
    amountLabel: "From PHP 6,000",
    matrixStartAmount: 6000,
    matrixLine: "Package 2 starts at PHP 6,000 for Class B, 7–9 pax. Class A is unavailable.",
    amountSubcopy:
      "Class A is unavailable. Final total updates after pax, route fees, OSP service fee, QR/voucher processing, and payment processing are confirmed.",
    feeLine:
      "Final checkout must show the Package 2 matrix, island fees, port charge, OSP service fee, QR/voucher processing, and payment processing before payment.",
    image: "/osp/temp-tour-posters/tri-island-joiner.png",
  },
  "corregidor-island-route": {
    routeCode: "gl-tri-island-corregidor",
    slug: "corregidor-island-route",
    intentId: "tour_sandbox_corregidor-island-route_5000",
    title: "Corregidor Island Route",
    tripNo: "GL-ISL-03",
    packageLabel: "Package 3",
    route: "Guyam · Daku · Naked · Corregidor",
    port: "General Luna Port",
    amountLabel: "From PHP 5,000",
    matrixStartAmount: 5000,
    matrixLine: "Package 3 starts at PHP 5,000 for Class A, 1–5 pax.",
    amountSubcopy:
      "Final total updates after pax, route fees, OSP service fee, QR/voucher processing, and payment processing are confirmed.",
    feeLine:
      "Final checkout must show the Package 3 matrix, island fees, port charge, OSP service fee, QR/voucher processing, and payment processing before payment.",
    image: "/osp/temp-tour-posters/tri-island-joiner.png",
  },
};

export const GL_ROUTE_CODE_TO_PAYMENT_SLUG: Record<GlRouteCode, GlRoutePaymentSlug> = {
  "gl-tri-island-standard": "tri-island-joiner",
  "gl-guyam-daku-mam-on": "mam-on-island-route",
  "gl-tri-island-corregidor": "corregidor-island-route",
};

export const SUPPORTED_GL_PAYMENT_SLUGS = Object.keys(
  GL_ROUTE_PRICE_ANCHORS
) as GlRoutePaymentSlug[];

export function getGlRoutePriceAnchor(slug?: string | null) {
  if (!slug) return null;
  return GL_ROUTE_PRICE_ANCHORS[slug as GlRoutePaymentSlug] || null;
}

export function getGlRoutePriceAnchorByRouteCode(routeCode?: string | null) {
  if (!routeCode) return null;
  const slug = GL_ROUTE_CODE_TO_PAYMENT_SLUG[routeCode as GlRouteCode];
  return slug ? GL_ROUTE_PRICE_ANCHORS[slug] : null;
}
