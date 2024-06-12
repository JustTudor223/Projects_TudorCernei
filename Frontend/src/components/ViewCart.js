import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

const ViewCart = ({ isOpen, cartModalSetting, handlePageUpdate }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  }, [isOpen]);

  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleBuyProducts = () => {
    cartItems.forEach(item => {
      fetch(`http://localhost:4000/api/product/update/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stock: item.stock - item.quantity })
      })
      .then(response => response.json())
      .then(data => {
        // You can handle success/failure here if needed
      });
    });

    localStorage.removeItem('cart');
    setCartItems([]);
    alert('Products ordered successfully!');
    cartModalSetting(); // Close the modal
    handlePageUpdate(); // Update the product list
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={cartModalSetting}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Cart
                </Dialog.Title>
                {cartItems.length === 0 ? (
                  <p className="mt-4 text-lg">Your cart is empty.</p>
                ) : (
                  <div className="mt-4 overflow-y-auto max-h-96">
                    <ul>
                      {cartItems.map(item => (
                        <li key={item._id} className="flex justify-between items-center mb-2 text-lg">
                          <span>{item.name} (x{item.quantity})</span>
                          <button
                            className="text-red-500"
                            onClick={() => handleRemoveItem(item._id)}
                          >
                            &times;
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={handleBuyProducts}
                    disabled={cartItems.length === 0}
                  >
                    Order Products
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

export default ViewCart;
