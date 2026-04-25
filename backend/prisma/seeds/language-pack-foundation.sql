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
('ltk_home_hero_active_title','home.hero.active.title','traveler','Trip Active.\nPass Ready.','OSP home active hero title',true,now(),now()),
('ltk_home_hero_active_body','home.hero.active.body','traveler','Access your trip status,\npass, clearance, and\npayment in one place.','OSP home active hero body',true,now(),now()),
('ltk_home_hero_active_traveler_label','home.hero.active.travelerLabel','traveler','Verified Traveler','OSP home active traveler label',true,now(),now()),
('ltk_home_hero_registration_required_title','home.hero.registrationRequired.title','traveler','Trip On File.\nRegistration Required.','OSP home registration required hero title',true,now(),now()),
('ltk_home_hero_registration_required_body','home.hero.registrationRequired.body','traveler','Complete your traveler trip registration first so your pass can move forward.','OSP home registration required hero body',true,now(),now()),
('ltk_home_hero_registration_required_traveler_label','home.hero.registrationRequired.travelerLabel','traveler','Traveler On File','OSP home registration required traveler label',true,now(),now()),
('ltk_home_hero_manifest_required_title','home.hero.manifestRequired.title','traveler','Trip On File.\nManifest Listing Required.','OSP home manifest required hero title',true,now(),now()),
('ltk_home_hero_manifest_required_body','home.hero.manifestRequired.body','traveler','Your registration is on file, but you are not yet listed in the manifest for this trip.','OSP home manifest required hero body',true,now(),now()),
('ltk_home_hero_manifest_required_traveler_label','home.hero.manifestRequired.travelerLabel','traveler','Traveler On File','OSP home manifest required traveler label',true,now(),now()),
('ltk_home_hero_pass_pending_title','home.hero.passPending.title','traveler','Trip Found.\nPass Pending.','OSP home pass pending hero title',true,now(),now()),
('ltk_home_hero_pass_pending_body','home.hero.passPending.body','traveler','Your registration is on file. Keep checking your latest trip status as your pass moves forward.','OSP home pass pending hero body',true,now(),now()),
('ltk_home_hero_pass_pending_traveler_label','home.hero.passPending.travelerLabel','traveler','Traveler On File','OSP home pass pending traveler label',true,now(),now()),
('ltk_home_hero_clearance_pending_title','home.hero.clearancePending.title','traveler','Trip On File.\nClearance Pending.','OSP home clearance pending hero title',true,now(),now()),
('ltk_home_hero_clearance_pending_body','home.hero.clearancePending.body','traveler','Your pass may be issued, but clearance is still under review before trip readiness is confirmed.','OSP home clearance pending hero body',true,now(),now()),
('ltk_home_hero_clearance_pending_traveler_label','home.hero.clearancePending.travelerLabel','traveler','Traveler On File','OSP home clearance pending traveler label',true,now(),now()),
('ltk_home_hero_payment_pending_title','home.hero.paymentPending.title','traveler','Trip On File.\nPayment Pending.','OSP home payment pending hero title',true,now(),now()),
('ltk_home_hero_payment_pending_body','home.hero.paymentPending.body','traveler','Access your trip status,\npass, clearance, and\npayment in one place.','OSP home payment pending hero body',true,now(),now()),
('ltk_home_hero_payment_pending_traveler_label','home.hero.paymentPending.travelerLabel','traveler','Payment Pending','OSP home payment pending traveler label',true,now(),now()),
('ltk_home_hero_empty_title','home.hero.empty.title','traveler','Start Your\nOne Siargao Pass.','OSP home empty hero title',true,now(),now()),
('ltk_home_hero_empty_body','home.hero.empty.body','traveler','Access your trip status,\npass, clearance, and\npayment in one place.','OSP home empty hero body',true,now(),now()),
('ltk_home_hero_empty_traveler_label','home.hero.empty.travelerLabel','traveler','Traveler Access','OSP home empty traveler label',true,now(),now()),
('ltk_home_header_official_traveler_pass','home.header.officialTravelerPass','traveler','Official Traveler Pass','OSP home header pass label',true,now(),now()),
('ltk_home_header_language_aria','home.header.language.ariaLabel','traveler','Open language selector','OSP home language aria label',true,now(),now()),
('ltk_home_header_currency_aria','home.header.currency.ariaLabel','traveler','Open currency selector','OSP home currency aria label',true,now(),now()),
('ltk_home_header_assistant_aria','home.header.assistant.ariaLabel','traveler','Open OSP Travel Assistant','OSP home assistant aria label',true,now(),now()),
('ltk_home_header_notifications_aria','home.header.notifications.ariaLabel','traveler','Notifications','OSP home notifications aria label',true,now(),now()),
('ltk_home_pass_card_pass_code','home.passCard.passCode','traveler','Pass Code','OSP home pass card pass code label',true,now(),now()),
('ltk_home_pass_card_valid_dates','home.passCard.validDates','traveler','Valid Dates','OSP home pass card valid dates label',true,now(),now()),
('ltk_home_pass_card_badge_prefix','home.passCard.badgePrefix','traveler','PASS','OSP home pass card badge prefix',true,now(),now()),
('ltk_home_status_clearance','home.status.clearance','traveler','Clearance Status','OSP home clearance status label',true,now(),now()),
('ltk_home_status_payment','home.status.payment','traveler','Payment Status','OSP home payment status label',true,now(),now()),
('ltk_home_status_pass','home.status.pass','traveler','Pass Status','OSP home pass status label',true,now(),now()),
('ltk_home_status_trip_dates','home.status.tripDates','traveler','Trip Dates','OSP home trip dates label',true,now(),now()),
('ltk_home_reassurance_message','home.reassurance.message','traveler','Your pass, clearance, payment, and trip records stay connected to your One Siargao Pass profile.','OSP home reassurance message',true,now(),now()),
('ltk_home_journey_title','home.journey.title','traveler','Continue Your Journey','OSP home journey section title',true,now(),now()),
('ltk_home_journey_trips_title','home.journey.trips.title','traveler','Trips','OSP home trips journey title',true,now(),now()),
('ltk_home_journey_trips_subtitle','home.journey.trips.subtitle','traveler','Plans & records','OSP home trips journey subtitle',true,now(),now()),
('ltk_home_journey_payments_title','home.journey.payments.title','traveler','Payments','OSP home payments journey title',true,now(),now()),
('ltk_home_journey_payments_subtitle','home.journey.payments.subtitle','traveler','Status & receipts','OSP home payments journey subtitle',true,now(),now()),
('ltk_home_journey_passport_map_title','home.journey.passportMap.title','traveler','Passport Map','OSP home passport map journey title',true,now(),now()),
('ltk_home_journey_passport_map_subtitle','home.journey.passportMap.subtitle','traveler','Trails & stamps','OSP home passport map journey subtitle',true,now(),now()),
('ltk_home_journey_checkpoints_title','home.journey.checkpoints.title','traveler','Checkpoints','OSP home checkpoints journey title',true,now(),now()),
('ltk_home_journey_checkpoints_subtitle','home.journey.checkpoints.subtitle','traveler','QR & access state','OSP home checkpoints journey subtitle',true,now(),now()),
('ltk_home_bottom_nav_home','home.bottomNav.home','traveler','Home','OSP home bottom nav home label',true,now(),now()),
('ltk_home_bottom_nav_trips','home.bottomNav.trips','traveler','Trips','OSP home bottom nav trips label',true,now(),now()),
('ltk_home_bottom_nav_payments','home.bottomNav.payments','traveler','Payments','OSP home bottom nav payments label',true,now(),now()),
('ltk_home_bottom_nav_profile','home.bottomNav.profile','traveler','Profile','OSP home bottom nav profile label',true,now(),now()),
('ltk_home_pass_open_qr_aria','home.pass.openQr.ariaLabel','traveler','Open active pass QR','OSP home active pass QR aria label',true,now(),now()),
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
('ltv_fil_ltk_home_passport_map','lang_fil','ltk_home_passport_map','Buksan ang Passport Map','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_hero_active_title','lang_fil','ltk_home_hero_active_title','Trip Aktibo.\nPass Handa.','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_hero_active_body','lang_fil','ltk_home_hero_active_body','Tingnan ang trip status,\npass, clearance, at\npayment mo sa isang lugar.','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_hero_active_traveler_label','lang_fil','ltk_home_hero_active_traveler_label','Verified Traveler','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_header_official_traveler_pass','lang_fil','ltk_home_header_official_traveler_pass','Official Traveler Pass','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_header_language_aria','lang_fil','ltk_home_header_language_aria','Buksan ang language selector','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_header_currency_aria','lang_fil','ltk_home_header_currency_aria','Buksan ang currency selector','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_header_assistant_aria','lang_fil','ltk_home_header_assistant_aria','Buksan ang OSP Travel Assistant','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_header_notifications_aria','lang_fil','ltk_home_header_notifications_aria','Mga notification','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_pass_card_pass_code','lang_fil','ltk_home_pass_card_pass_code','Pass Code','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_pass_card_valid_dates','lang_fil','ltk_home_pass_card_valid_dates','Valid Dates','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_pass_card_badge_prefix','lang_fil','ltk_home_pass_card_badge_prefix','PASS','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_status_clearance','lang_fil','ltk_home_status_clearance','Clearance Status','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_status_payment','lang_fil','ltk_home_status_payment','Payment Status','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_status_pass','lang_fil','ltk_home_status_pass','Pass Status','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_status_trip_dates','lang_fil','ltk_home_status_trip_dates','Trip Dates','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_reassurance_message','lang_fil','ltk_home_reassurance_message','Nakakonekta ang pass, clearance, payment, at trip records mo sa One Siargao Pass profile mo.','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_journey_title','lang_fil','ltk_home_journey_title','Ipagpatuloy ang Journey Mo','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_journey_trips_title','lang_fil','ltk_home_journey_trips_title','Trips','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_journey_trips_subtitle','lang_fil','ltk_home_journey_trips_subtitle','Plans & records','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_journey_payments_title','lang_fil','ltk_home_journey_payments_title','Payments','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_journey_payments_subtitle','lang_fil','ltk_home_journey_payments_subtitle','Status & receipts','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_journey_passport_map_title','lang_fil','ltk_home_journey_passport_map_title','Passport Map','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_journey_passport_map_subtitle','lang_fil','ltk_home_journey_passport_map_subtitle','Trails & stamps','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_journey_checkpoints_title','lang_fil','ltk_home_journey_checkpoints_title','Checkpoints','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_journey_checkpoints_subtitle','lang_fil','ltk_home_journey_checkpoints_subtitle','QR & access state','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_bottom_nav_home','lang_fil','ltk_home_bottom_nav_home','Home','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_bottom_nav_trips','lang_fil','ltk_home_bottom_nav_trips','Trips','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_bottom_nav_payments','lang_fil','ltk_home_bottom_nav_payments','Payments','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_bottom_nav_profile','lang_fil','ltk_home_bottom_nav_profile','Profile','PUBLISHED',now(),now()),
('ltv_fil_ltk_home_pass_open_qr_aria','lang_fil','ltk_home_pass_open_qr_aria','Buksan ang active pass QR','PUBLISHED',now(),now()),
on conflict ("languagePackId","translationKeyId") do update set
"value"=excluded."value",
"status"='PUBLISHED',
"updatedAt"=now();
