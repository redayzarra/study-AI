import OpenAI from "openai";

// Create an OpenAI client with our API key
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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
        const response = await client.responses.create({
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
};
