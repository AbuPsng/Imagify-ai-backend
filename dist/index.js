import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectToDb } from "./config/config.js";
const PORT = process.env.PORT || 3000;
const app = express();
connectToDb();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    res.send("api is working");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
