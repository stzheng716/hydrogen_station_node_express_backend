"use strict";

require("dotenv").config({path: '.env'});
const NodeGeocoder = require('node-geocoder');

const OpenCage_API_KEY = process.env.OPENCASE_API_KEY

console.log(OpenCage_API_KEY)

const options = {
    provider: 'opencage',
    apiKey: OpenCage_API_KEY
}

const geocoder = NodeGeocoder(options);

async function getLongLat(address) {
    try {
        const geocode = await geocoder.geocode(address)
        return geocode[0];
    }  catch(error) {
        console.log("Error", error);
        return null;
    }

}

module.exports = {
    getLongLat
  };


