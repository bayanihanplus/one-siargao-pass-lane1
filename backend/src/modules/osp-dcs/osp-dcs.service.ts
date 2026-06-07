import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  GENERAL_LUNA_AUTHORITY_CONTEXT,
  GENERAL_LUNA_PORT_CODE,
  GENERAL_LUNA_TIMEZONE,
  GL_BOAT_CLASS_RULES,
  GL_CLASSIC_JOINER_DEFAULT_FULFILLMENT_CATEGORY,
  GL_CLASSIC_JOINER_DEPARTURE_SLOTS,
  GL_CLASSIC_JOINER_FIXED_PRICE_PHP,
  GL_DAILY_DEPARTURE_SLOTS,
  GL_ROUTE_BOAT_CLASS_RULES,
  buildGeneralLunaTripNumber,
  getGeneralLunaRouteProduct,
  listGeneralLunaDepartureSchedules,
  listGeneralLunaJoinerDepartureSchedules,
  listGeneralLunaRouteProducts,
} from './domain';

@Injectable()
export class OspDcsService {
  constructor(private readonly prisma: PrismaService) {}
  getGeneralLunaRegistry() {
    return {
      port: {
        portCode: GENERAL_LUNA_PORT_CODE,
        portName: 'General Luna Port',
        authorityContext: GENERAL_LUNA_AUTHORITY_CONTEXT,
        timezone: GENERAL_LUNA_TIMEZONE,
        supportsDcs: true,
        supportsInterIsland: true,
      },
      joinerDoctrine: {
        routeProductCode: 'GL_TRI_ISLAND_STANDARD',
        fixedPricePhp: GL_CLASSIC_JOINER_FIXED_PRICE_PHP,
        allowedDepartureSlots: GL_CLASSIC_JOINER_DEPARTURE_SLOTS,
        defaultFulfillmentCategory: GL_CLASSIC_JOINER_DEFAULT_FULFILLMENT_CATEGORY,
        pricingInvariant:
          'Classic Tri-Island Joiner is fixed per paid traveler and must never be priced from boat class.',
      },
      dailyDepartureSlots: GL_DAILY_DEPARTURE_SLOTS,
      routeProducts: listGeneralLunaRouteProducts(),
      boatClassRules: GL_BOAT_CLASS_RULES,
      routeBoatClassRules: GL_ROUTE_BOAT_CLASS_RULES,
    };
  }

  getGeneralLunaRouteProduct(routeProductCode: string) {
    const route = getGeneralLunaRouteProduct(routeProductCode);

    if (!route) {
      return {
        ok: false,
        error: 'UNSUPPORTED_GENERAL_LUNA_ROUTE_PRODUCT',
        routeProductCode,
      };
    }

    return {
      ok: true,
      route,
      departureSchedules: listGeneralLunaDepartureSchedules(route.routeProductCode),
      joinerDepartureSchedules:
        route.routeProductCode === 'GL_TRI_ISLAND_STANDARD'
          ? listGeneralLunaJoinerDepartureSchedules()
          : [],
    };
  }

  previewGeneralLunaTripNumber(input: {
    routeProductCode: string;
    departureDate?: string;
    departureTime?: string;
  }) {
    const route = getGeneralLunaRouteProduct(input.routeProductCode);

    if (!route) {
      return {
        ok: false,
        error: 'UNSUPPORTED_GENERAL_LUNA_ROUTE_PRODUCT',
        routeProductCode: input.routeProductCode,
      };
    }

    const departureDate = input.departureDate || new Date().toISOString().slice(0, 10);
    const departureTime = input.departureTime || '07:00';

    return {
      ok: true,
      routeProductCode: route.routeProductCode,
      departureDate,
      departureTime,
      tripNumber: buildGeneralLunaTripNumber({
        routeProductCode: route.routeProductCode,
        departureDateYYYYMMDD: departureDate,
        departureTimeHHmm: departureTime,
      }),
    };
  }

