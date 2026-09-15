import { createClient } from "redis";
const redisClient = createClient();

redisClient.on("error", (err) => console.error("Error connecting to redis:", err));
redisClient.on("connect", () => console.log("Connected to redis successfully"));

await redisClient.connect();

export default redisClient;
