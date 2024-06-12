import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

function InviteCodeMenu({ isOpen, onClose }) {
  const [codes, setCodes] = useState([]);
  const [newCode, setNewCode] = useState('');

  useEffect(() => {
    const fetchCodes = async () => {
      const response = await fetch('http://localhost:4000/api/inviteCode/getAllCodes');
      const data = await response.json();
      setCodes(data);
    };

    if (isOpen) {
      fetchCodes();
    }
  }, [isOpen]);

  const handleAddCode = async () => {
    const response = await fetch('http://localhost:4000/api/inviteCode/addCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: newCode }),
    });

    const data = await response.json();

    if (data.success) {
      setCodes([...codes, { code: newCode }]);
      setNewCode('');
    } else {
      // Handle error...
    }
  };

  const handleRemoveCode = async (codeToRemove) => {
    const response = await fetch(`http://localhost:4000/api/inviteCode/removeCode/${codeToRemove}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (data.success) {
      setCodes(codes.filter((code) => code.code !== codeToRemove));
    } else {
      // Handle error...
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Invite Codes
                    </Dialog.Title>
                    <div className="mt-2">
                      <ul className="space-y-2">
                        {codes.map((code, index) => (
                          <li key={index} className="flex justify-between items-center">
                            <span>{code.code}</span>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveCode(code.code)}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4">
                      <input
                        type="text"
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Enter new code"
                      />
                      <button
                        className="w-full px-4 py-2 mt-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        onClick={handleAddCode}
                      >
                        Add Code
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default InviteCodeMenu;
