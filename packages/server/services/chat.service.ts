import fs from "fs";
import path from "path";
import { conversationRepository } from "../repositories/conversation.respository";
import template from "../prompts/chatbot.txt";
import { LLM } from "../llm/client";

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
        const response = await LLM.generateText({
            model: "gpt-4o-mini",
            instructions,
            prompt,
            temperature: 0.2,
            maxTokens: 200,
            previousResponseId:
                conversationRepository.getLastResponseId(conversationId),
        });

        conversationRepository.setLastResponseId(conversationId, response.id);

        // Return a ChatResponse
        return { id: response.id, message: response.text };
    },
};
