"use strict"

const express = require("express");

const { BadRequestError } = require("../expressError");
const HydrogenStations = require("../models/hydrogenStation");
const { getUserLocation } = require("../utils/getUserLocation");
const nearbySort = require("nearby-sort")

const router = express.Router();

router.get("/", async (req, res, next) => {
    let station = await HydrogenStations.findAll();

    //for local environment ip
    if (req.ip === "::1") return res.json({ station })

    const userCoordinate = await getUserLocation(req.ip)
    
    //sorts stations by distance from user
    station = await nearbySort(userCoordinate, station);

    return res.json({ station })
})

router.get("/search", async (req, res, next) => {
    const station = await HydrogenStations.getStation(req.query.zipCode);
    return res.json({ station })
})

module.exports = router;