"use server";

export async function setLikedReview(reviewId: number, userId: string) {
  console.log("front set request");
  try {
    const res = await fetch(
      `${process.env.API_URL}/reviews/${reviewId}/likes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      },
    );
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set like.");
  }
}

export async function deleteLikedReview(reviewId: number, userId: string) {
  console.log("front delete request");
  try {
    await fetch(`${process.env.API_URL}/reviews/${reviewId}/likes`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete like.");
  }
}
