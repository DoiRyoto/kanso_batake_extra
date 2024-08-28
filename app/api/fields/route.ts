import { NextRequest, NextResponse } from "next/server";
import { Field } from "@/type";
import { prisma } from "@/lib/prisma/prisma-client";

async function fetchAllFields(): Promise<Field[]> {
  try {
    const fields: Field[] = await prisma.$queryRaw<Field[]>`
      SELECT * FROM "Fields" ORDER BY id ASC;
    `;
    return fields;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch all fields.");
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const fields = await fetchAllFields();
    return NextResponse.json(fields, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch all fields." },
      { status: 500 },
    );
  }
}
