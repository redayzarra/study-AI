import OpenAI from "openai";
import { InferenceClient } from "@huggingface/inference";
import summarizePrompt from "../llm/prompts/summarize-reviews.txt";

// Create an OpenAI client with our API key
const openAIClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const huggingFaceClient = new InferenceClient(process.env.HF_TOKEN);

type GenerateTextOptions = {
    model?: string;
    prompt: string;
    instructions?: string;
    temperature?: number;
    maxTokens?: number;
    previousResponseId?: string;
};

type GenerateTextResult = {
    id: string;
    text: string;
};

export const LLM = {
    async generateText({
        model = "gpt-5",
        prompt,
        instructions,
        temperature,
        maxTokens = 500,
        previousResponseId,
    }: GenerateTextOptions): Promise<GenerateTextResult> {
        const response = await openAIClient.responses.create({
            model,
            input: prompt,
            instructions,
            temperature,
            max_output_tokens: maxTokens,
            previous_response_id: previousResponseId,
        });

        return {
            id: response.id,
            text: response.output_text,
        };
    },

    async summarizeReviews(text: string) {
        const chatCompletion = await huggingFaceClient.chatCompletion({
            provider: "sambanova",
            model: "meta-llama/Llama-3.1-8B-Instruct",
            messages: [
                {
                    role: "system",
                    content: summarizePrompt,
                },
                {
                    role: "user",
                    content: text,
                },
            ],
        });

        return chatCompletion.choices[0]?.message.content || "";
    },
};
