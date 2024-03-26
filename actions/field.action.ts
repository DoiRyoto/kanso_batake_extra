import { fieldInterface } from "@/constants";
import { prisma } from "@/lib/prisma/prisma-client";

export async function fetchAllFields(): Promise<fieldInterface[]> {
  try {
    const fieldsData = await prisma.$queryRaw<fieldInterface[]>`
        SELECT * FROM "Fields"`;

    return fieldsData;
  } catch (error) {
    throw new Error("Failed to fetch fields.");
  }
}

export async function fetchFieldsByUserId(
  userId: string
): Promise<fieldInterface[]> {
  try {
    const affiliationsData = await prisma.$queryRaw<fieldInterface[]>`
        SELECT "Fields".*
        FROM "Fields"
        JOIN "_FieldsToUsers" ON "Fields".id = "_FieldsToUsers".field_id
        JOIN "Users" ON "_FieldsToUsers".user_id = "Users".id
        WHERE "Users".id = ${userId};`;

    return affiliationsData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch fields.");
  }
}

export async function setField(fieldData: fieldInterface) {
  try {
    await prisma.$executeRaw<number>`
      INSERT INTO "Fields" (name)
      VALUES (${fieldData.name});`;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set field.");
  }
}
