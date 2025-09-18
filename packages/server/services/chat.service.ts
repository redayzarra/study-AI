import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { conversationRepository } from "../repositories/conversation.respository";
import template from "../prompts/chatbot.txt";

// Creating a new OpenAI client
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Get the informational markdown file from prompts/ directory then add it to our chatbot prompt
const parkInfo = fs.readFileSync(
    path.join(__dirname, "..", "prompts", "WonderWorld.md"),
    "utf-8"
);
const instructions = template.replace("{{parkInfo}}", parkInfo);

interface ChatResponse {
    id: string;
    message: string;
}

// Public interface
export const chatService = {
    async sendMessage(
        prompt: string,
        conversationId: string
    ): Promise<ChatResponse> {
        const response = await client.responses.create({
            model: "gpt-4o-mini",
            instructions,
            input: prompt,
            temperature: 0.2,
            max_output_tokens: 200,
            previous_response_id:
                conversationRepository.getLastResponseId(conversationId),
        });

        conversationRepository.setLastResponseId(conversationId, response.id);

        // Return a ChatResponse
        return { id: response.id, message: response.output_text };
    },
};
