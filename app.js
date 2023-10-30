"use strict";

const express = require("express");
// const serverless = require("serverless-http")
const cors = require("cors");

const { NotFoundError } = require("./expressError");
const UPDATE_INTERVAL = 10000

const hydrogenRoutes = require("./routes/hydrogenStations");
const { getH2StatusAndUpdate } = require("./utils/h2StatusRequest");

const morgan = require("morgan");

const app = express();
// const handler = serverless(app)

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

app.use("/stations", hydrogenRoutes)


setInterval(getH2StatusAndUpdate, UPDATE_INTERVAL)


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    throw new NotFoundError();
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app

// module.exports = {
//     app,
//     handler,
// };
