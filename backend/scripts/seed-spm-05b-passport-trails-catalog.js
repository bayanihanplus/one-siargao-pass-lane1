const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const PRODUCT = {
  SIARGAO_PARTNER_TOUR: 'SIARGAO_PARTNER_TOUR',
  PASSPORT_TRAILS_CURATED_TOUR: 'PASSPORT_TRAILS_CURATED_TOUR',
  DIY_PASSPORT_TRAIL: 'DIY_PASSPORT_TRAIL',
};

const CURATION = {
  OPERATOR_CREATED: 'OPERATOR_CREATED',
  SPM_CURATED: 'SPM_CURATED',
  ADMIN_CREATED: 'ADMIN_CREATED',
  TRAVELER_CREATED: 'TRAVELER_CREATED',
};

const FULFILLMENT = {
  LOCAL_OPERATOR: 'LOCAL_OPERATOR',
  APPROVED_GUIDE: 'APPROVED_GUIDE',
  TRANSPORT_PARTNER: 'TRANSPORT_PARTNER',
  RESTAURANT_PARTNER: 'RESTAURANT_PARTNER',
  COMMUNITY_PARTNER: 'COMMUNITY_PARTNER',
  SURF_SCHOOL: 'SURF_SCHOOL',
  ADVENTURE_PARTNER: 'ADVENTURE_PARTNER',
  SELF_GUIDED_QR: 'SELF_GUIDED_QR',
};

const BOOKABILITY = {
  REQUEST_TO_CONFIRM: 'REQUEST_TO_CONFIRM',
  DISABLED_PENDING_PRICE: 'DISABLED_PENDING_PRICE',
};

const APPROVAL = {
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  APPROVED: 'APPROVED',
};

const PRICING = {
  FIXED_PER_HEAD: 'FIXED_PER_HEAD',
  PAX_TIERED_PER_HEAD: 'PAX_TIERED_PER_HEAD',
  PACKAGE_FLAT_RATE: 'PACKAGE_FLAT_RATE',
  FILLABLE_PRICE_REQUIRED: 'FILLABLE_PRICE_REQUIRED',
  REQUEST_TO_CONFIRM: 'REQUEST_TO_CONFIRM',
  PRICE_RANGE: 'PRICE_RANGE',
};

