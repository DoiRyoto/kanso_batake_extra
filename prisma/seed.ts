import { prisma } from "@/lib/prisma/prisma-client";

async function main() {
  await prisma.affiliations.createMany({
    data: [
      { id: 1, name: "Example Affiliation 1" },
      { id: 2, name: "Example Affiliation 2" },
    ],
  });
}

main();
