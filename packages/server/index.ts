import express from  "express";
import type { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (request, response) => {
  response.send("Hello world!")
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})
