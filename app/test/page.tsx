import { fetchReview, updateReview } from "@/actions/review.action";
import { reviewInterface } from "@/constants";

const TestPage = async () => {
  const reviewData: reviewInterface = (await fetchReview(1))[0];
  const userId: string = reviewData.user_id;
  reviewData.paper_title = reviewData.paper_title + "(updated)";
  reviewData.content = reviewData.content + "(updated)";
  updateReview(userId, reviewData);

  return <div>this is update Review test page;</div>;
};

export default TestPage;
