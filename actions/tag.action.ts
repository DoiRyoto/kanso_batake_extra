import { tagInterface } from "@/constants";
import { prisma } from "@/lib/prisma/prisma-client";

export async function fetchAllTags(): Promise<tagInterface[]> {
  try {
    const tagsData = await prisma.$queryRaw<tagInterface[]>`
        SELECT * FROM "Tags"`;

    return tagsData;
  } catch (error) {
    throw new Error("Failed to fetch tags.");
  }
}

export async function fetchTagsByReviewId(
  reviewId: number
): Promise<tagInterface[]> {
  try {
    const tagsData = await prisma.$queryRaw<tagInterface[]>`
        SELECT "Tags".*
        FROM "Tags"
        JOIN "_ReviewsToTags" ON "Tags".id = "_ReviewsToTags".tag_id
        JOIN "Reviews" ON "_ReviewsToTags".review_id = "Reviews".id
        WHERE "Reviews".id = ${reviewId};`;

    return tagsData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch tags.");
  }
}

export async function setTag(tagData: tagInterface) {
  try {
    await prisma.$executeRaw<number>`
      INSERT INTO "Tags" (name)
      VALUES (${tagData.name});`;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set field.");
  }
}
