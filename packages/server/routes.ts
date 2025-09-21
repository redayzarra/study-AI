import type { Request, Response } from "express";
import express from "express";
import { chatController } from "./controllers/chat.controller";
import { reviewController } from "./controllers/review.controller";

const router = express.Router();

router.post("/api/chat", chatController.sendMessage);

router.get("/api/products/:id/reviews", reviewController.getReviews);

export default router;
