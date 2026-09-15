const { default: axios } = require("axios");
const express = require("express");

const app = express();

app.get("/", async (req, res) => {
  try {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/photos");
    return res.send(data);
  } catch (err) {
    console.error(err);
  }
});

app.listen(3000, (err) => {
  if (err) {
    console.error(err);
  }
  console.log("Listening on port: 3000");
});
