import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// API routes
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

// Catch-all (for frontend routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
