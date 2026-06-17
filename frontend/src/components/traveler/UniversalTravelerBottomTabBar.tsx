"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type TravelerBottomTabKey = "home" | "trails" | "pass" | "explore" | "profile";

type UniversalTravelerBottomTabBarProps = {
  activeTab?: TravelerBottomTabKey;
  fixed?: boolean;
  labels?: Partial<Record<TravelerBottomTabKey, string>>;
};

type TabItem = {
  key: Exclude<TravelerBottomTabKey, "pass">;
  label: string;
  href: string;
  dictionaryKey: string;
};

const OSP = {
  navy: "#013863",
  teal: "#0596A5",
  gold: "#F3AE26",
  white: "#FFFFFF",
  mist: "#EAFBFA",
  slate: "#50668B",
} as const;

const bottomTabSafeSpacerStyle = {
  height: "calc(60px + env(safe-area-inset-bottom))",
  flex: "0 0 auto",
  pointerEvents: "none",
} as const;

const TABS: TabItem[] = [
  { key: "home", label: "Home", href: "/traveler/app", dictionaryKey: "traveler.bottomTab.home" },
  { key: "explore", label: "Explore", href: "/traveler/explore", dictionaryKey: "traveler.bottomTab.explore" },
  { key: "trails", label: "Trails", href: "/traveler/passport-trails", dictionaryKey: "traveler.bottomTab.trails" },
  { key: "profile", label: "Profile", href: "/traveler/settings", dictionaryKey: "traveler.bottomTab.profile" },
];

function readPreviewLanguageCookie() {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|;\s*)osp_preview_language=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "en";
}

function translate(dictionary: Record<string, string>, key: string, fallback: string) {
  return dictionary[key] || fallback;
}

async function loadDictionary(languageCode: string) {
  try {
    const response = await fetch(`/api/traveler/language/dictionary?language=${encodeURIComponent(languageCode)}`, {
      cache: "no-store",
    });

    if (!response.ok) return {};

    const payload = await response.json();
    return payload?.dictionary && typeof payload.dictionary === "object" ? payload.dictionary : {};
  } catch {
    return {};
  }
}

