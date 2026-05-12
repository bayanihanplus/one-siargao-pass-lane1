import SiteVisitDetailPage from "../_components/SiteVisitDetailPage";

export const dynamic = "force-dynamic";

export default function MalinaoSkateParkPage() {
  return (
    <SiteVisitDetailPage
      code="MALINAO_SKATE_PARK_LGU_SITE_VISIT"
      fallbackTitle="Malinao Skate Park"
      mode="LOCAL_COMMUNITY_STOP"
      bannerSrc="/osp/malinao-skate-road-banner.png"
      bannerAlt="Malinao Skate Road sunset skate gathering"
    />
  );
}
