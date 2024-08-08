"use server";

import { prisma } from "@/lib/prisma/prisma-client";
import { User } from "@/type";

/*
export async function fetchUser(userId: string) {
  try {
    const userData = await getDoc(doc(db, `users/${userId}`));
    if (userData.exists()) {
      return userData.data() as userInterface;
    } else {
      throw new Error("Failed to fetch user.");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch user.");
  }
}
*/

export async function fetchUser(userId: string): Promise<User[]> {
  try {
    const userData = await prisma.$queryRaw<User[]>`
        SELECT * FROM "Users" WHERE id = ${userId};`;

    return userData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch user.");
  }
}

/* 
export async function fetchUserIdsByLabId(labId: string) {
  try {
    const labData = await getDoc(doc(db, `labs/${labId}`));
    if (labData.exists()) {
      return labData.data().users as string[];
    } else {
      throw new Error("LabData does not exist.");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch reviews.");
  }
}
*/

export async function fetchUsersByAffiliationId(
  affiliationId: number
): Promise<User[]> {
  try {
    const usersData = await prisma.$queryRaw<User[]>`
      SELECT "Users".*
      FROM "Users"
      JOIN "_AffiliationsToUsers" ON "Users".id = "_AffiliationsToUsers".user_id
      JOIN "Affiliations" ON "_AffiliationsToUsers".affiliation_id = "Affiliations".id
      WHERE "Affiliations".id = ${affiliationId};`;

    return usersData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch users.");
  }
}

/*
もうまとめてユーザーを取得する必要はない

export async function fetchUsers(userIds: string[]) {
  const promises = userIds.map((userId) => fetchUser(userId));
  const users = await Promise.all(promises);
  return users;
}
*/

/*
export async function setUser(userData: userInterface) {
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
*/

export async function setUser(userData: User) {
  try {
    const requestUrl = new URL(`${process.env.API_URL}/users/${userData.id}`);
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
