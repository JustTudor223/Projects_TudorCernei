import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ExclamationIcon from '@mui/icons-material/PriorityHighOutlined';
import PlusIcon from '@mui/icons-material/AddOutlined';
import Select from "react-select";

export default function AddSale({
  addSaleModalSetting,
  products,
  stores,
  handlePageUpdate,
  authContext
}) {
  const [sale, setSale] = useState({
    userID: authContext.user,
    productID: "",
    storeID: "",
    stockSold: "",
    saleDate: "",
    totalSaleAmount: "",
    pricePerUnit: "",
  });
  const [open, setOpen] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [maxStock, setMaxStock] = useState(0);
  const [stockText, setStockText] = useState("");
  const cancelButtonRef = useRef(null);

  // Handling Input Change for input fields
  const handleInputChange = (key, value) => {
    setSale((prevSale) => {
      const updatedSale = { ...prevSale, [key]: value };

      if (key === "productID") {
        const selectedProduct = products.find(product => product._id === value);
        setMaxStock(selectedProduct ? selectedProduct.stock : 0);
        setStockText(selectedProduct ? <span className="text-md font-bold">Stock: {selectedProduct.stock}</span> : "");
      }

      if (key === "stockSold" && value > maxStock) {
        setError(true);
        setErrorMessage(`Cannot sell more than ${maxStock} units.`);
      } else {
        setError(false);
        setErrorMessage("");
      }

      if (key === "stockSold" || key === "totalSaleAmount") {
        const stockSold = parseFloat(updatedSale.stockSold);
        const totalAmount = parseFloat(updatedSale.totalSaleAmount);
        if (stockSold && totalAmount) {
          updatedSale.pricePerUnit = (totalAmount / stockSold).toFixed(2);
        }
      } else if (key === "pricePerUnit") {
        const stockSold = parseFloat(updatedSale.stockSold);
        const pricePerUnit = parseFloat(updatedSale.pricePerUnit);
        if (stockSold && pricePerUnit) {
          updatedSale.totalSaleAmount = (stockSold * pricePerUnit).toFixed(2);
        }
      }

      return updatedSale;
    });
  };

  // Validate if all fields are filled
  const isFormValid = () => {
    return (
      sale.productID &&
      sale.storeID &&
      sale.stockSold &&
      sale.saleDate &&
      sale.totalSaleAmount &&
      !error
    );
  };

  // POST Data
  const addSale = () => {
    if (!isFormValid()) {
      setError(true);
      setErrorMessage("All fields are required.");
      return;
    }

    const saleData = {
      ...sale,
      saleDate: new Date(sale.saleDate), // Convert date string to Date object
    };

    fetch("http://localhost:4000/api/sales/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(saleData),
    })
      .then((result) => {
        alert("Sale ADDED");
        handlePageUpdate();
        addSaleModalSetting();
      })
      .catch((err) => console.log(err));
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
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
              as={Fragment}
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
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PlusIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg py-4 font-semibold leading-6 text-gray-900">
                        Add Sale
                      </Dialog.Title>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="productID" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Product Name
                            </label>
                            <Select
                              id="productID"
                              name="productID"
                              options={products.map(product => ({
                                value: product._id,
                                label: product.name,
                              }))}
                              onChange={(option) => handleInputChange("productID", option.value)}
                              className="basic-single"
                              classNamePrefix="select"
                              isSearchable
                              placeholder="Select Product"
                            />
                            {stockText && <p className="text-sm text-gray-600 mt-2">{stockText}</p>}
                          </div>
                          <div>
                            <label htmlFor="stockSold" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Stock Sold
                            </label>
                            <input
                              type="number"
                              name="stockSold"
                              id="stockSold"
                              value={sale.stockSold}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                              className={`bg-gray-50 border ${error ? "border-red-500" : "border-gray-300"} text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                              placeholder="Quantity Sold"
                            />
                          </div>
                          <div>
                            <label htmlFor="pricePerUnit" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Price per Unit
                            </label>
                            <input
                              type="number"
                              name="pricePerUnit"
                              id="pricePerUnit"
                              value={sale.pricePerUnit}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Price per Unit"
                            />
                          </div>
                          <div>
                            <label htmlFor="totalSaleAmount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Total Sale Amount
                            </label>
                            <input
                              type="number"
                              name="totalSaleAmount"
                              id="totalSaleAmount"
                              value={sale.totalSaleAmount}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Total Sale Amount"
                            />
                          </div>
                          <div>
                            <label htmlFor="storeID" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Store Name
                            </label>
                            <select
                              id="storeID"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="storeID"
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                            >
                              <option value="">Select Store</option>
                              {stores.map((element) => (
                                <option key={element._id} value={element._id}>
                                  {element.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="h-fit w-fit">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="salesDate">
                              Sales Date
                            </label>
                            <input
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              type="date"
                              id="saleDate"
                              name="saleDate"
                              value={sale.saleDate}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                            />
                          </div>
                        </div>
                        {error && (
                          <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <ExclamationIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
                              </div>
                            </div>
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className={`inline-flex w-full justify-center rounded-md ${!isFormValid() ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600"} px-3 py-2 text-sm font-semibold text-white shadow-sm ${!isFormValid() ? "" : "hover:bg-blue-500"} sm:ml-3 sm:w-auto`}
                    onClick={addSale}
                    disabled={!isFormValid()}
                  >
                    Add Sale
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => addSaleModalSetting()}
                    ref={cancelButtonRef}
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
