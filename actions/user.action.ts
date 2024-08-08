"use server";

import { User } from "@/type";

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
