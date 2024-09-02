import { prisma } from "@/lib/prisma/prisma-client";
import { Comments } from "@prisma/client";
import { Comment } from "@/type";
import { NextRequest, NextResponse } from "next/server";

async function setComment(comment: Comment) {
  try {
    await prisma.$executeRaw`
          INSERT INTO "Comments" (content, review_id, user_id)
          VALUES (${comment.content}, ${comment.review_id}, ${comment.user_id})`;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set comment.");
  }
}

async function fetchComment(reviewId: number): Promise<Comments[]> {
  try {
    const comments = await prisma.$queryRaw<Comments[]>`
            SELECT * 
            FROM "Comments" 
            WHERE review_id = ${reviewId}
            ORDER BY "Comments".created_at DESC;
        `;
    return comments;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch comment.");
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const reviewId = parseInt(params.id);
  if (isNaN(reviewId)) {
    return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
  }
  try {
    const commentDatas: Comment[] = await fetchComment(reviewId);
    return NextResponse.json(commentDatas, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to fetch comment associated with review with ID = ${params.id}.`,
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const commentData = await request.json();
  try {
    await setComment(commentData);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to post Comment associated with review with ID = ${params.id}`,
      },
      { status: 500 },
    );
  }
}
