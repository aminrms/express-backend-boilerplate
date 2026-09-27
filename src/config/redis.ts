
import { createClient, RedisSentinel } from "redis";
import { env } from "./env.js";

const redis = createClient({
    url: env.redisUrl
})

redis.on("error", (error) => {
    console.log("Redis client Error:", error)
})


redis.on("connect", () => {
    console.log("Redis connecting...");
});

redis.on("ready", () => {
    console.log("Redis ready");
});


redis.on("end", () => {
    console.log("Redis connection closed");
});



export const connectStatus = async () => {
    if (redis.isOpen) {
        return;
    }
    await redis.connect();
}


export const disconnectStatus = async () => {
    if (!redis.isOpen) {
        return;
    }
    await redis.quit();
}

export { redis };