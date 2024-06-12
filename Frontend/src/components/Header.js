import { Fragment, useContext, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import AuthContext from '../AuthContext';
import { Link } from 'react-router-dom';
import GridViewTwoToneIcon from '@mui/icons-material/GridViewTwoTone';
import InviteCodesModal from './InviteCodeMenu';
import AdminOptionsModal from './AdminOptionsModal';

const navigation = [
  { name: 'Dashboard', href: '/', current: true },
  { name: 'Inventory', href: '/inventory', current: false },
  { name: 'Purchase Details', href: '/purchase-details', current: false },
  { name: 'Sales', href: '/sales', current: false },
  { name: 'Manage Store', href: '/manage-store', current: false },
];

const userNavigation = [
  { name: 'Invite Codes', href: '#' },
  { name: 'Admin Options', href: '#' },
  { name: 'Sign Out', href: './login' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const ProfilePicture = ({ imageUrl, firstName, lastName }) => {
  if (imageUrl) {
    return <img className="h-8 w-8 rounded-full" src={imageUrl} alt="profile" />;
  }
  const initial = firstName ? firstName.charAt(0) : '';
  return (
    <div className="flex justify-center items-center h-8 w-8 rounded-full bg-gray-500">
      <span className="text-white font-medium">{initial.toUpperCase()}</span>
    </div>
  );
};

export default function Header() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const localStorageData = JSON.parse(localStorage.getItem('user')) || {};

  const handleDeleteInventory = () => {
    fetch('http://localhost:4000/api/product/deleteAll', { method: 'DELETE' })
      .then(response => response.json())
      .then(() => {
        setIsAdminModalOpen(false);
      })
      .catch(err => console.log(err));
  };

  const handleDeleteSales = () => {
    fetch('http://localhost:4000/api/sales/deleteAll', { method: 'DELETE' })
      .then(response => response.json())
      .then(() => {
        setIsAdminModalOpen(false);
      })
      .catch(err => console.log(err));
  };

  const handleDeletePurchases = () => {
    fetch('http://localhost:4000/api/purchase/deleteAll', { method: 'DELETE' })
      .then(response => response.json())
      .then(() => {
        setIsAdminModalOpen(false);
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <div className="min-h-full">
        <InviteCodesModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
        <AdminOptionsModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          handleDeleteInventory={handleDeleteInventory}
          handleDeleteSales={handleDeleteSales}
          handleDeletePurchases={handleDeletePurchases}
        />
        <Disclosure as="nav" className="bg-blue-900">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex justify-center items-center gap-2">
                        <GridViewTwoToneIcon className="h-8 w-8 text-white" />
                        <span className="font-bold text-white italic text-lg">
                          Stock Master
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <button
                        type="button"
                        className="rounded-full bg-blue-900 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Open user menu</span>
                            <ProfilePicture imageUrl={localStorageData.imageUrl} firstName={localStorageData.firstName} lastName={localStorageData.lastName} />
                            <span className="ml-3 mr-4 text-white">ADMIN</span>
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <Link
                                    to={item.href}
                                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                    onClick={() => {
                                      if (item.name === 'Invite Codes') {
                                        setIsInviteModalOpen(true);
                                      } else if (item.name === 'Admin Options') {
                                        setIsAdminModalOpen(true);
                                      } else if (item.name === 'Sign Out') {
                                        authContext.signout();
                                      }
                                    }}
                                  >
                                    {item.name}
                                  </Link>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Link to={item.href} key={item.name}>
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'block rounded-md px-3 py-2 text-base font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}
