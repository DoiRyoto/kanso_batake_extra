import { NextRequest, NextResponse } from "next/server";
import { Review } from "@/type";
import { prisma } from "@/lib/prisma/prisma-client";

async function fetchReviews(
  tag: string | null,
  fieldId: number | null,
): Promise<Review[]> {
  try {
    let reviews: Review[];
    if (!tag) {
      reviews = await prisma.$queryRaw<Review[]>`
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
            )) AS tags
        FROM "Reviews" r
        LEFT JOIN "Users" u ON r.user_id = u.id
        LEFT JOIN "_FieldsToUsers" ftu ON u.id = ftu.user_id
        LEFT JOIN "Fields" f ON ftu.field_id = f.id
        LEFT JOIN "Works" w ON u.id = w.user_id
        LEFT JOIN "_AffiliationsToUsers" atu ON u.id = atu.user_id
        LEFT JOIN "Affiliations" a ON atu.affiliation_id = a.id
        LEFT JOIN "_ReviewsToTags" rtt ON r.id = rtt.review_id
        LEFT JOIN "Tags" t ON rtt.tag_id = t.id
        WHERE f.id = ${fieldId}
        GROUP BY r.id, u.id
        ORDER BY r.created_at DESC;
      `;
    } else {
      reviews = await prisma.$queryRaw<Review[]>`
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
              )) AS tags
          FROM "Reviews" r
          LEFT JOIN "Users" u ON r.user_id = u.id
          LEFT JOIN "_FieldsToUsers" ftu ON u.id = ftu.user_id
          LEFT JOIN "Fields" f ON ftu.field_id = f.id
          LEFT JOIN "Works" w ON u.id = w.user_id
          LEFT JOIN "_AffiliationsToUsers" atu ON u.id = atu.user_id
          LEFT JOIN "Affiliations" a ON atu.affiliation_id = a.id
          LEFT JOIN "_ReviewsToTags" rtt ON r.id = rtt.review_id
          LEFT JOIN "Tags" t ON rtt.tag_id = t.id
        WHERE f.id = ${fieldId}
          AND r.id IN (
            SELECT rtt.review_id
            FROM "_ReviewsToTags" rtt
            JOIN "Tags" t ON rtt.tag_id = t.id
            WHERE t.name = ${tag})
          GROUP BY r.id, u.id
          ORDER BY r.created_at DESC;
      `;
    }
    return reviews;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch reviews.");
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const fieldId = parseInt(params.id);
  if (!fieldId) {
    return NextResponse.json({ error: "No field ID" }, { status: 400 });
  }
  const searchParams = request.nextUrl.searchParams;
  const searchTag = searchParams.get("searchTag");

  try {
    const reviewDatas = await fetchReviews(searchTag, fieldId);
    return NextResponse.json(reviewDatas, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: `Failed to fetch reviews posted by users majoring the field with ID = ${fieldId}.`,
      },
      { status: 500 },
    );
  }
}
