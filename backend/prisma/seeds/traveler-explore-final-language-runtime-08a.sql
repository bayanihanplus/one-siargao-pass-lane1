-- OSP-TRAVELER-LANGUAGE-RUNTIME-EXPLORE-FINAL-08A
-- Safe shell labels only. No protected operational-policy text.

WITH key_data(key, default_text, description) AS (
  VALUES
    ('explore.header.title','Explore Siargao','Explore header title'),
    ('explore.header.body','Find trusted routes, stays, and local services.','Explore header support line'),
    ('explore.search.placeholder','Search Siargao…','Explore search placeholder'),
    ('explore.search.aria','Search Explore Siargao','Explore search accessibility label'),
    ('explore.filters.aria','Explore filters','Explore filter rail accessibility label'),
    ('explore.filters.all','All','Explore filter'),
    ('explore.filters.stays','Stays','Explore filter'),
    ('explore.filters.tours','Tours','Explore filter'),
    ('explore.filters.rentals','Rentals','Explore filter'),
    ('explore.filters.surf','Surf','Explore filter'),
    ('explore.filters.food','Food','Explore filter'),
    ('explore.filters.health','Health','Explore filter'),
    ('explore.hero.badge','Verified by OSP','Explore hero badge'),
    ('explore.hero.title','Discover Siargao your way','Explore hero title'),
    ('explore.primary.passportTrails','Passport Trails','Explore primary action'),
    ('explore.primary.routes','Routes','Explore primary action note'),
    ('explore.primary.verifiedTours','Verified Tours','Explore primary action'),
    ('explore.primary.bookable','Bookable','Explore primary action note'),
    ('explore.primary.stays','Stays','Explore primary action'),
    ('explore.primary.places','Places','Explore primary action note'),
    ('explore.lanes.title','Explore by lane','Explore lane section title'),
    ('explore.lanes.tours','Tours','Explore lane shortcut'),
    ('explore.lanes.rentals','Rentals','Explore lane shortcut'),
    ('explore.lanes.surf','Surf','Explore lane shortcut'),
    ('explore.lanes.food','Food','Explore lane shortcut'),
    ('explore.lanes.care','Care','Explore lane shortcut'),
    ('explore.lanes.stays','Stays','Explore lane shortcut'),
    ('explore.featured.title','Featured verified services','Explore featured section title'),
    ('explore.actions.seeAll','All','Explore action label'),
    ('explore.actions.allTours','Tours','Explore action label'),
    ('explore.cards.cta','View','Explore featured card CTA'),
    ('explore.moreWays.title','More ways to explore','Explore secondary shortcuts title'),
    ('explore.moreWays.siteAccess','Site Access','Explore Site Access shortcut'),
    ('explore.trust.approvedOnly','Only approved traveler-ready services are shown.','Explore trust note')
)
INSERT INTO "LanguageTranslationKey" ("id","key","scope","defaultText","description","isActive","createdAt","updatedAt")
SELECT
  'ltk_08a_' || replace(replace(key_data.key, '.', '_'), '-', '_'),
  key_data.key,
  'traveler',
  key_data.default_text,
  key_data.description,
  true,
  now(),
  now()
FROM key_data
ON CONFLICT ("key")
DO UPDATE SET
  "defaultText" = EXCLUDED."defaultText",
  "description" = EXCLUDED."description",
  "isActive" = true,
  "updatedAt" = now();

WITH value_data(key, value) AS (
  VALUES
    ('explore.header.title','シアルガオを探す'),
    ('explore.header.body','信頼できるルート、宿泊、ローカルサービスを探せます。'),
    ('explore.search.placeholder','シアルガオを検索…'),
    ('explore.search.aria','Explore Siargaoを検索'),
    ('explore.filters.aria','Exploreフィルター'),
    ('explore.filters.all','すべて'),
    ('explore.filters.stays','宿泊'),
    ('explore.filters.tours','ツアー'),
    ('explore.filters.rentals','レンタル'),
    ('explore.filters.surf','サーフ'),
    ('explore.filters.food','食'),
    ('explore.filters.health','ケア'),
    ('explore.hero.badge','OSP確認済み'),
    ('explore.hero.title','自分らしくシアルガオを探す'),
    ('explore.primary.passportTrails','Passport Trails'),
    ('explore.primary.routes','ルート'),
    ('explore.primary.verifiedTours','確認済みツアー'),
    ('explore.primary.bookable','予約可能'),
    ('explore.primary.stays','宿泊'),
    ('explore.primary.places','滞在先'),
    ('explore.lanes.title','カテゴリーで探す'),
    ('explore.lanes.tours','ツアー'),
    ('explore.lanes.rentals','レンタル'),
    ('explore.lanes.surf','サーフ'),
    ('explore.lanes.food','食'),
    ('explore.lanes.care','ケア'),
    ('explore.lanes.stays','宿泊'),
    ('explore.featured.title','おすすめ確認済みサービス'),
    ('explore.actions.seeAll','すべて'),
    ('explore.actions.allTours','ツアー'),
    ('explore.cards.cta','見る'),
    ('explore.moreWays.title','ほかの探し方'),
    ('explore.moreWays.siteAccess','サイトアクセス'),
    ('explore.trust.approvedOnly','承認済みの旅行者向けサービスのみ表示されます。')
)
INSERT INTO "LanguageTranslationValue" ("id","languagePackId","translationKeyId","value","status","createdAt","updatedAt")
SELECT
  'ltv_08a_ja_' || replace(replace(value_data.key, '.', '_'), '-', '_'),
  lp.id,
  tk.id,
  value_data.value,
  'PUBLISHED',
  now(),
  now()
FROM value_data
JOIN "LanguageTranslationKey" tk
  ON tk.key = value_data.key
 AND tk.scope = 'traveler'
JOIN "LanguagePack" lp
  ON lp."languageCode" = 'ja'
ON CONFLICT ("languagePackId","translationKeyId")
DO UPDATE SET
  "value" = EXCLUDED."value",
  "status" = 'PUBLISHED',
  "updatedAt" = now();
