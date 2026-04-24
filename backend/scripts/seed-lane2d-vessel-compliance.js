const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const vessel = await prisma.ospVessel.upsert({
    where: {
      id: 'osp-vessel-001',
    },
    update: {
      operatorUserId: 'osp-operator-001',
      vesselName: 'OSP Test Island Hopping Boat 01',
      vesselRegistrationNumber: 'OSP-BOAT-001',
      vesselType: 'ISLAND_HOPPING_BOAT',
      capacity: 16,
      complianceStatus: 'APPROVED',
      notes: 'Seed approved vessel for Lane 2-D vessel compliance enforcement testing.',
    },
    create: {
      id: 'osp-vessel-001',
      operatorUserId: 'osp-operator-001',
      vesselName: 'OSP Test Island Hopping Boat 01',
      vesselRegistrationNumber: 'OSP-BOAT-001',
      vesselType: 'ISLAND_HOPPING_BOAT',
      capacity: 16,
      complianceStatus: 'APPROVED',
      notes: 'Seed approved vessel for Lane 2-D vessel compliance enforcement testing.',
    },
  });

  console.log(JSON.stringify({ ok: true, vessel }, null, 2));
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
