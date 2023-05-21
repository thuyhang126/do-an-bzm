"use strict";

const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

module.exports = {
  username: process.env.DB_USERNAME || "test",
  password: process.env.DB_PASSWORD || ".test",
  database: process.env.DB_DATABASE || "node_base",
  host: process.env.DB_HOST || "mariadb_bizvn",
  port: process.env.DB_PORT || "3306",
  dialect: process.env.DB_CONNECTION || "mariadb",
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
    timezone: process.env.APP_TIMEZONE || "+07:00",
  },
  timezone: "+07:00",
  pool: {
    min: 1,
    max: 60,
    idle: 10000,
  },
  define: {
    charset: "utf8mb4",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    table: {
      underscored: true,
    },
    script: {
      underscored: false,
    },
  },
  benchmark: false,
  logging: false,
};
