import { NextRequest, NextResponse } from "next/server";
import { Review } from "@/type";
import { prisma } from "@/lib/prisma/prisma-client";

export async function fetchReview(reviewId: number): Promise<Review | null> {
  try {
    const review: Review | null = await prisma.$queryRaw<Review[]>`
    SELECT * FROM "Reviews" WHERE id = ${reviewId};
    `.then((result) => result[0] || null);
    return review;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch reviews.");
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const reviewId = parseInt(params.id);
    if (isNaN(reviewId)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }

    const review = await fetchReview(reviewId);
    if (!review) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }
    return NextResponse.json(review);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to fetch review with ID = ${params.id}` },
      { status: 500 },
    );
  }
}
