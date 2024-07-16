import { prisma } from "@/lib/prisma/prisma-client";
import { Tag } from "@/type";

export async function fetchAllTags(): Promise<Tag[]> {
  try {
    const tagsData = await prisma.$queryRaw<Tag[]>`
        SELECT * FROM "Tags"`;

    return tagsData;
  } catch (error) {
    throw new Error("Failed to fetch tags.");
  }
}

export async function fetchTagsByReviewId(reviewId: number): Promise<Tag[]> {
  try {
    const tagsData = await prisma.$queryRaw<Tag[]>`
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
    const req = tags.map((tag) =>
      fetch("/api/tag/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tag }),
      }),
    );
    await Promise.all(req);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set tag.");
  }
}

export async function setTagsToReview(reviewId: number, tags: Tag[]) {
  try {
    // tagを一個づつPOSTする
    const req = tags.map((tag) =>
      fetch("/api/tagToreview/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tag, reviewId }),
      }),
    );
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set TagToReview table.");
  }
}
