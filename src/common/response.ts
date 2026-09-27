
import type { Response } from "express";
import HttpStatusCode from "../constants/http-status-codes.js";
import { env } from "../config/env.js";

export interface SuccessResponseOptions {
    status_code?: number;
    message?: string;
    data?: any
}
export interface ErrorResponseOptions {
    status_code?: number;
    error: unknown;
}


export class ResponseGenerator {

    success(
        res: Response,
        options: SuccessResponseOptions
    ) {
        const statusCode = options?.status_code || HttpStatusCode.OK;

        return res
            .status(statusCode)
            .json({
                success: true,
                message: options?.message || "Success",
                data: options?.data ?? null
            })

    }
    error(
        res: Response,
        options: ErrorResponseOptions
    ) {
        const statusCode = options?.status_code || HttpStatusCode.BAD_REQUEST;
        const err = options?.error;
        let message = "Something went wrong";
        let debug: unknown = undefined;

        if (typeof err === "string" && err) {
            message = err;
        } else if (err instanceof Error && err.message) {
            message = err.message;
            if (env.DEBUG) {
                debug = {
                    stack: err.stack,
                };
            }
        }
        const response: {
            success: boolean;
            message: string;
            data: null;
            debug?: unknown;
        } = {
            success: false,
            message,
            data: null,
        };

        if (env.DEBUG && debug) {
            response.debug = debug;
        }
        return res
            .status(statusCode)
            .json({
                success: false,
                message,
                data: null
            })
    }
}

export const responseGenerator = new ResponseGenerator();