import { NextRequest, NextResponse } from "next/server";
import { Review, Tag } from "@/type";
import { prisma } from "@/lib/prisma/prisma-client";

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
  id: string | null,
): Promise<Review[]> {
  try {
    let reviews: Review[];
    if (!tag && !id) {
      reviews = await prisma.$queryRaw<Review[]>`
      SELECT * FROM "Reviews" ORDER BY created_at DESC;`;
    } else if (!tag && id) {
      reviews = await prisma.$queryRaw<Review[]>`
        SELECT *
        FROM "Reviews"
        WHERE user_id = ${id}
        ORDER BY created_at DESC;`;
    } else if (tag && !id) {
      reviews = await prisma.$queryRaw<Review[]>`
        SELECT "Reviews".*
        FROM "Reviews"
        JOIN "_ReviewsToTags" ON "Reviews".id = "_ReviewsToTags".review_id
        JOIN "Tags" ON "_ReviewsToTags".tag_id = "Tags".id
        WHERE "Tags".name = ${tag}
        ORDER BY "Reviews".created_at DESC;`;
    } else if (tag && id) {
      reviews = await prisma.$queryRaw<Review[]>`
        SELECT "Reviews".*
        FROM "Reviews"
        JOIN "_ReviewsToTags" ON "Reviews".id = "_ReviewsToTags".review_id
        JOIN "Tags" ON "_ReviewsToTags".tag_id = "Tags".id
        WHERE "Tags".name = ${tag}
        AND "Reviews".user_id = ${id}
        ORDER BY "Reviews".created_at DESC;`;
    } else {
      reviews = await prisma.$queryRaw<Review[]>`
        SELECT * FROM "Reviews" ORDER BY created_at DESC;`;
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

// async function updateReview(reviewData: Review) {
//   try {
//     await prisma.$executeRaw`
//         INSERT INTO "Reviews" (content, paper_data, paper_title, user_id, thumbnail_url, created_at)
//         VALUES (${reviewData.content}, ${reviewData.paper_data}, ${reviewData.paper_title}, ${reviewData.user_info.id}, ${reviewData.thumbnail_url}, ${reviewData.created_at});`;
//   } catch (error) {
//     console.log(error);
//     throw new Error("Failed to update review.");
//   }
// }

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

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const searchTag = searchParams.get("searchTag");
  const userId = searchParams.get("userId");

  try {
    // const reviews = await fetchAllReviews();
    const reviews = await fetchReviews(searchTag, userId);
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch all reviews." },
      { status: 500 },
    );
  }
}

// export async function PUT(request: NextRequest): Promise<NextResponse> {
//   const params = await request.json();
//   console.log(params);
//   try {
//     await updateReview(params);
//     return NextResponse.json({ status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: `Failed to update Review` },
//       { status: 500 },
//     );
//   }
// }

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
