"use server";

import { Comment } from "@/type";
import { revalidatePath } from "next/cache";

export async function fetchComment(id: string): Promise<Comment> {
  try {
    const requestUrl = new URL(`${process.env.API_URL}/comments/${id}`);
    const response = await fetch(requestUrl, {
      method: "GET",
    });

    const commentData: Comment = await response.json();
    return commentData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch comment.");
  }
}

export async function setComment(commentData: Comment) {
  try {
    const requestUrl = new URL(`${process.env.API_URL}/comments`);
    await fetch(requestUrl, {
      method: "POST",
      body: JSON.stringify(commentData),
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch comment.");
  }

  revalidatePath(`/review`);
}

export async function fetchCommentsByReviewId(reviewId: number) {
  try {
    const requestUrl = new URL(
      `${process.env.API_URL}/comments?reviewId=${reviewId}`,
    );
    const response = await fetch(requestUrl, {
      method: "GET",
    });

    const commentData: Comment = await response.json();
    return commentData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch comment.");
  }
}
