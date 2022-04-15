const express = require("express");
const app = express();
let port = 5000;
require("./src/config/database");
const Router = require("./src/routes/usersRouter");

app.use(express.json());

app.use("/api/v1", Router);

// this is for testing route
app.get("/", (req, res) => {
  res.send("This App Test Case Is Runing ");
});

app.listen(port, () => {
  console.log("This Node App Is Runing On Port No = " + port);
});
