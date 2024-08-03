import { NextRequest, NextResponse } from "next/server";
import { Paper, Review, Tag, User } from "@/type";
import { prisma } from "@/lib/prisma/prisma-client";
import { Reviews, Users, Tags } from "@prisma/client";

// fetchReviews()の作成により廃止
// async function fetchAllReviews(): Promise<Review[]> {
//   try {
//     const reviews: Review[] = await prisma.$queryRaw<Review[]>`
//       SELECT * FROM "Reviews" ORDER BY created_at DESC;
//     `;
//     return reviews;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Failed to fetch all reviews.");
//   }
// }

async function fetchReviews(
  tag: string | null,
  userId: string | null,
  affiliationId: number | null,
): Promise<Review[]> {
  try {
    let reviews: Review[];
    if (!tag && !userId && !affiliationId) {
      reviews = await prisma.$queryRaw<Review[]>`
        SELECT
            r.*,
            json_build_object(
              'id', u.id,
              'name', u.name,
              'role', u.role,
              'created_at', u.created_at
            ) AS user_info,
            json_agg(json_build_object(
              'id', t.id,
              'name', t.name,
              'created_at', t.created_at
            )) AS tags
        FROM "Reviews" r
        LEFT JOIN "Users" u ON r.user_id = u.id
        LEFT JOIN "_ReviewsToTags" rtt ON r.id = rtt.review_id
        LEFT JOIN "Tags" t ON rtt.tag_id = t.id
        GROUP BY r.id, u.id
        ORDER BY r.created_at DESC;`;
    } else if (!tag && userId && !affiliationId) {
      reviews = await prisma.$queryRaw<Review[]>`
        SELECT
            r.*,
            json_build_object(
              'id', u.id,
              'name', u.name,
              'role', u.role,
              'created_at', u.created_at
            ) AS user_info,
            json_agg(json_build_object(
              'id', t.id,
              'name', t.name,
              'created_at', t.created_at
            )) AS tags
        FROM "Reviews" r
        LEFT JOIN "Users" u ON r.user_id = u.id
        LEFT JOIN "_ReviewsToTags" rtt ON r.id = rtt.review_id
        LEFT JOIN "Tags" t ON rtt.tag_id = t.id
        WHERE r.user_id = ${userId}
        GROUP BY r.id, u.id
        ORDER BY r.created_at DESC;`;
    } else if (tag && !userId && !affiliationId) {
      reviews = await prisma.$queryRaw<Review[]>`
        SELECT
            r.*,
            json_build_object(
              'id', u.id,
              'name', u.name,
              'role', u.role,
              'created_at', u.created_at
            ) AS user_info,
            json_agg(json_build_object(
              'id', t.id,
              'name', t.name,
              'created_at', t.created_at
            )) AS tags
        FROM "Reviews" r
        LEFT JOIN "Users" u ON r.user_id = u.id
        LEFT JOIN "_ReviewsToTags" rtt ON r.id = rtt.review_id
        LEFT JOIN "Tags" t ON rtt.tag_id = t.id
        WHERE r.id IN (
          SELECT rtt.review_id
          FROM "_ReviewsToTags" rtt
          JOIN "Tags" t ON rtt.tag_id = t.id
          WHERE t.name = ${tag})
        GROUP BY r.id, u.id
        ORDER BY r.created_at DESC;`;
    } else if (tag && !userId && affiliationId) {
      reviews = await prisma.$queryRaw<Review[]>`
        SELECT
            r.*,
            json_build_object(
              'id', u.id,
              'name', u.name,
              'role', u.role,
              'created_at', u.created_at
            ) AS user_info,
            json_agg(json_build_object(
              'id', t.id,
              'name', t.name,
              'created_at', t.created_at
            )) AS tags
        FROM "Reviews" r
        LEFT JOIN "Users" u ON r.user_id = u.id
        LEFT JOIN "_ReviewsToTags" rtt ON r.id = rtt.review_id
        LEFT JOIN "Tags" t ON rtt.tag_id = t.id
        LEFT JOIN "_AffiliationsToUsers" atu ON u.id = atu.user_id
        WHERE atu.affiliation_id = ${affiliationId}
          AND r.id IN (
            SELECT rtt.review_id
            FROM "_ReviewsToTags" rtt
            JOIN "Tags" t ON rtt.tag_id = t.id
            WHERE t.name = ${tag})
        GROUP BY r.id, u.id
        ORDER BY r.created_at DESC;`;
    } else if (tag && userId && !affiliationId) {
      reviews = await prisma.$queryRaw<Review[]>`
      SELECT
            r.*,
            json_build_object(
              'id', u.id,
              'name', u.name,
              'role', u.role,
              'created_at', u.created_at
            ) AS user_info,
            json_agg(json_build_object(
              'id', t.id,
              'name', t.name,
              'created_at', t.created_at
            )) AS tags
        FROM "Reviews" r
        LEFT JOIN "Users" u ON r.user_id = u.id
        LEFT JOIN "_ReviewsToTags" rtt ON r.id = rtt.review_id
        LEFT JOIN "Tags" t ON rtt.tag_id = t.id
        WHERE r.user_id = ${userId}
          AND r.id IN (
            SELECT rtt.review_id
            FROM "_ReviewsToTags" rtt
            JOIN "Tags" t ON rtt.tag_id = t.id
            WHERE t.name = ${tag})
        GROUP BY r.id, u.id
        ORDER BY r.created_at DESC;`;
    } else if (!tag && !userId && affiliationId) {
      reviews = await prisma.$queryRaw<Review[]>`
        SELECT
            r.*,
            json_build_object(
              'id', u.id,
              'name', u.name,
              'role', u.role,
              'created_at', u.created_at
            ) AS user_info,
            json_agg(json_build_object(
              'id', t.id,
              'name', t.name,
              'created_at', t.created_at
            )) AS tags
        FROM "Reviews" r
        LEFT JOIN "Users" u ON r.user_id = u.id
        LEFT JOIN "_ReviewsToTags" rtt ON r.id = rtt.review_id
        LEFT JOIN "Tags" t ON rtt.tag_id = t.id
        LEFT JOIN "_AffiliationsToUsers" atu ON u.id = atu.user_id
        WHERE atu.affiliation_id = ${affiliationId}
        GROUP BY r.id, u.id
        ORDER BY r.created_at DESC;`;
    } else {
      reviews = await prisma.$queryRaw<Review[]>`
        SELECT
            r.*,
            json_build_object(
              'id', u.id,
              'name', u.name,
              'role', u.role,
              'created_at', u.created_at
            ) AS user_info,
            json_agg(json_build_object(
              'id', t.id,
              'name', t.name,
              'created_at', t.created_at
            )) AS tags
        FROM "Reviews" r
        LEFT JOIN "Users" u ON r.user_id = u.id
        LEFT JOIN "_ReviewsToTags" rtt ON r.id = rtt.review_id
        LEFT JOIN "Tags" t ON rtt.tag_id = t.id
        GROUP BY r.id, u.id
        ORDER BY r.created_at DESC;`;
    }
    return reviews;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch all reviews.");
  }
}

