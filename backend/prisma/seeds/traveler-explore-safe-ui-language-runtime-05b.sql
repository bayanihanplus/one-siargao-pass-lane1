-- OSP-TRAVELER-LANGUAGE-RUNTIME-05B
-- Safe Explore shell labels only. No product/service/payment/operation copy.

INSERT INTO "LanguageTranslationKey" ("id","key","scope","defaultText","description","isActive","createdAt","updatedAt")
VALUES
('ltk_05b_explore_header_title','explore.header.title','traveler','Explore Siargao','Explore page title',true,now(),now()),
('ltk_05b_explore_header_eyebrow','explore.header.eyebrow','traveler','Verified island discovery','Explore header eyebrow',true,now(),now()),
('ltk_05b_explore_header_body','explore.header.body','traveler','Browse stays, tours, rentals, surf schools, food, culture, and trusted local services connected to your One Siargao Pass.','Explore header body',true,now(),now()),
('ltk_05b_explore_search_placeholder','explore.search.placeholder','traveler','Search stays, tours, rentals, surf, food…','Explore search placeholder',true,now(),now()),
('ltk_05b_explore_search_aria','explore.search.aria','traveler','Search Explore Siargao','Explore search aria label',true,now(),now()),
('ltk_05b_explore_filters_aria','explore.filters.aria','traveler','Explore filters','Explore filters aria label',true,now(),now()),
('ltk_05b_explore_filters_all','explore.filters.all','traveler','All','Explore filter label',true,now(),now()),
('ltk_05b_explore_filters_stays','explore.filters.stays','traveler','Stays','Explore filter label',true,now(),now()),
('ltk_05b_explore_filters_tours','explore.filters.tours','traveler','Tours','Explore filter label',true,now(),now()),
('ltk_05b_explore_filters_rentals','explore.filters.rentals','traveler','Rentals','Explore filter label',true,now(),now()),
('ltk_05b_explore_filters_surf','explore.filters.surf','traveler','Surf','Explore filter label',true,now(),now()),
('ltk_05b_explore_filters_food','explore.filters.food','traveler','Food','Explore filter label',true,now(),now()),
('ltk_05b_explore_filters_health','explore.filters.health','traveler','Health','Explore filter label',true,now(),now()),
('ltk_05b_explore_hero_title','explore.hero.title','traveler','Discover Siargao your way','Explore hero title',true,now(),now()),
('ltk_05b_explore_hero_body','explore.hero.body','traveler','Find verified local experiences, partner tours, and Passport Trails connected to your One Siargao Pass.','Explore hero body',true,now(),now()),
('ltk_05b_explore_hero_cta_passport','explore.hero.ctaPassportTrails','traveler','Explore Passport Trails','Explore hero CTA',true,now(),now()),
('ltk_05b_explore_lanes_title','explore.lanes.title','traveler','Explore by lane','Explore lane section title',true,now(),now()),
('ltk_05b_explore_actions_see_all','explore.actions.seeAll','traveler','See all','Explore safe action label',true,now(),now()),
('ltk_05b_explore_actions_all_tours','explore.actions.allTours','traveler','All tours','Explore safe action label',true,now(),now()),
('ltk_05b_explore_featured_title','explore.featured.title','traveler','Featured verified services','Explore featured section title',true,now(),now()),
('ltk_05b_explore_featured_body','explore.featured.body','traveler','Choose your Siargao trip type. Open the route group, compare options, and continue only when the route and fee path feel clear.','Explore featured section body',true,now(),now()),
('ltk_05b_explore_moreways_title','explore.moreWays.title','traveler','More ways to explore','Explore more ways title',true,now(),now()),
('ltk_05b_explore_moreways_body','explore.moreWays.body','traveler','Discovery lanes shown separately from verified marketplace services.','Explore more ways body',true,now(),now()),
('ltk_05b_explore_cards_cta','explore.cards.cta','traveler','View details','Explore card CTA fallback',true,now(),now()),
('ltk_05b_explore_cards_explore','explore.cards.explore','traveler','Explore','Explore card CTA',true,now(),now())
ON CONFLICT ("key")
DO UPDATE SET
  "defaultText" = EXCLUDED."defaultText",
  "description" = EXCLUDED."description",
  "isActive" = true,
  "updatedAt" = now();

