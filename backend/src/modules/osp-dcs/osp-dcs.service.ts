import { Injectable } from '@nestjs/common';
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

  previewGeneralLunaScheduledTrips(input: { departureDate?: string }) {
    const departureDate = input.departureDate || new Date().toISOString().slice(0, 10);

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


}
