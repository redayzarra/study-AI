import dotenv from "dotenv";
import type { Request, Response } from "express";
import express from "express";
import { chatController } from "./controllers/chat.controller";

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

app.post("/api/chat", chatController.sendMessage);

// Botts up the Express web server on the port we defined earlier
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
