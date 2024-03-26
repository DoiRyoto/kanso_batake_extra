import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userData = [
  {
    id: "user_2Z4nzspFRMiJCiXNRh50XgptgeN",
    name: "Ryoto Doi",
    role: "学生",
    works: {
      create: [
        {
          url: "http://www.vislab.cs.tsukuba.ac.jp/members/doi-ryoto/",
        },
      ],
    },
    reviews: {
      create: [
        {
          paper_data: {
            title: "test",
            doi: "test",
          },
          paper_title: "test",
          content: "test",
          tags: {
            create: [
              {
                name: "HCI",
              },
            ],
          },
        },
      ],
    },
    fields: {
      create: [
        {
          name: "ヒューマンインタフェース、インタラクション",
        },
      ],
    },
    affiliations: {
      create: [
        {
          name: "ビジュアリゼーションとインタラクティブシステム研究室",
        },
      ],
    },
  },
] satisfies Prisma.UsersCreateInput[];

async function main() {
  for (const u of userData) {
    const user = await prisma.users.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
