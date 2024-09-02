import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma-client";
import { Tag } from "@/type";

async function fetchTags(): Promise<Tag[]> {
  try {
    const tags = await prisma.$queryRaw<Tag[]>`
        SELECT *
        FROM "Tags";
    `;
    return tags;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch tags.");
  }
}

async function setTag(tag: Tag): Promise<Tag[]> {
  try {
    const newTag = await prisma.$queryRaw<Tag[]>`
          INSERT INTO "Tags" (name)
          VALUES (${tag.name})
          ON CONFLICT (name) DO nothing
          RETURNING *;
        `;
    return newTag;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to set tag."${tag.name}"`);
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const tagDatas = await fetchTags();
    return NextResponse.json(tagDatas, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to fetch all tags` },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const params = await request.json();
  try {
    await setTag(params);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to post User` }, { status: 500 });
  }
}
