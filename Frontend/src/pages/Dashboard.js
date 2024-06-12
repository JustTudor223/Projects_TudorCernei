import React, { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import AuthContext from "../AuthContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [saleAmount, setSaleAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [salesCount, setSalesCount] = useState(0);
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoriesData, setCategoriesData] = useState({ labels: [], data: [] });

  const [chart, setChart] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: getLast12Months(), // Dynamic categories based on the current month
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.round(val);
          },
        },
      },
    },
    series: [
      {
        name: "Monthly Sales Amount",
        data: [],
      },
    ],
  });

  // Function to get the last 12 months as an array of month names
  function getLast12Months() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const last12Months = [];

    for (let i = 0; i < 12; i++) {
      last12Months.unshift(months[(currentMonth - i + 12) % 12]);
    }

    return last12Months;
  }

  // Update Chart Data
  const updateChartData = (salesData) => {
    setChart({
      ...chart,
      series: [
        {
          name: "Monthly Sales Amount",
          data: salesData.map(val => Math.round(val)),
        },
      ],
    });
  };

  // Update Doughnut Data
  const updateDoughnutData = (products) => {
    const categoryCount = {};

    products.forEach((product) => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });

    setCategoriesData({
      labels: Object.keys(categoryCount),
      data: Object.values(categoryCount),
    });
  };

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchTotalSaleAmountLast30Days();
    fetchTotalPurchaseAmountLast30Days();
    fetchSalesCountLast30Days();
    fetchPurchaseCountLast30Days();
    fetchStoresData();
    fetchProductsData();
    fetchMonthlySalesData();
  }, []);

  // Fetching total sales amount in the last 30 days
  const fetchTotalSaleAmountLast30Days = () => {
    fetch(`http://localhost:4000/api/sales/get/totalsaleamountlast30days`)
      .then((response) => response.json())
      .then((datas) => setSaleAmount(Math.round(datas.totalSaleAmount)));
  };

  // Fetching total purchase amount in the last 30 days
  const fetchTotalPurchaseAmountLast30Days = () => {
    fetch(`http://localhost:4000/api/purchase/get/totalpurchaseamountlast30days`)
      .then((response) => response.json())
      .then((datas) => setPurchaseAmount(Math.round(datas.totalPurchaseAmount)));
  };

  // Fetching number of sales in the last 30 days
  const fetchSalesCountLast30Days = () => {
    fetch(`http://localhost:4000/api/sales/get/salescountlast30days`)
      .then((response) => response.json())
      .then((datas) => setSalesCount(Math.round(datas.salesCount)));
  };

  // Fetching number of purchases in the last 30 days
  const fetchPurchaseCountLast30Days = () => {
    fetch(`http://localhost:4000/api/purchase/get/purchasecountlast30days`)
      .then((response) => response.json())
      .then((datas) => setPurchaseCount(Math.round(datas.purchaseCount)));
  };

  // Fetching all stores data
  const fetchStoresData = () => {
    fetch(`http://localhost:4000/api/store/get`)
      .then((response) => response.json())
      .then((datas) => setStores(datas));
  };

  // Fetching Data of All Products
  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get`)
      .then((response) => response.json())
      .then((datas) => {
        setProducts(datas);
        updateDoughnutData(datas);
      })
      .catch((err) => console.log(err));
  };

  // Fetching Monthly Sales
  const fetchMonthlySalesData = () => {
    fetch(`http://localhost:4000/api/sales/getmonthly`)
      .then((response) => response.json())
      .then((datas) => updateChartData(datas.salesAmount))
      .catch((err) => console.log(err));
  };

  return (
    <div className="col-span-10 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Sales Section */}
        <div className="bg-white p-4 rounded-lg shadow-md col-span-1">
          <h2 className="text-lg font-semibold mb-2">Sales (Last 30 Days)</h2>
          <div className="text-xl font-medium text-gray-900">
            <p>Revenue: ${Math.round(saleAmount)}</p>
            <p>Count: {Math.round(salesCount)}</p>
          </div>
        </div>
        
        {/* Purchases Section */}
        <div className="bg-white p-4 rounded-lg shadow-md col-span-1">
          <h2 className="text-lg font-semibold mb-2">Purchases (Last 30 Days)</h2>
          <div className="text-xl font-medium text-gray-900">
            <p>Amount: ${Math.round(purchaseAmount)}</p>
            <p>Count: {Math.round(purchaseCount)}</p>
          </div>
        </div>

        {/* Products in Inventory */}
        <div className="bg-white p-4 rounded-lg shadow-md col-span-1">
          <h2 className="text-lg font-semibold mb-2">Products in Inventory</h2>
          <p className="text-2xl font-medium text-gray-900">{products.length}</p>
        </div>

        {/* Total Stores */}
        <div className="bg-white p-4 rounded-lg shadow-md col-span-1">
          <h2 className="text-lg font-semibold mb-2">Total Stores</h2>
          <p className="text-2xl font-medium text-gray-900">{stores.length}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
          <h2 className="text-xl font-semibold mb-4">Revenue per Month (Last 12 Months)</h2>
          <Chart
            options={chart.options}
            series={chart.series}
            type="bar"
            width="100%"
            height={400}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <h2 className="text-xl font-semibold mb-4">Products per Category</h2>
          <Doughnut
            data={{
              labels: categoriesData.labels,
              datasets: [
                {
                  label: "Number of Products",
                  data: categoriesData.data,
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                  ],
                  borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            height={400}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
