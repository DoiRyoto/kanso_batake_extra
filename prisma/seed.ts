import { prisma } from "@/lib/prisma/prisma-client";

async function main() {
  await prisma.affiliations.createMany({
    data: [
      { id: 1, name: "Example Affiliation 1" },
      { id: 2, name: "Example Affiliation 2" },
    ],
  });

  await prisma.fields.createMany({
    data: [
      { id: 1, name: "Example Field 1" },
      { id: 2, name: "Example Field 2" },
    ],
  });

  await prisma.users.createMany({
    data: [
      { id: "demo1", name: "demo 1", role: "学生" },
      { id: "demo2", name: "demo 2", role: "学生" },
      { id: "demo3", name: "demo 3", role: "学生" },
      { id: "demo4", name: "demo 4", role: "教員" },
    ],
  });

  await prisma.works.createMany({
    data: [
      { id: 1, url: "http//google.com", user_id: "demo1" },
      { id: 2, url: "http//apple.com", user_id: "demo2" },
      { id: 3, url: "http//facebook.com", user_id: "demo4" },
      { id: 4, url: "http//amazon.com", user_id: "demo4" },
    ],
  });

  await prisma.affiliationsToUsers.createMany({
    data: [
      { affiliation_id: 1, user_id: "demo1" },
      { affiliation_id: 1, user_id: "demo2" },
      { affiliation_id: 2, user_id: "demo3" },
      { affiliation_id: 2, user_id: "demo4" },
    ],
  });

  await prisma.fieldsToUsers.createMany({
    data: [
      { field_id: 1, user_id: "demo1" },
      { field_id: 1, user_id: "demo2" },
      { field_id: 2, user_id: "demo3" },
      { field_id: 2, user_id: "demo4" },
    ],
  });
}

main();
