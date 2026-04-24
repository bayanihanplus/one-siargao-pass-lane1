const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const trailFamilies = [
  {
    code: 'ISLAND_HOPPING',
    name: 'Island Hopping Trail',
    description: 'Flagship marine and island route covering approved island-hopping stops.',
    publicLabel: 'Island Hopping Trail',
    officialSortOrder: 1,
  },
  {
    code: 'SURF_EXPLORER',
    name: 'Surf Explorer Trail',
    description: 'Surf culture, surf discovery, and surf participation progression route.',
    publicLabel: 'Surf Explorer Trail',
    officialSortOrder: 2,
  },
  {
    code: 'NORTH_SIARGAO',
    name: 'North Siargao Trail',
    description: 'Northern overland route covering approved scenic, beach, and nature stops.',
    publicLabel: 'North Siargao Trail',
    officialSortOrder: 3,
  },
  {
    code: 'INLAND_DISCOVERY',
    name: 'Inland Discovery Trail',
    description: 'Inland river, lagoon access, scenic corridor, and eco-discovery route.',
    publicLabel: 'Inland Discovery Trail',
    officialSortOrder: 4,
  },
  {
    code: 'CULTURE_COMMUNITY',
    name: 'Culture & Community Trail',
    description: 'Approved culture, community, food, restaurant, local market, and livelihood nodes.',
    publicLabel: 'Culture & Community Trail',
    officialSortOrder: 5,
  },
  {
    code: 'SUNSET_SCENIC',
    name: 'Sunset & Scenic Stops Trail',
    description: 'Low-friction scenic and golden-hour route for approved visual stops.',
    publicLabel: 'Sunset & Scenic Stops Trail',
    officialSortOrder: 6,
  },
  {
    code: 'ADVENTURE',
    name: 'Adventure Trail',
    description: 'Safety-controlled adventure, lagoon, cave, paddle, and operator-backed activity nodes.',
    publicLabel: 'Adventure Trail',
    officialSortOrder: 7,
  },
  {
    code: 'RETURN_TRAVELER_CONTINUITY',
    name: 'Return Traveler Continuity Trail',
    description: 'Cross-trip verified traveler progression and repeat-visitor continuity engine.',
    publicLabel: 'Return Traveler Continuity Trail',
    officialSortOrder: 8,
  },
];

const tracks = [
  { code: 'ISLAND_CORE', familyCode: 'ISLAND_HOPPING', name: 'Island Core', sortOrder: 1, isPublic: true },
  { code: 'ISLAND_EXTENDED', familyCode: 'ISLAND_HOPPING', name: 'Island Extended', sortOrder: 2, isPublic: true },
  { code: 'ISLAND_FRONTIER', familyCode: 'ISLAND_HOPPING', name: 'Island Frontier', sortOrder: 3, isPublic: true },
  { code: 'SURF_DISCOVERY', familyCode: 'SURF_EXPLORER', name: 'Surf Discovery', sortOrder: 1, isPublic: true },
  { code: 'SURF_PARTICIPATION', familyCode: 'SURF_EXPLORER', name: 'Surf Participation', sortOrder: 2, isPublic: true },
  { code: 'CULTURE_FOOD_LOCAL_FLAVOR', familyCode: 'CULTURE_COMMUNITY', name: 'Food & Local Flavor', sortOrder: 1, isPublic: true },
  { code: 'CULTURE_COMMUNITY_TRACK', familyCode: 'CULTURE_COMMUNITY', name: 'Community Nodes', sortOrder: 2, isPublic: true },
];

