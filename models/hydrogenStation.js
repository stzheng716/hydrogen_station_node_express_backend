"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../utils/sqlUpdate");

class HydrogenStations {

    static async create({
        stationID,
        stationName,
        streetAddress,
        city, 
        state,
        zipCode,
        contentPath,
        longitude,
        latitude }) {

        const duplicateCheck = await db.query(`
            SELECT stationID
            FROM hydrogen_station
            WHERE stationID = $1`, [stationID]);

        if (duplicateCheck.rows[0])
            return 'Duplicate station';

        const result = await db.query(`
            INSERT INTO hydrogen_station (stationID,
                                           station_name,
                                           content_path,
                                           longitude,
                                           latitude,
                                           street_address,
                                           city, 
                                           us_state,
                                           zipcode)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING
                stationID,
                station_name,
                content_path,
                longitude,
                latitude,
                street_address,
                city, 
                us_state,
                zipcode
                `, [
            stationID,
            stationName,
            contentPath,
            longitude,
            latitude,
            streetAddress,
            city, 
            state,
            zipCode
            ]
        );

        const hydrogen_station = result.rows[0];

        return hydrogen_station;
    }

    static async updateStation(stationID, data) {
        console.log("station and data", stationID, data)
        const {setCols, values} = sqlForPartialUpdate(
            data, {
                h70status: "h70_current_status",
                capacity: "capacity_kg"
            }
        );

        const handleVarIdx = "$" + (values.length + 1);

        const querySql = `
            UPDATE hydrogen_station
            SET ${setCols}
            WHERE stationID = ${handleVarIdx}
            RETURNING
                stationID,
                street_address,
                h70_current_status`
        const result = await db.query(querySql, [...values, stationID]);
        const station = result.rows[0];
        return station;
    }
}

module.exports = HydrogenStations;