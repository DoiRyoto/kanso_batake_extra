import { NextRequest, NextResponse } from "next/server";
import { Paper, Review } from "@/type";
import { prisma } from "@/lib/prisma/prisma-client";
import { Reviews, Users, Tags, Comments } from "@prisma/client";

async function fetchReview(reviewId: number): Promise<Reviews[]> {
  try {
    const review = await prisma.$queryRaw<Reviews[]>`
      SELECT * FROM "Reviews" WHERE id = ${reviewId};
    `;
    return review;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch reviews.");
  }
}

async function fetchTagsByReviewId(reviewId: number): Promise<Tags[]> {
  try {
    const tags = await prisma.$queryRaw<Tags[]>`
        SELECT "Tags".*
        FROM "Tags"
        JOIN "_ReviewsToTags" ON "Tags".id = "_ReviewsToTags".tag_id
        JOIN "Reviews" ON "_ReviewsToTags".review_id = "Reviews".id
        WHERE "Reviews".id = ${reviewId};`;
    return tags;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch tags.");
  }
}

async function fetchCommentsByReviewId(reviewId: number): Promise<Comments[]> {
  try {
    const comments = await prisma.$queryRaw<Comments[]>`
        SELECT "Comments".*
        FROM "Comments"
        JOIN "_ReviewsToComments" ON "Comments".id = "_ReviewsToComments".comment_id
        JOIN "Reviews" ON "_ReviewsToComments".review_id = "Reviews".id
        WHERE "Reviews".id = ${reviewId};`;

    return comments;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch comments.");
  }
}

async function fetchUser(userId: string): Promise<Users[]> {
  try {
    const userData = await prisma.$queryRaw<Users[]>`
        SELECT * FROM "Users" WHERE id = ${userId};`;

    return userData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch user.");
  }
}

async function deleteReview(reviewId: number) {
  try {
    await prisma.$executeRaw`
    DELETE FROM "Reviews"
    WHERE id = ${reviewId};`;
  } catch (error) {
    throw new Error("failed to delete review.");
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    // ReviewIdをnumberに変換
    const reviewId = parseInt(params.id);
    if (isNaN(reviewId)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }
    // reviewsテーブルからreviewsを取得
    const review = await fetchReview(reviewId);
    if (!review.length) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }
    // Tagsテーブルから該当するタグをすべて取得
    const tags = await fetchTagsByReviewId(reviewId);
    // Usersテーブルからレビューの筆者を取得
    const user = await fetchUser(review[0].user_id);
    // Commentsテーブルからレビューの筆者を取得
    const comments = await fetchCommentsByReviewId(review[0].id);
    // Review型を構成
    const reviewData: Review = {
      id: reviewId,
      content: review[0].content,
      paper_title: review[0].paper_title,
      paper_data: review[0].paper_data as Paper,
      user_info: user[0],
      comments: comments,
      tags: tags,
      created_at: review[0].created_at,
      thumbnail_url: review[0].thumbnail_url,
    };
    return NextResponse.json(reviewData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to fetch review with ID = ${params.id}` },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    // ReviewIdをnumberに変換
    const reviewId = parseInt(params.id);
    if (isNaN(reviewId)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }
    console.log(reviewId);
    const res = await deleteReview(reviewId);
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete review with ID = ${params.id}` },
      { status: 500 },
    );
  }
}
