import { fetchCommentsByReviewIdByFB } from "@/actions/comment.action";
import { fetchAllReviewsByFB, setReview } from "@/actions/review.action";
import { fetchUserByFB } from "@/actions/user.action";
import { Review, Tag, commentType, reviewType, userType } from "@/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const reviewDatas: reviewType[] = await fetchAllReviewsByFB();
    reviewDatas.map(async (reviewData, idx) => {
      const user: userType = await fetchUserByFB(reviewData.createdBy);
      let tags: Tag[] = [];
      if (reviewData.tags.length != 0) {
        tags = reviewData.tags.map((tag) => {
          return {
            id: -1,
            name: tag,
            created_at: Date(),
          };
        });
      }

      const newReviewData: Review = {
        id: Date.now() + idx,
        content: reviewData.contents,
        paper_title: reviewData.paperTitle,
        user_info: {
          id: user.id,
          name: user.name,
          role: user.role,
          created_at: Date(),
        },
        paper_data: {
          venue: reviewData.venue,
          year: reviewData.year,
          journal_name: reviewData.journal_name,
          journal_pages: reviewData.journal_pages,
          journal_vol: reviewData.journal_vol,
          authors: reviewData.authors,
          doi: reviewData.doi,
          link: reviewData.link,
        },
        tags: tags,
        thumbnail_url: reviewData.imageUrl,
        created_at: Date(),
        comments: [],
      };
      await setReview(newReviewData);
    });
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to migrate reviews." },
      { status: 500 },
    );
  }
}
