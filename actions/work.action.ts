"use server";

import { Work } from "@/type";
import { prisma } from "@/lib/prisma/prisma-client";

export async function fetchAllWorks(): Promise<Work[]> {
  try {
    const worksData = await prisma.$queryRaw<Work[]>`
        SELECT * FROM "Works"`;

    return worksData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch works.");
  }
}

export async function fetchWorksByUserId(userId: string): Promise<Work[]> {
  try {
    const affiliationsData = await prisma.$queryRaw<Work[]>`
        SELECT *
        FROM "Works"
        WHERE user_id = ${userId};`;

    return affiliationsData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch affiliations.");
  }
}

export async function setWork(workData: Work) {
  try {
    await prisma.$executeRaw<number>`
      INSERT INTO "Works" (url, user_id)
      VALUES (${workData.url}, ${workData.user_id});`;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set work.");
  }
}
