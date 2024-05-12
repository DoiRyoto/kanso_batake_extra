import { NextRequest, NextResponse } from "next/server";
import { setReview, updateReview } from "@/actions/review.action";
import { reviewInterface, paperInterface } from "@/constants";

async function streamToString(stream: any) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function QueryStringToDict(queryString: string) {
  const searchParams = new URLSearchParams(queryString);
  let queryEntries = searchParams.entries();
  let queryParamsObject = Object.fromEntries(queryEntries);
  return queryParamsObject;
}

export async function POST(request: NextRequest) {
  //jsonパラメータの取得
  const data = request.body;
  const datastr: string = await streamToString(data);
  const datadict = await QueryStringToDict(datastr);
  console.log("===datadict===");
  console.log(datadict);

  const userid_gusest = "user_2YzbC3erekWVrBeAYG5iTWoaVk0";

  const paper: paperInterface = {
    year: "1000",
    journal_name: "sample_journal",
    authors: "st",
  };

  const review: reviewInterface = {
    id: 11,
    content: "this is test(api)",
    paper_title: "api test paper",
    paper_data: paper,
    user_id: userid_gusest,
    created_at: new Date(),
    thumbnail_url: "",
  };

  updateReview(userid_gusest, review);

  return new NextResponse(JSON.stringify({ auth: true }), {
    status: 200,
  });
}