const islandNodes = [
  {
    code: 'GUYAM_ISLAND',
    name: 'Guyam Island',
    description: 'Official Island Hopping Trail stamp node.',
    nodeType: 'PLACE',
    requirementType: 'QR_STAMP_NODE',
    isOfficialNode: true,
    isCandidateNode: false,
    isConditionalNode: false,
    stampEligible: true,
    bookingRequired: true,
    operatorRequired: true,
    safetyControlled: true,
  },
  {
    code: 'DAKU_ISLAND',
    name: 'Daku Island',
    description: 'Official Island Hopping Trail stamp node.',
    nodeType: 'PLACE',
    requirementType: 'QR_STAMP_NODE',
    isOfficialNode: true,
    isCandidateNode: false,
    isConditionalNode: false,
    stampEligible: true,
    bookingRequired: true,
    operatorRequired: true,
    safetyControlled: true,
  },
  {
    code: 'NAKED_ISLAND',
    name: 'Naked Island',
    description: 'Official Island Hopping Trail stamp node.',
    nodeType: 'PLACE',
    requirementType: 'QR_STAMP_NODE',
    isOfficialNode: true,
    isCandidateNode: false,
    isConditionalNode: false,
    stampEligible: true,
    bookingRequired: true,
    operatorRequired: true,
    safetyControlled: true,
  },
  {
    code: 'CORREGIDOR_ISLAND',
    name: 'Corregidor Island',
    description: 'Official Island Hopping Trail extended stamp node.',
    nodeType: 'PLACE',
    requirementType: 'QR_STAMP_NODE',
    isOfficialNode: true,
    isCandidateNode: false,
    isConditionalNode: false,
    stampEligible: true,
    bookingRequired: true,
    operatorRequired: true,
    safetyControlled: true,
  },
  {
    code: 'MAM_ON_ISLAND',
    name: 'Mam-on Island',
    description: 'Official Island Hopping Trail frontier stamp node.',
    nodeType: 'PLACE',
    requirementType: 'QR_STAMP_NODE',
    isOfficialNode: true,
    isCandidateNode: false,
    isConditionalNode: false,
    stampEligible: true,
    bookingRequired: true,
    operatorRequired: true,
    safetyControlled: true,
  },
  {
    code: 'SECRET_ISLAND',
    name: 'Secret Island',
    description: 'Conditional package node. Tide, operator, and package dependent. Not a fixed official stop.',
    nodeType: 'CONDITIONAL_PACKAGE_NODE',
    requirementType: 'PACKAGE_ONLY_NODE',
    isOfficialNode: false,
    isCandidateNode: false,
    isConditionalNode: true,
    conditionNote: 'Tide/operator/package-dependent. Not a fixed official stop.',
    stampEligible: true,
    bookingRequired: true,
    operatorRequired: true,
    safetyControlled: true,
  },
];

