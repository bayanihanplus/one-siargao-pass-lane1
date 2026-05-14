-- OSP-TRAVELER-LANGUAGE-RUNTIME-04D2
-- Low-risk Passport Trails Hub safe UI labels only.

INSERT INTO "LanguageTranslationKey" ("id","key","scope","defaultText","description","isActive","createdAt","updatedAt")
VALUES
('ltk_04d2_passport_trails_hero_title','passportTrails.hero.title','traveler','Choose your trail.','Passport Trails hero title',true,now(),now()),
('ltk_04d2_passport_trails_hero_body','passportTrails.hero.body','traveler','Routes, stops, and progress in one view.','Passport Trails hero body',true,now(),now()),
('ltk_04d2_passport_trails_official_title','passportTrails.official.title','traveler','Choose your official trail.','Passport Trails official section title',true,now(),now()),
('ltk_04d2_passport_trails_official_body','passportTrails.official.body','traveler','Pick a route. Keep progress connected.','Passport Trails official section body',true,now(),now()),
('ltk_04d2_passport_trails_actions_build_route','passportTrails.actions.buildRoute','traveler','Build route','Passport Trails safe CTA',true,now(),now()),
('ltk_04d2_passport_trails_actions_map','passportTrails.actions.map','traveler','Map','Passport Trails safe CTA',true,now(),now()),
('ltk_04d2_passport_trails_actions_kuya_tala','passportTrails.actions.kuyaTala','traveler','Kuya Tala™','Passport Trails safe CTA',true,now(),now()),
('ltk_04d2_passport_trails_cards_view','passportTrails.cards.view','traveler','View','Passport Trails card CTA',true,now(),now()),
('ltk_04d2_passport_trails_count_trails_capital','passportTrails.count.trailsCapital','traveler','Trails','Passport Trails count label',true,now(),now()),
('ltk_04d2_passport_trails_status_bookable','passportTrails.status.bookable','traveler','Bookable','Passport Trails safe status label',true,now(),now()),
('ltk_04d2_passport_trails_status_request','passportTrails.status.request','traveler','Request','Passport Trails safe status label',true,now(),now()),
('ltk_04d2_passport_trails_status_saved','passportTrails.status.saved','traveler','Saved','Passport Trails safe status label',true,now(),now()),
('ltk_04d2_passport_trails_status_explore','passportTrails.status.explore','traveler','Explore','Passport Trails safe status label',true,now(),now())
ON CONFLICT ("key")
DO UPDATE SET
  "defaultText" = EXCLUDED."defaultText",
  "description" = EXCLUDED."description",
  "isActive" = true,
  "updatedAt" = now();

INSERT INTO "LanguageTranslationValue" ("id","languagePackId","translationKeyId","value","status","createdAt","updatedAt")
VALUES
('ltv_04d2_ja_hero_title','lang_ja','ltk_04d2_passport_trails_hero_title','トレイルを選ぶ','PUBLISHED',now(),now()),
('ltv_04d2_ja_hero_body','lang_ja','ltk_04d2_passport_trails_hero_body','ルート、立ち寄り先、進行状況をひとつに。','PUBLISHED',now(),now()),
('ltv_04d2_ja_official_title','lang_ja','ltk_04d2_passport_trails_official_title','公式トレイルを選ぶ','PUBLISHED',now(),now()),
('ltv_04d2_ja_official_body','lang_ja','ltk_04d2_passport_trails_official_body','ルートを選び、進行状況をつなげます。','PUBLISHED',now(),now()),
('ltv_04d2_ja_build_route','lang_ja','ltk_04d2_passport_trails_actions_build_route','ルート作成','PUBLISHED',now(),now()),
('ltv_04d2_ja_map','lang_ja','ltk_04d2_passport_trails_actions_map','マップ','PUBLISHED',now(),now()),
('ltv_04d2_ja_kuya_tala','lang_ja','ltk_04d2_passport_trails_actions_kuya_tala','Kuya Tala™','PUBLISHED',now(),now()),
('ltv_04d2_ja_cards_view','lang_ja','ltk_04d2_passport_trails_cards_view','見る','PUBLISHED',now(),now()),
('ltv_04d2_ja_count_trails_capital','lang_ja','ltk_04d2_passport_trails_count_trails_capital','トレイル','PUBLISHED',now(),now()),
('ltv_04d2_ja_status_bookable','lang_ja','ltk_04d2_passport_trails_status_bookable','予約可能','PUBLISHED',now(),now()),
('ltv_04d2_ja_status_request','lang_ja','ltk_04d2_passport_trails_status_request','リクエスト','PUBLISHED',now(),now()),
('ltv_04d2_ja_status_saved','lang_ja','ltk_04d2_passport_trails_status_saved','保存済み','PUBLISHED',now(),now()),
('ltv_04d2_ja_status_explore','lang_ja','ltk_04d2_passport_trails_status_explore','探す','PUBLISHED',now(),now())
ON CONFLICT ("languagePackId","translationKeyId")
DO UPDATE SET
  "value" = EXCLUDED."value",
  "status" = 'PUBLISHED',
  "updatedAt" = now();
