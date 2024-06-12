const express = require("express");
const app = express();
const product = require("../controller/product");

// Add Product
app.post("/add", product.addProduct);

// Get All Products
app.get("/get", product.getAllProducts);

// Delete Selected Product Item
app.get("/delete/:id", product.deleteSelectedProduct);

// Update Selected Product
app.post("/update", product.updateSelectedProduct);

// Search Product
app.get("/search", product.searchProduct);

// Import Products
app.post("/import", product.importProducts);

// Delete All Products
app.delete("/deleteAll", product.deleteAllProducts);



// For Statistics Page //

// Stocks Satus
app.get('/stockStatus', product.getStockStatus);

// Top 5 products by stock
app.get('/topProductsByStock', product.getTopProductsByStock);

// http://localhost:4000/api/product/search?searchTerm=fa

module.exports = app;
