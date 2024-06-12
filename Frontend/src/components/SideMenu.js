import React from "react";
import { Link } from "react-router-dom";

import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StoreIcon from '@mui/icons-material/Store';
import MapIcon from '@mui/icons-material/Map';
import AssessmentIcon from '@mui/icons-material/Assessment';

function SideMenu() {
  return (
    <div className="h-full flex flex-col justify-between bg-gray-200 text-gray-700 hidden lg:flex">
      <div className="px-6 py-8">
        <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg hover:bg-blue-100 px-4 py-3 text-gray-600 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <HomeIcon />
            <span className="text-base font-semibold">Dashboard</span>
          </Link>

          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-gray-600 hover:bg-blue-100 hover:text-blue-800 transition duration-150 ease-in-out">
              <Link to="/inventory" className="flex items-center gap-3">
                <InventoryIcon />
                <span className="text-base font-semibold">Inventory</span>
              </Link>
            </summary>
          </details>

          <Link
            to="/statistics"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 hover:bg-blue-100 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <AssessmentIcon />
            <span className="text-base font-semibold">Statistics</span>
          </Link>
          
          <Link
            to="/purchase-details"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 hover:bg-blue-100 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <ReceiptIcon />
            <span className="text-base font-semibold">Purchases</span>
          </Link>

          <Link
            to="/sales"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 hover:bg-blue-100 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <AttachMoneyIcon />
            <span className="text-base font-semibold">Sales</span>
          </Link>

          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-gray-600 hover:bg-blue-100 hover:text-blue-800 transition duration-150 ease-in-out">
              <Link to="/manage-store" className="flex items-center gap-3">
                <StoreIcon />
                <span className="text-base font-semibold">Manage Stores</span>
              </Link>
            </summary>
          </details>

          <Link
            to="/stores-map"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 hover:bg-blue-100 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <MapIcon />
            <span className="text-base font-semibold">Stores Map</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default SideMenu;
