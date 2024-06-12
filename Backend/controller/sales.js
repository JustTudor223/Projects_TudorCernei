const Sales = require("../models/sales");
const Product = require("../models/Product");
const Store = require("../models/Store");
const soldStock = require("./soldStock");

// Add Sales
const addSales = (req, res) => {
  const addSale = new Sales({
    userID: req.body.userID,
    ProductID: req.body.productID,
    StoreID: req.body.storeID,
    StockSold: req.body.stockSold,
    SaleDate: new Date(req.body.saleDate),
    TotalSaleAmount: req.body.totalSaleAmount,
    PricePerUnit: req.body.pricePerUnit,
  });

  addSale
    .save()
    .then((result) => {
      soldStock(req.body.productID, req.body.stockSold);
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

// Get All Sales Data
const getSalesData = async (req, res) => {
  const findAllSalesData = await Sales.find({})
    .sort({ _id: -1 })
    .populate("ProductID")
    .populate("StoreID"); // -1 for descending order
  res.json(findAllSalesData);
};

// Get total sales amount
const getTotalSalesAmount = async (req, res) => {
  let totalSaleAmount = 0;
  const salesData = await Sales.find({});
  salesData.forEach((sale) => {
    totalSaleAmount += sale.TotalSaleAmount;
  });
  res.json({ totalSaleAmount });
};

// Get total sales amount in the last 30 days
const getTotalSalesAmountLast30Days = async (req, res) => {
  const date30DaysAgo = new Date();
  date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);

  const salesData = await Sales.find({
    SaleDate: { $gte: date30DaysAgo },
  });

  let totalSaleAmount = 0;
  salesData.forEach((sale) => {
    totalSaleAmount += sale.TotalSaleAmount;
  });

  res.json({ totalSaleAmount });
};

// Get monthly sales in the last 12 months
const getMonthlySales = async (req, res) => {
  try {
    const date12MonthsAgo = new Date();
    date12MonthsAgo.setMonth(date12MonthsAgo.getMonth() - 12);

    const sales = await Sales.find({
      SaleDate: { $gte: date12MonthsAgo },
    });

    const salesAmount = new Array(12).fill(0);

    sales.forEach((sale) => {
      const saleDate = new Date(sale.SaleDate);
      const monthDiff = (new Date().getFullYear() - saleDate.getFullYear()) * 12 + new Date().getMonth() - saleDate.getMonth();
      
      if (monthDiff >= 0 && monthDiff < 12) {
        salesAmount[11 - monthDiff] += sale.TotalSaleAmount; // Store amounts in reverse order
      }
    });

    res.status(200).json({ salesAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get number of sales in the last 30 days
const getSalesCountLast30Days = async (req, res) => {
  try {
    const date30DaysAgo = new Date();
    date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);

    const salesCount = await Sales.countDocuments({
      SaleDate: { $gte: date30DaysAgo },
    });

    res.status(200).json({ salesCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Import Sales
const importSales = async (req, res) => {
  const sales = req.body;
  console.log("Received sales for import:", sales);

  try {
    const productMap = {};
    const storeMap = {};
    const errors = [];

    // First, find all unique product names and store names in the CSV
    const productNames = [...new Set(sales.map(sale => sale.ProductName))];
    const storeNames = [...new Set(sales.map(sale => sale.StoreName))];

    // Fetch the product IDs for these names
    const products = await Product.find({ name: { $in: productNames } });
    // Fetch the store IDs for these names
    const stores = await Store.find({ name: { $in: storeNames } });

    // Create a map from product name to product ID and stock
    products.forEach(product => {
      productMap[product.name] = {
        id: product._id,
        stock: product.stock
      };
    });

    // Create a map from store name to store ID
    stores.forEach(store => {
      storeMap[store.name] = store._id;
    });

    // Replace product and store names with IDs in sales and check stock
    const salesWithIDs = sales.map(sale => {
      const productInfo = productMap[sale.ProductName];
      const storeID = storeMap[sale.StoreName];

      if (!productInfo) {
        errors.push(`Product name "${sale.ProductName}" not found`);
        return null;
      }
      if (!storeID) {
        errors.push(`Store name "${sale.StoreName}" not found`);
        return null;
      }

      let stockSold = sale.StockSold;

      // Check if stock sold is greater than available stock
      if (productInfo.stock < stockSold) {
        stockSold = productInfo.stock;
      }

      // Skip sale if no stock is available
      if (stockSold <= 0) {
        return null;
      }

      return {
        userID: sale.userID,
        ProductID: productInfo.id,
        StoreID: storeID,
        StockSold: stockSold,
        SaleDate: new Date(sale.SaleDate),
        TotalSaleAmount: sale.TotalSaleAmount * (stockSold / sale.StockSold), // Adjust total sale amount
        PricePerUnit: sale.PricePerUnit
      };
    }).filter(sale => sale !== null);

    if (errors.length > 0) {
      return res.status(400).send({ error: errors.join(", ") });
    }

    const result = await Sales.insertMany(salesWithIDs);
    salesWithIDs.forEach(sale => {
      soldStock(sale.ProductID, sale.StockSold);
    });
    res.status(200).send(result);
  } catch (err) {
    console.error("Error inserting sales:", err);
    res.status(400).send({ error: "Failed to import sales" });
  }
};

// Delete All Sales
const deleteAllSales = async (req, res) => {
  try {
    await Sales.deleteMany({});
    res.status(200).send({ message: "All sales deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting sales", error });
  }
};

// Get earned last 12 months
const getEarnedLast12Months = async (req, res) => {
  try {
    const date12MonthsAgo = new Date();
    date12MonthsAgo.setMonth(date12MonthsAgo.getMonth() - 12);

    const salesData = await Sales.find({
      SaleDate: { $gte: date12MonthsAgo },
    });

    const totalEarned = salesData.reduce((acc, sale) => acc + sale.TotalSaleAmount, 0);

    res.status(200).json({ totalEarned });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get sales last 12 months
const getSalesLast12Months = async (req, res) => {
  try {
    const date12MonthsAgo = new Date();
    date12MonthsAgo.setMonth(date12MonthsAgo.getMonth() - 12);

    const salesData = await Sales.aggregate([
      { $match: { SaleDate: { $gte: date12MonthsAgo } } },
      {
        $group: {
          _id: { $month: "$SaleDate" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } }
    ]);

    const salesByMonth = Array(12).fill(0);
    salesData.forEach((item) => {
      salesByMonth[item._id - 1] = item.count;
    });

    res.status(200).json({ salesByMonth });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get top 5 products by sales
const getTopProductsBySales = async (req, res) => {
  try {
    const salesData = await Sales.aggregate([
      {
        $group: {
          _id: "$ProductID",
          totalSold: { $sum: "$StockSold" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          totalSold: 1,
        },
      },
    ]);

    res.status(200).json(salesData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addSales,
  getMonthlySales,
  getSalesData,
  getTotalSalesAmount,
  getTotalSalesAmountLast30Days,
  getSalesCountLast30Days,
  importSales,
  deleteAllSales,
  getEarnedLast12Months,
  getSalesLast12Months,
  getTopProductsBySales
};
