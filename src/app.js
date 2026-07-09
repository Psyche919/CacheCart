require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
*/

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

const indexRoutes = require("./routes");

app.use("/", indexRoutes);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
    res.status(404).json({
        error: "Resource not found"
    });
});

module.exports = app;