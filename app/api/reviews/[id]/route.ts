import { NextRequest, NextResponse } from "next/server";
import { Paper, Review, Tag } from "@/type";
import { prisma } from "@/lib/prisma/prisma-client";
import { Reviews, Users, Tags, Comments, ReviewsToTags } from "@prisma/client";

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

async function putReview(
  reviewId: number,
  reviewData: Review,
): Promise<number> {
  try {
    const res = await prisma.$executeRaw`
      INSERT INTO "Reviews" (id, content, paper_data, paper_title, user_id, thumbnail_url)
      VALUES (${reviewId}, ${reviewData.content}, ${reviewData.paper_data}, ${reviewData.paper_title}, ${reviewData.user_info.id}, ${reviewData.thumbnail_url})
      ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        paper_data = EXCLUDED.paper_data,
        paper_title = EXCLUDED.paper_title,
        user_id = EXCLUDED.user_id,
        thumbnail_url = EXCLUDED.thumbnail_url;`;
    return res;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update review.");
  }
}

async function putTags(reviewId: number, tags: Tag[]) {
  try {
    // TagとReviewsToTagsのセット
    const req = tags.map(async (tag) => {
      const newTag = await prisma.$queryRaw<Tag[]>`
          WITH inserted AS (
            INSERT INTO "Tags" (name)
            VALUES (${tag.name})
            ON CONFLICT (name) DO NOTHING
            RETURNING *
          )
          SELECT *
          FROM inserted
          UNION ALL
          SELECT *
          FROM "Tags"
          WHERE name = (${tag.name})
          AND NOT EXISTS (SELECT 1 FROM inserted);`;

      await prisma.$queryRaw<ReviewsToTags[]>`
          INSERT INTO "_ReviewsToTags" (review_id, tag_id)
          VALUES (${reviewId}, ${newTag[0].id})
          ON CONFLICT (review_id, tag_id) DO NOTHING
          RETURNING *;`;
      return newTag[0];
    });
    const newTags = await Promise.all(req);

    const rtts = await prisma.$queryRaw<ReviewsToTags[]>`
          SELECT *
          FROM "_ReviewsToTags"
          WHERE review_id = ${reviewId};`;
    const req2 = rtts.map(async (rtt) => {
      if (!newTags.some((newTag) => newTag.id === rtt.tag_id)) {
        await prisma.$executeRaw`
          DELETE FROM "_ReviewsToTags"
          WHERE review_id = ${reviewId}
            AND tag_id = ${rtt.tag_id};`;
      }
    });
    await Promise.all(req2);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update review.");
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const reviewId = parseInt(params.id);
  const requestBody = await request.json();
  const reviewData: Review = requestBody.reviewData;
  try {
    const res = await putReview(reviewId, reviewData);
    await putTags(reviewId, reviewData.tags);
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to post Review` },
      { status: 500 },
    );
  }
}
