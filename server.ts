const routes = require("./routes");
const express = require("express");
require("dotenv").config({ path: ".env.development" });

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
