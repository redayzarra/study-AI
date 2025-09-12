import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

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

app.post("/api/chat", async (req: Request, res: Response) => {
  const { prompt } = req.body;

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
    temperature: 0.1,
    max_output_tokens: 100,
  });

  res.json({ message: response.output_text });
});

// Botts up the Express web server on the port we defined earlier
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
