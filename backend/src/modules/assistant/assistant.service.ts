import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const db = prisma as any;

function getUserId(user: any) {
  return user?.id || user?.sub || user?.userId || null;
}

function getRole(user: any) {
  return user?.primaryRole || user?.role || 'UNKNOWN';
}

function safeArray(value: any) {
  return Array.isArray(value) ? value : [];
}

async function safeFindMany(modelName: string, args: any = {}) {
  try {
    const model = db?.[modelName];
    if (!model?.findMany) return [];
    return await model.findMany(args);
  } catch {
    return [];
  }
}

async function safeCount(modelName: string, args: any = {}) {
  try {
    const model = db?.[modelName];
    if (!model?.count) return 0;
    return await model.count(args);
  } catch {
    return 0;
  }
}

function normalizeEventType(event: any) {
  return String(
    event?.eventType ||
      event?.qrEventType ||
      event?.type ||
      event?.scanType ||
      event?.checkpointEventType ||
      ''
  ).toUpperCase();
}

@Injectable()
export class AssistantService {
  async getTravelerContext(user: any) {
    const userId = getUserId(user);

    if (!userId) {
      return {
        ok: false,
        source: 'AUTH_CONTEXT',
        reason: 'AUTH_USER_MISSING',
        message: 'Authenticated user context is required.',
      };
    }

    const trips = safeArray(
      await safeFindMany('trip', {
        where: { travelerUserId: userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    );

    const latestTrip = trips[0] || null;

    const passes = safeArray(
      await safeFindMany('ospPass', {
        where: latestTrip?.id ? { tripId: latestTrip.id } : undefined,
        take: 5,
      }),
    );

    const qrCredentials = safeArray(
      await safeFindMany('qrCredential', {
        where: passes[0]?.id ? { passId: passes[0].id } : undefined,
        take: 5,
      }),
    );

    const bookings = safeArray(
      await safeFindMany('booking', {
        where: latestTrip?.id ? { tripId: latestTrip.id } : undefined,
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    );

    const paymentStates = safeArray(
      await safeFindMany('paymentStateRecord', {
        where: bookings[0]?.id ? { bookingId: bookings[0].id } : undefined,
        take: 5,
      }),
    );

    const paymentIntents = safeArray(
      await safeFindMany('paymentIntent', {
        where: bookings[0]?.id ? { bookingId: bookings[0].id } : undefined,
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    );

    const manifests = safeArray(
      await safeFindMany('manifestSubmission', {
        where: latestTrip?.id ? { tripId: latestTrip.id } : undefined,
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    );

    const qrEvents = [
      ...safeArray(await safeFindMany('qrEvent', { orderBy: { createdAt: 'desc' }, take: 25 })),
      ...safeArray(await safeFindMany('ospQrEvent', { orderBy: { createdAt: 'desc' }, take: 25 })),
    ];

    const travelerQrEvents = qrEvents.filter((event: any) => {
      const actor =
        event?.actorUserId ||
        event?.userId ||
        event?.travelerUserId ||
        event?.scannedUserId;
      return !actor || actor === userId;
    });

    const ingressCount = travelerQrEvents.filter((event: any) =>
      normalizeEventType(event).includes('INGRESS'),
    ).length;

    const egressCount = travelerQrEvents.filter((event: any) =>
      normalizeEventType(event).includes('EGRESS'),
    ).length;

    const stamps = safeArray(
      await safeFindMany('spmTravelerStamp', {
        where: { travelerUserId: userId },
        orderBy: { stampedAt: 'desc' },
        take: 10,
      }),
    );

    const trailProgress = safeArray(
      await safeFindMany('spmTravelerTrailProgress', {
        where: { travelerUserId: userId },
        orderBy: { updatedAt: 'desc' },
        take: 10,
      }),
    );

    const returnContinuityState =
      egressCount >= 2
        ? 'SECOND_EGRESS_RETURN_COMPLETED'
        : egressCount >= 1 && ingressCount >= 2
          ? 'SECOND_INGRESS_RETURN_ACTIVE'
          : egressCount >= 1
            ? 'FIRST_TRIP_COMPLETED_BY_EGRESS'
            : ingressCount >= 1
              ? 'FIRST_TRIP_ACTIVE'
              : 'NO_VERIFIED_HISTORY';

    return {
      ok: true,
      source: 'DB_READ_ONLY_SCHEMA_SAFE',
      assistantScope: 'TRAVELER_CONTEXT',
      user: {
        id: userId,
        role: getRole(user),
      },
      tripLifecycle: {
        returnContinuityState,
        totalVisibleTrips: trips.length,
        ingressEventCount: ingressCount,
        egressEventCount: egressCount,
        doctrine:
          'First ingress starts the journey. First egress saves it. Second ingress activates return mode. Second egress completes the return milestone.',
      },
      latestTrip: latestTrip
        ? {
            id: latestTrip.id,
            tripTitle: latestTrip.tripTitle || null,
            tripStatus: latestTrip.tripStatus || null,
            clearanceStatus: latestTrip.clearanceStatus || null,
            arrivalDate: latestTrip.arrivalDate || null,
            departureDate: latestTrip.departureDate || null,
            originLocation: latestTrip.originLocation || null,
            declaredAccommodationName: latestTrip.declaredAccommodationName || null,
          }
        : null,
      passAndQr: {
        visiblePassCount: passes.length,
        latestPassStatus: passes[0]?.passStatus || null,
        hasQrCredential: qrCredentials.length > 0,
        qrVersion: qrCredentials[0]?.qrVersion || null,
      },
      bookingPaymentManifest: {
        visibleBookingCount: bookings.length,
        latestBookingStatus: bookings[0]?.bookingStatus || null,
        latestPaymentState: paymentStates[0]?.state || null,
        latestPaymentIntentStatus: paymentIntents[0]?.status || null,
        visibleManifestSubmissionCount: manifests.length,
        latestManifestStatus: manifests[0]?.submissionStatus || manifests[0]?.status || null,
      },
      spmProgress: {
        recentStampCount: stamps.length,
        recentTrailProgressCount: trailProgress.length,
        recentStamps: stamps.map((stamp: any) => ({
          stampId: stamp.id,
          stampStatus: stamp.stampStatus || stamp.status || null,
          stampedAt: stamp.stampedAt || null,
          trailNodeId: stamp.trailNodeId || null,
          trailFamilyId: stamp.trailFamilyId || null,
        })),
        trailProgress: trailProgress.map((progress: any) => ({
          progressId: progress.id,
          trailFamilyId: progress.trailFamilyId || null,
          progressStatus: progress.progressStatus || progress.status || null,
          completedNodeCount: progress.completedNodeCount || 0,
          totalNodeCount: progress.totalNodeCount || 0,
          updatedAt: progress.updatedAt || null,
        })),
      },
      guardrails: [
        'Assistant must not approve clearance.',
        'Assistant must not issue passes.',
        'Assistant must not override payment.',
        'Assistant must not approve manifests.',
        'Assistant must not invent booking records.',
        'Assistant must not invent QR, ingress, egress, or stamp records.',
        'Assistant must explain visible DB context and guide the traveler to the correct OSP screen.',
      ],
    };
  }

  async getKnowledgeSpine(user: any) {
    const trailFamilies = safeArray(await safeFindMany('spmTrailFamily', { take: 50 }));
    const trailNodes = safeArray(await safeFindMany('spmTrailNode', { take: 300 }));
    const packages = safeArray(await safeFindMany('spmTrailPackage', { take: 100 }));
    const pricingRules = safeArray(await safeFindMany('spmPricingRule', { take: 100 }));
    const addOns = safeArray(await safeFindMany('spmAddOn', { take: 100 }));
    const languagePackCount = await safeCount('languagePack');
    const fxSnapshotCount = await safeCount('fxDisplaySnapshot');

    const nodesByFamily = trailNodes.reduce((acc: Record<string, any[]>, node: any) => {
      const key = node.trailFamilyId || 'UNASSIGNED';
      acc[key] = acc[key] || [];
      acc[key].push({
        nodeId: node.id,
        nodeCode: node.nodeCode || null,
        nodeName: node.nodeName || null,
        nodeStatus: node.nodeStatus || node.status || null,
        stampEligible: Boolean(node.stampEligible),
        trailTrackId: node.trailTrackId || null,
      });
      return acc;
    }, {});

    return {
      ok: true,
      source: 'DB_AND_LOCKED_DOCTRINE_READ_ONLY',
      assistantScope: 'OSP_SPM_KNOWLEDGE_SPINE',
      user: {
        role: getRole(user),
      },
      spineCoverage: {
        ospCore: true,
        travelerTripLifecycle: true,
        ingressEgressQr: true,
        passAndQrCredential: true,
        bookingPaymentManifest: true,
        spmPassportTrails: true,
        partnerLedTours: true,
        passportTrailsCuratedTours: true,
        diyTourLedActivities: true,
        spmTrailNodes: true,
        spmStampsAndProgress: true,
        returnTravelerContinuity: true,
        pricingAndAddOns: true,
        languageAndFx: true,
        safetyAndCompliance: true,
        emergencySafety: true,
        siargaoTourismAndGlobalAccess: true,
        kuyaTalaPersona: true,
        operatorLedToursOperation:
          'FUTURE_KB_ADDITION_ONLY_WHEN_OPERATORS_SUBMIT_APPROVED_TOURS_LED_TOURS_OPERATION',
      },
      doctrine: {
        product: 'One Siargao Pass / Siargao Passport Map',
        assistantPersona: {
          name: 'Kuya Tala™',
          title: 'Your Siargao Journey Guide',
          positioning:
            'Kuya Tala™ is the trusted One Siargao Pass assistant that helps travelers understand trip readiness, QR/pass status, Passport Trails, verified stops, payments, and responsible movement across Siargao.',
          tone:
            'Calm local guide plus digital readiness assistant. Warm and Filipino-familiar, but not clownish, not overly casual, not comedic, and not a generic travel mascot.',
        },
        assistantRole:
          'Traveler trip-success SME for OSP, SPM, Passport Trails, partner-led tours, Passport Trails™ Curated Tours, Build Your Own / DIY tour-led activities, QR, stamps, payments, pass readiness, manifest/compliance basics, Siargao tourism planning, global access guidance, return continuity, and safe next actions.',
        answerBoundary:
          'The assistant can explain, guide, and summarize visible records. It cannot mutate official state or invent missing records.',
        hardLimits: [
          'Cannot approve DOT/LGU clearance.',
          'Cannot issue OSP Pass.',
          'Cannot mark payment as paid.',
          'Cannot create, confirm, or cancel bookings.',
          'Cannot approve or submit manifests.',
          'Cannot assign guides or operators.',
          'Cannot unlock Passport Stamps without governed QR/stamp events.',
          'Cannot claim rewards, perks, or return traveler completion without governed records.',
          'Cannot advise bypassing QR, manifest, payment, operator, safety, vessel, or compliance rules.',
          'Cannot confirm live routes, fares, schedules, weather, advisories, or entry rules without verified data source.',
          'Cannot claim emergency responders were notified, dispatched, received, acknowledged, or en route unless backend incident records prove it.',
          'Cannot replace local emergency services, nearby authorities, medical responders, coast guard, police, accommodation staff, or LGU responders.',
        ],
      },
      knowledgeDomains: {
        ospCore: [
          'OSP is the traveler trip, pass, QR, compliance, payment, and manifest operating layer.',
          'Booking, payment, pass, QR, and manifest states must come from backend records.',
        ],
        spmCore: [
          'SPM is the journey map and Passport Trails layer inside OSP.',
          'SPM progress depends on governed trail families, nodes, stamps, QR events, and traveler progress records.',
        ],
        passportTrails: [
          'Official trail families and nodes are DB-governed where available.',
          'Stamp eligibility must come from approved trail node records.',
          'Presentation/candidate nodes must not be treated as active completion truth.',
          'Passport Trails are a governed SPM route/progression layer, not a generic tour marketplace.',
        ],
        partnerLedTours: [
          'Partner-led tours are traveler-facing experiences operated by approved local partners.',
          'The assistant may explain partner-led tour concepts only when approved partner/operator records or approved static product doctrine exist.',
          'Partner-led tour guidance must remain separate from SPM-curated Passport Trails and DIY trail-building logic.',
          'The assistant must not imply a partner tour is live, bookable, stamp-eligible, guide-assigned, or operationally confirmed unless backend records prove it.',
        ],
        passportTrailsCuratedTours: [
          'Passport Trails™ Curated Tours are official trail experiences curated around governed SPM trail logic.',
          'They may connect multiple verified stops into a structured journey, but completion still depends on governed QR/stamp validation.',
          'The assistant may help travelers understand which curated trail fits their interests, but must not claim live availability, pricing, inclusions, or operator assignment unless records prove it.',
          'Curated Tours must preserve the separation between journey guidance, commercial booking, QR validation, and stamp completion.',
        ],
        diyTourLedActivities: [
          'Build Your Own Passport Trail / DIY tour-led activities allow travelers to shape a personal trail route with SPM guidance.',
          'DIY does not mean unmanaged, unsafe, or automatically stampable.',
          'Where transport, boat, guide, operator, environmental, safety, or local access rules are required, the assistant must direct the traveler toward governed partner/operator support.',
          'The assistant may suggest planning structure, route logic, readiness checks, and responsible movement, but must not invent guide assignments, operator confirmations, prices, or QR/stamp completions.',
        ],
        qrAndStampRules: [
          'QR events are governed records.',
          'Passport Stamps require governed QR/stamp validation.',
          'The assistant may explain stamp rules but cannot create stamp events.',
        ],
        returnContinuity: [
          'First ingress starts the first journey.',
          'First egress saves the first journey into historical memory.',
          'Second ingress activates Welcome Back / Return Journey Active.',
          'Second egress completes Second Trip Return Explorer.',
          'No return traveler milestone is completed from page viewing alone.',
        ],
        siargaoTourismAndGlobalAccess: [
          'Siargao should be presented as one of the Philippines’ most recognized island tourism destinations, known for surf culture, island hopping, lagoons, coastal scenery, local communities, food, nature, and slow-island travel.',
          'The assistant may promote Siargao positively as a high-value Philippine destination, but must avoid fake rankings, exaggerated awards, or unsupported claims.',
          'The assistant should explain global access as a pathway: international origin to a Philippine gateway, then onward domestic air or sea access toward Siargao depending on available travel options.',
          'Common planning logic is: fly into the Philippines through a major gateway, connect to Siargao when available, or use a nearby regional gateway and continue by sea/land where applicable.',
          'The assistant must not claim live airline schedules, ferry schedules, ticket prices, immigration rules, weather, road conditions, or route availability unless a verified data source is connected.',
          'For international travelers, the assistant should guide them to check current flights, ferries, entry requirements, and weather advisories before finalizing plans.',
          'The assistant should connect tourism guidance back to OSP and SPM: use One Siargao Pass for trip readiness, Passport Map for journey planning, Passport Trails for verified experiences, and QR/stamp logic for governed progress.',
          'The assistant must encourage responsible tourism, community respect, environmental care, safety compliance, and operator-backed experiences where required.',
        ],
        bookingPaymentManifest: [
          'Payment state must come from payment records.',
          'Manifest and clearance states must come from backend records.',
          'The assistant can explain next steps but cannot override operational state.',
        ],
        emergencySafety: [
          'Emergency & Safety is a traveler safety-readiness surface, not a live dispatch system in Phase 1.',
          'Kuya Tala™ can help travelers find their trip details, OSP Pass, QR status, accommodation declaration, payment/booking context, and safety guidance.',
          'For immediate danger, the traveler should contact local emergency services, nearby authorities, accommodation staff, or trusted local contacts directly.',
          'The assistant must not claim help is coming, responders are notified, or an emergency case is created unless backend SafetyIncident and notification records prove it.',
          'Emergency notification workflows require backend incident records, escalation targets, notification attempts, acknowledgement states, and admin/LGU receiving surfaces before activation.',
          'Emergency guidance must be calm, direct, and safety-first. It must not sound casual, comedic, or mascot-like.',
        ],
        safetyAndOperatorControls: [
          'Adventure, island, vessel, cave, lagoon, and partner-led activities require safety and operator governance.',
          'Guide/operator assignment must not be implied unless backend records prove it.',
        ],
        languageAndFx: [
          'Language packs control traveler-facing translations.',
          'FX display is informational for traveler display where available; PHP remains the settlement source of truth unless future doctrine changes.',
        ],
        futureOperatorLedToursKbAddition: [
          'The only planned KB addition path is approved operator-submitted Tours Led Tours operation knowledge.',
          'Operator-led tour knowledge must be approved before the assistant treats it as official.',
          'Operator-led tours must include operations rules, safety controls, inclusions/exclusions, cancellation rules, QR/stamp eligibility, and commercial readiness before public assistant exposure.',
        ],
      },
      dbKnowledge: {
        trailFamilies: trailFamilies.map((family: any) => ({
          trailId: family.id,
          trailCode: family.trailCode || null,
          trailSlug: family.trailSlug || null,
          trailName: family.trailName || null,
          trailStatus: family.trailStatus || family.status || null,
          stampEnabled: Boolean(family.stampEnabled),
          nodes: nodesByFamily[family.id] || [],
        })),
        unassignedTrailNodes: nodesByFamily.UNASSIGNED || [],
        packages: packages.map((pkg: any) => ({
          packageId: pkg.id,
          packageCode: pkg.packageCode || null,
          packageName: pkg.packageName || null,
          packageStatus: pkg.packageStatus || pkg.status || null,
          trailFamilyId: pkg.trailFamilyId || null,
        })),
        pricingRulesCount: pricingRules.length,
        addOnsCount: addOns.length,
        languagePackCount,
        fxSnapshotCount,
      },
      responsePolicy: {
        answerStyle:
          'Explain clearly, guide next action, reference visible system state, and disclose when a record is unavailable.',
        simpleGreeting:
          'Hi, I’m Kuya Tala™ — your One Siargao Pass journey guide. I can help you understand your trip readiness, QR/pass status, Passport Trails, verified stops, payments, and responsible movement across Siargao. What would you like help with today?',
        greetingRules: [
          'Use a short, calm, helpful greeting at the start of a new assistant session.',
          'Introduce Kuya Tala™ as the One Siargao Pass journey guide.',
          'Mention the assistant can help with trip readiness, QR/pass status, Passport Trails, verified stops, payments, and responsible movement.',
          'Do not greet with jokes, exaggerated slang, hype, or mascot-style language.',
          'Do not claim the assistant can approve, issue, unlock, book, or confirm anything without backend records.',
        ],
        personaStyle:
          'Speak as Kuya Tala™: warm, calm, useful, locally familiar, and readiness-focused. Avoid jokes, exaggerated slang, mascot behavior, and overpromising.',
        fallback:
          'If DB context is missing, say the assistant cannot confirm that item yet and guide the traveler to the correct OSP screen.',
        noHallucination:
          'Never fill missing DB records with assumptions. Missing record means not confirmed.',
        tourLaneSeparation:
          'Keep Partner-led Tours, Passport Trails™ Curated Tours, and Build Your Own / DIY tour-led activities clearly separated. Never merge availability, pricing, stamp eligibility, or operator confirmation across lanes.',
        tourismAccessAccuracy:
          'Siargao tourism promotion is allowed, but live routes, schedules, fares, weather, advisories, and entry rules require verified sources before confirmation.',
        emergencySafetyAccuracy:
          'Emergency guidance is allowed, but live dispatch, responder notification, location sharing, case creation, acknowledgement, and incident status require backend proof before confirmation.',
      },
    };
  }
  async handleChatMessage(user: any, body: any) {
    const userId = getUserId(user);
    const message = String(body?.message || '').trim();
    const source = String(body?.source || 'traveler-assistant').trim();

    if (!message) {
      return {
        ok: false,
        source: 'KUYA_TALA_CHAT_ENDPOINT',
        reason: 'MESSAGE_REQUIRED',
        message: 'Please enter a question for Kuya Tala™.',
      };
    }

    const [travelerContext, knowledgeSpine] = await Promise.all([
      this.getTravelerContext(user),
      this.getKnowledgeSpine(user),
    ]);

    return {
      ok: true,
      source: 'KUYA_TALA_CHAT_ENDPOINT_PHASE_1',
      runtimeMode: 'DETERMINISTIC_READ_ONLY_NO_LLM',
      assistant: {
        name: 'Kuya Tala™',
        title: 'Your Siargao Journey Guide',
      },
      received: {
        userId,
        source,
        message,
      },
      response: {
        greeting:
          knowledgeSpine?.responsePolicy?.simpleGreeting ||
          'Hi, I’m Kuya Tala™ — your One Siargao Pass journey guide.',
        answer:
          'I can guide you using your visible OSP/SPM context and the approved knowledge spine. Full AI-generated answers will be activated in Phase 2 after retrieval, moderation, and approved KB ingestion are in place.',
        nextActions: [
          'Check Pass / QR status',
          'Open Passport Map',
          'Review Passport Trails',
          'Check Trip Status',
          'Review Payment Status',
        ],
        limits: [
          'I cannot approve clearance.',
          'I cannot issue passes.',
          'I cannot mark payment as paid.',
          'I cannot unlock stamps without governed QR/stamp records.',
          'I cannot treat submitted KB as official until approved.',
        ],
      },
      context: travelerContext,
      knowledgeCoverage: knowledgeSpine?.spineCoverage || {},
    };
  }

}
