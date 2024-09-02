import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma-client";
import { Affiliation, Field, User, Work } from "@/type";
import { fields } from "@/constants";
import { AffiliationsToUsers, FieldsToUsers, Works } from "@prisma/client";

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

async function deleteUser(userId: string): Promise<number> {
  try {
    const count = await prisma.$executeRaw`
      DELETE FROM "Users" WHERE id = ${userId};
    `;
    return count;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete user.");
  }
}

async function updateWork(work: Work, userId: string) {
  try {
    const newWork = await prisma.$queryRaw<Work[]>`
      WITH inserted AS (
        INSERT INTO "Works" (url, user_id)
        VALUES (${work.url}, ${userId})
        ON CONFLICT (url, user_id) DO nothing
        RETURNING *
      )
      SELECT *
      FROM inserted
      UNION ALL
      SELECT *
      FROM "Works"
      WHERE url = (${work.url})
        AND user_id = (${userId})
      AND NOT EXISTS (SELECT 1 FROM inserted);
    `;
    return newWork;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update work.");
  }
}

async function updateField(field: Field): Promise<Field[]> {
  try {
    const newField = await prisma.$queryRaw<Field[]>`
      WITH inserted AS (
        INSERT INTO "Fields" (name)
        VALUES (${field.name})
        ON CONFLICT (name) DO NOTHING
        RETURNING *
      )
      SELECT *
      FROM inserted
      UNION ALL
      SELECT *
      FROM "Fields"
      WHERE name = (${field.name})
      AND NOT EXISTS (SELECT 1 FROM inserted);
    `;
    return newField;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update field");
  }
}

async function updateAffiliation(
  affiliation: Affiliation,
): Promise<Affiliation[]> {
  try {
    const newAffiliation = await prisma.$queryRaw<Field[]>`
      WITH inserted AS (
        INSERT INTO "Affiliations" (name)
        VALUES (${affiliation.name})
        ON CONFLICT (name) DO NOTHING
        RETURNING *
      )
      SELECT *
      FROM inserted
      UNION ALL
      SELECT *
      FROM "Affiliations"
      WHERE name = (${affiliation.name})
      AND NOT EXISTS (SELECT 1 FROM inserted);
    `;
    return newAffiliation;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to set affiliation");
  }
}

async function updateUser(userId: string, userData: User) {
  try {
    const newUserData = await prisma.$queryRaw<User[]>`
        INSERT INTO "Users" (id, name, role)
        VALUES (${userId}, ${userData.name}, ${userData.role})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          role = EXCLUDED.role
        RETURNING *;
    `;

    // worksをset
    if (userData.works) {
      const setWorkReq = userData.works.map(async (work) => {
        const newWork = await updateWork(work, userId);
        return newWork[0];
      });
      const newWorks = await Promise.all(setWorkReq);

      const wtus = await prisma.$queryRaw<Works[]>`
          SELECT *
          FROM "Works"
          WHERE user_id = ${userId};`;
      const req2 = wtus
        .filter((wtu) => !newWorks.some((newWork) => newWork.id === wtu.id))
        .map(
          (wtu) =>
            prisma.$executeRaw`
            DELETE FROM "Works"
            WHERE id = ${wtu.id};`,
        );
      await Promise.all(req2);
    }

    // fieldsをset
    if (userData.fields) {
      const setFieldReq = userData.fields.map(async (field) => {
        const newField = await updateField(field);
        await prisma.$executeRaw`
          INSERT INTO "_FieldsToUsers" (user_id, field_id)
          VALUES (${userId}, ${newField[0].id})
          ON CONFLICT (user_id, field_id) DO NOTHING
          RETURNING *;
        `;
        return newField[0];
      });
      const newFields = await Promise.all(setFieldReq);
      // FieldsToUserを更新
      const ftus = await prisma.$queryRaw<FieldsToUsers[]>`
          SELECT *
          FROM "_FieldsToUsers"
          WHERE user_id = ${userId};`;
      const req2 = ftus
        .filter(
          (ftu) => !newFields.some((newField) => newField.id === ftu.field_id),
        )
        .map(
          (ftu) =>
            prisma.$executeRaw`
            DELETE FROM "_FieldsToUsers"
            WHERE field_id = ${ftu.field_id};`,
        );
      await Promise.all(req2);
    }

    // affiliationsをset
    if (userData.affiliations) {
      const setAffiliationReq = userData.affiliations.map(
        async (affiliation) => {
          const newAffiliation = await updateAffiliation(affiliation);
          await prisma.$executeRaw`
          INSERT INTO "_AffiliationsToUsers" (user_id, affiliation_id)
          VALUES (${userId}, ${newAffiliation[0].id})
          ON CONFLICT (user_id, affiliation_id) DO NOTHING
          RETURNING *;
        `;
          return newAffiliation[0];
        },
      );
      const newAffiliations = await Promise.all(setAffiliationReq);
      // AffiliationsToUsersを更新
      const atus = await prisma.$queryRaw<AffiliationsToUsers[]>`
          SELECT *
          FROM "_AffiliationsToUsers"
          WHERE user_id = ${userId};`;
      const req2 = atus
        .filter(
          (atu) =>
            !newAffiliations.some(
              (newAffiliation) => newAffiliation.id === atu.affiliation_id,
            ),
        )
        .map(
          (atu) =>
            prisma.$executeRaw`
            DELETE FROM "_AffiliationsToUsers"
            WHERE affiliation_id = ${atu.affiliation_id};`,
        );
      await Promise.all(req2);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to post user.");
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
    return NextResponse.json(userData[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to fetch user with ID = ${params.id}` },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "No user ID" }, { status: 400 });
    }

    const count = await deleteUser(id);
    if (count === 0) {
      return NextResponse.json(
        { error: `No such user with ID = ${params.id}` },
        { status: 500 },
      );
    }
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to delete user with ID = ${params.id}` },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "No user ID" }, { status: 400 });
    }
    const userData: User = await request.json();

    const user = await updateUser(id, userData);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to delete user with ID = ${params.id}` },
      { status: 500 },
    );
  }
}