const packages = [
  {
    code: 'TRI_ISLAND_JOINER',
    name: 'Tri-Island Joiner',
    publicLabel: 'Siargao Partner Tour',
    productType: PRODUCT.SIARGAO_PARTNER_TOUR,
    curationSource: CURATION.OPERATOR_CREATED,
    fulfillmentPartnerType: FULFILLMENT.LOCAL_OPERATOR,
    familyCode: 'ISLAND_HOPPING',
    description: 'Existing local island hopping product made Passport Stamp-capable through OSP/SPM validation.',
    shortDescription: 'Guyam • Daku • Naked Island',
    pricingMode: PRICING.FIXED_PER_HEAD,
    nodeCodes: ['GUYAM_ISLAND', 'DAKU_ISLAND', 'NAKED_ISLAND'],
  },
  {
    code: 'CORREGIDOR_TRI_ISLAND_JOINER',
    name: 'Corregidor + Tri-Island Joiner',
    publicLabel: 'Siargao Partner Tour',
    productType: PRODUCT.SIARGAO_PARTNER_TOUR,
    curationSource: CURATION.OPERATOR_CREATED,
    fulfillmentPartnerType: FULFILLMENT.LOCAL_OPERATOR,
    familyCode: 'ISLAND_HOPPING',
    description: 'Existing local Corregidor + Tri-Island product made Passport Stamp-capable through OSP/SPM validation.',
    shortDescription: 'Corregidor • Guyam • Daku • Naked Island',
    pricingMode: PRICING.FIXED_PER_HEAD,
    nodeCodes: ['CORREGIDOR_ISLAND', 'GUYAM_ISLAND', 'DAKU_ISLAND', 'NAKED_ISLAND'],
  },
  {
    code: 'LAND_JOINER',
    name: 'Land Joiner',
    publicLabel: 'Siargao Partner Tour',
    productType: PRODUCT.SIARGAO_PARTNER_TOUR,
    curationSource: CURATION.OPERATOR_CREATED,
    fulfillmentPartnerType: FULFILLMENT.LOCAL_OPERATOR,
    familyCode: 'INLAND_DISCOVERY',
    description: 'Existing local land tour product prepared for governed SPM trail catalog use.',
    shortDescription: 'Inland discovery route',
    pricingMode: PRICING.FIXED_PER_HEAD,
    nodeCodes: ['MAASIN_RIVER', 'SUGBA_LAGOON_ACCESS_NODE', 'COCONUT_FOREST_SCENIC_CORRIDOR'],
  },
  {
    code: 'SOHOTON_JOINER',
    name: 'Sohoton Joiner',
    publicLabel: 'Siargao Partner Tour',
    productType: PRODUCT.SIARGAO_PARTNER_TOUR,
    curationSource: CURATION.OPERATOR_CREATED,
    fulfillmentPartnerType: FULFILLMENT.ADVENTURE_PARTNER,
    familyCode: 'ADVENTURE',
    description: 'Existing Sohoton/Bucas Grande adventure product prepared for governed SPM catalog use.',
    shortDescription: 'Sohoton / Bucas Grande adventure cluster',
    pricingMode: PRICING.FIXED_PER_HEAD,
    nodeCodes: ['SOHOTON_BUCAS_GRANDE_LINKED_NODE', 'SUGBA_LAGOON'],
  },
  {
    code: 'NORTH_SIARGAO_SCENIC_ROUTE',
    name: 'North Siargao Scenic Route',
    publicLabel: 'Passport Trails™ Curated Tour',
    productType: PRODUCT.PASSPORT_TRAILS_CURATED_TOUR,
    curationSource: CURATION.SPM_CURATED,
    fulfillmentPartnerType: FULFILLMENT.LOCAL_OPERATOR,
    familyCode: 'NORTH_SIARGAO',
    description: 'SPM-curated, locally operated North Siargao route.',
    shortDescription: 'Pacifico • Alegria • Taktak • Coconut Road',
    pricingMode: PRICING.REQUEST_TO_CONFIRM,
    nodeCodes: ['PACIFICO', 'BURGOS', 'ALEGRIA_BEACH', 'TAKTAK_FALLS', 'COCONUT_ROAD'],
  },
  {
    code: 'INLAND_DISCOVERY_TRAIL',
    name: 'Inland Discovery Trail',
    publicLabel: 'Passport Trails™ Curated Tour',
    productType: PRODUCT.PASSPORT_TRAILS_CURATED_TOUR,
    curationSource: CURATION.SPM_CURATED,
    fulfillmentPartnerType: FULFILLMENT.LOCAL_OPERATOR,
    familyCode: 'INLAND_DISCOVERY',
    description: 'SPM-curated, locally operated inland route for nature, river, lagoon, and scenic corridor discovery.',
    shortDescription: 'Maasin • Sugba access • Coconut corridor',
    pricingMode: PRICING.REQUEST_TO_CONFIRM,
    nodeCodes: ['MAASIN_RIVER', 'SUGBA_LAGOON_ACCESS_NODE', 'COCONUT_FOREST_SCENIC_CORRIDOR', 'APPROVED_INLAND_ECO_NODE'],
  },
  {
    code: 'SUNSET_SCENIC_LOOP',
    name: 'Sunset Scenic Loop',
    publicLabel: 'Passport Trails™ Curated Tour',
    productType: PRODUCT.PASSPORT_TRAILS_CURATED_TOUR,
    curationSource: CURATION.SPM_CURATED,
    fulfillmentPartnerType: FULFILLMENT.TRANSPORT_PARTNER,
    familyCode: 'SUNSET_SCENIC',
    description: 'SPM-curated scenic loop for golden hour stops and approved scenic QR nodes.',
    shortDescription: 'Cloud 9 sunset • Catangnan • Coconut Road',
    pricingMode: PRICING.REQUEST_TO_CONFIRM,
    nodeCodes: ['CLOUD_9_SUNSET_ZONE', 'CATANGNAN_BRIDGE', 'COCONUT_ROAD_SCENIC_POINT', 'PACIFICO_SCENIC_SUNSET_POINT'],
  },
  {
    code: 'SURF_DISCOVERY_TRAIL',
    name: 'Surf Discovery Trail',
    publicLabel: 'Passport Trails™ Curated Tour',
    productType: PRODUCT.PASSPORT_TRAILS_CURATED_TOUR,
    curationSource: CURATION.SPM_CURATED,
    fulfillmentPartnerType: FULFILLMENT.SURF_SCHOOL,
    familyCode: 'SURF_EXPLORER',
    description: 'SPM-curated surf culture and beginner-friendly discovery trail fulfilled by approved surf partners.',
    shortDescription: 'Cloud 9 • Jacking Horse • surf culture',
    pricingMode: PRICING.REQUEST_TO_CONFIRM,
    nodeCodes: ['CLOUD_9', 'JACKING_HORSE', 'QUICKSILVER', 'TUASON_POINT', 'STIMPYS'],
  },
  {
    code: 'CULTURE_LOCAL_FLAVOR_ROUTE',
    name: 'Culture & Local Flavor Route',
    publicLabel: 'Passport Trails™ Curated Tour',
    productType: PRODUCT.PASSPORT_TRAILS_CURATED_TOUR,
    curationSource: CURATION.SPM_CURATED,
    fulfillmentPartnerType: FULFILLMENT.COMMUNITY_PARTNER,
    familyCode: 'CULTURE_COMMUNITY',
    description: 'SPM-curated food, local flavor, and community route. No instant checkout until partner pricing and approval are confirmed.',
    shortDescription: 'Food • community • local flavor',
    pricingMode: PRICING.FILLABLE_PRICE_REQUIRED,
    nodeCodes: ['APPROVED_RESTAURANT_NODE', 'LOCAL_MARKET_FOOD_CULTURE_NODE', 'BOODLE_FIGHT_EXPERIENCE', 'KAKANIN_ISLAND_DELICACIES_NODE'],
  },
  {
    code: 'BUILD_YOUR_OWN_PASSPORT_TRAIL',
    name: 'Build Your Own Passport Trail',
    publicLabel: 'Build Your Own Passport Trail',
    productType: PRODUCT.DIY_PASSPORT_TRAIL,
    curationSource: CURATION.TRAVELER_CREATED,
    fulfillmentPartnerType: FULFILLMENT.SELF_GUIDED_QR,
    familyCode: 'RETURN_TRAVELER_CONTINUITY',
    description: 'Traveler-curated trail shell using approved SPM nodes. Fulfilled by approved local partners where service is required.',
    shortDescription: 'Traveler-curated route using approved nodes',
    pricingMode: PRICING.REQUEST_TO_CONFIRM,
    nodeCodes: [],
  },
];

