"use server"

import { collection, getDocs, setDoc, doc, query, orderBy, where } from "firebase/firestore"
import db from "@/lib/firebase/store"
import { labType, affiliations } from "@/constants"

export const setAllLabs = async () => {
  try {
    const promises = affiliations.map((affiliation) => setDoc(doc(db, `labs/${affiliation.value}`), {...affiliation, users: []}))
    await Promise.all(promises)
  } catch (error) {
    console.log(error)
    throw new Error("Failed to set labs.")
  }
}

export async function fetchAllLabs() {
  const col = query(collection(db, "labs"), orderBy("value", "desc"));

  let result: labType[] = [];
  const allReviewsSnapshot = await getDocs(col);
  allReviewsSnapshot.forEach((doc) => {
    result.push(doc.data() as labType);
  });
  return result;
}