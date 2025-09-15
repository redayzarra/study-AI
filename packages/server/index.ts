import dotenv from "dotenv";
import express from "express";
import router from "./routes";

// Load the .env config
dotenv.config();

// Create an express app (default to json) and connect to our router
const app = express();
app.use(express.json());
app.use(router);

// Define the port in the .env file or fallback to 3000
const port = process.env.PORT || 3000;

// Boots up the Express web server on the port we defined earlier
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
