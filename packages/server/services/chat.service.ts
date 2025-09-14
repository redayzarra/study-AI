import OpenAI from "openai";
import { conversationRepository } from "../repositories/conversation.respository";

// Creating a new OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      model: "gpt-4o-minik",
      input: prompt,
      temperature: 0.1,
      max_output_tokens: 100,
      previous_response_id:
        conversationRepository.getLastResponseId(conversationId),
    });

    conversationRepository.setLastResponseId(conversationId, response.id);

    // Return a ChatResponse
    return {
      id: response.id,
      message: response.output_text,
    };
  },
};
