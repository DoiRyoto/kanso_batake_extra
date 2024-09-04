import { NextRequest, NextResponse } from "next/server";
import { Field } from "@/type";
import { prisma } from "@/lib/prisma/prisma-client";

async function fetchField(): Promise<Field[]> {
  try {
    const fields: Field[] = await prisma.$queryRaw<Field[]>`
      SELECT * FROM "Fields";
    `;
    return fields;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch all fields.");
  }
}

async function setField(field: Field): Promise<Field[]> {
  try {
    const newTag = await prisma.$queryRaw<Field[]>`
          INSERT INTO "Fields" (name)
          VALUES (${field.name})
          ON CONFLICT (name) DO nothing
          RETURNING *;
        `;
    return newTag;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to set field "${field.name}".`);
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const fields = await fetchField();
    return NextResponse.json(fields, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch all fields." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const params = await request.json();
  try {
    const newField = await setField(params);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to post Field` },
      { status: 500 },
    );
  }
}
