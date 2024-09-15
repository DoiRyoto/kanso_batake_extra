import { NextRequest, NextResponse } from "next/server";
import { Affiliation } from "@/type";
import { prisma } from "@/lib/prisma/prisma-client";

async function fetchAffiliation(): Promise<Affiliation[]> {
  try {
    const affiliations: Affiliation[] = await prisma.$queryRaw<Affiliation[]>`
      SELECT * FROM "Affiliations";
    `;
    return affiliations;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch all affiliations.");
  }
}

async function setAffiliation(
  affiliation: Affiliation,
): Promise<Affiliation[]> {
  try {
    const newTag = await prisma.$queryRaw<Affiliation[]>`
          INSERT INTO "Affiliations" (name)
          VALUES (${affiliation.name})
          ON CONFLICT (name) DO nothing
          RETURNING *;
        `;
    return newTag;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to set affiliation "${affiliation.name}".`);
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const affiliations = await fetchAffiliation();
    return NextResponse.json(affiliations, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch all affiliations." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const params = await request.json();
  try {
    const newAffiliation = await setAffiliation(params);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to post Affiliation` },
      { status: 500 },
    );
  }
}
