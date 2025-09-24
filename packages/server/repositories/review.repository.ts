import dayjs from "dayjs";
import { PrismaClient, type Review } from "../generated/prisma";

// Initialize a new Prisma client
const prisma = new PrismaClient();

export const reviewRepository = {
    // Return a list of reviews based on the productId, in descending order
    async getReviews(productId: number, limit?: number): Promise<Review[]> {
        return prisma.review.findMany({
            where: { productId },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    },
    // Store the generated review and add an expiration date, one week into the future
    storeReviewSummary(productId: number, summary: string) {
        const now = new Date();
        const expiresAt = dayjs().add(7, "days").toDate();
        const data = {
            content: summary,
            expiresAt,
            generatedAt: now,
            productId,
        };

        return prisma.summary.upsert({
            where: { productId },
            create: data,
            update: data,
        });
    },
    // Get a valid summary for a productId if it exists
    async getReviewSummary(productId: number): Promise<string | null> {
        const summary = await prisma.summary.findFirst({
            where: {
                AND: [{ productId }, { expiresAt: { gt: new Date() } }],
            },
        });

        return summary ? summary.content : null;
    },
};
