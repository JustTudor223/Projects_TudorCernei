const Purchase = require("../models/purchase");
const Product = require("../models/Product");
const purchaseStock = require("./purchaseStock");

// Add Purchase Details
const addPurchase = (req, res) => {
  const addPurchaseDetails = new Purchase({
    userID: req.body.userID,
    ProductID: req.body.productID,
    QuantityPurchased: req.body.quantityPurchased,
    PurchaseDate: new Date(req.body.purchaseDate),
    TotalPurchaseAmount: req.body.totalPurchaseAmount,
    PricePerUnit: req.body.pricePerUnit,
  });

  addPurchaseDetails
    .save()
    .then((result) => {
      purchaseStock(req.body.productID, req.body.quantityPurchased);
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

// Get All Purchase Data
const getPurchaseData = async (req, res) => {
  const findAllPurchaseData = await Purchase.find({})
    .sort({ _id: -1 })
    .populate("ProductID"); // -1 for descending order
  res.json(findAllPurchaseData);
};

// Get total purchase amount
const getTotalPurchaseAmount = async (req, res) => {
  let totalPurchaseAmount = 0;
  const purchaseData = await Purchase.find({});
  purchaseData.forEach((purchase) => {
    totalPurchaseAmount += purchase.TotalPurchaseAmount;
  });
  res.json({ totalPurchaseAmount });
};

// Get total purchase amount in the last 30 days
const getTotalPurchaseAmountLast30Days = async (req, res) => {
  const date30DaysAgo = new Date();
  date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);

  const purchaseData = await Purchase.find({
    PurchaseDate: { $gte: date30DaysAgo },
  });

  let totalPurchaseAmount = 0;
  purchaseData.forEach((purchase) => {
    totalPurchaseAmount += purchase.TotalPurchaseAmount;
  });

  res.json({ totalPurchaseAmount });
};

// Get number of purchases in the last 30 days
const getPurchaseCountLast30Days = async (req, res) => {
  try {
    const date30DaysAgo = new Date();
    date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);

    const purchaseCount = await Purchase.countDocuments({
      PurchaseDate: { $gte: date30DaysAgo },
    });

    res.status(200).json({ purchaseCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Import Purchases
const importPurchases = async (req, res) => {
  const purchases = req.body;
  console.log("Received purchases for import:", purchases);

  try {
    const productMap = {};
    const errors = [];

    // First, find all unique product names in the CSV
    const productNames = [...new Set(purchases.map(purchase => purchase.ProductName))];

    // Fetch the product IDs for these names
    const products = await Product.find({ name: { $in: productNames } });

    // Create a map from product name to product ID
    products.forEach(product => {
      productMap[product.name] = product._id;
    });

    // Replace product names with IDs in purchases
    const purchasesWithIDs = purchases.map(purchase => {
      const productID = productMap[purchase.ProductName];
      if (!productID) {
        errors.push(`Product name "${purchase.ProductName}" not found`);
        return null;
      }
      return {
        userID: purchase.userID,
        ProductID: productID,
        QuantityPurchased: purchase.QuantityPurchased,
        PurchaseDate: purchase.PurchaseDate,
        TotalPurchaseAmount: purchase.TotalPurchaseAmount,
        PricePerUnit: purchase.PricePerUnit
      };
    }).filter(purchase => purchase !== null);

    if (errors.length > 0) {
      return res.status(400).send({ error: errors.join(", ") });
    }

    const result = await Purchase.insertMany(purchasesWithIDs);
    purchasesWithIDs.forEach(purchase => {
      purchaseStock(purchase.ProductID, purchase.QuantityPurchased);
    });
    res.status(200).send(result);
  } catch (err) {
    console.error("Error inserting purchases:", err);
    res.status(400).send({ error: "Failed to import purchases" });
  }
};

// Delete All Purchases
const deleteAllPurchases = async (req, res) => {
  try {
    await Purchase.deleteMany({});
    res.status(200).send({ message: "All purchases deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting purchases", error });
  }
};

// Get spent last 12 months
const getSpentLast12Months = async (req, res) => {
  try {
    const date12MonthsAgo = new Date();
    date12MonthsAgo.setMonth(date12MonthsAgo.getMonth() - 12);

    const purchaseData = await Purchase.find({
      PurchaseDate: { $gte: date12MonthsAgo },
    });

    const totalSpent = purchaseData.reduce((acc, purchase) => acc + purchase.TotalPurchaseAmount, 0);

    res.status(200).json({ totalSpent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get purchases last 12 months
const getPurchasesLast12Months = async (req, res) => {
  try {
    const date12MonthsAgo = new Date();
    date12MonthsAgo.setMonth(date12MonthsAgo.getMonth() - 12);

    const purchaseData = await Purchase.aggregate([
      { $match: { PurchaseDate: { $gte: date12MonthsAgo } } },
      {
        $group: {
          _id: { $month: "$PurchaseDate" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } }
    ]);

    const purchasesByMonth = Array(12).fill(0);
    purchaseData.forEach((item) => {
      purchasesByMonth[item._id - 1] = item.count;
    });

    res.status(200).json({ purchasesByMonth });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = { 
  addPurchase, 
  getPurchaseData, 
  getTotalPurchaseAmount, 
  getTotalPurchaseAmountLast30Days, 
  getPurchaseCountLast30Days, 
  importPurchases,
  deleteAllPurchases,
  getSpentLast12Months,
  getPurchasesLast12Months
};
