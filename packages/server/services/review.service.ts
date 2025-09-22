import { type Review } from "../generated/prisma";
import { reviewRepository } from "../repositories/review.repository";

export const reviewService = {
    async getReviews(productId: number): Promise<Review[]> {
        return reviewRepository.getReviews(productId);
    },
    async summarizeReviews(productId: number): Promise<string> {
        const reviews = await reviewRepository.getReviews(productId, 10);
        const joinedReviews = reviews.map((rev) => rev.content).join("\n\n");

        // Placeholder
        const summary = "Placeholder summary.";
        return summary;
    },
};
