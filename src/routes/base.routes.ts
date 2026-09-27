import { Router } from "express";
import { responseGenerator } from "../common/response.js";
import { asyncHandler } from "../common/asyncHandler.js";
import { Pool } from "pg";
import { env } from "../config/env.js";
import HttpStatusCode from "../constants/http-status-codes.js";
import { redis } from "../config/redis.js";


const pool = new Pool({
    connectionString: env.databaseUrl,
});


export const baseRouter = Router();




baseRouter.get("/health", asyncHandler(async (req, res) => {
    return responseGenerator.success(res, {
        data: {
            status: "ok"
        }
    })
}))




baseRouter.get("/health/db", asyncHandler(async (req, res) => {
    try {
        const result = await pool.query("SELECt 1 AS ok");
        return responseGenerator.success(res, {
            data: {
                status: "ok",
                db: result.rows[0].ok === 1 ? "connected" : "unknown",

            }
        })
    } catch (err: any) {
        return responseGenerator.error(res, {
            error: "Service is unavilable",
            status_code: HttpStatusCode.SERVICE_UNAVAILABLE
        });
    }
}))




baseRouter.get("/health/redis", asyncHandler(async (req, res) => {
    try {
        const pong = await redis.ping();
        return responseGenerator.success(res, {
            data: {
                status: "ok",
                redis: pong === "PONG" ? "connected" : "unknown",
            },
        });
    }
    catch (err) {
        return responseGenerator.error(res, {
            error: "Service is unavilable",
            status_code:HttpStatusCode.SERVICE_UNAVAILABLE
        });
    }
}))