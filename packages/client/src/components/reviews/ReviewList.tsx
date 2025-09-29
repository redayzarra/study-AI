import axios from "axios";
import StarRating from "./StarRating";
import { useMutation, useQuery } from "@tanstack/react-query";
import { HiSparkles } from "react-icons/hi2";
import { Button } from "../ui/button";
import { useState } from "react";
import ReviewSkeleton from "./ReviewSkeleton";

type ReviewListProps = {
    productId: number;
};

type Review = {
    id: number;
    author: string;
    content: string;
    rating: number;
    createdAt: string;
};

type GetReviewsResponse = {
    summary: string | null;
    reviews: Review[];
};

type SummarizeResponse = {
    summary: string;
};

const ReviewList = ({ productId }: ReviewListProps) => {
    // Fetch the reviews for the product
    const {
        data: reviewData,
        isLoading,
        error,
    } = useQuery<GetReviewsResponse>({
        queryKey: ["reviews", productId],
        queryFn: () => fetchReviews(),
    });

    const {
        mutate: handleSummarize,
        isPending: isSummaryLoading,
        isError: isSummaryError,
        data: summarizeResponse,
    } = useMutation<SummarizeResponse>({
        mutationFn: () => summarizeReviews(),
    });

    // summarizeReviews: Responsible for summarizing the reviews from a productId
    const summarizeReviews = async () => {
        // Use axios to call the backend and get the product summary
        const { data } = await axios.post<SummarizeResponse>(
            `/api/products/${productId}/reviews/summarize`
        );
        return data;
    };

    // fetchReviews: Responsible for fetching the reviews from given productId
    const fetchReviews = async () => {
        const { data } = await axios.get<GetReviewsResponse>(
            `/api/products/${productId}/reviews`
        );
        return data;
    };

    // If we have an error, give users an error message
    if (error) {
        return (
            <p className="text-red-500">
                Could not fetch reviews, please try again later!
            </p>
        );
    }

    // If we are still loading, show a loading skeleton
    if (isLoading) {
        return (
            <div className="flex flex-col gap-5">
                {[1, 2, 3].map((placeholder) => (
                    <ReviewSkeleton key={placeholder} />
                ))}
            </div>
        );
    }

    // Set the current summary to a pre-existing summary or the one we just fetched
    const currentSummary = reviewData?.summary || summarizeResponse?.summary;

    // If there are no reviews, then simply return that
    if (!reviewData?.reviews.length) {
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
                            onClick={() => handleSummarize}
                            className="cursor-pointer"
                            disabled={isSummaryLoading}>
                            <HiSparkles /> Summarize
                        </Button>
                        {isSummaryLoading && (
                            <div className="py-3">
                                <ReviewSkeleton />
                            </div>
                        )}
                        {isSummaryError && (
                            <p className="text-red-500">
                                Could not summarize the reviews, please try
                                again!
                            </p>
                        )}
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-5">
                {reviewData?.reviews.map((review) => (
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
