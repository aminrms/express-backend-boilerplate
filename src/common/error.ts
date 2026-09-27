import type { NextFunction, Response, Request } from "express";
import HttpStatusCode from "../constants/http-status-codes.js";
import { logger } from "./logger.js";


export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string;

    constructor(
        message: string,
        statusCode = 500,
        code = "INTERNAL_SERVER_ERR",
    ) {
        super(message);
        this.name = "AppError",
            this.statusCode = statusCode;
        this.code = code

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export const errorHnadler = (
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error("Unhandled error", error);

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error?.message,
            code: error?.code
        })
    }

    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Something went wrong",
        code: "INTERNAL_SERVER_ERROR",
    })
}