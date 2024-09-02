import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma-client";
import { Tag, User } from "@/type";

async function fetchTag(tagId: number): Promise<Tag[]> {
  try {
    const tagData = await prisma.$queryRaw<Tag[]>`
        SELECT *
        FROM "Tags" t
        WHERE t.id = ${tagId};
        `;
    return tagData;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch tag.");
  }
}

async function deleteTag(tagId: number): Promise<number> {
  try {
    const count = await prisma.$executeRaw`
      DELETE FROM "Tags" WHERE id = ${tagId};
    `;
    return count;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete tag.");
  }
}

async function updateTag(tagId: number, tagData: User) {
  try {
    const newTagData = await prisma.$queryRaw<Tag[]>`
        INSERT INTO "Tags" (id, name)
        VALUES (${tagId}, ${tagData.name})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name
        RETURNING *;
    `;
    return newTagData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update tag.");
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid tag ID" }, { status: 400 });
    }

    const tagData = await fetchTag(id);
    if (!tagData.length) {
      return NextResponse.json(
        { error: `No such tag with ID = ${params.id}` },
        { status: 400 },
      );
    }
    return NextResponse.json(tagData[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to fetch tag with ID = ${params.id}` },
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
      return NextResponse.json({ error: "Invalid tag ID" }, { status: 400 });
    }

    const count = await deleteTag(id);
    if (count === 0) {
      return NextResponse.json(
        { error: `No such tag with ID = ${params.id}` },
        { status: 500 },
      );
    }
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to delete tag with ID = ${params.id}` },
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
      return NextResponse.json({ error: "Invalid tag ID" }, { status: 400 });
    }
    const newTagData = await request.json();

    const user = await updateTag(id, newTagData);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to delete user with ID = ${params.id}` },
      { status: 500 },
    );
  }
}
