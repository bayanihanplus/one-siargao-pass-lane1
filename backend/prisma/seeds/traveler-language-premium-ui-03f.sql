-- OSP-TRAVELER-LANGUAGE-PREMIUM-UI-03F
-- Low-risk Profile Language UI keys only.

INSERT INTO "LanguageTranslationKey" ("id","key","scope","defaultText","description","isActive","createdAt","updatedAt")
VALUES
('ltk_03f_settings_language_eyebrow','settings.language.eyebrow','traveler','Language','Language panel eyebrow',true,now(),now()),
('ltk_03f_settings_language_body','settings.language.body','traveler','Choose your preferred guidance language. Protected records stay verified.','Language panel body',true,now(),now()),
('ltk_03f_settings_language_selected_eyebrow','settings.language.selected.eyebrow','traveler','Selected language','Language selected label',true,now(),now()),
('ltk_03f_settings_language_selected_helper','settings.language.selected.helper','traveler','Used for guidance and app labels where available.','Language selected helper',true,now(),now()),
('ltk_03f_settings_language_status_saved','settings.language.status.saved','traveler','Saved','Language status badge',true,now(),now()),
('ltk_03f_settings_language_status_preview','settings.language.status.preview','traveler','Preview','Language status badge',true,now(),now()),
('ltk_03f_settings_language_trust_note','settings.language.trustNote','traveler','General guidance may localize. Protected records stay verified.','Language trust note',true,now(),now()),
('ltk_03f_settings_language_availability_eyebrow','settings.language.availability.eyebrow','traveler','Availability','Language availability label',true,now(),now()),
('ltk_03f_settings_language_availability_title','settings.language.availability.title','traveler','Language support','Language availability title',true,now(),now()),
('ltk_03f_settings_language_availability_count','settings.language.availability.countLabel','traveler','options','Language availability count label',true,now(),now()),
('ltk_03f_settings_language_availability_local','settings.language.availability.local','traveler','Local guidance','Language availability local group',true,now(),now()),
('ltk_03f_settings_language_availability_preview','settings.language.availability.preview','traveler','Preview languages','Language availability preview group',true,now(),now()),
('ltk_settings_language_auth_required_title','settings.language.authRequired.title','traveler','Sign in to save','Language auth notice title',true,now(),now()),
('ltk_settings_language_auth_required_body','settings.language.authRequired.body','traveler','Previewing {language}. Sign in to keep this preference.','Language auth notice body',true,now(),now()),
('ltk_settings_language_choose_option','settings.language.chooseOption','traveler','Choose language','Language selector label',true,now(),now()),
('ltk_settings_language_choose_aria','settings.language.chooseAria','traveler','Choose traveler language','Language selector aria',true,now(),now()),
('ltk_settings_language_save_button','settings.language.saveButton','traveler','Save language','Language save button',true,now(),now()),
('ltk_settings_tabs_profile','settings.tabs.profile','traveler','Profile','Settings tab label',true,now(),now()),
('ltk_settings_tabs_language','settings.tabs.language','traveler','Language','Settings tab label',true,now(),now()),
('ltk_settings_tabs_currency','settings.tabs.currency','traveler','Currency','Settings tab label',true,now(),now()),
('ltk_settings_tabs_assistant','settings.tabs.assistant','traveler','AI Guide','Settings tab label',true,now(),now()),
('ltk_settings_tabs_alerts','settings.tabs.alerts','traveler','Alerts','Settings tab label',true,now(),now())
ON CONFLICT ("key")
DO UPDATE SET
  "defaultText" = EXCLUDED."defaultText",
  "description" = EXCLUDED."description",
  "isActive" = true,
  "updatedAt" = now();

-- Japanese low-risk Profile Language UI
INSERT INTO "LanguageTranslationValue" ("id","languagePackId","translationKeyId","value","status","createdAt","updatedAt")
VALUES
('ltv_03f_ja_language_eyebrow','lang_ja','ltk_03f_settings_language_eyebrow','言語','PUBLISHED',now(),now()),
('ltv_03f_ja_language_body','lang_ja','ltk_03f_settings_language_body','希望する案内言語を選択します。保護された記録は確認済みのまま保持されます。','PUBLISHED',now(),now()),
('ltv_03f_ja_selected_eyebrow','lang_ja','ltk_03f_settings_language_selected_eyebrow','選択中の言語','PUBLISHED',now(),now()),
('ltv_03f_ja_selected_helper','lang_ja','ltk_03f_settings_language_selected_helper','利用可能な範囲で案内とアプリ表示に使用されます。','PUBLISHED',now(),now()),
('ltv_03f_ja_status_saved','lang_ja','ltk_03f_settings_language_status_saved','保存済み','PUBLISHED',now(),now()),
('ltv_03f_ja_status_preview','lang_ja','ltk_03f_settings_language_status_preview','プレビュー','PUBLISHED',now(),now()),
('ltv_03f_ja_trust_note','lang_ja','ltk_03f_settings_language_trust_note','一般案内はローカライズできます。保護された記録は確認済みのまま保持されます。','PUBLISHED',now(),now()),
('ltv_03f_ja_avail_eyebrow','lang_ja','ltk_03f_settings_language_availability_eyebrow','対応状況','PUBLISHED',now(),now()),
('ltv_03f_ja_avail_title','lang_ja','ltk_03f_settings_language_availability_title','言語サポート','PUBLISHED',now(),now()),
('ltv_03f_ja_avail_count','lang_ja','ltk_03f_settings_language_availability_count','件','PUBLISHED',now(),now()),
('ltv_03f_ja_avail_local','lang_ja','ltk_03f_settings_language_availability_local','ローカル案内','PUBLISHED',now(),now()),
('ltv_03f_ja_avail_preview','lang_ja','ltk_03f_settings_language_availability_preview','プレビュー言語','PUBLISHED',now(),now()),
('ltv_03f_ja_auth_title','lang_ja','ltk_settings_language_auth_required_title','保存するにはサインイン','PUBLISHED',now(),now()),
('ltv_03f_ja_auth_body','lang_ja','ltk_settings_language_auth_required_body','{language}をプレビュー中です。この設定を保持するにはサインインしてください。','PUBLISHED',now(),now()),
('ltv_03f_ja_choose_option','lang_ja','ltk_settings_language_choose_option','言語を選択','PUBLISHED',now(),now()),
('ltv_03f_ja_choose_aria','lang_ja','ltk_settings_language_choose_aria','旅行者の言語を選択','PUBLISHED',now(),now()),
('ltv_03f_ja_save_button','lang_ja','ltk_settings_language_save_button','言語を保存','PUBLISHED',now(),now()),
('ltv_03f_ja_tabs_profile','lang_ja','ltk_settings_tabs_profile','プロフィール','PUBLISHED',now(),now()),
('ltv_03f_ja_tabs_language','lang_ja','ltk_settings_tabs_language','言語','PUBLISHED',now(),now()),
('ltv_03f_ja_tabs_currency','lang_ja','ltk_settings_tabs_currency','通貨','PUBLISHED',now(),now()),
('ltv_03f_ja_tabs_assistant','lang_ja','ltk_settings_tabs_assistant','AIガイド','PUBLISHED',now(),now()),
('ltv_03f_ja_tabs_alerts','lang_ja','ltk_settings_tabs_alerts','通知','PUBLISHED',now(),now())
ON CONFLICT ("languagePackId","translationKeyId")
DO UPDATE SET
  "value" = EXCLUDED."value",
  "status" = 'PUBLISHED',
  "updatedAt" = now();
