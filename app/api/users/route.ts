import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma-client";
import { UserDetail } from "@/type";

async function fetchUsers(affiliationId: number | null): Promise<UserDetail[]> {
  try {
    let users: UserDetail[];
    if (affiliationId) {
      users = await prisma.$queryRaw`
        SELECT
      users.*,
        (SELECT json_agg(json_build_object(
          'id', work.id,
          'url', work.url,
          'user_id', work.user_id,
          'created_at', work.created_at
        )) FROM "Works" work WHERE work.user_id = users.id)
        AS works,
        (SELECT json_agg(json_build_object(
          'id', field.id,
          'name', field.name,
          'created_at', field.created_at
        )) FROM "Fields" field
        JOIN "_FieldsToUsers" fields_to_users ON field.id = fields_to_users.field_id
        WHERE fields_to_users.user_id = users.id)
        AS fields,
        (SELECT json_agg(json_build_object(
          'id', affiliation.id,
          'name', affiliation.name,
          'created_at', affiliation.created_at
        )) FROM "Affiliations" affiliation
        JOIN "_AffiliationsToUsers" affiliations_to_users ON affiliation.id = affiliations_to_users.affiliation_id
        WHERE affiliations_to_users.user_id = users.id)
        AS affiliations
    FROM "Users" users
    LEFT JOIN "_AffiliationsToUsers" affiliations_to_users ON users.id = affiliations_to_users.user_id
    WHERE affiliations_to_users.affiliation_id = ${affiliationId}
    ORDER BY users.created_at DESC;
        `;
    } else {
      users = await prisma.$queryRaw<UserDetail[]>`
        SELECT
      users.*,
        (SELECT json_agg(json_build_object(
          'id', work.id,
          'url', work.url,
          'user_id', work.user_id,
          'created_at', work.created_at
        )) FROM "Works" work WHERE work.user_id = users.id)
        AS works,
        (SELECT json_agg(json_build_object(
          'id', field.id,
          'name', field.name,
          'created_at', field.created_at
        )) FROM "Fields" field
        JOIN "_FieldsToUsers" fields_to_users ON field.id = fields_to_users.field_id
        WHERE fields_to_users.user_id = users.id)
        AS fields,
        (SELECT json_agg(json_build_object(
          'id', affiliation.id,
          'name', affiliation.name,
          'created_at', affiliation.created_at
        )) FROM "Affiliations" affiliation
        JOIN "_AffiliationsToUsers" affiliations_to_users ON affiliation.id = affiliations_to_users.affiliation_id
        WHERE affiliations_to_users.user_id = users.id)
        AS affiliations
    FROM "Users" users
    ORDER BY users.created_at DESC;
        `;
    }
    return users;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch users.");
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const affiliationIdString = searchParams.get("affiliationId");
  const affiliationId = affiliationIdString
    ? parseInt(affiliationIdString)
    : null;
  try {
    const userDatas = await fetchUsers(affiliationId);
    if (!userDatas.length) {
      return NextResponse.json({ error: "No user" }, { status: 400 });
    }
    return NextResponse.json(userDatas, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to fetch users` },
      { status: 500 },
    );
  }
}
