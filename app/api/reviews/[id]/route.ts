import { NextRequest, NextResponse } from "next/server";
import { Review, Tag } from "@/type";
import { prisma } from "@/lib/prisma/prisma-client";
import { ReviewsToTags } from "@prisma/client";

async function fetchReview(reviewId: number): Promise<Review[]> {
  try {
    const reviews = await prisma.$queryRaw<Review[]>`
      SELECT 
        r.*,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'role', u.role,
          'created_at', u.created_at,
          'fields', json_agg(DISTINCT f.*),
          'works', json_agg(DISTINCT w.*),
          'affiliations', json_agg(DISTINCT a.*)
        ) AS user_info,
        json_agg(json_build_object(
          'id', t.id,
          'name', t.name,
          'created_at', t.created_at
        )) AS tags,
        json_agg(json_build_object(
          'id', c.id,
          'content', c.content,
          'user_id', c.user_id,
          'review_id', c.review_id,
          'created_at', c.created_at
        )) AS comments
      FROM "Reviews" r
      LEFT JOIN "Users" u ON r.user_id = u.id
      LEFT JOIN "_FieldsToUsers" ftu ON u.id = ftu.user_id
      LEFT JOIN "Fields" f ON ftu.field_id = f.id
      LEFT JOIN "Works" w ON u.id = w.user_id
      LEFT JOIN "_AffiliationsToUsers" atu ON u.id = atu.user_id
      LEFT JOIN "Affiliations" a ON atu.affiliation_id = a.id
      LEFT JOIN "_ReviewsToTags" rtt ON r.id = rtt.review_id
      LEFT JOIN "Tags" t ON rtt.tag_id = t.id
      LEFT JOIN "Comments" c ON r.id = c.review_id
      WHERE r.id = ${reviewId}
      GROUP BY r.id, u.id, f.id, w.id, a.id
      ORDER BY r.created_at DESC;`;

    return reviews;
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

async function deleteReview(reviewId: number): Promise<number> {
  try {
    const res = await prisma.$executeRaw`
        DELETE FROM "Reviews" WHERE id = ${reviewId};`;
    return res;
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
    const reviewData = await fetchReview(reviewId);
    if (!reviewData.length) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }
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
    const res = await deleteReview(reviewId);
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete review with ID = ${params.id}` },
      { status: 500 },
    );
  }
}
