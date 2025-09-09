import express from  "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";

// Load the .env config
dotenv.config();

// Create an express app and define the port to host the webserver
const app = express();
const port = process.env.PORT || 3000;

// Create a basic endpoint at homepage that responds with text when visited in browser 
app.get("/", (request: Request, response: Response) => {
  response.send("Goodbye world.");
})

// Create a basic endpoint at homepage that responds with text when visited in browser 
app.get("/api/hello", (request: Request, response: Response) => {
  response.json({
    message: "Hello world!"
  })
})

// Botts up the Express web server on the port we defined earlier
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})
