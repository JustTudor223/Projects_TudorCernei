import React, { useState, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import AuthContext from "../AuthContext";
import CSVReader from "react-csv-reader";

export default function ImportSales({ importSalesModalSetting, handlePageUpdate }) {
  const [open, setOpen] = useState(true);
  const [csvData, setCsvData] = useState([]);
  const authContext = useContext(AuthContext);

  const handleFileLoad = (data) => {
    console.log("Raw CSV data:", data);

    const headers = data[0];
    const formattedData = data.slice(1).map(row => {
      let sale = {};
      headers.forEach((header, index) => {
        sale[header] = row[index];
      });
      sale.userID = authContext.user; // Ensure userID is set correctly
      sale.StockSold = Number(sale.StockSold); // Convert to number
      sale.TotalSaleAmount = Number(sale.TotalSaleAmount); // Convert to number
      sale.SaleDate = new Date(sale.SaleDate); // Convert to date
      return sale;
    });

    console.log("Formatted data:", formattedData);
    setCsvData(formattedData);
  };

  const importSales = () => {
    fetch("http://localhost:4000/api/sales/import", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(csvData),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          alert("Failed to import sales: " + result.error);
        } else {
          alert("Sales Imported Successfully");
          handlePageUpdate();
          importSalesModalSetting();
        }
      })
      .catch((err) => {
        console.error("Error importing sales:", err);
        alert("An error occurred while importing sales");
      });
  };

  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900"
                      >
                        Import Sales
                      </Dialog.Title>
                      <div className="mt-2">
                        <CSVReader
                          cssClass="csv-reader-input"
                          label="Select CSV with Sales Data"
                          onFileLoaded={handleFileLoad}
                          inputId="csv"
                          inputStyle={{ color: 'red' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={importSales}
                  >
                    Import
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => importSalesModalSetting()}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
