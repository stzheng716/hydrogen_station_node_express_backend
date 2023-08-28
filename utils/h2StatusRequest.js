"use strict";

const axios = require('axios');
const API_URL = "https://m.h2fcp.org/nocache/soss2-status-mini.json"
const HydrogenStations = require('../models/hydrogenStation')

async function getH2StatusAndUpdate() {
    
    const resp = await axios.get(API_URL);

    const stationsStatus = resp.data
    
    for(const station of stationsStatus) {

        try {
            const stationID = station.n.s;
            const h70status = station.n.s7
            let capacity = Number(station.n.c7.split(" ")[0])

            if(isNaN(capacity)) {
                capacity = 0;
            }
    
            HydrogenStations.updateStation(stationID, {h70status, capacity})
        } catch (error) {
            console.error("error", error)
        }
    }

    console.log("Database last updated on", Date.now())
}

module.exports = {
    getH2StatusAndUpdate
}

//legend for s7 status code
// 1 = available
// 2 = limited
// 3 = unavailable 
// 4 = unknown
// 6 = refreshing/wait