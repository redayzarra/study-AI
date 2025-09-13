import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import z from "zod";

// Load the .env config
dotenv.config();

// Creating a new OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

// Mapping conversationId -> lastResponseId
const conversations = new Map<string, string>();

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
    const response = await client.responses.create({
      model: "gpt-4o-minik",
      input: prompt,
      temperature: 0.1,
      max_output_tokens: 100,
      previous_response_id: conversations.get(conversationId),
    });

    conversations.set(conversationId, response.id);

    res.json({ message: response.output_text });
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
