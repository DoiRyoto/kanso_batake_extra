"use server";

import { Field } from "@/type";
import { prisma } from "@/lib/prisma/prisma-client";

export async function fetchAllFields(): Promise<Field[]> {
  try {
    const fieldsData = await prisma.$queryRaw<Field[]>`
        SELECT * FROM "Fields"`;

    return fieldsData;
  } catch (error) {
    throw new Error("Failed to fetch fields.");
  }
}

export async function fetchFieldsByUserId(userId: string): Promise<Field[]> {
  try {
    const affiliationsData = await prisma.$queryRaw<Field[]>`
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

export async function fetchFieldIdByFieldName(
  fieldName: string,
): Promise<number> {
  try {
    const fieldId = await prisma.$queryRaw<{ id: number }[]>`
      SELECT "id"
      FROM "Fields"
      WHERE name = ${fieldName};`;
    if (!fieldId.length) {
      return 0;
    }
    return fieldId[0].id;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch field id.");
  }
}

export async function setField(fieldData: Field) {
  try {
    await prisma.$executeRaw<number>`
      INSERT INTO "Fields" (name)
      VALUES (${fieldData.name});`;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set field.");
  }
}

export async function setFieldToUser(field_id: number, user_id: string) {
  try {
    await prisma.$executeRaw`
      INSERT INTO "_FieldsToUsers" (field_id, user_id)
      VALUES (${field_id}, ${user_id});`;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set field to user.");
  }
}
