-- OSP-TRAVELER-LANGUAGE-RUNTIME-04E
-- Safe lower Passport Trails shell labels only.

INSERT INTO "LanguageTranslationKey" ("id","key","scope","defaultText","description","isActive","createdAt","updatedAt")
VALUES
('ltk_04e_nextstep_eyebrow','passportTrails.nextStep.eyebrow','traveler','Next Step','Passport Trails next-step eyebrow',true,now(),now()),
('ltk_04e_nextstep_title','passportTrails.nextStep.title','traveler','Choose how you want to move.','Passport Trails next-step title',true,now(),now()),
('ltk_04e_nextstep_official_title','passportTrails.nextStep.official.title','traveler','Official Trail','Passport Trails next-step card title',true,now(),now()),
('ltk_04e_nextstep_official_body','passportTrails.nextStep.official.body','traveler','Book or check route.','Passport Trails next-step card body',true,now(),now()),
('ltk_04e_nextstep_custom_title','passportTrails.nextStep.custom.title','traveler','Custom Route','Passport Trails next-step card title',true,now(),now()),
('ltk_04e_nextstep_custom_body','passportTrails.nextStep.custom.body','traveler','Pick your stops.','Passport Trails next-step card body',true,now(),now()),
('ltk_04e_utility_payments','passportTrails.utility.payments','traveler','Payments','Passport Trails utility card title',true,now(),now()),
('ltk_04e_utility_receipts','passportTrails.utility.receipts','traveler','Receipts','Passport Trails utility card subtitle',true,now(),now())
ON CONFLICT ("key")
DO UPDATE SET
  "defaultText" = EXCLUDED."defaultText",
  "description" = EXCLUDED."description",
  "isActive" = true,
  "updatedAt" = now();

INSERT INTO "LanguageTranslationValue" ("id","languagePackId","translationKeyId","value","status","createdAt","updatedAt")
VALUES
('ltv_04e_ja_nextstep_eyebrow','lang_ja','ltk_04e_nextstep_eyebrow','次のステップ','PUBLISHED',now(),now()),
('ltv_04e_ja_nextstep_title','lang_ja','ltk_04e_nextstep_title','進み方を選ぶ','PUBLISHED',now(),now()),
('ltv_04e_ja_nextstep_official_title','lang_ja','ltk_04e_nextstep_official_title','公式トレイル','PUBLISHED',now(),now()),
('ltv_04e_ja_nextstep_official_body','lang_ja','ltk_04e_nextstep_official_body','ルートを予約または確認します。','PUBLISHED',now(),now()),
('ltv_04e_ja_nextstep_custom_title','lang_ja','ltk_04e_nextstep_custom_title','カスタムルート','PUBLISHED',now(),now()),
('ltv_04e_ja_nextstep_custom_body','lang_ja','ltk_04e_nextstep_custom_body','立ち寄り先を選びます。','PUBLISHED',now(),now()),
('ltv_04e_ja_utility_payments','lang_ja','ltk_04e_utility_payments','支払い','PUBLISHED',now(),now()),
('ltv_04e_ja_utility_receipts','lang_ja','ltk_04e_utility_receipts','領収書','PUBLISHED',now(),now())
ON CONFLICT ("languagePackId","translationKeyId")
DO UPDATE SET
  "value" = EXCLUDED."value",
  "status" = 'PUBLISHED',
  "updatedAt" = now();
