-- OSP-TRAVELER-LANGUAGE-RUNTIME-03B
-- Low-risk traveler UI translation seed.
-- Scope: profile/settings/home navigation and general app convenience labels only.

-- Japanese low-risk UI
INSERT INTO "LanguageTranslationValue" ("id","languagePackId","translationKeyId","value","status","createdAt","updatedAt")
VALUES
('ltv_03b_ja_home_bottom_nav_home','lang_ja','ltk_home_bottom_nav_home','ホーム','PUBLISHED',now(),now()),
('ltv_03b_ja_home_bottom_nav_trips','lang_ja','ltk_home_bottom_nav_trips','旅程','PUBLISHED',now(),now()),
('ltv_03b_ja_home_bottom_nav_profile','lang_ja','ltk_home_bottom_nav_profile','プロフィール','PUBLISHED',now(),now()),
('ltv_03b_ja_home_passport_map','lang_ja','ltk_home_passport_map','パスポートマップを開く','PUBLISHED',now(),now()),
('ltv_03b_ja_home_header_language_aria','lang_ja','ltk_home_header_language_aria','言語選択を開く','PUBLISHED',now(),now()),
('ltv_03b_ja_home_header_currency_aria','lang_ja','ltk_home_header_currency_aria','通貨選択を開く','PUBLISHED',now(),now()),
('ltv_03b_ja_home_header_assistant_aria','lang_ja','ltk_home_header_assistant_aria','OSPトラベルアシスタントを開く','PUBLISHED',now(),now()),
('ltv_03b_ja_home_header_notifications_aria','lang_ja','ltk_home_header_notifications_aria','通知','PUBLISHED',now(),now()),
('ltv_03b_ja_settings_title','lang_ja','ltk_settings_title','旅行者設定','PUBLISHED',now(),now()),
('ltv_03b_ja_settings_language_title','lang_ja','ltk_settings_language_title','希望する旅行言語','PUBLISHED',now(),now())
ON CONFLICT ("languagePackId","translationKeyId")
DO UPDATE SET
  "value" = EXCLUDED."value",
  "status" = 'PUBLISHED',
  "updatedAt" = now();

-- Filipino low-risk UI
INSERT INTO "LanguageTranslationValue" ("id","languagePackId","translationKeyId","value","status","createdAt","updatedAt")
VALUES
('ltv_03b_fil_home_bottom_nav_home','lang_fil','ltk_home_bottom_nav_home','Home','PUBLISHED',now(),now()),
('ltv_03b_fil_home_bottom_nav_trips','lang_fil','ltk_home_bottom_nav_trips','Mga Trip','PUBLISHED',now(),now()),
('ltv_03b_fil_home_bottom_nav_profile','lang_fil','ltk_home_bottom_nav_profile','Profile','PUBLISHED',now(),now()),
('ltv_03b_fil_home_passport_map','lang_fil','ltk_home_passport_map','Buksan ang Passport Map','PUBLISHED',now(),now()),
('ltv_03b_fil_home_header_language_aria','lang_fil','ltk_home_header_language_aria','Buksan ang language selector','PUBLISHED',now(),now()),
('ltv_03b_fil_home_header_currency_aria','lang_fil','ltk_home_header_currency_aria','Buksan ang currency selector','PUBLISHED',now(),now()),
('ltv_03b_fil_home_header_assistant_aria','lang_fil','ltk_home_header_assistant_aria','Buksan ang OSP Travel Assistant','PUBLISHED',now(),now()),
('ltv_03b_fil_home_header_notifications_aria','lang_fil','ltk_home_header_notifications_aria','Mga notification','PUBLISHED',now(),now()),
('ltv_03b_fil_settings_title','lang_fil','ltk_settings_title','Mga Kontrol ng Traveler','PUBLISHED',now(),now()),
('ltv_03b_fil_settings_language_title','lang_fil','ltk_settings_language_title','Piniling travel language','PUBLISHED',now(),now())
ON CONFLICT ("languagePackId","translationKeyId")
DO UPDATE SET
  "value" = EXCLUDED."value",
  "status" = 'PUBLISHED',
  "updatedAt" = now();

-- Cebuano / Bisaya low-risk UI
INSERT INTO "LanguageTranslationValue" ("id","languagePackId","translationKeyId","value","status","createdAt","updatedAt")
VALUES
('ltv_03b_ceb_home_bottom_nav_home','lang_ceb','ltk_home_bottom_nav_home','Home','PUBLISHED',now(),now()),
('ltv_03b_ceb_home_bottom_nav_trips','lang_ceb','ltk_home_bottom_nav_trips','Mga Biyahe','PUBLISHED',now(),now()),
('ltv_03b_ceb_home_bottom_nav_profile','lang_ceb','ltk_home_bottom_nav_profile','Profile','PUBLISHED',now(),now()),
('ltv_03b_ceb_home_passport_map','lang_ceb','ltk_home_passport_map','Ablihi ang Passport Map','PUBLISHED',now(),now()),
('ltv_03b_ceb_home_header_language_aria','lang_ceb','ltk_home_header_language_aria','Ablihi ang pagpili sa language','PUBLISHED',now(),now()),
('ltv_03b_ceb_home_header_currency_aria','lang_ceb','ltk_home_header_currency_aria','Ablihi ang pagpili sa currency','PUBLISHED',now(),now()),
('ltv_03b_ceb_home_header_assistant_aria','lang_ceb','ltk_home_header_assistant_aria','Ablihi ang OSP Travel Assistant','PUBLISHED',now(),now()),
('ltv_03b_ceb_home_header_notifications_aria','lang_ceb','ltk_home_header_notifications_aria','Mga pahibalo','PUBLISHED',now(),now()),
('ltv_03b_ceb_settings_title','lang_ceb','ltk_settings_title','Mga Kontrol sa Traveler','PUBLISHED',now(),now()),
('ltv_03b_ceb_settings_language_title','lang_ceb','ltk_settings_language_title','Piniling travel language','PUBLISHED',now(),now())
ON CONFLICT ("languagePackId","translationKeyId")
DO UPDATE SET
  "value" = EXCLUDED."value",
  "status" = 'PUBLISHED',
  "updatedAt" = now();
