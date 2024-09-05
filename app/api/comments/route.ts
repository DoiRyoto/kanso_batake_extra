import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma-client";
import { Comment as commentType } from "@/type";
import { Comments } from "@prisma/client";

async function fetchComment(): Promise<Comments[]> {
  try {
    const comments = await prisma.$queryRaw<Comments[]>`
      SELECT * 
      FROM "Comments";
    `;
    return comments;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch comment.");
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const commentDatas: commentType[] = await fetchComment();
    return NextResponse.json(commentDatas, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch all Comment` },
      { status: 500 },
    );
  }
}
