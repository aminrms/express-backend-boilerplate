import app from "./app.js";
import { logger } from "./common/logger.js";
import { env } from "./config/env.js";
import {
    connectStatus as connectRedis,
    disconnectStatus as disconnectRedis,
} from "./config/redis.js";
import { prisma } from "./lib/prisma.js";


let server: ReturnType<typeof app.listen>;


const startServer = async () => {
    try {
        logger.info("Starting server");

        await prisma.$connect();
        console.log("PostgreSQL connected");


        await connectRedis();
        console.log("Redis connected");

        // Start HTTP server
        server = app.listen(env.port, () => {
            console.log(
                `Server running on http://localhost:${env.port}`,
            );
        });

    } catch (error) {
        console.error("Failed to start server:", error);

        await disconnectRedis();
        await prisma.$disconnect();

        process.exit(1);
    }
}


const shutdown = async (signal: string) => {
    logger.info(`${signal} recieved , Sutting down ...`);
    try {
        if (server) {
            await new Promise<void>((resolve, reject) => {
                server.close((error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                });
            });
        }
        console.log("HTTP server closed");

        await disconnectRedis();
        console.log("Redis disconnected");

        await prisma.$disconnect();
        console.log("PostgreSQL disconnected");

        process.exit(0);
    } catch (err) {
        console.error("Shutdown error:", err);
        process.exit(1);
    }
}



process.on("SIGINT", () => {
    void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});

void startServer();