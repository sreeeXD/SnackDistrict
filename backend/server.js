import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

// Catch-all route (for frontend)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

