import { prisma } from "@/lib/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  },
): Promise<NextResponse> {
  console.log("set like");
  try {
    const data = await request.json();
    if (!data.user_id)
      return NextResponse.json({ error: "No User ID" }, { status: 400 });

    const review_id = parseInt(params.id);
    if (!review_id)
      return NextResponse.json({ error: "No review ID" }, { status: 400 });

    const existingLike = await prisma.likes.findFirst({
      where: {
        user_id: data.user_id,
        review_id: review_id,
      },
    });
    if (existingLike)
      return NextResponse.json({ error: "Already Exist" }, { status: 400 });

    const like = await prisma.likes.create({
      data: {
        user_id: data.user_id,
        review_id: review_id,
      },
    });
    return NextResponse.json({ status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Failed to post like" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  console.log("delete");
  try {
    const data = await request.json();
    if (!data.user_id)
      return NextResponse.json({ error: "No User ID" }, { status: 400 });

    const review_id = parseInt(params.id);
    if (!review_id)
      return NextResponse.json({ error: "No review ID" }, { status: 400 });

    const existingLike = await prisma.likes.findFirst({
      where: {
        user_id: data.user_id,
        review_id: review_id,
      },
    });

    if (!existingLike)
      return NextResponse.json({ error: " Like not found" }, { status: 404 });

    await prisma.likes.delete({ where: { id: existingLike.id } });

    return NextResponse.json({ status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Failed to delete like" },
      { status: 500 },
    );
  }
}
