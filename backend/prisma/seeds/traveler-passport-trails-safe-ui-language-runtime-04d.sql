-- OSP-TRAVELER-LANGUAGE-RUNTIME-04D
-- Low-risk Passport Trails Hub safe UI labels only.

INSERT INTO "LanguageTranslationKey" ("id","key","scope","defaultText","description","isActive","createdAt","updatedAt")
VALUES
('ltk_04d_passport_trails_header_title','passportTrails.header.title','traveler','Passport Trails','Passport Trails hub header title',true,now(),now()),
('ltk_04d_passport_trails_actions_open_map_aria','passportTrails.actions.openMapAria','traveler','Open Passport Map','Passport Trails safe aria label',true,now(),now()),
('ltk_04d_passport_trails_actions_view_trails_aria','passportTrails.actions.viewTrailsAria','traveler','View official Passport Trails','Passport Trails safe aria label',true,now(),now()),
('ltk_04d_passport_trails_actions_view_trails','passportTrails.actions.viewTrails','traveler','View trails','Passport Trails safe CTA label',true,now(),now()),
('ltk_04d_passport_trails_actions_build_custom_aria','passportTrails.actions.buildCustomAria','traveler','Build a custom Passport Trail','Passport Trails safe aria label',true,now(),now()),
('ltk_04d_passport_trails_actions_ask_kuya_aria','passportTrails.actions.askKuyaTalaAria','traveler','Ask Kuya Tala about Passport Trails','Passport Trails safe aria label',true,now(),now()),
('ltk_04d_passport_trails_actions_open_map','passportTrails.actions.openMap','traveler','Open Map','Passport Trails safe CTA label',true,now(),now()),
('ltk_04d_passport_trails_actions_ask_kuya','passportTrails.actions.askKuyaTala','traveler','Ask Kuya Tala™','Passport Trails safe CTA label',true,now(),now()),
('ltk_04d_passport_trails_filters_aria','passportTrails.filters.aria','traveler','Filter official Passport Trails','Passport Trails filter aria label',true,now(),now()),
('ltk_04d_passport_trails_filters_all','passportTrails.filters.all','traveler','All','Passport Trails filter label',true,now(),now()),
('ltk_04d_passport_trails_filters_explore','passportTrails.filters.explore','traveler','Explore','Passport Trails filter label',true,now(),now()),
('ltk_04d_passport_trails_filters_bookable','passportTrails.filters.bookable','traveler','Bookable','Passport Trails filter label',true,now(),now()),
('ltk_04d_passport_trails_filters_confirm','passportTrails.filters.confirm','traveler','Needs Confirm','Passport Trails filter label',true,now(),now()),
('ltk_04d_passport_trails_filters_saved','passportTrails.filters.saved','traveler','Saved','Passport Trails filter label',true,now(),now()),
('ltk_04d_passport_trails_sections_official','passportTrails.sections.officialEyebrow','traveler','Official SPM Passport Trails','Passport Trails section label',true,now(),now()),
('ltk_04d_passport_trails_sections_discover_saved','passportTrails.sections.discoverSaved','traveler','Discover + Saved','Passport Trails section label',true,now(),now()),
('ltk_04d_passport_trails_count_trails','passportTrails.count.trails','traveler','trails','Passport Trails count label',true,now(),now()),
('ltk_04d_passport_trails_labels_saved_friendly','passportTrails.labels.savedFriendly','traveler','Saved-friendly','Passport Trails safe label',true,now(),now()),
('ltk_04d_passport_trails_shortcuts_trips','passportTrails.shortcuts.trips','traveler','Trips','Passport Trails shortcut label',true,now(),now()),
('ltk_04d_passport_trails_shortcuts_saved_plans','passportTrails.shortcuts.savedPlans','traveler','Saved plans','Passport Trails shortcut label',true,now(),now())
ON CONFLICT ("key")
DO UPDATE SET
  "defaultText" = EXCLUDED."defaultText",
  "description" = EXCLUDED."description",
  "isActive" = true,
  "updatedAt" = now();

