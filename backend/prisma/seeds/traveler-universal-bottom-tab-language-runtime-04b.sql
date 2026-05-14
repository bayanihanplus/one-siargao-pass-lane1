-- OSP-TRAVELER-LANGUAGE-RUNTIME-04B
-- Low-risk Universal Traveler Bottom Tab labels only.

INSERT INTO "LanguageTranslationKey" ("id","key","scope","defaultText","description","isActive","createdAt","updatedAt")
VALUES
('ltk_04b_traveler_bottom_tab_home','traveler.bottomTab.home','traveler','Home','Universal traveler bottom tab label',true,now(),now()),
('ltk_04b_traveler_bottom_tab_trails','traveler.bottomTab.trails','traveler','Trails','Universal traveler bottom tab label',true,now(),now()),
('ltk_04b_traveler_bottom_tab_explore','traveler.bottomTab.explore','traveler','Explore','Universal traveler bottom tab label',true,now(),now()),
('ltk_04b_traveler_bottom_tab_profile','traveler.bottomTab.profile','traveler','Profile','Universal traveler bottom tab label',true,now(),now()),
('ltk_04b_traveler_bottom_tab_qr_aria','traveler.bottomTab.qrAria','traveler','Open official Traveler QR','Universal traveler bottom tab center QR aria label',true,now(),now())
ON CONFLICT ("key")
DO UPDATE SET
  "defaultText" = EXCLUDED."defaultText",
  "description" = EXCLUDED."description",
  "isActive" = true,
  "updatedAt" = now();

INSERT INTO "LanguageTranslationValue" ("id","languagePackId","translationKeyId","value","status","createdAt","updatedAt")
VALUES
('ltv_04b_ja_bottom_tab_home','lang_ja','ltk_04b_traveler_bottom_tab_home','ホーム','PUBLISHED',now(),now()),
('ltv_04b_ja_bottom_tab_trails','lang_ja','ltk_04b_traveler_bottom_tab_trails','トレイル','PUBLISHED',now(),now()),
('ltv_04b_ja_bottom_tab_explore','lang_ja','ltk_04b_traveler_bottom_tab_explore','探す','PUBLISHED',now(),now()),
('ltv_04b_ja_bottom_tab_profile','lang_ja','ltk_04b_traveler_bottom_tab_profile','プロフィール','PUBLISHED',now(),now()),
('ltv_04b_ja_bottom_tab_qr','lang_ja','ltk_04b_traveler_bottom_tab_qr_aria','公式トラベラーQRを開く','PUBLISHED',now(),now()),
('ltv_04b_fil_bottom_tab_home','lang_fil','ltk_04b_traveler_bottom_tab_home','Home','PUBLISHED',now(),now()),
('ltv_04b_fil_bottom_tab_trails','lang_fil','ltk_04b_traveler_bottom_tab_trails','Trails','PUBLISHED',now(),now()),
('ltv_04b_fil_bottom_tab_explore','lang_fil','ltk_04b_traveler_bottom_tab_explore','Explore','PUBLISHED',now(),now()),
('ltv_04b_fil_bottom_tab_profile','lang_fil','ltk_04b_traveler_bottom_tab_profile','Profile','PUBLISHED',now(),now()),
('ltv_04b_ceb_bottom_tab_home','lang_ceb','ltk_04b_traveler_bottom_tab_home','Home','PUBLISHED',now(),now()),
('ltv_04b_ceb_bottom_tab_trails','lang_ceb','ltk_04b_traveler_bottom_tab_trails','Trails','PUBLISHED',now(),now()),
('ltv_04b_ceb_bottom_tab_explore','lang_ceb','ltk_04b_traveler_bottom_tab_explore','Explore','PUBLISHED',now(),now()),
('ltv_04b_ceb_bottom_tab_profile','lang_ceb','ltk_04b_traveler_bottom_tab_profile','Profile','PUBLISHED',now(),now())
ON CONFLICT ("languagePackId","translationKeyId")
DO UPDATE SET
  "value" = EXCLUDED."value",
  "status" = 'PUBLISHED',
  "updatedAt" = now();
