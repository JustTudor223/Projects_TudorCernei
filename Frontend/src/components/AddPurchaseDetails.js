import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Select from "react-select";

export default function AddPurchaseDetails({
  addSaleModalSetting,
  products,
  handlePageUpdate,
  authContext,
}) {
  const [purchase, setPurchase] = useState({
    userID: authContext.user,
    productID: "",
    quantityPurchased: "",
    purchaseDate: "",
    totalPurchaseAmount: "",
    pricePerUnit: "",
  });
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const isFormComplete = Object.values(purchase).every(
    (field) => field !== ""
  );

  // Handling Input Change for input fields
  const handleInputChange = (key, value) => {
    setPurchase((prevPurchase) => {
      const updatedPurchase = { ...prevPurchase, [key]: value };

      if (key === "quantityPurchased" || key === "totalPurchaseAmount") {
        const quantity = parseFloat(updatedPurchase.quantityPurchased);
        const totalAmount = parseFloat(updatedPurchase.totalPurchaseAmount);
        if (quantity && totalAmount) {
          updatedPurchase.pricePerUnit = (totalAmount / quantity).toFixed(2);
        }
      } else if (key === "pricePerUnit") {
        const quantity = parseFloat(updatedPurchase.quantityPurchased);
        const pricePerUnit = parseFloat(updatedPurchase.pricePerUnit);
        if (quantity && pricePerUnit) {
          updatedPurchase.totalPurchaseAmount = (quantity * pricePerUnit).toFixed(2);
        }
      }

      return updatedPurchase;
    });
  };

  // POST Data
  const addPurchase = () => {
    const purchaseData = {
      ...purchase,
      purchaseDate: new Date(purchase.purchaseDate), // Convert date string to Date object
    };

    fetch("http://localhost:4000/api/purchase/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(purchaseData),
    })
      .then((res) => res.json())
      .then((result) => {
        alert("Purchase ADDED");
        handlePageUpdate();
        addSaleModalSetting();
      })
      .catch((err) => {
        console.error("Error adding purchase:", err);
        alert("Error adding purchase. Please check console for details.");
      });
  };

  return (
    // Modal
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
                        Purchase Details
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
                          </div>
                          <div>
                            <label htmlFor="quantityPurchased" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Quantity Purchased
                            </label>
                            <input
                              type="number"
                              name="quantityPurchased"
                              id="quantityPurchased"
                              value={purchase.quantityPurchased}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Quantity Purchased"
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
                              value={purchase.pricePerUnit}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Price per Unit"
                            />
                          </div>
                          <div>
                            <label htmlFor="totalPurchaseAmount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Total Purchase Amount
                            </label>
                            <input
                              type="number"
                              name="totalPurchaseAmount"
                              id="totalPurchaseAmount"
                              value={purchase.totalPurchaseAmount}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Total Purchase Amount"
                            />
                          </div>
                          <div className="h-fit w-fit">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="purchaseDate">
                              Purchase Date
                            </label>
                            <input
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              type="date"
                              id="purchaseDate"
                              name="purchaseDate"
                              value={purchase.purchaseDate}
                              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className={`inline-flex w-full justify-center rounded-md ${
                      isFormComplete
                        ? "bg-blue-600 hover:bg-blue-500"
                        : "bg-gray-300"
                    } px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}
                    onClick={addPurchase}
                    disabled={!isFormComplete}
                  >
                    Add
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
