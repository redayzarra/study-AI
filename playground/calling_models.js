import dotenv from "dotenv";
import { OpenAI } from "openai";

// Load the .env config
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

const client = new OpenAI({
  apiKey: apiKey,
});

// Async iterable
const stream = await client.responses.create({
  model: "gpt-3.5-turbo",
  input: "Write a story about a garden",
  temperature: 0.7,
  max_output_tokens: 100,
  stream: true,
});

for await (const response of stream) {
  if (response.delta) {
    process.stdout.write(response.delta);
  }
}
