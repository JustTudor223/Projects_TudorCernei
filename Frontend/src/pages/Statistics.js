import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import 'tailwindcss/tailwind.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function Statistics() {
  const [topProductsBySales, setTopProductsBySales] = useState({
    options: {
      chart: {
        id: "top-products-sales",
      },
      xaxis: {
        categories: [],
      },
    },
    series: [
      {
        name: "Sales",
        data: [],
      },
    ],
  });

  const [topProductsByStock, setTopProductsByStock] = useState({
    options: {
      chart: {
        id: "top-products-stock",
      },
      xaxis: {
        categories: [],
      },
    },
    series: [
      {
        name: "Stock",
        data: [],
      },
    ],
  });

  const [stockStatus, setStockStatus] = useState({
    labels: ["Out of Stock", "Low Stock", "In Stock"],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
      },
    ],
  });

  const [salesLast12Months, setSalesLast12Months] = useState({
    options: {
      chart: {
        id: "sales-last-12-months",
      },
      xaxis: {
        categories: getLast12Months(),
      },
    },
    series: [
      {
        name: "Sales",
        data: new Array(12).fill(0),
      },
    ],
  });

  const [purchasesLast12Months, setPurchasesLast12Months] = useState({
    options: {
      chart: {
        id: "purchases-last-12-months",
      },
      xaxis: {
        categories: getLast12Months(),
      },
    },
    series: [
      {
        name: "Purchases",
        data: new Array(12).fill(0),
      },
    ],
  });

  const [spentLast12Months, setSpentLast12Months] = useState(0);
  const [earnedLast12Months, setEarnedLast12Months] = useState(0);
  const [profitLast12Months, setProfitLast12Months] = useState(0);

  useEffect(() => {
    fetchTopProductsByStockData();
    fetchStockStatusData();
    fetchSpentLast12Months();
    fetchPurchasesLast12Months();
    fetchEarnedLast12Months();
    fetchSalesLast12Months();
    fetchTopProductsBySalesData();
  }, []);

  const fetchTopProductsByStockData = () => {
    fetch(`http://localhost:4000/api/product/topProductsByStock`)
      .then((response) => response.json())
      .then((data) => {
        setTopProductsByStock({
          options: {
            ...topProductsByStock.options,
            xaxis: {
              categories: data.map((item) => item.name),
            },
          },
          series: [
            {
              name: "Stock",
              data: data.map((item) => item.stock),
            },
          ],
        });
      })
      .catch((err) => console.error('Failed to fetch top products by stock:', err));
  };

  const fetchStockStatusData = () => {
    fetch(`http://localhost:4000/api/product/stockStatus`)
      .then((response) => response.json())
      .then((data) => {
        setStockStatus({
          labels: ["Out of Stock", "Low Stock", "In Stock"],
          datasets: [
            {
              data: [data.outOfStock, data.lowStock, data.inStock],
              backgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
              hoverBackgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
            },
          ],
        });
      })
      .catch((err) => console.error('Failed to fetch stock status:', err));
  };

  const fetchSpentLast12Months = () => {
    fetch(`http://localhost:4000/api/purchase/spentLast12Months`)
      .then((response) => response.json())
      .then((data) => setSpentLast12Months(Math.round(data.totalSpent)))
      .catch((err) => console.error('Failed to fetch spent last 12 months:', err));
  };

  const fetchPurchasesLast12Months = () => {
    fetch(`http://localhost:4000/api/purchase/purchasesLast12Months`)
      .then((response) => response.json())
      .then((data) => {
        const purchasesData = mapDataToLast12Months(data.purchasesByMonth);
        setPurchasesLast12Months({
          options: {
            ...purchasesLast12Months.options,
            xaxis: {
              categories: getLast12Months(),
            },
          },
          series: [
            {
              name: "Purchases",
              data: purchasesData,
            },
          ],
        });
      })
      .catch((err) => console.error('Failed to fetch purchases last 12 months:', err));
  };

  const fetchEarnedLast12Months = () => {
    fetch(`http://localhost:4000/api/sales/get/earnedlast12months`)
      .then((response) => response.json())
      .then((data) => setEarnedLast12Months(Math.round(data.totalEarned)))
      .catch((err) => console.error('Failed to fetch earned last 12 months:', err));
  };

  const fetchSalesLast12Months = () => {
    fetch(`http://localhost:4000/api/sales/get/saleslast12months`)
      .then((response) => response.json())
      .then((data) => {
        const salesData = mapDataToLast12Months(data.salesByMonth);
        setSalesLast12Months({
          options: {
            ...salesLast12Months.options,
            xaxis: {
              categories: getLast12Months(),
            },
          },
          series: [
            {
              name: "Sales",
              data: salesData.map(val => Math.round(val)),
            },
          ],
        });
      })
      .catch((err) => console.error('Failed to fetch sales last 12 months:', err));
  };

  const fetchTopProductsBySalesData = () => {
    fetch(`http://localhost:4000/api/sales/get/topproductsbysales`)
      .then((response) => response.json())
      .then((data) => {
        setTopProductsBySales({
          options: {
            ...topProductsBySales.options,
            xaxis: {
              categories: data.map((item) => item.name),
            },
          },
          series: [
            {
              name: "Sales",
              data: data.map((item) => item.totalSold),
            },
          ],
        });
      })
      .catch((err) => console.error('Failed to fetch top products by sales:', err));
  };

  function getLast12Months() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const last12Months = [];

    for (let i = 0; i < 12; i++) {
      last12Months.unshift(months[(currentMonth - i + 12) % 12]);
    }

    return last12Months;
  }

  function mapDataToLast12Months(data) {
    const last12Months = getLast12Months();
    const mappedData = new Array(12).fill(0);
    data.forEach((item, index) => {
      const month = new Date().getMonth() - index;
      const adjustedMonth = (month + 12) % 12;
      mappedData[11 - index] = item;
    });
    return mappedData;
  }

  useEffect(() => {
    setProfitLast12Months(Math.round(earnedLast12Months - spentLast12Months));
  }, [earnedLast12Months, spentLast12Months]);

  return (
    <div className="col-span-10 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Spent Last 12 Months */}
        <div className="bg-white p-4 rounded-lg shadow-md col-span-1">
          <h2 className="text-lg font-semibold mb-2">Spent Last 12 Months</h2>
          <p className="text-2xl font-medium text-gray-900">${spentLast12Months}</p>
        </div>
        
        {/* Earned Last 12 Months */}
        <div className="bg-white p-4 rounded-lg shadow-md col-span-1">
          <h2 className="text-lg font-semibold mb-2">Earned Last 12 Months</h2>
          <p className="text-2xl font-medium text-gray-900">${earnedLast12Months}</p>
        </div>
        
        {/* Profit Last 12 Months */}
        <div className="bg-white p-4 rounded-lg shadow-md col-span-1">
          <h2 className="text-lg font-semibold mb-2">Profit Last 12 Months</h2>
          <p className="text-2xl font-medium text-gray-900">${profitLast12Months}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Top 5 Products by Stock */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <h2 className="text-xl font-semibold mb-4">Top 5 Products by Stock</h2>
          <Chart options={topProductsByStock.options} series={topProductsByStock.series} type="bar" height={350} />
        </div>
        
        {/* Stock Status */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <h2 className="text-xl font-semibold mb-4">Stock Status</h2>
          <Doughnut data={stockStatus} />
        </div>
        
        {/* Top 5 Products by Sales */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <h2 className="text-xl font-semibold mb-4">Top 5 Products by Sales</h2>
          <Chart options={topProductsBySales.options} series={topProductsBySales.series} type="bar" height={350} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Last 12 Months */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Sales Last 12 Months</h2>
          <Chart options={salesLast12Months.options} series={salesLast12Months.series} type="bar" height={350} />
        </div>
        
        {/* Purchases Last 12 Months */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Purchases Last 12 Months</h2>
          <Chart options={purchasesLast12Months.options} series={purchasesLast12Months.series} type="bar" height={350} />
        </div>
      </div>
    </div>
  );
}

export default Statistics;
