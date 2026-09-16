import axios from "axios";
import express from "express";
import cacheMiddleware from "./cacheMiddleware.js";

const PORT = 3000;

const app = express();

app.get("/photos", cacheMiddleware(), async (req, res) => {
  try {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/photos");
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log("Listening on port:", PORT);
});
