import { type Review } from "../generated/prisma";
import { LLM } from "../llm/client";
import { reviewRepository } from "../repositories/review.repository";
import template from "../prompts/summarize-reviews.txt";

export const reviewService = {
    // getReviews: Allows us the fetch the reviews for a specific product given it's ID
    async getReviews(productId: number): Promise<Review[]> {
        return reviewRepository.getReviews(productId);
    },
    // summarizeReviews: Summarizes the reviews for a specific product given it's ID
    async summarizeReviews(productId: number): Promise<string> {
        const reviews = await reviewRepository.getReviews(productId, 10);
        const joinedReviews = reviews.map((rev) => rev.content).join("\n\n");

        const prompt = template.replace("{{reviews}}", joinedReviews);

        const { text: summary } = await LLM.generateText({
            model: "gpt-5",
            prompt,
            maxTokens: 500,
        });

        await reviewRepository.storeReviewSummary(productId, summary);
        return summary;
    },
};
