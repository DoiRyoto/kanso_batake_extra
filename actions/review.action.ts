"use server";

// import { reviewInterface } from "@/constants";
import { Review } from "@/type";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteImage } from "./image.action";
import { prisma } from "@/lib/prisma/prisma-client";

// export async function fetchAllReviews(): Promise<Review[]> {
//   try {
//     const response = await fetch(`http://localhost:3000/api/reviews/`, {
//       method: "GET",
//     });
//     const reviewData: Review[] = await response.json();
//     return reviewData;
//   } catch (error) {
//     console.log(error);
//     throw new Error("Failed to fetch reviews.");
//   }
// }

export async function fetchReview(reviewId: number): Promise<Review> {
  try {
    const response = await fetch(`${process.env.API_URL}/reviews/${reviewId}`, {
      method: "GET",
    });
    const reviewData: Review = await response.json();
    return reviewData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch review.");
  }
}

export async function setReview(reviewData: Review) {
  try {
    // userIdとreviewDataをポストする
    const response = await fetch(`${process.env.API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviewData }),
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set review.");
  }
}

export async function updateReview(userId: string, reviewData: Review) {
  try {
    await prisma.$executeRaw`
        UPDATE "Reviews" 
        SET content = ${reviewData.content}, paper_data = ${reviewData.paper_data}, paper_title = ${reviewData.paper_title}, user_id = ${userId}, thumbnail_url = ${reviewData.thumbnail_url}
        WHERE id = ${reviewData.id};`;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set review.");
  }

  revalidatePath(`/user/${userId}`);
  redirect(`/user/${userId}`);
}

/*
export async function deleteReview(
  reviewData: reviewInterface,
  userId: string
) {
  await Promise.all([
    deleteImage(reviewData.id.toString()),
    deleteDoc(doc(db, `reviews/${reviewData.id}`)),
    deleteDoc(doc(db, `users/${userId}/reviews/${reviewData.id}`)),
  ]);

  revalidatePath(`/user/${userId}`);
  redirect(`/user/${userId}`);
}
*/

export async function deleteReview(reviewData: Review, userId: string) {
  try {
    await prisma.$executeRaw<Review[]>`
    DELETE FROM "Reviews"
    WHERE id = ${reviewData.id};`;

    //わからん。
    /*
  try {
    await Promise.all([deleteImage(reviewData.id.toString()), prismaQuery]);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete review.");
  }*/
  } catch (error) {
    throw new Error("failed to delete review.");
  }

  revalidatePath(`/user/${userId}`);
  redirect(`/user/${userId}`);
}

export async function fetchReviewsByFilter(
  searchTag?: string,
  userId?: string,
  affiliationId?: string,
): Promise<Review[]> {
  try {
    const params = {
      searchTag: searchTag || "",
      userId: userId || "",
      affiliationId: affiliationId || "",
    };

    const urlSearchParam = new URLSearchParams(params).toString();
    const requestUrl = new URL(
      `${process.env.API_URL}/reviews?` + urlSearchParam,
    );

    const response = await fetch(requestUrl, {
      method: "GET",
    });
    const reviewData: Review[] = await response.json();
    return reviewData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch reviews.");
  }
}
