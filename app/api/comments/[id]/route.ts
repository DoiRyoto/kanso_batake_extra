import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma-client";
import { Tag, Comment } from "@/type";

async function fetchComment(commentId: number): Promise<Tag[]> {
  try {
    const tagData = await prisma.$queryRaw<Tag[]>`
        SELECT *
        FROM "Comments" c
        WHERE c.id = ${commentId};
        `;
    return tagData;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch comment.");
  }
}

async function deleteComment(commentId: number): Promise<number> {
  try {
    const count = await prisma.$executeRaw`
      DELETE FROM "Comments" WHERE id = ${commentId};
    `;
    return count;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete comment.");
  }
}

async function updateComment(commentId: number, commentData: Comment) {
  try {
    const newCommentData = await prisma.$queryRaw<Tag[]>`
        INSERT INTO "Comments" (id, content, user_id, review_id)
        VALUES (${commentId}, ${commentData.content}, ${commentData.user_id}, ${commentData.review_id})
        ON CONFLICT (id) DO UPDATE SET
          content = EXCLUDED.content,
          user_id = EXCLUDED.user_id,
          review_id = EXCLUDED.review_id
        RETURNING *;
    `;
    return newCommentData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update comment.");
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid comment ID" },
        { status: 400 },
      );
    }

    const commentData = await fetchComment(id);
    if (!commentData.length) {
      return NextResponse.json(
        { error: `No such comment with ID = ${params.id}` },
        { status: 400 },
      );
    }
    return NextResponse.json(commentData[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to fetch comment with ID = ${params.id}` },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid comment ID" },
        { status: 400 },
      );
    }

    const count = await deleteComment(id);
    if (count === 0) {
      return NextResponse.json(
        { error: `No such comment with ID = ${params.id}` },
        { status: 500 },
      );
    }
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to delete comment with ID = ${params.id}` },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid comment ID" },
        { status: 400 },
      );
    }
    const newCommentData = await request.json();

    const user = await updateComment(id, newCommentData);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to delete comment with ID = ${params.id}` },
      { status: 500 },
    );
  }
}
