import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma-client";
import { Comment as commentType } from "@/type";
import { Comments } from "@prisma/client";

async function setComment(comment: commentType) {
  try {
    await prisma.$executeRaw`
        INSERT INTO "Comments" (content, review_id, user_id)
        VALUES (${comment.content}, ${comment.review_id}, ${comment.user_id})`;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set comment.");
  }
}

async function fetchComment(reviewId: number | null): Promise<Comments[]> {
  try {
    let comments: Comments[];
    if (reviewId) {
      comments = await prisma.$queryRaw<Comments[]>`
                SELECT * 
                FROM "Comments" 
                WHERE review_id = ${reviewId}
                ORDER BY "Comments".created_at DESC;`;
    } else {
      comments = await prisma.$queryRaw<Comments[]>`
                SELECT * 
                FROM "Comments" 
                ORDER BY "Comments".created_at DESC;`;
    }
    return comments;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch comment.");
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const params = await request.json();
  try {
    await setComment(params);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to post Comment` },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const reviewIdString = searchParams.get("reviewId");
  const reviewId = reviewIdString ? parseInt(reviewIdString) : null;
  try {
    const commentDatas: commentType[] = await fetchComment(reviewId);
    return NextResponse.json(commentDatas, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch Comment` },
      { status: 500 },
    );
  }
}
