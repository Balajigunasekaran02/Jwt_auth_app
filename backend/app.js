require("dotenv").config();
const express = require("express");
const authRouter = require("./routes/authRoutes.js");
const databaseConnect = require("./config/db.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
databaseConnect();

app.use(express.json());

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/", (req, res) => {
  res.status(200).json({
    data: "JWT Auth app",
  });
});

module.exports = app;
