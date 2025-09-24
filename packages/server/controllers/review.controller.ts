import type { Request, Response } from "express";
import { reviewService } from "../services/review.service";
import { productRepository } from "../repositories/product.repository";
import { reviewRepository } from "../repositories/review.repository";

export const reviewController = {
    async getReviews(req: Request, res: Response) {
        // Get the productId from the request
        const productId = Number(req.params.id);

        // If the productId is Not a Number, then return invalid error
        if (isNaN(productId)) {
            res.status(400).json({ error: "Invalid productId: Not a number" });
            return;
        }

        // Validate that this product is valid
        const product = await productRepository.getProduct(productId);
        if (!product) {
            res.status(400).json({
                error: `Invalid productId: ${productId} doesn't exist.`,
            });
            return;
        }

        // Check to make sure that the product has at least one review
        const checkReview = await reviewRepository.getReviews(productId, 1);
        if (!checkReview.length) {
            res.status(400).json({
                error: "There are no reviews to summarize.",
            });
            return;
        }

        const reviews = await reviewService.getReviews(product.id);
        res.json(reviews);
    },
    async summarizeReviews(req: Request, res: Response) {
        // Get the productId from the request
        const productId = Number(req.params.id);

        // If the productId is Not a Number, then return invalid error
        if (isNaN(productId)) {
            res.status(400).json({ error: "Invalid productId" });
            return;
        }

        const summary = await reviewService.summarizeReviews(productId);
        res.json({ summary });
    },
};
