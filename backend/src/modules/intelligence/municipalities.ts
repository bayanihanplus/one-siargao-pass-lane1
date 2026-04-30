export const SIARGAO_MUNICIPALITIES = [
  'ALL_SIARGAO',
  'BURGOS',
  'DAPA',
  'DEL_CARMEN',
  'GENERAL_LUNA',
  'PILAR',
  'SAN_BENITO',
  'SAN_ISIDRO',
  'SANTA_MONICA',
  'SOCORRO',
] as const;

export type SiargaoMunicipality = typeof SIARGAO_MUNICIPALITIES[number];

export function normalizeMunicipality(input?: string): SiargaoMunicipality {
  const normalized = String(input || 'ALL_SIARGAO')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');

  return (SIARGAO_MUNICIPALITIES as readonly string[]).includes(normalized)
    ? (normalized as SiargaoMunicipality)
    : 'ALL_SIARGAO';
}
