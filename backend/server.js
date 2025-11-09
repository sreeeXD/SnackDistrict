import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
