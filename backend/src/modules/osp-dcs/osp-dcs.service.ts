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
      if (row.tripStatus === 'DELAYED' || row.tripStatus === 'HELD') return 'DELAY_WATCH';
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

}
