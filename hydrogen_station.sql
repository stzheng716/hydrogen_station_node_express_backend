CREATE TABLE hydrogen_station(
    stationID VARCHAR(25) PRIMARY KEY,
    station_name TEXT NOT NULL,
    h70_current_status NUMERIC DEFAULT 4 NOT NULL,
    content_path TEXT NOT NULL,
    longitude FLOAT,
    latitude FLOAT,
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    us_state TEXT NOT NULL,
    zipcode TEXT NOT NULL,
    capacity_kg NUMERIC DEFAULT 0
);
