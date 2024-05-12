"use server";

import { reviewInterface } from "@/constants";
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

export async function fetchAllReviews(): Promise<reviewInterface[]> {
  try {
    const reviewsData = await prisma.$queryRaw<reviewInterface[]>`
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

export async function fetchReview(
  reviewId: number,
): Promise<reviewInterface[]> {
  try {
    const reviewData = await prisma.$queryRaw<reviewInterface[]>`
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

export async function setReview(
  auth_userId: string,
  reviewData: reviewInterface,
): Promise<reviewInterface[]> {
  try {
    await prisma.$executeRaw<reviewInterface[]>`
        INSERT INTO "Reviews" (contents, paper_data, paper_title, user_id, image_url)
        VALUES (${reviewData.content}, ${reviewData.paper_data}, ${reviewData.paper_title}, ${reviewData.user_id}, ${reviewData.thumbnail_url});`;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set review.");
  }

  revalidatePath(`/user/${auth_userId}`);
  redirect(`/user/${auth_userId}`);
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

export async function updateReview(
  userId: string,
  reviewData: reviewInterface,
) {
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

export async function deleteReview(
  reviewData: reviewInterface,
  userId: string,
) {
  const prismaQuery = prisma.$executeRaw`
    DELETE FROM "Reviews"
    WHERE id = ${reviewData.id};`;

  try {
    await Promise.all([deleteImage(reviewData.id.toString()), prismaQuery]);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete review.");
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

export async function fetchReviewsByUser(
  userId: string,
): Promise<reviewInterface[]> {
  try {
    const reviewsData = await prisma.$queryRaw<reviewInterface[]>`
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

export async function fetchReviewsByTag(
  searchTag: string,
): Promise<reviewInterface[]> {
  try {
    const reviewsData = await prisma.$queryRaw<reviewInterface[]>`
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
): Promise<reviewInterface[]> {
  try {
    const reviewsData = await prisma.$queryRaw<reviewInterface[]>`
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
): Promise<reviewInterface[]> {
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
): Promise<reviewInterface[]> {
  try {
    const reviewsData = await prisma.$queryRaw<reviewInterface[]>`
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
