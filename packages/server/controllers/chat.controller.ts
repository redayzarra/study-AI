import type { Request, Response } from "express";
import { chatService } from "../services/chat.service";
import z from "zod";

// Creating a schema for the incoming request body
const chatSchema = z.object({
    prompt: z
        .string()
        .trim()
        .min(1, "Prompt is required")
        .max(1000, "Prompt is too long. Max 100 characters"),
    converstationId: z.uuid(),
});

export const chatController = {
    async sendMessage(req: Request, res: Response) {
        // Parse the result first
        const parseResult = chatSchema.safeParse(req.body);

        // Check if we have an error
        if (parseResult.error) {
            res.status(400).json(z.treeifyError(parseResult.error));
            return;
        }

        try {
            // Get the prommpt and conversationId from the request
            const { prompt, conversationId } = req.body;

            // Send the response to the chatService
            const response = await chatService.sendMessage(
                prompt,
                conversationId
            );

            // Create a
            res.status(200).json({ message: response.message });
        } catch (error) {
            // Set the status to "internal server error"
            res.status(500).json({
                error: "Failed to generate a response.",
            });
        }
    },
};
