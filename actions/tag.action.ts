import { tagInterface } from "@/constants";
import { prisma } from "@/lib/prisma/prisma-client";
import { Tag } from "@/type";

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
  reviewId: number,
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

export async function setTag(tags: Tag[]) {
  try {
    for (const tagData of tags) {
      await fetch("/api/tag/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tagData }),
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set tag.");
  }
}

export async function setTagsToReview(reviewId: number, tags: Tag[]) {
  try {
    // tagを一個づつPOSTする
    for (const tagData of tags) {
      const body = {
        tagData,
        reviewId,
      };
      await fetch("/api/tagToreview/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body }),
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set TagToReview table.");
  }
}
