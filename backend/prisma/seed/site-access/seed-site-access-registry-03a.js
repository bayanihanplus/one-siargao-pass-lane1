const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const points = [
  {
    siteAccessPointCode: "CLOUD_9_LGU_SITE_ACCESS",
    displayName: "Cloud 9 Access",
    siteType: "LGU_SITE_ACCESS",
    consumerModule: "SITE_ACCESS",
    accessRule: "PAID_SITE_ENTITLEMENT",
    qrMode: "SITE_SIGNAGE_QR",
    governingAuthorityType: "LGU",
    governingAuthorityCode: "GENERAL_LUNA_LGU",
    operatingAuthorityType: "LGU",
    operatingAuthorityCode: "GENERAL_LUNA_LGU",
    municipalityCode: "GENERAL_LUNA",
    barangayCode: "CATANGNAN",
    physicalLocationLabel: "Cloud 9, Catangnan, General Luna, Siargao",
    visibilityScope: "TRAVELER_APP",
    operationScope: "GENERAL_LUNA_SITE_ACCESS",
    scanPermissionScope: "LGU_SITE_ACCESS_STAFF",
    payoutVisibilityScope: "LGU_FINANCE",
    registryStatus: "ACTIVE",
    apiReadinessStatus: "API_READY_FUTURE",
    isActive: true,
    isPublicVisible: true,
    isSuperAdminVisible: true,
    metadataJson: {
      lane: "OSP-SITE-ACCESS-REGISTRY-03A",
      travelerHomeCard: "Cloud 9 Access",
      commercialMode: "paid_entitlement_existing_cloud9_vertical",
      note: "Cloud 9 remains the first working Site Access vertical. This registry point does not replace existing SiteAccessIntent / SiteAccessEntitlement flow."
    },
    feeRule: {
      feeRequired: true,
      feeType: "LGU_ENTRANCE_FEE",
      feeOwnerType: "LGU",
      feeOwnerCode: "GENERAL_LUNA_LGU",
      feeCollectorType: "OSP_PLATFORM",
      feeCollectorCode: "OSP",
      payoutRecipientType: "LGU",
      payoutRecipientCode: "GENERAL_LUNA_LGU",
      standardAmount: "100.00",
      residentAmount: null,
      seniorAmount: null,
      childAmount: null,
      exemptAmount: "0.00",
      discountedAmount: null,
      currencyCode: "PHP",
      paymentProviderAllowed: true,
      counterPaymentAllowed: true,
      receiptRequired: true,
      settlementSurface: "SITE_ACCESS",
      isActive: true,
      metadataJson: {
        source: "existing_cloud9_site_access_vertical",
        feeNote: "Amount based on current Cloud 9 access flow; update via governance when official matrix changes."
      }
    },
    qrDefinition: {
      qrCode: "SITE-ACCESS-CLOUD-9-LGU",
      qrMode: "SITE_SIGNAGE_QR",
      qrPurpose: "Cloud 9 LGU site access scan point",
      publicScanUrl: "/traveler/site-access/cloud-9",
      internalScanUrl: "/lgu/site-access/cloud-9/scan",
      status: "ACTIVE",
      metadataJson: {
        existingTravelerRoute: "/traveler/site-access/cloud-9",
        existingLguScanRoute: "/lgu/site-access/cloud-9/scan"
      }
    }
  },
  {
    siteAccessPointCode: "MALINAO_SKATE_PARK_LGU_SITE_VISIT",
    displayName: "Malinao Skate Park",
    siteType: "LGU_SITE_ACCESS",
    consumerModule: "SITE_ACCESS",
    accessRule: "SITE_VISIT_LOG",
    qrMode: "SITE_SIGNAGE_QR",
    governingAuthorityType: "LGU",
    governingAuthorityCode: "GENERAL_LUNA_LGU",
    operatingAuthorityType: "LGU",
    operatingAuthorityCode: "GENERAL_LUNA_LGU",
    municipalityCode: "GENERAL_LUNA",
    barangayCode: "MALINAO",
    physicalLocationLabel: "Malinao Skate Park, General Luna, Siargao",
    visibilityScope: "TRAVELER_APP",
    operationScope: "GENERAL_LUNA_SITE_VISIT",
    scanPermissionScope: "LGU_SITE_VISIT_STAFF",
    payoutVisibilityScope: "NO_PAYOUT",
    registryStatus: "ACTIVE",
    apiReadinessStatus: "API_READY_FUTURE",
    isActive: true,
    isPublicVisible: true,
    isSuperAdminVisible: true,
    metadataJson: {
      lane: "OSP-SITE-ACCESS-REGISTRY-03A",
      travelerHomeCard: "Malinao Skate Park",
      commercialMode: "site_visit_only",
      noPaidClaim: true,
      noSpmStampClaim: true,
      note: "Validated as LGU site-visit access only. No paid entitlement or SPM stamp claim."
    },
    feeRule: {
      feeRequired: false,
      feeType: "NO_FEE",
      feeOwnerType: "LGU",
      feeOwnerCode: "GENERAL_LUNA_LGU",
      feeCollectorType: null,
      feeCollectorCode: null,
      payoutRecipientType: null,
      payoutRecipientCode: null,
      standardAmount: null,
      residentAmount: null,
      seniorAmount: null,
      childAmount: null,
      exemptAmount: null,
      discountedAmount: null,
      currencyCode: "PHP",
      paymentProviderAllowed: false,
      counterPaymentAllowed: false,
      receiptRequired: false,
      settlementSurface: "NO_SETTLEMENT",
      isActive: true,
      metadataJson: {
        source: "validated_user_instruction",
        feeNote: "Site-visit access only. No fee rule active."
      }
    },
    qrDefinition: {
      qrCode: "SITE-VISIT-MALINAO-SKATE-PARK",
      qrMode: "SITE_SIGNAGE_QR",
      qrPurpose: "Malinao Skate Park LGU site-visit log",
      publicScanUrl: "/traveler/passport-map",
      internalScanUrl: "/lgu/site-access/registry/scan",
      status: "ACTIVE",
      metadataJson: {
        fallbackTravelerRoute: "/traveler/passport-map",
        futureRegistryRoute: "/traveler/site-access/malinao-skate-park"
      }
    }
  },
  {
    siteAccessPointCode: "AFAM_CATANGNAN_BRIDGE_LGU_SITE_VISIT",
    displayName: "AFAM / Catangnan Bridge",
    siteType: "LGU_SITE_ACCESS",
    consumerModule: "SITE_ACCESS",
    accessRule: "SITE_VISIT_LOG",
    qrMode: "SITE_SIGNAGE_QR",
    governingAuthorityType: "LGU",
    governingAuthorityCode: "GENERAL_LUNA_LGU",
    operatingAuthorityType: "LGU",
    operatingAuthorityCode: "GENERAL_LUNA_LGU",
    municipalityCode: "GENERAL_LUNA",
    barangayCode: "CATANGNAN",
    physicalLocationLabel: "AFAM / Catangnan Bridge, General Luna, Siargao",
    visibilityScope: "TRAVELER_APP",
    operationScope: "GENERAL_LUNA_SITE_VISIT",
    scanPermissionScope: "LGU_SITE_VISIT_STAFF",
    payoutVisibilityScope: "NO_PAYOUT",
    registryStatus: "ACTIVE",
    apiReadinessStatus: "API_READY_FUTURE",
    isActive: true,
    isPublicVisible: true,
    isSuperAdminVisible: true,
    metadataJson: {
      lane: "OSP-SITE-ACCESS-REGISTRY-03A",
      travelerHomeCard: "AFAM / Catangnan Bridge",
      commercialMode: "site_visit_only",
      scenicSiteVisit: true,
      noPaidClaim: true,
      noSpmStampClaim: true,
      note: "Validated as scenic LGU site-visit access only. No paid entitlement or SPM stamp claim."
    },
    feeRule: {
      feeRequired: false,
      feeType: "NO_FEE",
      feeOwnerType: "LGU",
      feeOwnerCode: "GENERAL_LUNA_LGU",
      feeCollectorType: null,
      feeCollectorCode: null,
      payoutRecipientType: null,
      payoutRecipientCode: null,
      standardAmount: null,
      residentAmount: null,
      seniorAmount: null,
      childAmount: null,
      exemptAmount: null,
      discountedAmount: null,
      currencyCode: "PHP",
      paymentProviderAllowed: false,
      counterPaymentAllowed: false,
      receiptRequired: false,
      settlementSurface: "NO_SETTLEMENT",
      isActive: true,
      metadataJson: {
        source: "validated_user_instruction",
        feeNote: "Scenic LGU site-visit access only. No fee rule active."
      }
    },
    qrDefinition: {
      qrCode: "SITE-VISIT-AFAM-CATANGNAN-BRIDGE",
      qrMode: "SITE_SIGNAGE_QR",
      qrPurpose: "AFAM / Catangnan Bridge LGU site-visit log",
      publicScanUrl: "/traveler/passport-map",
      internalScanUrl: "/lgu/site-access/registry/scan",
      status: "ACTIVE",
      metadataJson: {
        fallbackTravelerRoute: "/traveler/passport-map",
        futureRegistryRoute: "/traveler/site-access/afam-catangnan-bridge"
      }
    }
  }
];

