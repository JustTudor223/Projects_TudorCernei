import React, { useContext } from "react";
import AuthContext from "../AuthContext";

function HomePageClient() {
  const authContext = useContext(AuthContext);
  const localStorageData = JSON.parse(localStorage.getItem('user')) || {};
  const { firstName, lastName } = localStorageData;

  return (
    <div className="col-span-10 p-6 ml-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Hello {firstName} {lastName}! Welcome to Stock Master!
        </h1>
        <p className="text-lg mb-4 text-gray-700 text-center">
          Stock Master is your one-stop solution for managing and viewing inventory, exploring stores, and finding the best routes to them.
        </p>
        <div className="flex justify-center mb-6">
          <img
            src="https://omniaccounts.co.za/wp-content/uploads/2021/06/The-Top-4-Business-Benefits-of-Stock-Control.jpg"
            alt="Stock Control Benefits"
            className="max-w-full h-auto rounded-lg"
            style={{ maxWidth: '700px' }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2 text-center">Products</h2>
            <p className="text-gray-700 mb-2 text-center">
              View our inventory of products and place orders for what you need. Search products, and sort them by category, name, or stock.
            </p>
            <div className="text-center">
              <a href="/client/products" className="text-blue-500 hover:text-blue-700">
                Go to Products
              </a>
            </div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2 text-center">Stores</h2>
            <p className="text-gray-700 mb-2 text-center">
              View information about our existing stores and search for specific stores.
            </p>
            <div className="text-center">
              <a href="/client/stores" className="text-green-500 hover:text-green-700">
                Go to Stores
              </a>
            </div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2 text-center">Map</h2>
            <p className="text-gray-700 mb-2 text-center">
              View stores on a map, get directions to each store, and find out more information about them.
            </p>
            <div className="text-center">
              <a href="/client/map" className="text-yellow-500 hover:text-yellow-700">
                Go to Map
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePageClient;