const checkpoints = [
  {
    code: 'SAYAK_AIRPORT',
    name: 'Sayak Airport / Siargao Airport',
    checkpointType: 'AIRPORT',
    locationLabel: 'Siargao Airport',
    municipality: 'Del Carmen',
    barangay: null,
    supportsIngress: true,
    supportsEgress: true,
    supportsInterIsland: false,
    requiresManifest: false,
    requiresBooking: false,
    requiresOperator: false,
    requiresPaymentClearance: false,
  },
  {
    code: 'DAPA_PORT',
    name: 'Dapa Port',
    checkpointType: 'SEAPORT',
    locationLabel: 'Dapa Port',
    municipality: 'Dapa',
    barangay: null,
    supportsIngress: true,
    supportsEgress: true,
    supportsInterIsland: true,
    requiresManifest: false,
    requiresBooking: false,
    requiresOperator: false,
    requiresPaymentClearance: false,
  },
  {
    code: 'GENERAL_LUNA_ISLAND_HOPPING_DEPARTURE',
    name: 'General Luna Island Hopping Departure',
    checkpointType: 'BOAT_DEPARTURE',
    locationLabel: 'General Luna Tourism / Island Hopping Departure Area',
    municipality: 'General Luna',
    barangay: null,
    supportsIngress: false,
    supportsEgress: false,
    supportsInterIsland: true,
    requiresManifest: true,
    requiresBooking: true,
    requiresOperator: true,
    requiresPaymentClearance: true,
  },
  {
    code: 'GENERAL_LUNA_ISLAND_HOPPING_RETURN',
    name: 'General Luna Island Hopping Return / Disembarkation',
    checkpointType: 'BOAT_ARRIVAL',
    locationLabel: 'General Luna Tourism / Island Hopping Return Area',
    municipality: 'General Luna',
    barangay: null,
    supportsIngress: false,
    supportsEgress: true,
    supportsInterIsland: true,
    requiresManifest: true,
    requiresBooking: true,
    requiresOperator: true,
    requiresPaymentClearance: false,
  },
  {
    code: 'GUYAM_ISLAND_STOP',
    name: 'Guyam Island Stop',
    checkpointType: 'ISLAND_STOP',
    locationLabel: 'Guyam Island',
    municipality: 'General Luna',
    barangay: null,
    supportsIngress: false,
    supportsEgress: false,
    supportsInterIsland: true,
    requiresManifest: true,
    requiresBooking: true,
    requiresOperator: true,
    requiresPaymentClearance: false,
  },
  {
    code: 'DAKU_ISLAND_STOP',
    name: 'Daku Island Stop',
    checkpointType: 'ISLAND_STOP',
    locationLabel: 'Daku Island',
    municipality: 'General Luna',
    barangay: null,
    supportsIngress: false,
    supportsEgress: false,
    supportsInterIsland: true,
    requiresManifest: true,
    requiresBooking: true,
    requiresOperator: true,
    requiresPaymentClearance: false,
  },
  {
    code: 'NAKED_ISLAND_STOP',
    name: 'Naked Island Stop',
    checkpointType: 'ISLAND_STOP',
    locationLabel: 'Naked Island',
    municipality: 'General Luna',
    barangay: null,
    supportsIngress: false,
    supportsEgress: false,
    supportsInterIsland: true,
    requiresManifest: true,
    requiresBooking: true,
    requiresOperator: true,
    requiresPaymentClearance: false,
  },
  {
    code: 'CORREGIDOR_ISLAND_STOP',
    name: 'Corregidor Island Stop',
    checkpointType: 'ISLAND_STOP',
    locationLabel: 'Corregidor Island',
    municipality: 'General Luna',
    barangay: null,
    supportsIngress: false,
    supportsEgress: false,
    supportsInterIsland: true,
    requiresManifest: true,
    requiresBooking: true,
    requiresOperator: true,
    requiresPaymentClearance: false,
  },
  {
    code: 'MAM_ON_ISLAND_STOP',
    name: 'Mam-on Island Stop',
    checkpointType: 'ISLAND_STOP',
    locationLabel: 'Mam-on Island',
    municipality: null,
    barangay: null,
    supportsIngress: false,
    supportsEgress: false,
    supportsInterIsland: true,
    requiresManifest: true,
    requiresBooking: true,
    requiresOperator: true,
    requiresPaymentClearance: false,
  },
];

