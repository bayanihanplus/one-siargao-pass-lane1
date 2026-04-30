import { randomUUID } from 'crypto';

type PrismaLike = {
  ospPass: {
    findUnique: Function;
    create: Function;
  };
};

export type OspPassBootstrapSource =
  | 'traveler_registration_bootstrap'
  | 'api_trip_create'
  | 'ota_api_trip_intake'
  | 'manual_admin_issue';

export async function ensureOspPassForTrip(
  prisma: PrismaLike,
  input: {
    tripId: string;
    travelerUserId?: string | null;
    expiresAt?: Date | null;
    source: OspPassBootstrapSource;
    metadataJson?: Record<string, any>;
  },
) {
  const existing = await prisma.ospPass.findUnique({
    where: { tripId: input.tripId },
    include: { qrCredential: true },
  });

  if (existing) {
    return existing;
  }

  const now = new Date();
  const expiresAt =
    input.expiresAt ?? new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30);
  const passCode = `OSP-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;
  const qrToken = `OSPQR-${randomUUID()}`;
  const backupCode = `BK-${randomUUID().slice(0, 12).toUpperCase()}`;

  return prisma.ospPass.create({
    data: {
      tripId: input.tripId,
      passCode,
      expiresAt,
      qrCredential: {
        create: {
          qrToken,
        },
      },
      backupCodes: {
        create: [
          {
            backupCode,
          },
        ],
      },
      offlinePayloads: {
        create: [
          {
            payloadVersion: 1,
            payloadJson: {
              userId: input.travelerUserId ?? null,
              tripId: input.tripId,
              passCode,
              issuedAt: now.toISOString(),
              expiresAt: expiresAt.toISOString(),
              source: input.source,
              ...(input.metadataJson ?? {}),
            },
            expiresAt,
          },
        ],
      },
    },
    include: {
      qrCredential: true,
    },
  });
}