  async previewGeneralLunaScheduledTrips(input: { departureDate?: string }) {
    const departureDate = input.departureDate || new Date().toISOString().slice(0, 10);

    const dbProjection = await this.getGeneralLunaBoardDbProjection({ departureDate });
    const dbTrips = Array.isArray((dbProjection as any).trips) ? (dbProjection as any).trips : [];
    if (dbProjection.ok && dbTrips.length > 0) {
      return dbProjection;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(departureDate)) {
      return {
        ok: false,
        error: 'INVALID_DEPARTURE_DATE',
        departureDate,
      };
    }

    const toHHmm = (slot: string) => {
      const [rawTime, meridiem] = slot.split(' ');
      const [rawHour, minute] = rawTime.split(':');
      let hour = Number(rawHour);

      if (meridiem === 'PM' && hour !== 12) hour += 12;
      if (meridiem === 'AM' && hour === 12) hour = 0;

      return `${String(hour).padStart(2, '0')}:${minute}`;
    };

    const routeProducts = listGeneralLunaRouteProducts();

    const trips = routeProducts.flatMap((route) =>
      listGeneralLunaDepartureSchedules(route.routeProductCode).map((schedule) => {
        const departureTimeHHmm = toHHmm(schedule.departureTimeLocal);

        return {
          tripNumber: buildGeneralLunaTripNumber({
            routeProductCode: route.routeProductCode,
            departureDateYYYYMMDD: departureDate,
            departureTimeHHmm,
          }),
          routeProductCode: route.routeProductCode,
          routeName: route.routeName,
          routeShortName: route.routeShortName,
          portCode: route.portCode,
          departureDate,
          departureTimeLocal: schedule.departureTimeLocal,
          departureTimeHHmm,
          pricingMode: route.pricingMode,
          bookabilityStatus: route.bookabilityStatus,
          instantBookingEnabled: route.instantBookingEnabled,
          requestToConfirmRequired: route.requestToConfirmRequired,
          requiresOperatorAssignment: route.requiresOperatorAssignment,
          requiresVesselAssignment: route.requiresVesselAssignment,
          requiresManifest: route.requiresManifest,
          requiresBoardingQr: route.requiresBoardingQr,
          dcsState: 'SCHEDULED',
          paymentStatus: 'NOT_BOOKED',
          voucherStatus: 'NOT_ISSUED',
          assignmentStatus: 'NOT_ASSIGNED',
          boardingQrStatus: 'NOT_ISSUED',
          manifestStatus: 'NOT_OPEN',
          bookedPaxCount: 0,
          boardedPaxCount: 0,
          sensitiveDataHidden: true,
        };
      }),
    );

    return {
      ok: true,
      portCode: GENERAL_LUNA_PORT_CODE,
      departureDate,
      totalTrips: trips.length,
      displayMode: 'ADMIN_PREVIEW',
      dataSource: 'DCS_REGISTRY_PREVIEW_NOT_LIVE_BOARD',
      trips,
    };
  }



  async getGeneralLunaBoardDbProjection(input: { departureDate?: string }) {
    const requestedDate = input.departureDate || new Date().toISOString().slice(0, 10);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
      return {
        ok: false,
        error: 'INVALID_DEPARTURE_DATE',
        departureDate: requestedDate,
      };
    }

    const nearestDateRows = await this.prisma.$queryRawUnsafe<Array<{ departureDate: Date }>>(
      `
      SELECT st."departureDate"::date AS "departureDate"
      FROM "OspScheduledTrip" st
      WHERE st."portCode" IN ('GENERAL_LUNA', 'GENERAL_LUNA_PORT')
      GROUP BY st."departureDate"::date
      ORDER BY
        CASE
          WHEN st."departureDate"::date = $1::date THEN 0
          WHEN st."departureDate"::date > $1::date THEN 1
          ELSE 2
        END,
        CASE
          WHEN st."departureDate"::date >= $1::date THEN st."departureDate"::date - $1::date
          ELSE $1::date - st."departureDate"::date
        END ASC,
        st."departureDate"::date DESC
      LIMIT 1
      `,
      requestedDate,
    );

