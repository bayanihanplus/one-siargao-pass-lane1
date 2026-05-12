import SiteVisitDetailPage from "../_components/SiteVisitDetailPage";

export const dynamic = "force-dynamic";

export default function AfamCatangnanBridgePage() {
  return (
    <SiteVisitDetailPage
      code="AFAM_CATANGNAN_BRIDGE_LGU_SITE_VISIT"
      fallbackTitle="AFAM / Catangnan Bridge"
      mode="SCENIC_VIEWPOINT_STOP"
      bannerSrc="/osp/afam-catangnan-bridge-banner.png"
      bannerAlt="AFAM / Catangnan Bridge golden-hour scenic view"
    />
  );
}
