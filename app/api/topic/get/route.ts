import { NextRequest, NextResponse } from "next/server";
import { Topic } from "@/type";
import { prisma } from "@/lib/prisma/prisma-client";

async function fetchAllTopics(): Promise<Topic[]> {
  try {
    const topics: Topic[] = await prisma.$queryRaw<Topic[]>`
      SELECT * FROM "Topics" ORDER BY created_at DESC;
    `;
    return topics;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch all topics.");
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const topics = await fetchAllTopics();
    return NextResponse.json(topics);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch all topics." },
      { status: 500 },
    );
  }
}