async function upsertPoint(point) {
  const { feeRule, qrDefinition, ...pointData } = point;

  const savedPoint = await prisma.siteAccessPoint.upsert({
    where: { siteAccessPointCode: point.siteAccessPointCode },
    update: pointData,
    create: pointData,
  });

  await prisma.siteAccessFeeRule.upsert({
    where: {
      id: `${savedPoint.id}:fee-rule`,
    },
    update: {
      ...feeRule,
      siteAccessPointId: savedPoint.id,
    },
    create: {
      id: `${savedPoint.id}:fee-rule`,
      siteAccessPointId: savedPoint.id,
      ...feeRule,
    },
  });

  await prisma.siteAccessQrDefinition.upsert({
    where: { qrCode: qrDefinition.qrCode },
    update: {
      ...qrDefinition,
      siteAccessPointId: savedPoint.id,
    },
    create: {
      siteAccessPointId: savedPoint.id,
      ...qrDefinition,
    },
  });

  return savedPoint;
}

async function main() {
  for (const point of points) {
    const saved = await upsertPoint(point);
    console.log(`Seeded ${saved.siteAccessPointCode}`);
  }

  const count = await prisma.siteAccessPoint.count({
    where: {
      siteAccessPointCode: {
        in: points.map((point) => point.siteAccessPointCode),
      },
    },
  });

  if (count !== points.length) {
    throw new Error(`Expected ${points.length} site access points, found ${count}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
