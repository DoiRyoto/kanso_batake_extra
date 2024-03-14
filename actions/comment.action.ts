"use server"

import { commentType } from "@/constants";
import db from "@/lib/firebase/store";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

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

export async function setComment(commentData: commentType, path: string) {
  await Promise.all([
    setDoc(doc(db, `reviews/${commentData.parentId}/comments/${commentData.id}`), commentData),
    setDoc(doc(db, `comments/${commentData.id}`), commentData),
  ]);
  
  revalidatePath(path);
}

export async function fetchCommentsByReviewId(id: string) {
  const col = collection(db, `reviews/${id}/comments`);

  let result: commentType[] = [];
  const allReviewsSnapshot = await getDocs(col);
  allReviewsSnapshot.forEach((doc) => {
    result.push(doc.data() as commentType);
  });

  return result;
}