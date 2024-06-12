import React, { useState, useEffect, useContext, Fragment } from "react";
import ViewCart from "../components/ViewCart"; // Import the new component for the modal
import AuthContext from "../AuthContext";

const categories = ["All", "Electronics", "Groceries", "Healthcare", "Clothing", "Beauty", "Toys", "Sports", "Home", "Books", "Automotive"];
const itemsPerPageOptions = [5, 10, 20, 50];

function ProductsClient() {
  const [showCartModal, setShowCartModal] = useState(false);
  const [products, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [updatePage, setUpdatePage] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedQuantities, setSelectedQuantities] = useState({});

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchProductsData();
  }, [updatePage, selectedCategory, searchTerm, sortConfig, currentPage, itemsPerPage]);

  // Fetching Data of All Products
  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get`)
      .then((response) => response.json())
      .then((data) => {
        // Apply category filter
        let filteredData = data;
        if (selectedCategory !== "All") {
          filteredData = data.filter(product => product.category === selectedCategory);
        }

        // Apply search filter
        if (searchTerm) {
          filteredData = filteredData.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Apply sorting
        if (sortConfig.key) {
          filteredData = filteredData.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
              return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
              return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
          });
        }

        setAllProducts(filteredData);
        updateFilteredProducts(filteredData);
      })
      .catch((err) => console.log(err));
  };

  // Update filtered products for current page
  const updateFilteredProducts = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredProducts(data.slice(startIndex, endIndex));
  };

  // Modal for View Cart
  const cartModalSetting = () => {
    setShowCartModal(!showCartModal);
  };

  // Handle Search Term
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle Category Change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Handle Sort
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Handle Items Per Page Change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  // Handle Page Change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate Page Numbers
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle Add to Cart
  const handleAddToCart = (product, quantity) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item._id === product._id);
    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${quantity} ${product.name}(s) added to cart`);
  };

  // Validate stock quantity
  const getMaxQuantity = (product) => {
    return Array.from({ length: product.stock }, (_, i) => i + 1);
  };

  // Handle quantity selection change
  const handleQuantityChange = (productId, quantity) => {
    setSelectedQuantities(prevState => ({
      ...prevState,
      [productId]: quantity
    }));
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {showCartModal && (
          <ViewCart
            isOpen={showCartModal}
            cartModalSetting={cartModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}

        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center">
              <span className="font-bold">Products</span>
              <div className="flex justify-center items-center px-2 border-2 rounded-md">
                <img
                  alt="search-icon"
                  className="w-5 h-5"
                  src={require("../assets/search-icon.png")}
                />
                <input
                  className="border-none outline-none focus:border-none text-xs"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearchTerm}
                />
              </div>
              <select
                className="border-2 rounded-md text-xs px-2 w-auto"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                className="border-2 rounded-md text-xs px-2 w-40"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                {itemsPerPageOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option} items per page
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
                onClick={cartModalSetting}
              >
                View Cart
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th
                  className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 cursor-pointer"
                  onClick={() => handleSort("category")}
                >
                  Category
                  {sortConfig.key === "category" && (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Product Name
                  {sortConfig.key === "name" && (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 cursor-pointer"
                  onClick={() => handleSort("stock")}
                >
                  Stock
                  {sortConfig.key === "stock" && (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Description
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Availability
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Options
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((element) => {
                let stockStatus = "";
                let stockClass = "";

                if (element.stock === 0) {
                  stockStatus = "Out of Stock";
                  stockClass = "text-red-500";
                } else if (element.stock <= 50) {
                  stockStatus = "Low Stock";
                  stockClass = "text-yellow-500";
                } else {
                  stockStatus = "In Stock";
                  stockClass = "text-green-500";
                }

                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {element.category}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.stock}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.description}
                    </td>
                    <td className={`whitespace-nowrap px-4 py-2 font-semibold ${stockClass}`}>
                      {stockStatus}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <div className="flex items-center">
                        <select
                          className="border-2 rounded-md text-xs px-2 mr-2 w-16" // Increased width
                          defaultValue={1}
                          disabled={element.stock === 0}
                          onChange={(e) => handleQuantityChange(element._id, parseInt(e.target.value))}
                        >
                          {getMaxQuantity(element).map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                        <button
                          className={`px-2 py-1 cursor-pointer rounded-lg font-semibold ${
                            element.stock === 0 ? "bg-gray-400" : "bg-blue-500 text-white"
                          }`}
                          onClick={() => handleAddToCart(element, selectedQuantities[element._id] || 1)}
                          disabled={element.stock === 0}
                        >
                          Order
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-between items-center p-4">
            <div>
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, products.length)} to {Math.min(currentPage * itemsPerPage, products.length)} of {products.length} products
            </div>
            <div className="flex gap-2">
              {pageNumbers.map(number => (
                <button
                  key={number}
                  className={`px-4 py-2 border ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsClient;
