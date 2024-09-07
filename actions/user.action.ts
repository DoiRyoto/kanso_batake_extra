"use server";

import db from "@/lib/firebase/store";
import { prisma } from "@/lib/prisma/prisma-client";
import { User, userType } from "@/type";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

export async function fetchUser(userId: string): Promise<User> {
  try {
    const requestUrl = new URL(`${process.env.API_URL}/users/${userId}`);
    const response = await fetch(requestUrl, {
      method: "GET",
    });

    const userData: User = await response.json();
    return userData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch user.");
  }
}

export async function fetchUsersByAffiliationId(
  affiliationId: number,
): Promise<User[]> {
  try {
    const requestUrl = new URL(
      `${process.env.API_URL}/users?affiliationId=${affiliationId}`,
    );
    const response = await fetch(requestUrl, {
      method: "GET",
    });

    const usersData = await response.json();
    return usersData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch users.");
  }
}

export async function setUser(userData: User) {
  try {
    const requestUrl = new URL(`${process.env.API_URL}/users`);
    await fetch(requestUrl, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set user.");
  }
}

/*
同じ分野のユーザーを取得する関数を使う場所が多分ない

export async function getUsersbyUserField(userId: string) {
  const user = await fetchUser(userId);
  const users: User[] = [];
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    usersSnapshot.forEach((doc) => {
      //userIdさんと別人かつ同じ分野の人か？
      if (doc.id != userId && (doc.data() as userInterface).field == user.field) {
        //同じならusersにプッシュする
        users.push(doc.data() as userInterface);
      }
    });
    return users;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch users.");
  }
}
*/

export async function fetchUserByFB(userId: string) {
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

export async function fetchUsersByFB() {
  const col = query(collection(db, "users"), orderBy("id", "desc"));
  let result: userType[] = [];
  const allUsersSnapshot = await getDocs(col);
  allUsersSnapshot.forEach((doc) => {
    result.push(doc.data() as userType);
  });
  return result;
}