async function main() {
  const familiesByCode = {};

  for (const family of trailFamilies) {
    const row = await prisma.spmTrailFamily.upsert({
      where: { code: family.code },
      update: {
        name: family.name,
        description: family.description,
        publicLabel: family.publicLabel,
        officialSortOrder: family.officialSortOrder,
        isActive: true,
        isOfficial: true,
      },
      create: {
        ...family,
        isActive: true,
        isOfficial: true,
      },
    });

    familiesByCode[family.code] = row;
  }

  for (const track of tracks) {
    const family = familiesByCode[track.familyCode];

    await prisma.spmTrailTrack.upsert({
      where: { code: track.code },
      update: {
        trailFamilyId: family.id,
        name: track.name,
        isPublic: track.isPublic,
        isActive: true,
        sortOrder: track.sortOrder,
      },
      create: {
        trailFamilyId: family.id,
        code: track.code,
        name: track.name,
        isPublic: track.isPublic,
        isActive: true,
        sortOrder: track.sortOrder,
      },
    });
  }

  const islandFamily = familiesByCode.ISLAND_HOPPING;
  const islandCoreTrack = await prisma.spmTrailTrack.findUnique({ where: { code: 'ISLAND_CORE' } });

  for (const node of islandNodes) {
    await prisma.spmTrailNode.upsert({
      where: { code: node.code },
      update: {
        trailFamilyId: islandFamily.id,
        trailTrackId: islandCoreTrack?.id ?? null,
        name: node.name,
        description: node.description,
        nodeType: node.nodeType,
        requirementType: node.requirementType,
        approvalStatus: 'APPROVED',
        isOfficialNode: node.isOfficialNode,
        isCandidateNode: node.isCandidateNode,
        isConditionalNode: node.isConditionalNode,
        conditionNote: node.conditionNote ?? null,
        stampEligible: node.stampEligible,
        bookingRequired: node.bookingRequired,
        operatorRequired: node.operatorRequired,
        safetyControlled: node.safetyControlled,
        guideRequirement: 'GUIDE_OPTIONAL',
      },
      create: {
        trailFamilyId: islandFamily.id,
        trailTrackId: islandCoreTrack?.id ?? null,
        code: node.code,
        name: node.name,
        description: node.description,
        nodeType: node.nodeType,
        requirementType: node.requirementType,
        approvalStatus: 'APPROVED',
        isOfficialNode: node.isOfficialNode,
        isCandidateNode: node.isCandidateNode,
        isConditionalNode: node.isConditionalNode,
        conditionNote: node.conditionNote ?? null,
        stampEligible: node.stampEligible,
        bookingRequired: node.bookingRequired,
        operatorRequired: node.operatorRequired,
        safetyControlled: node.safetyControlled,
        guideRequirement: 'GUIDE_OPTIONAL',
      },
    });
  }

  for (const checkpoint of checkpoints) {
    await prisma.ospCheckpoint.upsert({
      where: { code: checkpoint.code },
      update: {
        name: checkpoint.name,
        checkpointType: checkpoint.checkpointType,
        locationLabel: checkpoint.locationLabel,
        municipality: checkpoint.municipality,
        barangay: checkpoint.barangay,
        isActive: true,
        requiresManifest: checkpoint.requiresManifest,
        requiresBooking: checkpoint.requiresBooking,
        requiresOperator: checkpoint.requiresOperator,
        requiresPaymentClearance: checkpoint.requiresPaymentClearance,
        supportsIngress: checkpoint.supportsIngress,
        supportsEgress: checkpoint.supportsEgress,
        supportsInterIsland: checkpoint.supportsInterIsland,
      },
      create: {
        ...checkpoint,
        isActive: true,
      },
    });
  }

  const counts = {
    trailFamilies: await prisma.spmTrailFamily.count(),
    tracks: await prisma.spmTrailTrack.count(),
    nodes: await prisma.spmTrailNode.count(),
    officialIslandNodes: await prisma.spmTrailNode.count({
      where: {
        trailFamilyId: islandFamily.id,
        isOfficialNode: true,
      },
    }),
    conditionalNodes: await prisma.spmTrailNode.count({
      where: {
        isConditionalNode: true,
      },
    }),
    checkpoints: await prisma.ospCheckpoint.count(),
  };

  const officialFamilies = await prisma.spmTrailFamily.findMany({
    orderBy: { officialSortOrder: 'asc' },
    select: { code: true, name: true, officialSortOrder: true, isOfficial: true },
  });

  const islandNodeRows = await prisma.spmTrailNode.findMany({
    where: { trailFamilyId: islandFamily.id },
    orderBy: { code: 'asc' },
    select: {
      code: true,
      name: true,
      isOfficialNode: true,
      isConditionalNode: true,
      stampEligible: true,
      operatorRequired: true,
    },
  });

  const checkpointRows = await prisma.ospCheckpoint.findMany({
    orderBy: { code: 'asc' },
    select: {
      code: true,
      name: true,
      checkpointType: true,
      supportsIngress: true,
      supportsEgress: true,
      supportsInterIsland: true,
      requiresManifest: true,
      requiresBooking: true,
      requiresOperator: true,
    },
  });

  console.log(JSON.stringify({ counts, officialFamilies, islandNodeRows, checkpointRows }, null, 2));
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
