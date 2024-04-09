"use server";

import { affiliationInterface } from "@/constants";
import { prisma } from "@/lib/prisma/prisma-client";

export async function fetchAllAffiliations(): Promise<affiliationInterface[]> {
  try {
    const affiliationsData = await prisma.$queryRaw<affiliationInterface[]>`
        SELECT * FROM "Affiliations"`;

    return affiliationsData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch affiliations.");
  }
}

export async function fetchAffiliation(
  affiliationId: number,
): Promise<affiliationInterface[]> {
  try {
    const affiliationsData = await prisma.$queryRaw<affiliationInterface[]>`
        SELECT * FROM "Affiliations" WHERE id = ${affiliationId}`;

    return affiliationsData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch affiliations.");
  }
}

export async function fetchAffiliationsByUserId(
  userId: string,
): Promise<affiliationInterface[]> {
  try {
    const affiliationsData = await prisma.$queryRaw<affiliationInterface[]>`
        SELECT "Affiliations".*
        FROM "Affiliations"
        JOIN "_AffiliationsToUsers" ON "Affiliations".id = "_AffiliationsToUsers".affiliation_id
        JOIN "Users" ON "_AffiliationsToUsers".user_id = "Users".id
        WHERE "Users".id = ${userId};`;

    return affiliationsData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch affiliations.");
  }
}

export async function fetchAffiliationIdByAffiliationName(
  affiliationData: affiliationInterface,
): Promise<number> {
  try {
    const affiliationId = await prisma.$queryRaw<number>`
      SELECT "id"
      FROM "Affiliations"
      WHERE name = ${affiliationData.name};`;
    if (affiliationId == 0) {
      return 0;
    }
    return affiliationId;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch affiliation id.");
  }
}

export async function setAffiliation(affiliationData: affiliationInterface) {
  try {
    await prisma.$executeRaw<number>`
      INSERT INTO "Affiliations" (name)
      VALUES (${affiliationData.name});`;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set affiliation.");
  }
}

export async function setAffiliationToUser(
  affiliation_id: number,
  user_id: string,
) {
  try {
    await prisma.$executeRaw`
      INSERT INTO "_AffiliationsToUsers" (affiliation_id, user_id)
      VALUES (${affiliation_id}, ${user_id});`;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set affiliation to user.");
  }
}
