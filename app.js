const express = require("express");
const app = express();
const db = require("./db/connection");
const getApi = require("./controllers folder/api.controllers");

app.get("/api", getApi);

module.exports = app;
