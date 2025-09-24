import type { Request, Response } from "express";
import { reviewService } from "../services/review.service";
import { productRepository } from "../repositories/product.repository";

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
