import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma-client";
import { UserDetail, Work, Field, Affiliation } from "@/type";

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

async function setWork(work: Work, userId: string) {
  try {
    await prisma.$executeRaw`
        INSERT INTO "Works" (url, user_id)
        VALUES (${work.url}, ${userId}) 
        `;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set work.");
  }
}

async function setField(field: Field): Promise<Field[]> {
  try {
    const newField = await prisma.$queryRaw<Field[]>`
            INSERT INTO "Fields" (name)
            VALUES (${field.name})
            ON CONFLICT (name) DO UPDATE
            SET name = EXCLUDED.name
            RETURNING *;
        `;
    return newField;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set field");
  }
}

async function setAffiliation(
  affiliation: Affiliation,
): Promise<Affiliation[]> {
  try {
    const newAffiliation = await prisma.$queryRaw<Affiliation[]>`
            INSERT INTO "Affiliations" (id, name)
            VALUES (${affiliation.id}, ${affiliation.name})
            ON CONFLICT (name) DO UPDATE
            SET name = EXCLUDED.name
            RETURNING *;
        `;
    return newAffiliation;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set affiliation");
  }
}

async function setUser(userData: UserDetail) {
  try {
    const newUserData = await prisma.$queryRaw<UserDetail[]>`
        INSERT INTO "Users" (id, name, role)
        VALUES (${userData.id}, ${userData.name}, ${userData.role})
        ON CONFLICT (id) DO UPDATE
        SET id = EXCLUDED.id
        RETURNING *;
        `;

    // worksをset
    if (userData.works) {
      const setWorkReq = userData.works.map(async (work) => {
        await setWork(work, userData.id);
      });
      await Promise.all(setWorkReq);
    }

    // fieldsをset
    if (userData.fields) {
      const setFieldReq = userData.fields.map(async (field) => {
        const newField = await setField(field);
        await prisma.$executeRaw`
                    INSERT INTO "_FieldsToUsers" (user_id, field_id)
                    VALUES (${userData.id}, ${newField[0].id});
                `;
      });
      await Promise.all(setFieldReq);
    }

    // affiliationsをset
    if (userData.affiliations) {
      const setAffiliationReq = userData.affiliations.map(
        async (affiliation) => {
          const newAffiliation = await setAffiliation(affiliation);
          await prisma.$executeRaw`
                    INSERT INTO "_AffiliationsToUsers" (user_id, affiliation_id)
                    VALUES (${userData.id}, ${newAffiliation[0].id});
                `;
        },
      );
      await Promise.all(setAffiliationReq);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to post user.");
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
    return NextResponse.json(userDatas, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to fetch users` },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const params = await request.json();
  try {
    await setUser(params);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to post User` }, { status: 500 });
  }
}
