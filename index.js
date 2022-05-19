const express = require("express");
const morgan = require("morgan");

// Loading the .env file
require("dotenv").config();

/**
 *
 * ------------- GENERAL SETUP -------------
 *
 */
const app = express();
const PORT = process.env.PORT || 8080;

app.use(morgan("dev")); // for logging
app.use(express.json()); // for parsing json body
app.use(express.urlencoded({ extended: true })); // for parsing urlencoded payloads

app.set("views", "./views");
app.set("view engine", "pug");

/**
 *
 * ------------- APP ROUTES -------------
 *
 */
app.get("/", (req, res, next) => {
  res.render("index", { phrase: "Hello world" });
});

/**
 *
 * ------------- ERROR HANDLERS -------------
 *
 */
// 404 error handler
app.use((req, res, next) => {
  const err = new HttpException(404, "Route doesnot exist");

  next(err);
});

// Global error handler
// in development environment error handler sends whole error stack
// in production environment error handler sends only error data if any
app.use((err, req, res, next) => {
  const env = process.env.ENV;

  err.data = err.data || null;
  if (env !== "production") {
    err.data = err.data || err.stack || null;
  }

  err.success = false;
  err.status = err.status || 500;
  err.message = err.message || "Something went wrong";
  err.data = err.data || err.stack || null;

  res.status(err.status).json({
    success: err.success,
    status: err.status,
    message: err.message,
    data: err.data,
  });
});

app.listen(PORT, () => {
  console.log(`
    Server running on port: ${PORT}
    *************************
    http://localhost:${PORT}/
    *************************
    `);
});