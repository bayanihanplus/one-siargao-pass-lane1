export function getPreferredTravelerTrip<T extends { pass?: any }>(rows: T[]): T | null {
  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  return rows.find((trip) => Boolean(trip?.pass)) || rows[0] || null;
}