async function setTag(tag: Tag): Promise<Tag[]> {
  try {
    const newTag = await prisma.$queryRaw<Tag[]>`
        INSERT INTO "Tags" (name)
        VALUES (${tag.name})
        ON CONFLICT (name) DO UPDATE
        SET name = EXCLUDED.name
        RETURNING *;`;
    return newTag;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to set tag.${tag.name}`);
  }
}

async function setReview(reviewData: Review) {
  try {
    // ReviewDataをセット
    const newReviewData = await prisma.$queryRaw<Review[]>`
        INSERT INTO "Reviews" (content, paper_data, paper_title, user_id, thumbnail_url)
        VALUES (${reviewData.content}, ${reviewData.paper_data}, ${reviewData.paper_title}, ${reviewData.user_info.id}, ${reviewData.thumbnail_url})
        RETURNING *;`;
    // TagとReviewsToTagsのセット
    const req = reviewData.tags.map(async (tag) => {
      const newTag = await setTag(tag);
      await prisma.$executeRaw`
            INSERT INTO "_ReviewsToTags" (review_id, tag_id)
            VALUES (${newReviewData[0].id}, ${newTag[0].id});`;
    });
    await Promise.all(req);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to post review.");
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

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const searchTag = searchParams.get("searchTag");
  const userId = searchParams.get("userId");

  const convertStringToNumber = (value: string | null): number | null =>
    value !== null ? (isNaN(parseInt(value)) ? null : parseInt(value)) : null;
  const affiliationId = convertStringToNumber(
    searchParams.get("affiliationId"),
  );

  try {
    const reviewDatas = await fetchReviews(searchTag, userId, affiliationId);
    return NextResponse.json(reviewDatas, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch all reviews." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const params = await request.json();
  const data: Review = params.reviewData;
  try {
    await setReview(data);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to post Review` },
      { status: 500 },
    );
  }
}
