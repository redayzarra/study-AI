import dotenv from "dotenv";
import type { Request, Response } from "express";
import express from "express";
import z from "zod";
import { chatService } from "./services/chat.service";

// Load the .env config
dotenv.config();

// Create an express app and define the port to host the webserver
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

// Create a basic endpoint at homepage that responds with text when visited in browser
app.get("/", (req: Request, res: Response) => {
    res.send("Goodbye world.");
});

// Create a basic endpoint at homepage that responds with text when visited in browser
app.get("/api/hello", (req: Request, res: Response) => {
    res.json({
        message: "Hello world!",
    });
});

// Creating a schema for the incoming request body
const chatSchema = z.object({
    prompt: z
        .string()
        .trim()
        .min(1, "Prompt is required")
        .max(1000, "Prompt is too long. Max 100 characters"),
    converstationId: z.uuid(),
});

app.post("/api/chat", async (req: Request, res: Response) => {
    // Parse the result first
    const parseResult = chatSchema.safeParse(req.body);

    if (parseResult.error) {
        res.status(400).json(z.treeifyError(parseResult.error));
        return;
    }

    try {
        const { prompt, conversationId } = req.body;
        const response = await chatService.sendMessage(prompt, conversationId);

        res.json({ message: response.message });
    } catch (error) {
        // Set the status to "internal server error"
        res.status(500).json({
            error: "Failed to generate a response.",
        });
    }
});

// Botts up the Express web server on the port we defined earlier
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
