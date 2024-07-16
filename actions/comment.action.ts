"use server";

import { Comment } from "@/type";
import { prisma } from "@/lib/prisma/prisma-client";
import { revalidatePath } from "next/cache";

/* 
export async function fetchComment(id: string) {
  try {
    const commentData = await getDoc(doc(db, `comments/${id}`));
    if (commentData.exists()) {
      return commentData.data() as commentType;
    } else {
      throw new Error("Failed to fetch comment.");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch comment.");
  }
}
*/

export async function fetchComment(id: string) {
  try {
    const commentData = await prisma.$queryRaw<Comment[]>`
        SELECT * FROM "Comments" WHERE id = ${id};`;
    return commentData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch comment.");
  }
}

/*
export async function setComment(commentData: commentType, path: string) {
  await Promise.all([
    setDoc(
      doc(db, `reviews/${commentData.parentId}/comments/${commentData.id}`),
      commentData
    ),
    setDoc(doc(db, `comments/${commentData.id}`), commentData),
  ]);

  revalidatePath(path);
}
*/

export async function setComment(commentData: Comment) {
  try {
    await prisma.$executeRaw<Comment[]>`
        INSERT INTO "Comments" (content, review_id, user_id)
        VALUES (${commentData.content}, ${commentData.review_id}, ${commentData.user_id});`;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set review.");
  }

  revalidatePath(`/review`);
}

/*
export async function fetchCommentsByReviewId(id: string) {
  const col = collection(db, `reviews/${id}/comments`);

  let result: commentType[] = [];
  const allReviewsSnapshot = await getDocs(col);
  allReviewsSnapshot.forEach((doc) => {
    result.push(doc.data() as commentType);
  });

  return result;
}
*/

export async function fetchCommentsByReviewId(reviewId: number) {
  try {
    const commentsData = await prisma.$queryRaw<Comment[]>`
        SELECT * FROM "Comments" WHERE review_id = ${reviewId} ORDER BY created_at DESC;`;

    return commentsData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch comment.");
  }
}
