import axios from "axios";
import Skeleton from "react-loading-skeleton";
import StarRating from "./StarRating";
import { useQuery } from "@tanstack/react-query";

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

const ReviewList = ({ productId }: ReviewListProps) => {
    const {
        data: reviewData,
        isLoading,
        error,
    } = useQuery<GetReviewsResponse>({
        queryKey: ["reviews", productId],
        queryFn: () => fetchReviews(),
    });

    const fetchReviews = async () => {
        const { data } = await axios.get<GetReviewsResponse>(
            `/api/products/${productId}/reviews`
        );
        return data;
    };

    if (error) {
        return (
            <p className="text-red-500">
                Could not fetch reviews, please try again later!
            </p>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col gap-5">
                {[1, 2, 3].map((placeholder) => (
                    <div key={placeholder}>
                        <Skeleton width={150} />
                        <Skeleton width={100} />
                        <Skeleton count={2} />
                    </div>
                ))}
            </div>
        );
    }

    return (
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
    );
};

export default ReviewList;
