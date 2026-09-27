import "dotenv/config"
import { z } from 'zod';


// const PORT = process.env.PORT || 3000;
// const JWT_SECRET = process.env.JWT_SECRET || null
// const CORS_ORIGINS = process.env.CORS_ORIGINS || "*";
// const DATABASE_URL = process.env.DATABASE_URL || "*";
// const DEBUG = process.env.DEBUG === "true";
// const REDIS_URL = process.env.REDIS_URL || "";


const envSchema = z.object({
    PORT: z.coerce.number().int().positive().default(4000),
    NODE_ENV: z.enum([
        "development",
        "test",
        "production"
    ]).default("development"),

    DEBUG: z.string().default("true"),
    DATABASE_URL: z.url(),

    REDIS_URL: z.url(),

    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

    CORS_ORIGINS: z
        .string()
        .default("http://localhost:3000"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error("Invalid environment variables:");
    console.error(result.error.issues);

    process.exit(1);
}

const values = result.data;

console.log(values)

export const env = {
    port: values.PORT,
    nodeEnv: values.NODE_ENV,
    databaseUrl: values.DATABASE_URL,
    redisUrl: values.REDIS_URL,
    jwtSecret: values.JWT_SECRET,

    corsOrigins: values.CORS_ORIGINS
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    DEBUG:values.DEBUG
}