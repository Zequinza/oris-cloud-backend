import express from "express";
import cors from "cors";
import "express-async-errors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import planRoutes from "./routes/plans.js";
import subscriptionRoutes from "./routes/subscriptions.js";
import diskRoutes from "./routes/disks.js";

// Import middleware
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

// ============================================
// MIDDLEWARE
// ============================================

// CORS
const corsOrigin = process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"];
app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use(requestLogger);

// ============================================
// ROUTES
// ============================================

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/disks", diskRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${NODE_ENV}`);
  console.log(`🔗 CORS enabled for: ${corsOrigin.join(", ")}`);
});

export default app;
