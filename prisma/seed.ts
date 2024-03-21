import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const affiliationData = [
  {
    name: "ビジュアリゼーションとインタラクティブシステム研究室",
  },
  {
    name: "適応情報処理研究室",
  },
  {
    name: "人工生命・ウェブサイエンス研究室",
  },
] satisfies Prisma.AffiliationsCreateInput[];

const fieldData = [
  {
    name: "知能情報学",
  },
  {
    name: "ヒューマンインタフェース、インタラクション",
  },
] satisfies Prisma.FieldsCreateInput[];

const tagData = [
  {
    name: "HCI",
  },
  {
    name: "人工生命",
  },
  {
    name: "深層学習",
  },
] satisfies Prisma.TagsCreateInput[];

const userData = [
  {
    user_id: "user_2Z4nzspFRMiJCiXNRh50XgptgeN",
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
        },
      ],
    },
    comments: {
      create: [
        {
          content: "test",
          review_id: 1,
        },
      ],
    },
  },
] satisfies Prisma.UsersCreateInput[];

async function main() {
  console.log(`Start seeding ...`);
  for (const a of affiliationData) {
    const affiliation = await prisma.affiliations.create({
      data: a,
    });
    console.log(`Created affiliation with id: ${affiliation.id}`);
  }

  for (const f of fieldData) {
    const field = await prisma.fields.create({
      data: f,
    });
    console.log(`Created field with id: ${field.id}`);
  }

  for (const t of tagData) {
    const tag = await prisma.tags.create({
      data: t,
    });
    console.log(`Created tag with id: ${tag.id}`);
  }

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
