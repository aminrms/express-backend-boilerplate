import type { RequestHandler } from "express";
import { z } from 'zod';

interface ValidateSchema {
    body?: z.ZodType;
    params?: z.ZodType;
    query?: z.ZodType;
}


export const validate = (
    schemas: ValidateSchema
): RequestHandler => {
    return (req, _res, next) => {
        try {
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);;
            }
            if (schemas.params) {
                req.params = schemas.params.parse(req.params);

            }
            if (schemas.query) {
                req.query = schemas.query.parse(req.query);;
            }
            next();

        } catch (error) {
            next(error)
        }
    }
}