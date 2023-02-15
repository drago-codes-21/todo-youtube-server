const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./database/connectDB");
const userRoute = require("./routes/user.routes");
const todoRoute = require("./routes/todo.routes");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();
connectDB();

// middlewares
app.use(express.json()); // data parsing
app.use(cors()); // cors policy
app.use(helmet()); // saving express server from attacks
app.use(morgan("common")); // middlware logger

// routes
app.use("/api/user", userRoute);
app.use("/api/todo", todoRoute);

app.get("/", (req, res) => {
  res.send("Welcome to our application");
});

app.listen(process.env.PORT, () => {
  console.log("Server is started");
});
