import StarRating from "./StarRating";
import { useMutation, useQuery } from "@tanstack/react-query";
import { HiSparkles } from "react-icons/hi2";
import { Button } from "../ui/button";
import ReviewSkeleton from "./ReviewSkeleton";
import {
    reviewsApi,
    type GetReviewsResponse,
    type SummarizeResponse,
} from "./reviewsApi";

type ReviewListProps = {
    productId: number;
};

const ReviewList = ({ productId }: ReviewListProps) => {
    // Fetch the reviews for the product
    const reviewsQuery = useQuery<GetReviewsResponse>({
        queryKey: ["reviews", productId],
        queryFn: () => reviewsApi.fetchReviews(productId),
    });

    const summaryMutation = useMutation<SummarizeResponse>({
        mutationFn: () => reviewsApi.summarizeReview(productId),
    });

    // If we have an error, give users an error message
    if (reviewsQuery.isError) {
        return (
            <p className="text-red-500">
                Could not fetch reviews, please try again later!
            </p>
        );
    }

    // If we are still loading, show a loading skeleton
    if (reviewsQuery.isLoading) {
        return (
            <div className="flex flex-col gap-5">
                {[1, 2, 3].map((placeholder) => (
                    <ReviewSkeleton key={placeholder} />
                ))}
            </div>
        );
    }

    // Set the current summary to a pre-existing summary or the one we just fetched
    const currentSummary =
        reviewsQuery.data?.summary || summaryMutation.data?.summary;

    // If there are no reviews, then simply return that
    if (!reviewsQuery.data?.reviews.length) {
        return <p>There are no reviews.</p>;
    }

    return (
        <div className="">
            <div className="mb-5">
                {currentSummary ? (
                    <p>{currentSummary}</p>
                ) : (
                    <div className="">
                        <Button
                            onClick={() => summaryMutation.mutate()}
                            className="cursor-pointer"
                            disabled={summaryMutation.isPending}>
                            <HiSparkles /> Summarize
                        </Button>
                        {summaryMutation.isPending && (
                            <div className="py-3">
                                <ReviewSkeleton />
                            </div>
                        )}
                        {summaryMutation.isError && (
                            <p className="text-red-500">
                                Could not summarize the reviews, please try
                                again!
                            </p>
                        )}
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-5">
                {reviewsQuery.data?.reviews.map((review) => (
                    <div key={review.id}>
                        <div className="font-semibold">{review.author}</div>
                        <div>
                            <StarRating value={review.rating} />
                        </div>
                        <p className="py-2">{review.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewList;
