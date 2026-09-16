import redisClient from "./redisClient.js";

const cacheMiddleware = (ttl = 3600) => {
  return async (req, res, next) => {
    const cacheKey = req.originalUrl;

    if (req.method !== "GET") {
      return next();
    }

    try {
      const cache = await redisClient.get(cacheKey);

      if (cache) {
        res.setHeader("X-Cache", "HIT");
        return res.json(JSON.parse(cache));
      }

      res.setHeader("X-Cache", "MISS");
      const originalJsonMethod = res.json;

      res.json = (body) => {
        res.json = originalJsonMethod;

        if (res.statusCode === 200) {
          redisClient
            .setEx(cacheKey, ttl, JSON.stringify(body))
            .catch((err) => console.error(`Failed to save key ${cacheKey} to Redis:`, err));
        }

        return res.json(body);
      };

      next();
    } catch (err) {
      console.error(`Redis Middleware Error for key ${cacheKey}:`, err);
      res.setHeader("X-Cache", "BYPASS");
      next();
    }
  };
};

export default cacheMiddleware;
