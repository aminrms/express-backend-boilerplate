import express from "express";
import cors from "cors"
import helmet from "helmet";
import { env } from "./config/env.js";
import { baseRouter } from "./routes/base.routes.js";
import { AppError, errorHnadler } from "./common/error.js";
import { asyncHandler } from "./common/asyncHandler.js";
import morgan from "morgan";

 const app = express();

app.use(morgan("dev"));

app.use(express.json({
  limit: "1mb"
}));
app.use(helmet())

// --- CORS ---
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (env.corsOrigins?.[0] === "*") return callback(null, true);

    // Allow if the origin is in the allowlist
    if (Array.isArray(env.corsOrigins) && env.corsOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: [],
  credentials: true,
  maxAge: 86400,
  optionsSuccessStatus: 204,
}
app.use(cors(corsOptions));



// Routes
app.use(baseRouter)



app.use(
  asyncHandler(async () => {
    throw new AppError(
      "Route not found",
      404,
      "NOT_FOUND",
    );
  }),
);

app.use(errorHnadler)
export default app;