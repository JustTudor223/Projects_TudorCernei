const express = require("express");
const app = express();
const store = require("../controller/store");

// Add Store 
app.post("/add", store.addStore);

// Get All Stores
app.get("/get", store.getAllStores);

module.exports = app;