    const departureDate =
      nearestDateRows[0]?.departureDate instanceof Date
        ? nearestDateRows[0].departureDate.toISOString().slice(0, 10)
        : requestedDate;

    type DbTripRow = {
      id: string;
      tripNumber: string;
      routeProductCode: string;
      routeName: string | null;
      routeShortName: string | null;
      portCode: string;
      departureDate: Date;
      departureTime: string;
      boatClassCode: string | null;
      tripStatus: string;
      bookedPaxCount: number | bigint | null;
      boardedPaxCount: number | bigint | null;
      voucherStatus: string | null;
      assignmentStatus: string | null;
      boardingQrStatus: string | null;
      manifestStatus: string | null;
      movementStatus: string | null;
    };

    const rows = await this.prisma.$queryRawUnsafe<DbTripRow[]>(
      `
      SELECT
        st."id",
        st."tripNumber",
        st."routeProductCode",
        rp."name" AS "routeName",
        rp."name" AS "routeShortName",
        st."portCode",
        st."departureDate",
        st."departureTime",
        st."boatClassCode",
        st."status" AS "tripStatus",
        COALESCE(SUM(tb."paxTotalCount"), 0)::int AS "bookedPaxCount",
        COALESCE(MAX(tm."paxBoarded"), 0)::int AS "boardedPaxCount",
        COALESCE(MAX(tv."voucherStatus"), 'AWAITING_PAYMENT') AS "voucherStatus",
        COALESCE(MAX(fa."assignmentStatus"), CASE WHEN st."assignedOperatorId" IS NOT NULL THEN 'ASSIGNED' ELSE 'NOT_ASSIGNED' END) AS "assignmentStatus",
        COALESCE(MAX(tq."qrStatus"), 'NOT_ISSUED') AS "boardingQrStatus",
        COALESCE(MAX(tm."manifestStatus"), 'NOT_CREATED') AS "manifestStatus",
        COALESCE(MAX(mr."movementStatus"), 'NOT_STARTED') AS "movementStatus"
      FROM "OspScheduledTrip" st
      LEFT JOIN "OspRouteProduct" rp ON rp."routeProductCode" = st."routeProductCode"
      LEFT JOIN "OspTourBooking" tb ON tb."scheduledTripId" = st."id"
      LEFT JOIN "OspTourVoucher" tv ON tv."bookingId" = tb."id"
      LEFT JOIN "OspTourBoardingQr" tq ON tq."bookingId" = tb."id"
      LEFT JOIN "OspFulfillmentAssignment" fa ON fa."scheduledTripId" = st."id"
      LEFT JOIN "OspTourManifest" tm ON tm."scheduledTripId" = st."id"
      LEFT JOIN "OspTourMovementRecord" mr ON mr."scheduledTripId" = st."id"
      WHERE st."portCode" IN ('GENERAL_LUNA', 'GENERAL_LUNA_PORT')
        AND st."departureDate"::date = $1::date
      GROUP BY
        st."id",
        st."tripNumber",
        st."routeProductCode",
        rp."name",
        st."portCode",
        st."departureDate",
        st."departureTime",
        st."boatClassCode",
        st."status",
        st."assignedOperatorId"
      ORDER BY st."departureTime" ASC, st."tripNumber" ASC
      LIMIT 12
      `,
      departureDate,
    );

    const normalizeCount = (value: number | bigint | null) =>
      typeof value === 'bigint' ? Number(value) : value || 0;

