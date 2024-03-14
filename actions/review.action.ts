"use server";

import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  query,
  orderBy,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import db from "@/lib/firebase/store";
import { reviewType } from "@/constants";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { storage } from "@/lib/firebase/storage";
import { ref } from "firebase/storage";
import { deleteImage } from "./image.action";

export async function getAllReviews() {
  const col = query(collection(db, "reviews"), orderBy("id", "desc"));

  let result: reviewType[] = [];
  const allReviewsSnapshot = await getDocs(col);
  allReviewsSnapshot.forEach((doc) => {
    result.push(doc.data() as reviewType);
  });

  return result;
}

export async function fetchReview(reviewId: string) {
  try {
    const reviewData = await getDoc(doc(db, `reviews/${reviewId}`));
    if (reviewData.exists()) {
      return reviewData.data() as reviewType;
    } else {
      throw new Error("Failed to fetch review.");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch review.");
  }
}

export async function setReview(userId: string, reviewData: reviewType) {
  await Promise.all([
    setDoc(doc(db, `reviews/${reviewData.id}`), reviewData),
    setDoc(doc(db, `users/${userId}/reviews/${reviewData.id}`), reviewData),
  ]);

  revalidatePath("/create");
  redirect("/");
}

export async function updateReview(userId: string, reviewData: reviewType) {
  await Promise.all([
    updateDoc(doc(db, `reviews/${reviewData.id}`), reviewData),
    updateDoc(doc(db, `users/${userId}/reviews/${reviewData.id}`), reviewData),
  ]);

  revalidatePath(`/user/${userId}`);
  redirect(`/user/${userId}`);
}

export async function deleteReview(reviewData: reviewType, userId?: string) {
  await Promise.all([
    deleteImage(reviewData.id),
    deleteDoc(doc(db, `reviews/${reviewData.id}`)),
    deleteDoc(doc(db, `users/${userId}/reviews/${reviewData.id}`)),
  ]);

  revalidatePath(`/user/${userId}`);
  redirect(`/user/${userId}`);
}

export async function fetchReviewsByUser(userId: string) {
  const col = query(
    collection(db, `users/${userId}/reviews`),
    orderBy("id", "desc")
  );

  let result: reviewType[] = [];

  try {
    const allReviewsSnapshot = await getDocs(col);
    allReviewsSnapshot.forEach((doc) => {
      result.push(doc.data() as reviewType);
    });

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch reviews.");
  }
}

export async function fetchReviewsByTag(searchTag: string) {
  const col = query(
    collection(db, "reviews"),
    where("tags", "array-contains", searchTag)
  );
  let result: reviewType[] = [];
  try {
    const allReviewsSnapshot = await getDocs(col);
    allReviewsSnapshot.forEach((doc) => {
      result.push(doc.data() as reviewType);
    });

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch reviews.");
  }
}

export async function fetchReviewsByTagAndUser(searchTag: string, userId: string) {
  const col = query(
    collection(db, `users/${userId}/reviews`),
    where("tags", "array-contains", searchTag)
  );
  let result: reviewType[] = [];
  try {
    const allReviewsSnapshot = await getDocs(col);
    allReviewsSnapshot.forEach((doc) => {
      result.push(doc.data() as reviewType);
    });

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch reviews.");
  }
}

export async function fetchReviewsByFilter(searchTag?: string, userId?: string) {
  try{
    if(!searchTag && !userId) {
      return getAllReviews()
    }
  
    else if(!searchTag && userId) {
      return fetchReviewsByUser(userId)
    }
  
    else if(searchTag && !userId) {
      return fetchReviewsByTag(searchTag)
    }
  
    else if(searchTag && !userId) {
      return fetchReviewsByTag(searchTag)
    }
  
    else if(searchTag && userId) {
      return fetchReviewsByTagAndUser(searchTag, userId)
    }

    else {
      return []
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch reviews.");
  }
}

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