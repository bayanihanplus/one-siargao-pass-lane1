import { cookies } from "next/headers";
import { getApiBaseUrl, getCurrentUser } from "./server-auth";

export const TRAVELER_PREVIEW_LANGUAGE_COOKIE = "osp_preview_language";
export const DEFAULT_TRAVELER_LANGUAGE = "en";

export type TravelerLanguagePack = {
  code: string;
  label: string;
  group: string;
  isActive?: boolean;
  launchPriority?: number | null;
};

export type TravelerLanguageSource = "profile" | "guest-preview" | "query-preview" | "fallback";

export type TravelerLanguageRuntime = {
  languageCode: string;
  source: TravelerLanguageSource;
  dictionary: Record<string, string>;
  languagePack?: TravelerLanguagePack;
  isPreview: boolean;
};

type SearchParamsLike = Record<string, string | string[] | undefined> | undefined;

function getSearchParamValue(searchParams: SearchParamsLike, key: string): string {
  const value = searchParams?.[key];
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function cleanLanguageCode(value: string | null | undefined): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}

function resolveSupportedLanguage(
  candidate: string | null | undefined,
  supportedCodes: Set<string>,
): string {
  const cleaned = cleanLanguageCode(candidate);

  if (cleaned && supportedCodes.has(cleaned)) {
    return cleaned;
  }

  return DEFAULT_TRAVELER_LANGUAGE;
}

export async function getTravelerLanguagePacks(): Promise<TravelerLanguagePack[]> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/language-packs`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const payload = await res.json();
    const packs = Array.isArray(payload) ? payload : payload?.languagePacks || [];

    return packs
      .map((pack: any) => ({
        code: String(pack.languageCode || pack.code || "").trim(),
        label: String(pack.label || pack.languageCode || pack.code || "").trim(),
        group: String(pack.group || "International").trim(),
        isActive: Boolean(pack.isActive ?? true),
        launchPriority:
          typeof pack.launchPriority === "number" ? pack.launchPriority : null,
      }))
      .filter((pack: TravelerLanguagePack) => pack.code && pack.label && pack.isActive);
  } catch {
    return [];
  }
}

export async function getTravelerDictionary(
  languageCode: string,
  scope = "traveler",
): Promise<Record<string, string>> {
  const safeLanguageCode = cleanLanguageCode(languageCode) || DEFAULT_TRAVELER_LANGUAGE;
  const safeScope = scope.replace(/[^a-z0-9_-]/gi, "") || "traveler";

  try {
    const res = await fetch(
      `${getApiBaseUrl()}/language-packs/${safeLanguageCode}/dictionary?scope=${safeScope}`,
      { cache: "no-store" },
    );

    if (!res.ok) return {};

    const payload = await res.json();
    return payload?.dictionary && typeof payload.dictionary === "object"
      ? payload.dictionary
      : {};
  } catch {
    return {};
  }
}

export function tr(
  dictionary: Record<string, string>,
  key: string,
  fallback: string,
): string {
  return dictionary?.[key] || fallback;
}

export async function getTravelerLanguageRuntime(options?: {
  searchParams?: SearchParamsLike;
  scope?: string;
  allowQueryPreview?: boolean;
}): Promise<TravelerLanguageRuntime> {
  const packs = await getTravelerLanguagePacks();
  const supportedCodes = new Set([
    DEFAULT_TRAVELER_LANGUAGE,
    ...packs.map((pack) => pack.code),
  ]);

  const queryPreview = options?.allowQueryPreview
    ? getSearchParamValue(options.searchParams, "previewLanguage")
    : "";

  const cookiePreview = cookies().get(TRAVELER_PREVIEW_LANGUAGE_COOKIE)?.value || "";

  let userPreferredLanguage = "";
  try {
    const user = await getCurrentUser();
    userPreferredLanguage = String(user?.preferredLanguage || "");
  } catch {
    userPreferredLanguage = "";
  }

  let source: TravelerLanguageSource = "fallback";
  let selectedLanguage = DEFAULT_TRAVELER_LANGUAGE;

  if (userPreferredLanguage) {
    selectedLanguage = resolveSupportedLanguage(userPreferredLanguage, supportedCodes);
    source = "profile";
  } else if (cookiePreview) {
    selectedLanguage = resolveSupportedLanguage(cookiePreview, supportedCodes);
    source = selectedLanguage === DEFAULT_TRAVELER_LANGUAGE ? "fallback" : "guest-preview";
  } else if (queryPreview) {
    selectedLanguage = resolveSupportedLanguage(queryPreview, supportedCodes);
    source = selectedLanguage === DEFAULT_TRAVELER_LANGUAGE ? "fallback" : "query-preview";
  }

  const languagePack = packs.find((pack) => pack.code === selectedLanguage);
  const dictionary = await getTravelerDictionary(selectedLanguage, options?.scope || "traveler");

  return {
    languageCode: selectedLanguage,
    source,
    dictionary,
    languagePack,
    isPreview: source === "guest-preview" || source === "query-preview",
  };
}
