import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const StoreDetails = ({ isOpen, onClose, store }) => {
  const hardcodedOpenHours = [
    { day: "Monday", open: "9:00 AM", close: "6:00 PM" },
    { day: "Tuesday", open: "9:00 AM", close: "6:00 PM" },
    { day: "Wednesday", open: "9:00 AM", close: "6:00 PM" },
    { day: "Thursday", open: "9:00 AM", close: "6:00 PM" },
    { day: "Friday", open: "9:00 AM", close: "6:00 PM" },
    { day: "Saturday", open: "10:00 AM", close: "4:00 PM" },
    { day: "Sunday", open: "Closed", close: "" },
  ];

  const hardcodedHolidays = [
    "New Year's Day",
    "Independence Day",
    "Thanksgiving Day",
    "Christmas Day",
  ];

  const additionalInfo = "This store offers a wide range of products including groceries, electronics, and clothing. We aim to provide the best service to our customers.";

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Store Details
                </Dialog.Title>
                <div className="mt-4">
                  <img
                    alt="store"
                    className="w-full h-auto object-cover mb-4"
                    src={store.image}
                  />
                  <p className="mb-2"><strong>Name:</strong> {store.name}</p>
                  <p className="mb-2"><strong>Address:</strong> {store.address}</p>
                  <p className="mb-2"><strong>City:</strong> {store.city}</p>
                  <p className="mb-2"><strong>Open Hours:</strong></p>
                  <ul className="list-disc list-inside mb-2">
                    {hardcodedOpenHours.map((hour, index) => (
                      <li key={index}>{hour.day}: {hour.open} - {hour.close}</li>
                    ))}
                  </ul>
                  <p className="mb-2"><strong>Holidays:</strong></p>
                  <ul className="list-disc list-inside mb-2">
                    {hardcodedHolidays.map((holiday, index) => (
                      <li key={index}>{holiday}</li>
                    ))}
                  </ul>
                  <p className="mb-2"><strong>Additional Information:</strong></p>
                  <p className="mb-2">{additionalInfo}</p>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default StoreDetails;
