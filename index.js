const { default: axios } = require("axios");
const express = require("express");
const { createClient } = require("redis");

const PORT = 3000;
const DEFAULT_EXPIRY_TIME = 3600;

const app = express();
const redisClient = createClient();

const startRedis = async () => await redisClient.connect();

startRedis();

app.get("/photos", async (req, res) => {
  const cached = await redisClient.get("photos");

  if (cached != null) {
    console.log("Cache Hit");
    return res.json(JSON.parse(cached));
  }

  console.log("Cache Miss");
  const { data } = await axios.get("https://jsonplaceholder.typicode.com/photos");
  await redisClient.setEx("photos", DEFAULT_EXPIRY_TIME, JSON.stringify(data));
  res.json(data);
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.log("Listening on port:", PORT);
});
