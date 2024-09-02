import { NextRequest, NextResponse } from "next/server";
import { Affiliation } from "@/type";
import { prisma } from "@/lib/prisma/prisma-client";

async function fetchAllAffiliations(): Promise<Affiliation[]> {
  try {
    const affiliations: Affiliation[] = await prisma.affiliations.findMany();
    return affiliations;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch all affiliations.");
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const affiliations = await fetchAllAffiliations();
    return NextResponse.json(affiliations, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch all affiliations." },
      { status: 500 },
    );
  }
}
