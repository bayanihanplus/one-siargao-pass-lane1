const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const program = await prisma.ospComplianceFeeProgram.upsert({
    where: {
      code: 'GL_INTER_ISLAND_LGU_BARANGAY_FEES',
    },
    update: {
      name: 'General Luna Inter-Island LGU / Barangay Fee Program',
      scopeType: 'INTER_ISLAND_MOVEMENT',
      municipality: 'General Luna',
      approvalStatus: 'DRAFT',
      isActive: true,
      notes:
        'Fee program foundation for inter-island movement approval logic. Amounts are fillable/configurable and should not be hardcoded in frontend.',
    },
    create: {
      code: 'GL_INTER_ISLAND_LGU_BARANGAY_FEES',
      name: 'General Luna Inter-Island LGU / Barangay Fee Program',
      scopeType: 'INTER_ISLAND_MOVEMENT',
      municipality: 'General Luna',
      approvalStatus: 'DRAFT',
      isActive: true,
      notes:
        'Fee program foundation for inter-island movement approval logic. Amounts are fillable/configurable and should not be hardcoded in frontend.',
    },
  });

  const items = [
    {
      code: 'ENVIRONMENTAL_FEE',
      name: 'Environmental Fee',
      description: 'Environmental fee applicable to inter-island movement passengers where required.',
      feeCategory: 'ENVIRONMENTAL',
      chargeBasis: 'PER_TRAVELER',
      sortOrder: 10,
    },
    {
      code: 'BARANGAY_FEE',
      name: 'Barangay Fee',
      description: 'Barangay-imposed fee applicable to route, checkpoint, island stop, or passenger movement.',
      feeCategory: 'BARANGAY',
      chargeBasis: 'PER_TRAVELER',
      sortOrder: 20,
    },
    {
      code: 'TERMINAL_OR_DEPARTURE_FEE',
      name: 'Terminal / Departure Fee',
      description: 'Departure or terminal fee applied at approved origin checkpoint where required.',
      feeCategory: 'TERMINAL',
      chargeBasis: 'PER_TRAVELER',
      sortOrder: 30,
    },
    {
      code: 'ISLAND_ACCESS_FEE',
      name: 'Island Access Fee',
      description: 'Island stop or protected-area access fee where applicable.',
      feeCategory: 'ACCESS',
      chargeBasis: 'PER_TRAVELER',
      sortOrder: 40,
    },
    {
      code: 'OTHER_LOCAL_FEE',
      name: 'Other Local Fee',
      description: 'Fillable placeholder for additional LGU, barangay, or ordinance-based fees.',
      feeCategory: 'LOCAL_OTHER',
      chargeBasis: 'PER_TRAVELER',
      sortOrder: 50,
    },
  ];

  for (const item of items) {
    await prisma.ospComplianceFeeItem.upsert({
      where: {
        feeProgramId_code: {
          feeProgramId: program.id,
          code: item.code,
        },
      },
      update: {
        name: item.name,
        description: item.description,
        feeCategory: item.feeCategory,
        chargeBasis: item.chargeBasis,
        amountPhp: null,
        isRequiredForApproval: true,
        isLguFillable: true,
        isTravelerFacing: true,
        sortOrder: item.sortOrder,
      },
      create: {
        feeProgramId: program.id,
        code: item.code,
        name: item.name,
        description: item.description,
        feeCategory: item.feeCategory,
        chargeBasis: item.chargeBasis,
        amountPhp: null,
        isRequiredForApproval: true,
        isLguFillable: true,
        isTravelerFacing: true,
        sortOrder: item.sortOrder,
      },
    });
  }

  const result = await prisma.ospComplianceFeeProgram.findUnique({
    where: { id: program.id },
    include: { feeItems: { orderBy: { sortOrder: 'asc' } } },
  });

  console.log(JSON.stringify({ ok: true, program: result }, null, 2));
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