function shouldRequirePrice(pricingMode) {
  return pricingMode === PRICING.FILLABLE_PRICE_REQUIRED || pricingMode === PRICING.REQUEST_TO_CONFIRM;
}

function bookabilityForPricing(pricingMode) {
  return shouldRequirePrice(pricingMode) ? BOOKABILITY.REQUEST_TO_CONFIRM : BOOKABILITY.DISABLED_PENDING_PRICE;
}

async function findFamily(code) {
  return prisma.spmTrailFamily.findFirst({ where: { code } });
}

async function findNode(code) {
  return prisma.spmTrailNode.findFirst({ where: { code } });
}

async function upsertPricingRule(packageRow, pricingMode) {
  const existing = await prisma.spmPricingRule.findFirst({
    where: {
      trailPackageId: packageRow.id,
      trailNodeId: null,
      operatorUserId: null,
      partnerId: null,
    },
  });

  const data = {
    trailPackageId: packageRow.id,
    trailNodeId: null,
    operatorUserId: null,
    partnerId: null,
    pricingMode,
    currencyCode: 'PHP',
    basePrice: null,
    priceRangeMin: null,
    priceRangeMax: null,
    packageFlatRate: null,
    fillableRequired: shouldRequirePrice(pricingMode),
    requestToConfirmRequired: shouldRequirePrice(pricingMode),
    instantCheckoutAllowed: false,
    approvalStatus: APPROVAL.DRAFT,
    effectiveFrom: null,
    effectiveTo: null,
  };

  if (existing) {
    return prisma.spmPricingRule.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.spmPricingRule.create({ data });
}

async function main() {
  console.log('=== SPM-05B Passport Trails catalog seed started ===');

  let createdOrUpdatedPackages = 0;
  let createdOrUpdatedPricingRules = 0;
  let linkedNodes = 0;
  let skippedMissingFamilies = 0;
  let skippedMissingNodes = 0;

  for (const item of packages) {
    const family = await findFamily(item.familyCode);

    if (!family) {
      console.warn(`[SKIP PACKAGE] ${item.code}: missing trail family ${item.familyCode}`);
      skippedMissingFamilies += 1;
      continue;
    }

    const packageRow = await prisma.spmTrailPackage.upsert({
      where: { code: item.code },
      update: {
        trailFamilyId: family.id,
        trailVariantId: null,
        productType: item.productType,
        curationSource: item.curationSource,
        fulfillmentPartnerType: item.fulfillmentPartnerType,
        name: item.name,
        publicLabel: item.publicLabel,
        description: item.description,
        shortDescription: item.shortDescription,
        operatorFacingName: item.name,
        travelerFacingName: item.name,
        bookabilityStatus: bookabilityForPricing(item.pricingMode),
        approvalStatus: APPROVAL.DRAFT,
        distributionEnabled: false,
        stampEnabled: true,
        guideRequirement: 'NO_GUIDE_REQUIRED',
        difficultyLevel: null,
        defaultStartTime: null,
        defaultEndTime: null,
        durationMinutes: null,
        pickupPolicyText: null,
        inclusionsText: null,
        exclusionsText: null,
        weatherPolicyText: null,
        cancellationPolicyText: null,
        requiresOperatorApproval: true,
        requiresPriceBeforePublish: true,
        instantCheckoutAllowed: false,
      },
      create: {
        trailFamilyId: family.id,
        trailVariantId: null,
        productType: item.productType,
        curationSource: item.curationSource,
        fulfillmentPartnerType: item.fulfillmentPartnerType,
        code: item.code,
        name: item.name,
        publicLabel: item.publicLabel,
        description: item.description,
        shortDescription: item.shortDescription,
        operatorFacingName: item.name,
        travelerFacingName: item.name,
        bookabilityStatus: bookabilityForPricing(item.pricingMode),
        approvalStatus: APPROVAL.DRAFT,
        distributionEnabled: false,
        stampEnabled: true,
        guideRequirement: 'NO_GUIDE_REQUIRED',
        difficultyLevel: null,
        defaultStartTime: null,
        defaultEndTime: null,
        durationMinutes: null,
        pickupPolicyText: null,
        inclusionsText: null,
        exclusionsText: null,
        weatherPolicyText: null,
        cancellationPolicyText: null,
        requiresOperatorApproval: true,
        requiresPriceBeforePublish: true,
        instantCheckoutAllowed: false,
      },
    });

    createdOrUpdatedPackages += 1;

    await upsertPricingRule(packageRow, item.pricingMode);
    createdOrUpdatedPricingRules += 1;

    await prisma.spmTrailPackageNode.deleteMany({
      where: { trailPackageId: packageRow.id },
    });

    let sortOrder = 1;
    for (const nodeCode of item.nodeCodes) {
      const node = await findNode(nodeCode);

      if (!node) {
        console.warn(`[SKIP NODE LINK] ${item.code}: missing node ${nodeCode}`);
        skippedMissingNodes += 1;
        continue;
      }

      await prisma.spmTrailPackageNode.create({
        data: {
          trailPackageId: packageRow.id,
          trailNodeId: node.id,
          isRequired: true,
          isOptional: false,
          isConditional: false,
          isStampEligible: Boolean(node.stampEligible),
          sortOrder,
          conditionNote: null,
        },
      });

      linkedNodes += 1;
      sortOrder += 1;
    }

    console.log(`[SEEDED] ${item.code} -> ${item.publicLabel}`);
  }

  console.log('');
  console.log('=== SPM-05B seed summary ===');
  console.log(`packages created/updated: ${createdOrUpdatedPackages}`);
  console.log(`pricing rules created/updated: ${createdOrUpdatedPricingRules}`);
  console.log(`package node links created: ${linkedNodes}`);
  console.log(`packages skipped due to missing families: ${skippedMissingFamilies}`);
  console.log(`node links skipped due to missing nodes: ${skippedMissingNodes}`);
  console.log('=== SPM-05B Passport Trails catalog seed complete ===');
}

main()
  .catch((error) => {
    console.error('SPM-05B seed failed');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
