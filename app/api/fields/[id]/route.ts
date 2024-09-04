import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma-client";
import { Field, User } from "@/type";

async function fetchField(fieldId: number): Promise<Field[]> {
  try {
    const fieldData = await prisma.$queryRaw<Field[]>`
        SELECT *
        FROM "Fields" f
        WHERE f.id = ${fieldId};
        `;
    return fieldData;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch field.");
  }
}

async function deleteField(fieldId: number): Promise<number> {
  try {
    const count = await prisma.$executeRaw`
      DELETE FROM "Fields" WHERE id = ${fieldId};
    `;
    return count;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete field.");
  }
}

async function updateField(fieldId: number, fieldData: User) {
  try {
    const newFieldData = await prisma.$queryRaw<Field[]>`
        INSERT INTO "Fields" (id, name)
        VALUES (${fieldId}, ${fieldData.name})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name
        RETURNING *;
    `;
    return newFieldData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update field.");
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid field ID" }, { status: 400 });
    }

    const fieldData = await fetchField(id);
    if (!fieldData.length) {
      return NextResponse.json(
        { error: `No such field with ID = ${params.id}` },
        { status: 400 },
      );
    }
    return NextResponse.json(fieldData[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to fetch field with ID = ${params.id}` },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid field ID" }, { status: 400 });
    }

    const count = await deleteField(id);
    if (count === 0) {
      return NextResponse.json(
        { error: `No such field with ID = ${params.id}` },
        { status: 500 },
      );
    }
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to delete field with ID = ${params.id}` },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid field ID" }, { status: 400 });
    }
    const newFieldData = await request.json();

    const user = await updateField(id, newFieldData);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to delete user with ID = ${params.id}` },
      { status: 500 },
    );
  }
}
