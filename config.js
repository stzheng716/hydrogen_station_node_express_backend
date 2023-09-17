require("dotenv").config();

// Use dev database, testing database, or via env var, production database

const PORT = +process.env.PORT || 3001;

function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? process.env.DATABASE_URL_TEST
        : process.env.DATABASE_URL || "postgresql:///hydrogen_stations";
  }

  module.exports = {
    PORT,
    getDatabaseUri,
  }