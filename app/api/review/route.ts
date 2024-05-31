import { NextRequest, NextResponse } from "next/server";
import { Review } from "@/type";
import { prisma } from "@/lib/prisma/prisma-client";

async function fetchAllReviews(): Promise<Review[]> {
  try {
    const reviews: Review[] = await prisma.$queryRaw<Review[]>`
      SELECT * FROM "Reviews" ORDER BY created_at DESC;
    `;
    return reviews;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch all reviews.");
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const reviews = await fetchAllReviews();
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch all reviews." },
      { status: 500 },
    );
  }
}
