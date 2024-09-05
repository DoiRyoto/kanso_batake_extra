import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma-client";
import { Affiliation, User } from "@/type";

async function fetchAffiliation(affiliationId: number): Promise<Affiliation[]> {
  try {
    const affiliationData = await prisma.$queryRaw<Affiliation[]>`
        SELECT *
        FROM "Affiliations" a
        WHERE a.id = ${affiliationId};
        `;
    return affiliationData;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch affiliation.");
  }
}

async function deleteAffiliation(affiliationId: number): Promise<number> {
  try {
    const count = await prisma.$executeRaw`
      DELETE FROM "Affiliations" WHERE id = ${affiliationId};
    `;
    return count;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete affiliation.");
  }
}

async function updateAffiliation(affiliationId: number, affiliationData: User) {
  try {
    const newAffiliationData = await prisma.$queryRaw<Affiliation[]>`
        INSERT INTO "Affiliations" (id, name)
        VALUES (${affiliationId}, ${affiliationData.name})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name
        RETURNING *;
    `;
    return newAffiliationData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update affiliation.");
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid affiliation ID" },
        { status: 400 },
      );
    }

    const affiliationData = await fetchAffiliation(id);
    if (!affiliationData.length) {
      return NextResponse.json(
        { error: `No such affiliation with ID = ${params.id}` },
        { status: 400 },
      );
    }
    return NextResponse.json(affiliationData[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to fetch affiliation with ID = ${params.id}` },
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
      return NextResponse.json(
        { error: "Invalid affiliation ID" },
        { status: 400 },
      );
    }

    const count = await deleteAffiliation(id);
    if (count === 0) {
      return NextResponse.json(
        { error: `No such affiliation with ID = ${params.id}` },
        { status: 500 },
      );
    }
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to delete affiliation with ID = ${params.id}` },
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
      return NextResponse.json(
        { error: "Invalid affiliation ID" },
        { status: 400 },
      );
    }
    const newAffiliationData = await request.json();

    const user = await updateAffiliation(id, newAffiliationData);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to delete user with ID = ${params.id}` },
      { status: 500 },
    );
  }
}
