"use strict";

const puppeteer = require('puppeteer')
const { getLongLat } = require('./geoCoder')
const HydrogenStations = require('../models/hydrogenStation')

const h2URL = "https://m.h2fcp.org/"

async function h2StationScrap() {
    let browser;
    try {
        browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(h2URL)

        const stationsInfo = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("#block-system-main > div > div > div.view-content > table > tbody > tr")).map((s) => {

                const contentPath = "https://m.h2fcp.org" + s.childNodes['3'].querySelector('a').getAttribute('href')

                const stationID = s.classList['1']
                const stationName = s.childNodes[3].childNodes[1].textContent.trim()
                // const h70StatusStr =  s.childNodes[5].childNodes[0].classList['1']
                // const unknownStatusCode = 4;
                // const h70StatusCode = unknownStatusCode;


                return {
                    stationID,
                    stationName,
                    contentPath,
                }

            })
        })


        for (const station of stationsInfo) {

            await page.goto(station.contentPath)

            const address = await page.evaluate(() => {
                address = document.querySelector(".address").textContent
                return address.trim().split(',')
            })

            const { latitude, longitude } = await getLongLat(address)

            station["longitude"] = longitude;
            station["latitude"] = latitude;
            station["streetAddress"] = address[0].trim();
            station["city"] = address[1].trim();
            station["state"] = address[2].split(" ")[1].trim();
            station["zipCode"] = address[2].split(" ")[2].trim();

            await HydrogenStations.create(station);
            console.log(station)
            await page.goBack();
        }
    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        await browser.close()
    }

    return;
}

h2StationScrap().then(() => {
    console.log("Scrapped data and updated database")
    process.exit()})