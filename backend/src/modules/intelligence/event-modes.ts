export const OSP_EVENT_MODES = [
  'NORMAL',
  'PEAK_SEASON',
  'WEATHER_DISRUPTION',
  'SAFETY_ADVISORY',
  'OFFICIAL_EVENT',
] as const;

export type OspEventMode = typeof OSP_EVENT_MODES[number];

export function normalizeEventMode(input?: string): OspEventMode {
  const normalized = String(input || 'NORMAL')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');

  return (OSP_EVENT_MODES as readonly string[]).includes(normalized)
    ? (normalized as OspEventMode)
    : 'NORMAL';
}
