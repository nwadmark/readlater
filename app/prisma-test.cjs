require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { randomUUID } = require("crypto");

const prisma = new PrismaClient();

(async () => {
  const r = await prisma.link.create({
    data: {
      id: randomUUID(),
      url: "https://example.com/test-" + Date.now(),
      status: "SAVED",
      ownerKey: "test-owner",
      updatedAt: new Date(),
    },
  });

  console.log("created", r.id);

  const c = await prisma.link.count();
  console.log("count", c);

  await prisma.$disconnect();
})().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