export default function UniversalTravelerBottomTabBar({
  activeTab = "home",
  labels,
}: UniversalTravelerBottomTabBarProps) {
  const passActive = activeTab === "pass";
  const [dictionary, setDictionary] = useState<Record<string, string>>({});

  useEffect(() => {
    const languageCode = readPreviewLanguageCookie();
    let isMounted = true;

    loadDictionary(languageCode).then((nextDictionary) => {
      if (isMounted) {
        setDictionary(nextDictionary);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const resolvedTabs = useMemo(
    () =>
      TABS.map((tab) => ({
        ...tab,
        label: labels?.[tab.key] || translate(dictionary, tab.dictionaryKey, tab.label),
      })),
    [dictionary, labels],
  );

  const bottomTabNav = (
    <nav
      aria-label="Universal traveler bottom tab"
      data-osp-component="universal-traveler-bottom-tab"
      data-osp-lock="HOME_EXPLORE_QR_TRAILS_PROFILE"
      style={{
        position: "fixed",
        left: "50%",
        bottom: "calc(12px + env(safe-area-inset-bottom))",
        transform: "translateX(-50%)",
        pointerEvents: "auto",
        width: "min(430px, calc(100vw - 24px))",
        minHeight: 76,
        zIndex: 120,
        borderRadius: 26,
        background: "#FFFFFF",
        border: "1px solid #dbe8ef",
        boxShadow: "0 14px 36px rgba(15,23,42,0.08)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
        willChange: "auto",
        isolation: "isolate",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        textAlign: "center",
        gap: 6,
        padding: "10px 12px 12px",
        boxSizing: "border-box",
        touchAction: "manipulation",
        outline: "none",
      }}
    >
      {resolvedTabs.slice(0, 2).map((tab) => (
        <BottomTabItem key={tab.key} tab={tab} active={activeTab === tab.key} />
      ))}

      <Link
        href="/traveler/pass"
        prefetch
        aria-label={translate(dictionary, "traveler.bottomTab.qrAria", "Open official Traveler QR")}
        aria-current={passActive ? "page" : undefined}
        data-osp-bottom-tab-center-qr="true"
        style={{
          width: 66,
          height: 66,
          minWidth: 66,
          maxWidth: 66,
          minHeight: 66,
          maxHeight: 66,
          aspectRatio: "1 / 1",
          marginTop: -24,
          borderRadius: "50%",
          background: passActive ? OSP.navy : "#24bfd1",
          color: OSP.white,
          border: "6px solid #FFFFFF",
          boxShadow: passActive
            ? "0 14px 30px rgba(1,56,99,0.24)"
            : "0 12px 28px rgba(36,191,209,0.35)",
          display: "grid",
          placeItems: "center",
          textDecoration: "none",
          flex: "0 0 66px",
          flexShrink: 0,
          boxSizing: "border-box",
          overflow: "hidden",
          lineHeight: 0,
          appearance: "none",
          WebkitAppearance: "none",
          WebkitTapHighlightColor: "transparent",
          touchAction: "manipulation",
          userSelect: "none",
          outline: "none",
          transform: "translateZ(0)",
        }}
      >
        <QrIcon active={passActive} />
      </Link>

      {resolvedTabs.slice(2).map((tab) => (
        <BottomTabItem key={tab.key} tab={tab} active={activeTab === tab.key} />
      ))}
    </nav>
  );

  return (
    <>
      <div aria-hidden="true" style={bottomTabSafeSpacerStyle} />
      {bottomTabNav}
    </>
  );
}

function BottomTabItem({
  tab,
  active,
}: {
  tab: TabItem;
  active: boolean;
}) {
  return (
    <Link
      href={tab.href}
      prefetch
      aria-label={tab.label}
      aria-current={active ? "page" : undefined}
      data-osp-bottom-tab-item={tab.key}
      style={{
        minHeight: 58,
        minWidth: 54,
        maxWidth: 70,
        borderRadius: 18,
        display: "grid",
        gridTemplateRows: "30px 17px",
        alignContent: "center",
        justifyItems: "center",
        rowGap: 3,
        textDecoration: "none",
        color: active ? OSP.teal : OSP.slate,
        background: active ? OSP.mist : "transparent",
        border: active ? "1px solid rgba(5,150,165,0.18)" : "1px solid transparent",
        boxShadow: active ? "0 8px 18px rgba(5,150,165,0.10)" : "none",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
        flex: "1 1 0",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        userSelect: "none",
        outline: "none",
      }}
    >
      {active ? (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 4,
            width: 20,
            height: 4,
            borderRadius: 999,
            background: OSP.gold,
            boxShadow: "0 2px 8px rgba(243,174,38,0.28)",
          }}
        />
      ) : null}

      <span
        aria-hidden="true"
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          display: "grid",
          placeItems: "center",
          color: active ? OSP.white : OSP.slate,
          background: active ? OSP.teal : "transparent",
          border: active ? "1px solid rgba(5,150,165,0.24)" : "1px solid transparent",
          boxSizing: "border-box",
        }}
      >
        <TabIcon icon={tab.key} active={active} />
      </span>

      <span
        style={{
          maxWidth: "100%",
          color: active ? OSP.teal : OSP.slate,
          fontSize: 11,
          lineHeight: "15px",
          fontWeight: active ? 960 : 900,
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {tab.label}
      </span>
    </Link>
  );
}

function TabIcon({
  icon,
  active,
}: {
  icon: TabItem["key"];
  active: boolean;
}) {
  if (icon === "home") {
    return <HomeBadgeIcon active={active} />;
  }

  if (icon === "trails") {
    return <TrailsBadgeIcon active={active} />;
  }

  if (icon === "explore") {
    return <ExploreBadgeIcon active={active} />;
  }

  return <ProfileBadgeIcon active={active} />;
}

function BadgeFrame({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  const frameStroke = active ? OSP.navy : OSP.slate;
  const frameFill = active ? "rgba(243,174,38,0.14)" : "rgba(255,255,255,0.08)";

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3.9"
        y="3.9"
        width="16.2"
        height="16.2"
        rx="5.4"
        fill={frameFill}
        stroke={frameStroke}
        strokeWidth="1.85"
      />
      {children}
    </svg>
  );
}

function HomeBadgeIcon({ active }: { active: boolean }) {
  const primary = active ? OSP.navy : OSP.slate;
  const accent = active ? OSP.gold : OSP.teal;

  return (
    <BadgeFrame active={active}>
      <path
        d="M7.1 11.15 12 7.05l4.9 4.1"
        stroke={primary}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.35 10.8v5.45h7.3V10.8"
        stroke={primary}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M10.75 16.25v-2.55h2.5v2.55"
        stroke={accent}
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.55" r="1.35" fill={accent} opacity="0.92" />
      <path
        d="M9.65 16.15c.75-.5 1.52-.75 2.35-.75s1.6.25 2.35.75"
        stroke={accent}
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.88"
      />
    </BadgeFrame>
  );
}

function TrailsBadgeIcon({ active }: { active: boolean }) {
  const primary = active ? OSP.navy : OSP.slate;
  const accent = active ? OSP.gold : OSP.teal;
  const fill = active ? "rgba(5,150,165,0.14)" : "rgba(5,150,165,0.08)";

  return (
    <BadgeFrame active={active}>
      <path
        d="M8.1 6.75h6.55c.72 0 1.25.53 1.25 1.25v8.8c0 .46-.38.82-.84.82H8.1c-.55 0-1-.45-1-1V7.75c0-.55.45-1 1-1Z"
        fill={fill}
        stroke={primary}
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <path
        d="M9.55 8.75h4.35M9.55 15.25h2.1"
        stroke={primary}
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M12.4 10.15 13 11.25l1.2.22-.85.88.15 1.22-1.1-.52-1.1.52.15-1.22-.85-.88 1.2-.22.6-1.1Z"
        fill={accent}
      />
      <path
        d="M14.6 16.7v1.7l.85-.55.85.55v-2.35"
        stroke={accent}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </BadgeFrame>
  );
}

function ExploreBadgeIcon({ active }: { active: boolean }) {
  const primary = active ? OSP.navy : OSP.slate;
  const accent = active ? OSP.gold : OSP.teal;
  const fill = active ? "rgba(243,174,38,0.20)" : "rgba(5,150,165,0.10)";

  return (
    <BadgeFrame active={active}>
      <circle
        cx="12"
        cy="12"
        r="5.25"
        fill={fill}
        stroke={primary}
        strokeWidth="1.55"
      />
      <path
        d="M14.75 8.65 12.85 12.85 8.65 14.75l1.9-4.2 4.2-1.9Z"
        stroke={primary}
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
      <circle cx="14.75" cy="8.65" r="1.15" fill={accent} />
      <path
        d="M8.55 15.85c1.05.58 2.2.88 3.45.88s2.4-.3 3.45-.88"
        stroke={accent}
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </BadgeFrame>
  );
}

function ProfileBadgeIcon({ active }: { active: boolean }) {
  const primary = active ? OSP.navy : OSP.slate;
  const accent = active ? OSP.gold : OSP.teal;

  return (
    <BadgeFrame active={active}>
      <circle cx="12" cy="9" r="2.45" stroke={primary} strokeWidth="1.65" />
      <path
        d="M7.95 16.05c.82-2.1 2.15-3.05 4.05-3.05s3.23.95 4.05 3.05"
        stroke={primary}
        strokeWidth="1.65"
        strokeLinecap="round"
      />
      <path
        d="M8.45 17.1c1.1.58 2.25.88 3.55.88s2.45-.3 3.55-.88"
        stroke={accent}
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M15.95 6.75h1.8M16.85 5.85v1.8"
        stroke={accent}
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </BadgeFrame>
  );
}

function QrIcon({ active }: { active: boolean }) {
  const stroke = active ? OSP.gold : OSP.white;
  const soft = active ? "rgba(243,174,38,0.24)" : "rgba(255,255,255,0.22)";
  const dot = active ? OSP.white : OSP.white;

  return (
    <svg
      aria-hidden="true"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      style={{
        display: "block",
        width: 32,
        height: 32,
        overflow: "visible",
        filter: active ? "drop-shadow(0 2px 7px rgba(243,174,38,0.22))" : "none",
      }}
    >
      <circle cx="16" cy="16" r="15" fill={soft} />

      <path d="M9 9h5v5H9V9Z" stroke={stroke} strokeWidth="2.15" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 9h5v5h-5V9Z" stroke={stroke} strokeWidth="2.15" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 18h5v5H9v-5Z" stroke={stroke} strokeWidth="2.15" strokeLinecap="round" strokeLinejoin="round" />

      <circle cx="11.5" cy="11.5" r="1.15" fill={dot} />
      <circle cx="20.5" cy="11.5" r="1.15" fill={dot} />
      <circle cx="11.5" cy="20.5" r="1.15" fill={dot} />

      <path d="M18 18h2.6v2.6H18V18Z" fill={stroke} />
      <path d="M22 18h1.8v5.8H22V18Z" fill={stroke} />
      <path d="M18 22h5.8v1.8H18V22Z" fill={stroke} />

      <circle cx="16" cy="16" r="14.2" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
    </svg>
  );
}
