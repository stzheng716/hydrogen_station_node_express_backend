"use strict";

const axios = require('axios');
const BASE_URL = "https://ipapi.co/";

async function getUserLocation(userIP) {
    const resp = await axios.get(`${BASE_URL}/${userIP}/json`);

    const {longitude, latitude} = resp.data;
    return {
        lat: latitude,
        long: longitude
    };
}

module.exports = {
    getUserLocation
}