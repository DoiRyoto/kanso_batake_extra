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

async function updateReview(reviewData: Review) {
  try {
    await prisma.$executeRaw`
        UPDATE "Reviews" 
        SET content = ${reviewData.content}, paper_data = ${reviewData.paper_data}, paper_title = ${reviewData.paper_title}, user_id = ${reviewData.user_id}, thumbnail_url = ${reviewData.thumbnail_url}
        WHERE id = ${reviewData.id};`;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update review.");
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

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const params = await request.json();
  console.log(params);
  try {
    await updateReview(params);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to update Review` },
      { status: 500 },
    );
  }
}
