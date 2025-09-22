import { PrismaClient, type Review } from "../generated/prisma";

export const reviewRepository = {
    async getReviews(productId: number, limit?: number): Promise<Review[]> {
        // Initialize a new Prisma client
        const prisma = new PrismaClient();

        // Return a list of reviews based on the productId, in descending order
        return prisma.review.findMany({
            where: { productId },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    },
};