INSERT INTO "LanguageTranslationValue" ("id","languagePackId","translationKeyId","value","status","createdAt","updatedAt")
VALUES
('ltv_04d_ja_header_title','lang_ja','ltk_04d_passport_trails_header_title','パスポートトレイル','PUBLISHED',now(),now()),
('ltv_04d_ja_open_map_aria','lang_ja','ltk_04d_passport_trails_actions_open_map_aria','パスポートマップを開く','PUBLISHED',now(),now()),
('ltv_04d_ja_view_trails_aria','lang_ja','ltk_04d_passport_trails_actions_view_trails_aria','公式パスポートトレイルを見る','PUBLISHED',now(),now()),
('ltv_04d_ja_view_trails','lang_ja','ltk_04d_passport_trails_actions_view_trails','トレイルを見る','PUBLISHED',now(),now()),
('ltv_04d_ja_build_custom_aria','lang_ja','ltk_04d_passport_trails_actions_build_custom_aria','カスタムパスポートトレイルを作成','PUBLISHED',now(),now()),
('ltv_04d_ja_ask_kuya_aria','lang_ja','ltk_04d_passport_trails_actions_ask_kuya_aria','パスポートトレイルについてKuya Talaに質問','PUBLISHED',now(),now()),
('ltv_04d_ja_open_map','lang_ja','ltk_04d_passport_trails_actions_open_map','マップを開く','PUBLISHED',now(),now()),
('ltv_04d_ja_ask_kuya','lang_ja','ltk_04d_passport_trails_actions_ask_kuya','Kuya Tala™に質問','PUBLISHED',now(),now()),
('ltv_04d_ja_filters_aria','lang_ja','ltk_04d_passport_trails_filters_aria','公式パスポートトレイルを絞り込む','PUBLISHED',now(),now()),
('ltv_04d_ja_filters_all','lang_ja','ltk_04d_passport_trails_filters_all','すべて','PUBLISHED',now(),now()),
('ltv_04d_ja_filters_explore','lang_ja','ltk_04d_passport_trails_filters_explore','探す','PUBLISHED',now(),now()),
('ltv_04d_ja_filters_bookable','lang_ja','ltk_04d_passport_trails_filters_bookable','予約可能','PUBLISHED',now(),now()),
('ltv_04d_ja_filters_confirm','lang_ja','ltk_04d_passport_trails_filters_confirm','確認が必要','PUBLISHED',now(),now()),
('ltv_04d_ja_filters_saved','lang_ja','ltk_04d_passport_trails_filters_saved','保存済み','PUBLISHED',now(),now()),
('ltv_04d_ja_sections_official','lang_ja','ltk_04d_passport_trails_sections_official','公式SPMパスポートトレイル','PUBLISHED',now(),now()),
('ltv_04d_ja_sections_discover_saved','lang_ja','ltk_04d_passport_trails_sections_discover_saved','発見・保存','PUBLISHED',now(),now()),
('ltv_04d_ja_count_trails','lang_ja','ltk_04d_passport_trails_count_trails','件のトレイル','PUBLISHED',now(),now()),
('ltv_04d_ja_saved_friendly','lang_ja','ltk_04d_passport_trails_labels_saved_friendly','保存対応','PUBLISHED',now(),now()),
('ltv_04d_ja_shortcuts_trips','lang_ja','ltk_04d_passport_trails_shortcuts_trips','旅程','PUBLISHED',now(),now()),
('ltv_04d_ja_shortcuts_saved_plans','lang_ja','ltk_04d_passport_trails_shortcuts_saved_plans','保存済みプラン','PUBLISHED',now(),now())
ON CONFLICT ("languagePackId","translationKeyId")
DO UPDATE SET
  "value" = EXCLUDED."value",
  "status" = 'PUBLISHED',
  "updatedAt" = now();
