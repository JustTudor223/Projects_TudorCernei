import React, { useState, useEffect, useContext } from "react";
import { CSVLink } from "react-csv"; // Import CSVLink
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import AddPurchaseDetails from "../components/AddPurchaseDetails";
import ImportPurchases from "../components/ImportPurchases"; // Import the new modal
import AuthContext from "../AuthContext";

function PurchaseDetails() {
  const [showPurchaseModal, setPurchaseModal] = useState(false);
  const [showImportModal, setImportModal] = useState(false); // State for import modal
  const [purchase, setAllPurchaseData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchPurchaseData();
    fetchProductsData();
  }, [updatePage]);

  // Fetching Data of All Purchase items
  const fetchPurchaseData = () => {
    fetch(`http://localhost:4000/api/purchase/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllPurchaseData(data);
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

  // Modal for Purchase Add
  const addSaleModalSetting = () => {
    setPurchaseModal(!showPurchaseModal);
  };

  // Modal for Import Purchases
  const importPurchaseModalSetting = () => {
    setImportModal(!showImportModal);
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
    { headerName: "Quantity Purchased", field: "QuantityPurchased", sortable: true, filter: 'agNumberColumnFilter' },
    { headerName: "Purchase Date", field: "PurchaseDate", sortable: true, filter: 'agDateColumnFilter', valueFormatter: params => new Date(params.value).toLocaleDateString() },
    { headerName: "Total Purchase Amount", field: "TotalPurchaseAmount", sortable: true, filter: 'agNumberColumnFilter' },
    { headerName: "Price per Unit", field: "pricePerUnit", valueGetter: params => {
        if (params.data.TotalPurchaseAmount && params.data.QuantityPurchased) {
          return (params.data.TotalPurchaseAmount / params.data.QuantityPurchased).toFixed(2);
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

  const filteredData = purchase.filter(item => item.ProductID?.name?.toLowerCase().includes(searchText.toLowerCase()));

  // Prepare CSV data
  const csvData = purchase.map(p => ({
    productName: p.ProductID.name,
    category: p.ProductID.category,
    quantityPurchased: p.QuantityPurchased,
    purchaseDate: new Date(p.PurchaseDate).toLocaleDateString(),
    totalPurchaseAmount: p.TotalPurchaseAmount,
    pricePerUnit: (p.TotalPurchaseAmount / p.QuantityPurchased).toFixed(2)
  }));

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {showPurchaseModal && (
          <AddPurchaseDetails
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}
        {showImportModal && (
          <ImportPurchases
            importPurchaseModalSetting={importPurchaseModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        <div className="ag-theme-alpine" style={{ height: 'calc(100vh - 150px)', width: '100%' }}>
          <div className="flex flex-col pt-5 pb-3 px-3 bg-white shadow rounded-lg">
            <div className="flex justify-center items-center mb-4">
              <span className="font-bold text-3xl">Purchases</span>
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
                  Add Purchase
                </button>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
                  onClick={importPurchaseModalSetting}
                >
                  Import Purchases
                </button>
                <CSVLink
                  data={csvData}
                  filename={"purchases.csv"}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded text-sm"
                  target="_blank"
                >
                  Export Purchases
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

export default PurchaseDetails;
