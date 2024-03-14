"use server";

import { userType } from "@/constants";
import db from "@/lib/firebase/store";
import { arrayUnion, doc, getDoc, setDoc, updateDoc, query, where, collection, getDocs } from "firebase/firestore";

export async function fetchUser(userId: string) {
  try {
    const userData = await getDoc(doc(db, `users/${userId}`));
    if (userData.exists()) {
      return userData.data() as userType;
    } else {
      throw new Error("Failed to fetch user.");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch user.");
  }
}

export async function fetchUserIdsByLabId(labId: string) {
    try {
        const labData = await getDoc(doc(db, `labs/${labId}`))
        if (labData.exists()) {
          return labData.data().users as string[];  
        } else {
            throw new Error("LabData does not exist.");
        }
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch reviews.")
    }
}

export async function fetchUsers(userIds: string[]) {
    const promises = userIds.map((userId) => fetchUser(userId))
    const users = await Promise.all(promises);
    return users;
}

export async function setUser(userData: userType) {
  try {
    await Promise.all([
      setDoc(doc(db, `users/${userData.id}`), userData),
      updateDoc(doc(db, `labs/${userData.affiliation}`), {
        users: arrayUnion(userData.id),
      }),
    ]);
  } catch (error) {
    throw new Error("Failed to set user.");
  }
}

// reviewsコレクション内のreviewのユーザー情報を更新
async function updateUserInfoOnReview(userData: userType) {
  // reviewsコレクション内の書き換え
  const col = query(
    collection(db, `reviews`),
    where("createdBy", "==", userData.id)
  );
  let docRef;

  try {
    const allReviewsSnapshot = await getDocs(col);
    allReviewsSnapshot.forEach((docSnap) => {
      docRef = doc(db, "reviews", docSnap.id);
      updateDoc(docRef, {"reviewerName": userData.name, "reviewerFields": userData.field});
    });
  } catch(e) {
    throw new Error("Failed to update user info on review.");
  }

  // users コレクション内のreviewsサブコレクションの書き換え
  try {
    const allUserReviewsSnapshot = await getDocs(collection(db, `users/${userData.id}/reviews`));
    allUserReviewsSnapshot.forEach((docSnap) => {
        docRef = doc(db, `users/${userData.id}/reviews`, docSnap.id);
        updateDoc(docRef, {"reviewerName": userData.name, "reviewerFields":userData.field});
    })
  } catch(e) {
    throw new Error("Fialed to update user info on user's review.");
  }
}

export async function updateUser(userData: userType) {
  try {
    await Promise.all([
      updateDoc(doc(db, `users/${userData.id}`), userData),
      updateUserInfoOnReview(userData),
    ]);
  } catch (error) {
    throw new Error("Failed to update user.");
  }
}