import OpenAI from "openai";
import { type Review } from "../generated/prisma";
import { reviewRepository } from "../repositories/review.repository";

// Create an OpenAI client with our API key
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const reviewService = {
    // getReviews: Allows us the fetch the reviews for a specific product given it's ID
    async getReviews(productId: number): Promise<Review[]> {
        return reviewRepository.getReviews(productId);
    },
    // summarizeReviews: Summarizes the reviews for a specific product given it's ID
    async summarizeReviews(productId: number): Promise<string> {
        const reviews = await reviewRepository.getReviews(productId, 10);
        const joinedReviews = reviews.map((rev) => rev.content).join("\n\n");

        const prompt = `
            Summarize the following customer reviews into a short paragraph highlighting 
            key themes, both positive and negative: 

            ${joinedReviews}
        `;

        const response = await client.responses.create({
            model: "gpt-5",
            input: prompt,
            max_output_tokens: 500,
        });

        return response.output_text;
    },
};
