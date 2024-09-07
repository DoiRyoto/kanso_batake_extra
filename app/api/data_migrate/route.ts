import { fetchCommentsByReviewIdByFB } from "@/actions/comment.action";
import { fetchAllReviewsByFB, setReview } from "@/actions/review.action";
import {
  fetchUserByFB,
  fetchUsersByAffiliationId,
  fetchUsersByFB,
  setUser,
} from "@/actions/user.action";
import {
  Review,
  Tag,
  Work,
  commentType,
  reviewType,
  userType,
  Field,
  Affiliation,
  User,
} from "@/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const userDatas: userType[] = await fetchUsersByFB();
    userDatas.map(async (userData, idx) => {
      // init works
      let works: Work[] = [];
      if (userData.works && userData.works.length > 0) {
        works = userData.works.map((work) => {
          return {
            id: -1,
            url: work,
            user_id: userData.id,
            created_at: Date(),
          };
        });
      }

      // init fields
      let fields: Field[] = [];
      if (userData.field?.length > 0) {
        fields = userData.field.map((field) => {
          return {
            id: -1,
            name: field,
            created_at: Date(),
          };
        });
      }

      // init affiliations
      let affiliations: Affiliation[] = [];
      if (userData.affiliation?.length > 0) {
        affiliations = userData.affiliation.map((affiliation) => {
          return {
            id: -1,
            name: affiliation,
            created_at: Date(),
          };
        });
      }

      const newUserData: User = {
        id: userData.id,
        name: userData.name,
        role: userData.role,
        created_at: Date(),
        works: works,
        affiliations: affiliations,
        fields: fields,
      };
      // console.log(newUserData);
      await setUser(newUserData);
    });
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to migrate users." },
      { status: 500 },
    );
  }
}
