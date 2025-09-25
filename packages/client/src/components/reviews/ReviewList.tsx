import axios from "axios";
import { useEffect, useState } from "react";

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
    const [reviewData, setReviewData] = useState<GetReviewsResponse>();

    const fetchReviews = async () => {
        const { data } = await axios.get<GetReviewsResponse>(
            `/api/products/${productId}/reviews`
        );
        setReviewData(data);
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <div>
            {reviewData?.reviews.map((review) => (
                <div key={review.id}>
                    <div>{review.author}</div>
                    <div>Rating: {review.rating}/5</div>
                    <p>{review.content}</p>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
