import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  if (count) return;
  await prisma.product.createMany({
    data: [
      { name: "Urea (46% N)", description: "Nitrogen fertilizer", priceInINR: 600, imageUrl: "" },
      { name: "DAP (18-46-0)", description: "Di-ammonium phosphate", priceInINR: 1400, imageUrl: "" },
      { name: "MOP (0-0-60)", description: "Muriate of Potash", priceInINR: 900, imageUrl: "" }
    ]
  });
  console.log("Seeded products");
}
main().finally(() => prisma.$disconnect());
