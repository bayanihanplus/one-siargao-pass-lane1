const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const reportTypes = [
  {
    code: 'MANIFEST-APPROVAL',
    name: 'Manifest Approval Report',
    description: 'Official registry entry for manifest approval reporting.',
    requiresPeriod: true,
    requiresJurisdiction: true,
    requiresSignature: true,
    requiresFileHash: true,
  },
  {
    code: 'MANIFEST-SUBMISSION',
    name: 'Manifest Submission Queue Report',
    description: 'Official registry entry for manifest submission queue reporting.',
    requiresPeriod: true,
    requiresJurisdiction: true,
    requiresSignature: true,
    requiresFileHash: true,
  },
  {
    code: 'APPROVAL-EVENT',
    name: 'Approval Event Report',
    description: 'Official registry entry for approval event reporting.',
    requiresPeriod: true,
    requiresJurisdiction: true,
    requiresSignature: true,
    requiresFileHash: true,
  },
  {
    code: 'FEE-CLEARANCE-EXCEPTION',
    name: 'Fee Clearance Exception Report',
    description: 'Official registry entry for fee clearance exception reporting.',
    requiresPeriod: true,
    requiresJurisdiction: true,
    requiresSignature: true,
    requiresFileHash: true,
  },
  {
    code: 'FEE-RECEIPT-REGISTER',
    name: 'Fee Receipt Register',
    description: 'Official registry entry for fee receipt register reporting.',
    requiresPeriod: true,
    requiresJurisdiction: true,
    requiresSignature: true,
    requiresFileHash: true,
  },
  {
    code: 'PAYMENT-AUDIT',
    name: 'Payment Audit Report',
    description: 'Official registry entry for payment audit reporting.',
    requiresPeriod: true,
    requiresJurisdiction: true,
    requiresSignature: true,
    requiresFileHash: true,
  },
  {
    code: 'OVERDUE-MOVEMENT',
    name: 'Overdue Movement Signal Report',
    description: 'Official registry entry for overdue movement signal reporting.',
    requiresPeriod: true,
    requiresJurisdiction: true,
    requiresSignature: true,
    requiresFileHash: true,
  },
  {
    code: 'INTER-ISLAND-COMPLIANCE',
    name: 'Inter-Island Compliance Summary',
    description: 'Official registry entry for inter-island compliance summary reporting.',
    requiresPeriod: true,
    requiresJurisdiction: true,
    requiresSignature: true,
    requiresFileHash: true,
  },
];

const jurisdictions = [
  {
    code: 'GL',
    name: 'General Luna',
    jurisdictionType: 'MUNICIPALITY',
    parentCode: null,
    metadataJson: {
      island: 'Siargao',
      province: 'Surigao del Norte',
    },
  },
  {
    code: 'SIARGAO',
    name: 'Siargao Island Consolidated',
    jurisdictionType: 'ISLAND',
    parentCode: null,
    metadataJson: {
      province: 'Surigao del Norte',
    },
  },
  {
    code: 'SDN',
    name: 'Surigao del Norte',
    jurisdictionType: 'PROVINCE',
    parentCode: null,
    metadataJson: {
      country: 'Philippines',
    },
  },
  {
    code: 'DOT',
    name: 'Department of Tourism Consolidated',
    jurisdictionType: 'AGENCY',
    parentCode: null,
    metadataJson: {
      agency: 'Department of Tourism',
      country: 'Philippines',
    },
  },
];

async function seedReportTypes() {
  for (let index = 0; index < reportTypes.length; index += 1) {
    const reportType = reportTypes[index];

    await prisma.officialReportTypeRegistry.upsert({
      where: { code: reportType.code },
      update: {
        name: reportType.name,
        description: reportType.description,
        isActive: true,
        isOfficialEnabled: false,
        requiresPeriod: reportType.requiresPeriod,
        requiresJurisdiction: reportType.requiresJurisdiction,
        requiresSignature: reportType.requiresSignature,
        requiresFileHash: reportType.requiresFileHash,
        sortOrder: index + 1,
      },
      create: {
        code: reportType.code,
        name: reportType.name,
        description: reportType.description,
        isActive: true,
        isOfficialEnabled: false,
        requiresPeriod: reportType.requiresPeriod,
        requiresJurisdiction: reportType.requiresJurisdiction,
        requiresSignature: reportType.requiresSignature,
        requiresFileHash: reportType.requiresFileHash,
        sortOrder: index + 1,
      },
    });
  }
}

async function seedJurisdictions() {
  for (let index = 0; index < jurisdictions.length; index += 1) {
    const jurisdiction = jurisdictions[index];

    await prisma.officialJurisdictionRegistry.upsert({
      where: { code: jurisdiction.code },
      update: {
        name: jurisdiction.name,
        jurisdictionType: jurisdiction.jurisdictionType,
        parentCode: jurisdiction.parentCode,
        isActive: true,
        isOfficialEnabled: false,
        sortOrder: index + 1,
        metadataJson: jurisdiction.metadataJson,
      },
      create: {
        code: jurisdiction.code,
        name: jurisdiction.name,
        jurisdictionType: jurisdiction.jurisdictionType,
        parentCode: jurisdiction.parentCode,
        isActive: true,
        isOfficialEnabled: false,
        sortOrder: index + 1,
        metadataJson: jurisdiction.metadataJson,
      },
    });
  }
}

async function main() {
  await seedReportTypes();
  await seedJurisdictions();

  const reportTypeCount = await prisma.officialReportTypeRegistry.count();
  const jurisdictionCount = await prisma.officialJurisdictionRegistry.count();
  const enabledReportTypeCount = await prisma.officialReportTypeRegistry.count({
    where: { isOfficialEnabled: true },
  });
  const enabledJurisdictionCount = await prisma.officialJurisdictionRegistry.count({
    where: { isOfficialEnabled: true },
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        reportTypeCount,
        jurisdictionCount,
        enabledReportTypeCount,
        enabledJurisdictionCount,
        officialActivation: 'DISABLED',
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