    const toPublicState = (row: DbTripRow) => {
      if (row.movementStatus === 'DEPARTED' || row.tripStatus === 'DEPARTED') return 'DEPARTED';
      if (row.tripStatus === 'CANCELLED') return 'CANCELLED';
      if (row.tripStatus === 'BOARDING_NOW') return 'BOARDING_NOW';
      if (row.tripStatus === 'BOARDING_SOON') return 'BOARDING_SOON';
      if (row.tripStatus === 'CLEARED_FOR_DEPARTURE') return 'DEPARTING';
      if (row.tripStatus === 'DELAY_WATCH' || row.tripStatus === 'BOARDING_HOLD' || row.tripStatus === 'DELAYED' || row.tripStatus === 'HELD') return 'DELAY_WATCH';
      if (row.manifestStatus === 'CREATED' || row.manifestStatus === 'OPEN') return 'BOARDING_NOW';
      if (row.boardingQrStatus === 'ISSUED' || row.boardingQrStatus === 'ACTIVE') return 'BOARDING_SOON';
      return 'SCHEDULED';
    };

    return {
      ok: true,
      portCode: 'GENERAL_LUNA_PORT',
      departureDate,
      totalTrips: rows.length,
      displayMode: rows.length ? 'DB_OPERATING_PROJECTION' : 'REGISTRY_PREVIEW_FALLBACK',
      dataSource: rows.length ? 'DCS_DB_OPERATING_SPINE' : 'DCS_REGISTRY_PREVIEW_NOT_LIVE_BOARD',
      trips: rows.map((row) => {
        const dcsState = toPublicState(row);

        return {
          id: row.id,
          tripNumber: row.tripNumber,
          routeProductCode: row.routeProductCode,
          routeName: row.routeName || row.routeProductCode,
          routeShortName: row.routeShortName || row.routeName || row.routeProductCode,
          portCode: row.portCode,
          departureDate,
          departureTimeLocal: row.departureTime,
          departureTimeHHmm: row.departureTime,
          boatClassCode: row.boatClassCode,
          dcsState,
          paymentStatus: row.voucherStatus === 'PAID_VOUCHER_ISSUED' ? 'PAID' : 'PENDING',
          voucherStatus: row.voucherStatus || 'AWAITING_PAYMENT',
          assignmentStatus: row.assignmentStatus || 'NOT_ASSIGNED',
          boardingQrStatus: row.boardingQrStatus || 'NOT_ISSUED',
          manifestStatus: row.manifestStatus || 'NOT_CREATED',
          movementStatus: row.movementStatus || 'NOT_STARTED',
          bookedPaxCount: normalizeCount(row.bookedPaxCount),
          boardedPaxCount: normalizeCount(row.boardedPaxCount),
          sensitiveDataHidden: true,
          sourceLabel: 'DCS_DB_OPERATING_SPINE',
        };
      }),
    };
  }


  async updateGeneralLunaQueueClearance(input: {
    tripNumber: string;
    queueStatus?: string;
    boardingWindowStatus?: string;
    clearanceStatus?: string;
    publicStatus?: string;
    routeNote?: string;
    actorRole?: string;
  }) {
    const tripNumber = (input.tripNumber || '').trim();

    if (!tripNumber) {
      return {
        ok: false,
        error: 'TRIP_NUMBER_REQUIRED',
      };
    }

    const allowedQueueStatuses = new Set([
      'NOT_OPEN',
      'QUEUE_FORMING',
      'BOARDING_SOON',
      'BOARDING_NOW',
      'BOARDING_HOLD',
      'CLEARED_FOR_DEPARTURE',
      'DEPARTED',
      'CLOSED',
    ]);

    const allowedBoardingWindows = new Set([
      'NOT_STARTED',
      'OPEN',
      'PAUSED',
      'CLOSED',
    ]);

    const allowedClearanceStatuses = new Set([
      'PENDING',
      'READY_FOR_REVIEW',
      'CLEARED',
      'HELD_BY_LGU',
      'HELD_BY_WEATHER',
      'HELD_BY_PORT',
      'HELD_BY_OPERATOR',
      'CANCELLED',
    ]);

    const allowedPublicStatuses = new Set([
      'SCHEDULED',
      'BOARDING_SOON',
      'BOARDING_NOW',
      'CLEARED_FOR_DEPARTURE',
      'DEPARTED',
      'DELAY_WATCH',
      'CANCELLED',
    ]);

    const queueStatus = input.queueStatus || 'QUEUE_FORMING';
    const boardingWindowStatus = input.boardingWindowStatus || 'NOT_STARTED';
    const clearanceStatus = input.clearanceStatus || 'READY_FOR_REVIEW';
    const publicStatus = input.publicStatus || this.deriveTripStatusFromQueueClearance({
      queueStatus,
      clearanceStatus,
    });

    if (!allowedQueueStatuses.has(queueStatus)) {
      return { ok: false, error: 'INVALID_QUEUE_STATUS', queueStatus };
    }

    if (!allowedBoardingWindows.has(boardingWindowStatus)) {
      return { ok: false, error: 'INVALID_BOARDING_WINDOW_STATUS', boardingWindowStatus };
    }

    if (!allowedClearanceStatuses.has(clearanceStatus)) {
      return { ok: false, error: 'INVALID_CLEARANCE_STATUS', clearanceStatus };
    }

    if (!allowedPublicStatuses.has(publicStatus)) {
      return { ok: false, error: 'INVALID_PUBLIC_STATUS', publicStatus };
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<{
      id: string;
      tripNumber: string;
      status: string;
      departureDate: Date;
      departureTime: string;
      portCode: string;
    }>>(
      `
      UPDATE "OspScheduledTrip"
      SET "status" = $2,
          "updatedAt" = NOW()
      WHERE "tripNumber" = $1
        AND "portCode" IN ('GENERAL_LUNA', 'GENERAL_LUNA_PORT')
      RETURNING "id", "tripNumber", "status", "departureDate", "departureTime", "portCode"
      `,
      tripNumber,
      publicStatus,
    );

    if (!rows.length) {
      return {
        ok: false,
        error: 'TRIP_NOT_FOUND_OR_NOT_GENERAL_LUNA',
        tripNumber,
      };
    }

    const trip = rows[0];

    return {
      ok: true,
      dataSource: 'DCS_DB_OPERATING_SPINE',
      operation: 'QUEUE_CLEARANCE_UPDATED',
      tripNumber: trip.tripNumber,
      portCode: trip.portCode,
      departureDate: trip.departureDate.toISOString().slice(0, 10),
      departureTime: trip.departureTime,
      publicStatus: trip.status,
      queueStatus,
      boardingWindowStatus,
      clearanceStatus,
      routeNote: input.routeNote || null,
      actorRole: input.actorRole || 'LGU_DOT_STAFF',
      boardProjectionHint: 'GL_BOARD_READS_FROM_OSP_SCHEDULED_TRIP_STATUS',
    };
  }

  private deriveTripStatusFromQueueClearance(input: {
    queueStatus?: string;
    clearanceStatus?: string;
  }) {
    if (input.clearanceStatus === 'CANCELLED') return 'CANCELLED';
    if (
      input.clearanceStatus === 'HELD_BY_LGU' ||
      input.clearanceStatus === 'HELD_BY_WEATHER' ||
      input.clearanceStatus === 'HELD_BY_PORT' ||
      input.clearanceStatus === 'HELD_BY_OPERATOR' ||
      input.queueStatus === 'BOARDING_HOLD'
    ) {
      return 'DELAY_WATCH';
    }
    if (input.queueStatus === 'DEPARTED') return 'DEPARTED';
    if (input.queueStatus === 'CLEARED_FOR_DEPARTURE') return 'CLEARED_FOR_DEPARTURE';
    if (input.queueStatus === 'BOARDING_NOW') return 'BOARDING_NOW';
    if (input.queueStatus === 'BOARDING_SOON') return 'BOARDING_SOON';
    return 'SCHEDULED';
  }


  async generateGeneralLunaDailyTrips(input: {
    departureDate: string;
    dryRun?: boolean;
    routeProductCodes?: string[];
    departureSlots?: string[];
    actorRole?: string;
  }) {
    const departureDate = (input.departureDate || '').trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(departureDate)) {
      return {
        ok: false,
        error: 'INVALID_DEPARTURE_DATE',
        departureDate,
      };
    }

    const routeProducts = [
      {
        routeProductCode: 'GL_TRI_ISLAND_STANDARD',
        routeCode: 'GDN',
        routeName: 'Guyam · Daku · Naked',
        defaultBoatClassCode: 'A',
      },
      {
        routeProductCode: 'GL_GUYAM_DAKU_MAM_ON',
        routeCode: 'GDM',
        routeName: 'Guyam · Daku · Mam-On',
        defaultBoatClassCode: 'B',
      },
      {
        routeProductCode: 'GL_TRI_ISLAND_CORREGIDOR',
        routeCode: 'GDNC',
        routeName: 'Guyam · Daku · Naked · Corregidor',
        defaultBoatClassCode: 'C',
      },
    ];

    const defaultDepartureSlots = [
      '07:00',
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
    ];

    const requestedRouteCodes = new Set(input.routeProductCodes || []);
    const activeRouteProducts = requestedRouteCodes.size
      ? routeProducts.filter((route) => requestedRouteCodes.has(route.routeProductCode))
      : routeProducts;

    const departureSlots = input.departureSlots?.length
      ? input.departureSlots
      : defaultDepartureSlots;

    const validTime = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

    const invalidSlot = departureSlots.find((slot) => !validTime(slot));
    if (invalidSlot) {
      return {
        ok: false,
        error: 'INVALID_DEPARTURE_SLOT',
        departureSlot: invalidSlot,
      };
    }

    if (!activeRouteProducts.length) {
      return {
        ok: false,
        error: 'NO_VALID_ROUTE_PRODUCTS',
        routeProductCodes: input.routeProductCodes || [],
      };
    }

    const generated = activeRouteProducts.flatMap((route) =>
      departureSlots.map((slot) => {
        const hhmm = slot.replace(':', '');
        const serviceNumber = `GL-${route.routeCode}-${hhmm}`;
        const operatingTripId = `DOT-GL-${route.routeCode}-${departureDate.replace(/-/g, '')}-${hhmm}`;

        return {
          serviceNumber,
          tripNumber: operatingTripId,
          routeProductCode: route.routeProductCode,
          routeCode: route.routeCode,
          routeName: route.routeName,
          portCode: 'GENERAL_LUNA_PORT',
          departureDate,
          departureTime: slot,
          boatClassCode: route.defaultBoatClassCode,
          status: 'SCHEDULED',
        };
      }),
    );

    const existingRows = await this.prisma.$queryRawUnsafe<Array<{ tripNumber: string }>>(
      `
      SELECT "tripNumber"
      FROM "OspScheduledTrip"
      WHERE "tripNumber" = ANY($1::text[])
      `,
      generated.map((trip) => trip.tripNumber),
    );

    const existingTripNumbers = new Set(existingRows.map((row) => row.tripNumber));
    const toCreate = generated.filter((trip) => !existingTripNumbers.has(trip.tripNumber));
    const existing = generated.filter((trip) => existingTripNumbers.has(trip.tripNumber));

    if (input.dryRun !== false) {
      return {
        ok: true,
        dryRun: true,
        operation: 'GENERAL_LUNA_DAILY_TRIP_GENERATOR_PREVIEW',
        dataSource: 'DCS_GENERATOR_FOUNDATION',
        departureDate,
        generatedCount: generated.length,
        createCount: toCreate.length,
        existingCount: existing.length,
        serviceNumberDoctrine: 'Service number repeats by route and time; operating trip ID is unique by date.',
        bookingSystemDoctrine: 'Scheduled trips are the DCS operating anchor. Centralized booking modules attach later; this generator does not claim booking centralization is complete.',
        generated,
        existing,
      };
    }

    await this.ensureGeneralLunaRouteProductsForGenerator(activeRouteProducts);

    const created: Array<{
      tripNumber: string;
      serviceNumber: string;
      routeProductCode: string;
      departureTime: string;
    }> = [];

    for (const trip of toCreate) {
      const id = `osp_sched_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

      await this.prisma.$executeRawUnsafe(
        `
        INSERT INTO "OspScheduledTrip" (
          "id",
          "tripNumber",
          "routeProductCode",
          "portCode",
          "departureDate",
          "departureTime",
          "boatClassCode",
          "status",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5::date,
          $6,
          $7,
          $8,
          NOW(),
          NOW()
        )
        `,
        id,
        trip.tripNumber,
        trip.routeProductCode,
        trip.portCode,
        trip.departureDate,
        trip.departureTime,
        trip.boatClassCode,
        trip.status,
      );

      created.push({
        tripNumber: trip.tripNumber,
        serviceNumber: trip.serviceNumber,
        routeProductCode: trip.routeProductCode,
        departureTime: trip.departureTime,
      });
    }

    return {
      ok: true,
      dryRun: false,
      operation: 'GENERAL_LUNA_DAILY_TRIPS_GENERATED',
      dataSource: 'DCS_GENERATOR_FOUNDATION',
      departureDate,
      generatedCount: generated.length,
      createdCount: created.length,
      existingCount: existing.length,
      actorRole: input.actorRole || 'LGU_DOT_STAFF',
      serviceNumberDoctrine: 'Service number repeats by route and time; operating trip ID is unique by date.',
      bookingSystemDoctrine: 'Scheduled trips are the DCS operating anchor. Centralized booking modules attach later; this generator does not claim booking centralization is complete.',
      created,
      existing,
    };
  }


  private async ensureGeneralLunaRouteProductsForGenerator(routeProducts: Array<{
    routeProductCode: string;
    routeName: string;
  }>) {
    for (const route of routeProducts) {
      const existingRows = await this.prisma.$queryRawUnsafe<Array<{ id: string }>>(
        `
        SELECT "id"
        FROM "OspRouteProduct"
        WHERE "routeProductCode" = $1
        LIMIT 1
        `,
        route.routeProductCode,
      );

      if (existingRows.length) {
        await this.prisma.$executeRawUnsafe(
          `
          UPDATE "OspRouteProduct"
          SET "name" = $2,
              "portCode" = 'GENERAL_LUNA_PORT',
              "pricingMode" = COALESCE(NULLIF("pricingMode", ''), 'DCS_SCHEDULE_TEMPLATE'),
              "instantBookingMode" = COALESCE(NULLIF("instantBookingMode", ''), 'REQUEST_TO_CONFIRM'),
              "isActive" = true,
              "updatedAt" = NOW()
          WHERE "routeProductCode" = $1
          `,
          route.routeProductCode,
          route.routeName,
        );
        continue;
      }

      await this.prisma.$executeRawUnsafe(
        `
        INSERT INTO "OspRouteProduct" (
          "id",
          "routeProductCode",
          "name",
          "portCode",
          "pricingMode",
          "authorityContext",
          "isActive",
          "instantBookingMode",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          $1,
          $2,
          $3,
          'GENERAL_LUNA_PORT',
          'DCS_SCHEDULE_TEMPLATE',
          'GENERAL_LUNA_LGU_DOT_GOVERNANCE_LAYER',
          true,
          'REQUEST_TO_CONFIRM',
          NOW(),
          NOW()
        )
        `,
        `osp_route_${route.routeProductCode.toLowerCase()}`,
        route.routeProductCode,
        route.routeName,
      );
    }
  }

}
