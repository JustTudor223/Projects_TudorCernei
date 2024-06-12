import React, { useState, useEffect, useContext } from "react";
import { CSVLink } from "react-csv"; // Import CSVLink
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import AddSale from "../components/AddSale";
import ImportSales from "../components/ImportSales"; // Import the new modal
import AuthContext from "../AuthContext";

function Sales() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false); // State for import modal
  const [sales, setAllSalesData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [stores, setAllStores] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchSalesData();
    fetchProductsData();
    fetchStoresData();
  }, [updatePage]);

  // Fetching Data of All Sales
  const fetchSalesData = () => {
    fetch(`http://localhost:4000/api/sales/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllSalesData(data);
      })
      .catch((err) => console.log(err));
  };

  // Fetching Data of All Products
  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((err) => console.log(err));
  };

  // Fetching Data of All Stores
  const fetchStoresData = () => {
    fetch(`http://localhost:4000/api/store/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      });
  };

  // Modal for Sale Add
  const addSaleModalSetting = () => {
    setShowSaleModal(!showSaleModal);
  };

  // Modal for Import Sales
  const importSalesModalSetting = () => {
    setShowImportModal(!showImportModal);
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const columns = [
    { headerName: "Product Name", field: "ProductID.name", sortable: true, filter: true },
    { headerName: "Category", field: "ProductID.category", sortable: true, filter: true },
    { headerName: "Store Name", field: "StoreID.name", sortable: true, filter: true },
    { headerName: "Stock Sold", field: "StockSold", sortable: true, filter: 'agNumberColumnFilter' },
    { headerName: "Sales Date", field: "SaleDate", sortable: true, filter: 'agDateColumnFilter', valueFormatter: params => new Date(params.value).toLocaleDateString() },
    { headerName: "Total Sale Amount", field: "TotalSaleAmount", sortable: true, filter: 'agNumberColumnFilter', valueFormatter: params => Math.round(params.value) },
    { headerName: "Price per Unit", field: "pricePerUnit", valueGetter: params => {
        if (params.data.TotalSaleAmount && params.data.StockSold) {
          return (params.data.TotalSaleAmount / params.data.StockSold).toFixed(2);
        }
        return null;
      }, sortable: true, filter: 'agNumberColumnFilter' }
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 100
  };

  const filteredData = sales.filter(item => item.ProductID?.name?.toLowerCase().includes(searchText.toLowerCase()));

  // Prepare CSV data
  const csvData = sales.map(s => ({
    productName: s.ProductID.name,
    category: s.ProductID.category,
    storeName: s.StoreID.name,
    stockSold: s.StockSold,
    saleDate: new Date(s.SaleDate).toLocaleDateString(),
    totalSaleAmount: Math.round(s.TotalSaleAmount),
    pricePerUnit: (s.TotalSaleAmount / s.StockSold).toFixed(2)
  }));

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {showSaleModal && (
          <AddSale
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            stores={stores}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}
        {showImportModal && (
          <ImportSales
            importSalesModalSetting={importSalesModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        <div className="ag-theme-alpine" style={{ height: 'calc(100vh - 150px)', width: '100%' }}>
          <div className="flex flex-col pt-5 pb-3 px-3 bg-white shadow rounded-lg">
            <div className="flex justify-center items-center mb-4">
              <span className="font-bold text-3xl">Sales</span>
            </div>
            <div className="flex justify-between items-center">
              <input
                type="text"
                placeholder="Search by Product Name"
                value={searchText}
                onChange={handleSearch}
                className="border p-2 rounded text-sm"
              />
              <div className="flex gap-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                  onClick={addSaleModalSetting}
                >
                  Add Sale
                </button>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
                  onClick={importSalesModalSetting}
                >
                  Import Sales
                </button>
                <CSVLink
                  data={csvData}
                  filename={"sales.csv"}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded text-sm"
                  target="_blank"
                >
                  Export Sales
                </CSVLink>
              </div>
            </div>
          </div>
          <AgGridReact
            rowData={filteredData}
            columnDefs={columns}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={pageSize}
            rowSelection="multiple"
            enableRangeSelection={true}
            enableCharts={true}
            domLayout="autoHeight"
            onGridReady={(params) => {
              params.api.sizeColumnsToFit();
              params.api.paginationSetPageSize(pageSize);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Sales;
