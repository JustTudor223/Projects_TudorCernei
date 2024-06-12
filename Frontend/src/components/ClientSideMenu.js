import React from "react";
import { Link } from "react-router-dom";

import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import StoreIcon from '@mui/icons-material/Store';
import MapIcon from '@mui/icons-material/Map';

function ClientSideMenu() {
  return (
    <div className="h-full flex flex-col justify-between bg-gray-200 text-gray-700 hidden lg:flex">
      <div className="px-6 py-8">
        <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-2">
          <Link
            to="/client"
            className="flex items-center gap-3 rounded-lg hover:bg-blue-100 px-4 py-3 text-gray-600 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <HomeIcon />
            <span className="text-base font-semibold">Home</span>
          </Link>

          <Link
            to="/client/products"
            className="flex items-center gap-3 rounded-lg hover:bg-blue-100 px-4 py-3 text-gray-600 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <InventoryIcon />
            <span className="text-base font-semibold">Products</span>
          </Link>

          <Link
            to="/client/stores"
            className="flex items-center gap-3 rounded-lg hover:bg-blue-100 px-4 py-3 text-gray-600 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <StoreIcon />
            <span className="text-base font-semibold">Stores</span>
          </Link>

          <Link
            to="/client/map"
            className="flex items-center gap-3 rounded-lg hover:bg-blue-100 px-4 py-3 text-gray-600 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <MapIcon />
            <span className="text-base font-semibold">Stores Map</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default ClientSideMenu;