INSERT INTO "LanguageTranslationValue" ("id","languagePackId","translationKeyId","value","status","createdAt","updatedAt")
VALUES
('ltv_05b_ja_header_title','lang_ja','ltk_05b_explore_header_title','シアルガオを探す','PUBLISHED',now(),now()),
('ltv_05b_ja_header_eyebrow','lang_ja','ltk_05b_explore_header_eyebrow','確認済みの島内ディスカバリー','PUBLISHED',now(),now()),
('ltv_05b_ja_header_body','lang_ja','ltk_05b_explore_header_body','宿泊、ツアー、レンタル、サーフスクール、食、文化、信頼できるローカルサービスをOne Siargao Passで探せます。','PUBLISHED',now(),now()),
('ltv_05b_ja_search_placeholder','lang_ja','ltk_05b_explore_search_placeholder','宿泊、ツアー、レンタル、サーフ、食を検索…','PUBLISHED',now(),now()),
('ltv_05b_ja_search_aria','lang_ja','ltk_05b_explore_search_aria','Explore Siargaoを検索','PUBLISHED',now(),now()),
('ltv_05b_ja_filters_aria','lang_ja','ltk_05b_explore_filters_aria','Exploreフィルター','PUBLISHED',now(),now()),
('ltv_05b_ja_filters_all','lang_ja','ltk_05b_explore_filters_all','すべて','PUBLISHED',now(),now()),
('ltv_05b_ja_filters_stays','lang_ja','ltk_05b_explore_filters_stays','宿泊','PUBLISHED',now(),now()),
('ltv_05b_ja_filters_tours','lang_ja','ltk_05b_explore_filters_tours','ツアー','PUBLISHED',now(),now()),
('ltv_05b_ja_filters_rentals','lang_ja','ltk_05b_explore_filters_rentals','レンタル','PUBLISHED',now(),now()),
('ltv_05b_ja_filters_surf','lang_ja','ltk_05b_explore_filters_surf','サーフ','PUBLISHED',now(),now()),
('ltv_05b_ja_filters_food','lang_ja','ltk_05b_explore_filters_food','食','PUBLISHED',now(),now()),
('ltv_05b_ja_filters_health','lang_ja','ltk_05b_explore_filters_health','ヘルス','PUBLISHED',now(),now()),
('ltv_05b_ja_hero_title','lang_ja','ltk_05b_explore_hero_title','自分らしくシアルガオを探す','PUBLISHED',now(),now()),
('ltv_05b_ja_hero_body','lang_ja','ltk_05b_explore_hero_body','確認済みのローカル体験、パートナーツアー、Passport TrailsをOne Siargao Passでつなげます。','PUBLISHED',now(),now()),
('ltv_05b_ja_hero_cta_passport','lang_ja','ltk_05b_explore_hero_cta_passport','Passport Trailsを見る','PUBLISHED',now(),now()),
('ltv_05b_ja_lanes_title','lang_ja','ltk_05b_explore_lanes_title','カテゴリーで探す','PUBLISHED',now(),now()),
('ltv_05b_ja_actions_see_all','lang_ja','ltk_05b_explore_actions_see_all','すべて見る','PUBLISHED',now(),now()),
('ltv_05b_ja_actions_all_tours','lang_ja','ltk_05b_explore_actions_all_tours','すべてのツアー','PUBLISHED',now(),now()),
('ltv_05b_ja_featured_title','lang_ja','ltk_05b_explore_featured_title','おすすめ確認済みサービス','PUBLISHED',now(),now()),
('ltv_05b_ja_featured_body','lang_ja','ltk_05b_explore_featured_body','旅行タイプを選び、ルートや料金の流れを確認してから進めます。','PUBLISHED',now(),now()),
('ltv_05b_ja_moreways_title','lang_ja','ltk_05b_explore_moreways_title','ほかの探し方','PUBLISHED',now(),now()),
('ltv_05b_ja_moreways_body','lang_ja','ltk_05b_explore_moreways_body','ディスカバリーレーンは確認済みマーケットプレイスサービスとは分けて表示されます。','PUBLISHED',now(),now()),
('ltv_05b_ja_cards_cta','lang_ja','ltk_05b_explore_cards_cta','詳細を見る','PUBLISHED',now(),now()),
('ltv_05b_ja_cards_explore','lang_ja','ltk_05b_explore_cards_explore','探す','PUBLISHED',now(),now())
ON CONFLICT ("languagePackId","translationKeyId")
DO UPDATE SET
  "value" = EXCLUDED."value",
  "status" = 'PUBLISHED',
  "updatedAt" = now();
