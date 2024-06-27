"use server";

// import { reviewInterface } from "@/constants";
import { Review } from "@/type";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteImage } from "./image.action";
import { prisma } from "@/lib/prisma/prisma-client";

/*
export async function getAllReviews() {
  const col = query(collection(db, "reviews"), orderBy("id", "desc"));

  let result: reviewInterface[] = [];
  const allReviewsSnapshot = await getDocs(col);
  allReviewsSnapshot.forEach((doc) => {
    result.push(doc.data() as reviewInterface);
  });

  return result;
}
*/

export async function fetchAllReviews(): Promise<Review[]> {
  try {
    const reviewsData = await prisma.$queryRaw<Review[]>`
        SELECT * FROM "Reviews" ORDER BY created_at DESC`;

    return reviewsData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch reviews.");
  }
}

/*
export async function fetchReview(reviewId: string) {
  try {
    const reviewData = await getDoc(doc(db, `reviews/${reviewId}`));
    if (reviewData.exists()) {
      return reviewData.data() as reviewInterface;
    } else {
      throw new Error("Failed to fetch review.");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch review.");
  }
}
*/

export async function fetchReview(reviewId: number): Promise<Review[]> {
  try {
    const reviewData = await prisma.$queryRaw<Review[]>`
        SELECT * FROM "Reviews" WHERE id = ${reviewId};`;

    return reviewData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch review.");
  }
}

/*
export async function setReview(userId: string, reviewData: reviewInterface) {
  await Promise.all([
    setDoc(doc(db, `reviews/${reviewData.id}`), reviewData),
    setDoc(doc(db, `users/${userId}/reviews/${reviewData.id}`), reviewData),
  ]);

  revalidatePath("/create");
  redirect("/");
}
*/

export async function setReview(reviewData: Review) {
  try {
    // userIdとreviewDataをポストする
    const response = await fetch("http://localhost:3000/api/reviews", {
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

/*
export async function updateReview(
  userId: string,
  reviewData: reviewInterface
) {
  await Promise.all([
    updateDoc(doc(db, `reviews/${reviewData.id}`), reviewData),
    updateDoc(doc(db, `users/${userId}/reviews/${reviewData.id}`), reviewData),
  ]);

  revalidatePath(`/user/${userId}`);
  redirect(`/user/${userId}`);
}
*/

export async function updateReview(userId: string, reviewData: Review) {
  try {
    await prisma.$executeRaw`
        UPDATE "Reviews" 
        SET content = ${reviewData.content}, paper_data = ${reviewData.paper_data}, paper_title = ${reviewData.paper_title}, user_id = ${reviewData.user_id}, thumbnail_url = ${reviewData.thumbnail_url}
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

/*
export async function fetchReviewsByUser(userId: string) {
  const col = query(
    collection(db, `users/${userId}/reviews`),
    orderBy("id", "desc")
  );

  let result: reviewInterface[] = [];

  try {
    const allReviewsSnapshot = await getDocs(col);
    allReviewsSnapshot.forEach((doc) => {
      result.push(doc.data() as reviewInterface);
    });

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch reviews.");
  }
}
*/

export async function fetchReviewsByUser(userId: string): Promise<Review[]> {
  try {
    const reviewsData = await prisma.$queryRaw<Review[]>`
      SELECT *
      FROM "Reviews"
      WHERE user_id = ${userId}
      ORDER BY created_at DESC;`;

    return reviewsData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fecth reviews.");
  }
}

/*
export async function fetchReviewsByTag(searchTag: string) {
  const col = query(
    collection(db, "reviews"),
    where("tags", "array-contains", searchTag)
  );
  let result: reviewInterface[] = [];
  try {
    const allReviewsSnapshot = await getDocs(col);
    allReviewsSnapshot.forEach((doc) => {
      result.push(doc.data() as reviewInterface);
    });

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch reviews.");
  }
}
*/

export async function fetchReviewsByTag(searchTag: string): Promise<Review[]> {
  try {
    const reviewsData = await prisma.$queryRaw<Review[]>`
      SELECT "Reviews".*
      FROM "Reviews"
      JOIN "_ReviewsToTags" ON "Reviews".id = "_ReviewsToTags".review_id
      JOIN "Tags" ON "_ReviewsToTags".tag_id = "Tags".id
      WHERE "Tags".name = ${searchTag}
      ORDER BY "Reviews".created_at DESC;`;

    return reviewsData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fecth reviews.");
  }
}

/*
export async function fetchReviewsByTagAndUser(
  searchTag: string,
  userId: string
) {
  const col = query(
    collection(db, `users/${userId}/reviews`),
    where("tags", "array-contains", searchTag)
  );
  let result: reviewInterface[] = [];
  try {
    const allReviewsSnapshot = await getDocs(col);
    allReviewsSnapshot.forEach((doc) => {
      result.push(doc.data() as reviewInterface);
    });

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch reviews.");
  }
}
*/

export async function fetchReviewsByTagAndUser(
  searchTag: string,
  userId: string,
): Promise<Review[]> {
  try {
    const reviewsData = await prisma.$queryRaw<Review[]>`
      SELECT "Reviews".*
      FROM "Reviews"
      JOIN "_ReviewsToTags" ON "Reviews".id = "_ReviewsToTags".review_id
      JOIN "Tags" ON "_ReviewsToTags".tag_id = "Tags".id
      WHERE "Tags".name = ${searchTag}
      AND "Reviews".user_id = ${userId}
      ORDER BY "Reviews".created_at DESC;`;

    return reviewsData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fecth reviews.");
  }
}

export async function fetchReviewsByFilter(
  searchTag?: string,
  userId?: string,
): Promise<Review[]> {
  try {
    if (!searchTag && !userId) {
      return fetchAllReviews();
    } else if (!searchTag && userId) {
      return fetchReviewsByUser(userId);
    } else if (searchTag && !userId) {
      return fetchReviewsByTag(searchTag);
    } else if (searchTag && !userId) {
      return fetchReviewsByTag(searchTag);
    } else if (searchTag && userId) {
      return fetchReviewsByTagAndUser(searchTag, userId);
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch reviews.");
  }
}

export async function fetchReviewsByAffiliationId(
  affiliationId: number,
): Promise<Review[]> {
  try {
    const reviewsData = await prisma.$queryRaw<Review[]>`
      SELECT "Reviews".*
      FROM "Reviews"
      JOIN "Users" ON "Reviews".user_id = "Users".id
      JOIN "_AffiliationsToUsers" ON "Users".id = "_AffiliationsToUsers".user_id
      JOIN "Affiliations" ON "_AffiliationsToUsers".affiliation_id = "Affiliations".id
      WHERE "Affiliations".id = ${affiliationId}
      ORDER BY "Reviews".created_at DESC;
    `;

    return reviewsData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch reviews.");
  }
}

/*

こういう汎用的な関数は今後使わなくなるはず

export async function fetchReviewsByUserIds(userIds: string[], tag?: string) {
  try {
    const promises = userIds.map((userId) => fetchReviewsByFilter(tag, userId));
    const reviews = await Promise.all(promises);
    return reviews.flat().sort();
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch reviews.");
  }
}
*/
