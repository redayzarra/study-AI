import { LLM } from "../llm/client";
import { reviewRepository } from "../repositories/review.repository";
import template from "../prompts/summarize-reviews.txt";

export const reviewService = {
    // summarizeReviews: Summarizes the reviews for a specific product given it's ID
    async summarizeReviews(productId: number): Promise<string> {
        // Use the review repository to get the productId
        const existingSummary =
            await reviewRepository.getReviewSummary(productId);

        // If the summary already exists, then return it
        if (existingSummary) {
            return existingSummary;
        }

        // Get the first 10 reviews and join them in one single string
        const reviews = await reviewRepository.getReviews(productId, 10);
        const joinedReviews = reviews.map((rev) => rev.content).join("\n\n");

        // Load in our prompt and add our reviews
        const prompt = template.replace("{{reviews}}", joinedReviews);

        // Call our LLM client and generate a summary
        const { text: summary } = await LLM.generateText({
            model: "gpt-5",
            prompt,
            maxTokens: 500,
        });

        // Store the summary in the database and return it
        await reviewRepository.storeReviewSummary(productId, summary);
        return summary;
    },
};
