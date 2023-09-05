"use strict"

const express = require("express");

const { BadRequestError } = require("../expressError");
const HydrogenStations = require("../models/hydrogenStation");

const router = express.Router();

router.get("/", async function (req, res, next) {
    const station = await HydrogenStations.findAll();
    return res.json({ station })
})

router.get("/zipCode", async function (req, res, next) {
    console.log("zipcode", req.query.zipCode)
    const station = await HydrogenStations.getStation(req.query.zipCode);
    console.log(station)
    return res.json({ station })
})

module.exports = router;