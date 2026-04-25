-- OSP Language Pack Foundation Seed
-- Purpose:
-- - Seed active language packs.
-- - Seed starter traveler translation keys.
-- - Seed English default published values.
-- - Seed Filipino proof values for dictionary rendering validation.
--
-- Safe to rerun.

insert into "LanguagePack" ("id","languageCode","label","group","isActive","launchPriority","createdAt","updatedAt") values
('lang_en','en','English','International',true,1,now(),now()),
('lang_zh_hant','zh-Hant','Chinese Traditional','International',true,2,now(),now()),
('lang_zh_hans','zh-Hans','Chinese Simplified','International',true,3,now(),now()),
('lang_ko','ko','Korean','International',true,4,now(),now()),
('lang_ja','ja','Japanese','International',true,5,now(),now()),
('lang_es','es','Spanish','European',true,6,now(),now()),
('lang_fr','fr','French','European',true,7,now(),now()),
('lang_de','de','German','European',true,8,now(),now()),
('lang_it','it','Italian','European',true,9,now(),now()),
('lang_pt','pt','Portuguese','European',true,10,now(),now()),
('lang_nl','nl','Dutch','European',true,11,now(),now()),
('lang_sv','sv','Swedish','European',true,12,now(),now()),
('lang_no','no','Norwegian','European',true,13,now(),now()),
('lang_da','da','Danish','European',true,14,now(),now()),
('lang_pl','pl','Polish','European',true,15,now(),now()),
('lang_fil','fil','Filipino','Filipino',true,16,now(),now()),
('lang_ceb','ceb','Bisaya / Cebuano','Filipino',true,17,now(),now()),
('lang_sgd','sgd','Surigaonon','Filipino',true,18,now(),now())
on conflict ("languageCode") do update set
"label"=excluded."label",
"group"=excluded."group",
"isActive"=excluded."isActive",
"launchPriority"=excluded."launchPriority",
"updatedAt"=now();

insert into "LanguageTranslationKey" ("id","key","scope","defaultText","description","isActive","createdAt","updatedAt") values
('ltk_home_title','home.hero.title','traveler','Trips Active. Pass Ready.','OSP home hero title',true,now(),now()),
('ltk_home_show_qr','home.cta.showQr','traveler','Show My QR','OSP home QR CTA',true,now(),now()),
('ltk_home_passport_map','home.cta.passportMap','traveler','Open Passport Map','OSP home passport map CTA',true,now(),now()),
('ltk_settings_title','settings.title','traveler','Traveler Controls','Traveler settings screen title',true,now(),now()),
('ltk_settings_language_title','settings.language.title','traveler','Choose your travel language','Language settings title',true,now(),now()),
('ltk_trips_title','trips.title','traveler','My Trips','Traveler trips title',true,now(),now()),
('ltk_trip_detail_title','tripDetail.title','traveler','View Trip','Trip detail screen title',true,now(),now()),
('ltk_payment_detail_title','paymentDetail.title','traveler','Payment Detail','Payment detail screen title',true,now(),now()),
('ltk_spm_title','spm.title','traveler','Your Siargao Journey, Mapped','SPM hero title',true,now(),now())
on conflict ("key") do update set
"scope"=excluded."scope",
"defaultText"=excluded."defaultText",
"description"=excluded."description",
"isActive"=excluded."isActive",
"updatedAt"=now();

insert into "LanguageTranslationValue" ("id","languagePackId","translationKeyId","value","status","createdAt","updatedAt")
select replace('ltv_' || lp."languageCode" || '_' || tk."id", '-', '_'), lp."id", tk."id", tk."defaultText", 'PUBLISHED', now(), now()
from "LanguagePack" lp
cross join "LanguageTranslationKey" tk
where lp."languageCode" = 'en'
on conflict ("languagePackId","translationKeyId") do update set
"value"=excluded."value",
"status"='PUBLISHED',
"updatedAt"=now();

insert into "LanguageTranslationValue" ("id","languagePackId","translationKeyId","value","status","createdAt","updatedAt") values
('ltv_fil_ltk_settings_title','lang_fil','ltk_settings_title','Mga Kontrol ng Traveler','PUBLISHED',now(),now()),
('ltv_fil_ltk_settings_language_title','lang_fil','ltk_settings_language_title','Piliin ang travel language mo','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_title','lang_fil','ltk_home_title','Trip Aktibo. Pass Handa.','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_show_qr','lang_fil','ltk_home_show_qr','Ipakita ang QR','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_passport_map','lang_fil','ltk_home_passport_map','Buksan ang Passport Map','PUBLISHED',now(),now())
on conflict ("languagePackId","translationKeyId") do update set
"value"=excluded."value",
"status"='PUBLISHED',
"updatedAt"=now();
