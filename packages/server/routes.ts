import express from "express";
import type { Request, Response } from "express";
import { chatController } from "./controllers/chat.controller";
import { PrismaClient } from "./generated/prisma";

const router = express.Router();

// Create a basic endpoint at homepage that responds with text when visited in browser
router.get("/", (req: Request, res: Response) => {
    res.send("Goodbye world.");
});

// Create a basic endpoint at homepage that responds with text when visited in browser
router.get("/api/hello", (req: Request, res: Response) => {
    res.json({ message: "Hello world!" });
});

router.post("/api/chat", chatController.sendMessage);

router.get("/api/products/:id/reviews", async (req: Request, res: Response) => {
    const prisma = new PrismaClient();
    const productId = Number(req.params.id);

    // Prisma will generate a SQL query for us
    const reviews = await prisma.review.findMany({
        where: { productId },
        orderBy: { createdAt: "desc" },
    });

    res.json(reviews);
});

export default router;
