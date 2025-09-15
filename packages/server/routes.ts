import express from "express";
import type { Request, Response } from "express";
import { chatController } from "./controllers/chat.controller";

const router = express.Router();

// Create a basic endpoint at homepage that responds with text when visited in browser
router.get("/", (req: Request, res: Response) => {
    res.send("Goodbye world.");
});

// Create a basic endpoint at homepage that responds with text when visited in browser
router.get("/api/hello", (req: Request, res: Response) => {
    res.json({
        message: "Hello world!",
    });
});

router.post("/api/chat", chatController.sendMessage);

export default router;
