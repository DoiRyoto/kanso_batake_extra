import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma-client";
import { User } from "@/type";

async function fetchUser(userId: string): Promise<User[]> {
  try {
    const user = await prisma.$queryRaw<User[]>`
        SELECT
        users.*,
        (SELECT json_agg(json_build_object(
            'id', works.id,
            'url', works.url,
            'user_id', works.user_id,
            'created_at', works.created_at
        )) FROM "Works" works WHERE works.user_id = users.id) AS works,
        (SELECT json_agg(json_build_object(
            'id', fields.id,
            'name', fields.name,
            'created_at', fields.created_at
        )) FROM "Fields" fields
        JOIN "_FieldsToUsers" fields_to_users ON fields.id = fields_to_users.field_id
        WHERE fields_to_users.user_id = users.id) AS fields,
        (SELECT json_agg(json_build_object(
            'id', affiliations.id,
            'name', affiliations.name,
            'created_at', affiliations.created_at
        )) FROM "Affiliations" affiliations
        JOIN "_AffiliationsToUsers" affiliations_to_users ON affiliations.id = affiliations_to_users.affiliation_id
        WHERE affiliations_to_users.user_id = users.id) AS affiliations
        FROM "Users" users
        WHERE users.id = ${userId};
        `;
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch user.");
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "No user ID" }, { status: 400 });
    }

    const userData = await fetchUser(id);
    if (!userData.length) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to fetch user with ID = ${params.id}` },
      { status: 500 },
    );
  }
}
