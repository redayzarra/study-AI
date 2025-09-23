import dayjs from "dayjs";
import { PrismaClient, type Review } from "../generated/prisma";

// Initialize a new Prisma client
const prisma = new PrismaClient();

export const reviewRepository = {
    async getReviews(productId: number, limit?: number): Promise<Review[]> {
        // Return a list of reviews based on the productId, in descending order
        return prisma.review.findMany({
            where: { productId },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    },

    storeReviewSummary(productId: number, summary: string) {
        const now = new Date();
        const expiresAt = dayjs().add(7, "days").toDate();
        const data = {
            content: summary,
            expiresAt,
            generatedAt: now,
            productId,
        };

        prisma.summary.upsert({
            where: { productId },
            create: data,
            update: data,
        });
    },
};
