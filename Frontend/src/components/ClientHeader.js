import { useContext } from 'react';
import { Menu } from '@headlessui/react';
import AuthContext from '../AuthContext';
import { Link } from 'react-router-dom';
import GridViewTwoToneIcon from '@mui/icons-material/GridViewTwoTone';

const userNavigation = [
  { name: 'Sign Out', href: '/login' },
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

export default function ClientHeader() {
  const authContext = useContext(AuthContext);
  const localStorageData = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <div className="bg-blue-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <GridViewTwoToneIcon className="h-8 w-8 text-white" />
            <span className="font-bold text-white italic text-lg">
              Stock Master
            </span>
          </div>
          <Menu as="div" className="relative ml-3">
            <div>
              <Menu.Button className="flex items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="sr-only">Open user menu</span>
                <ProfilePicture imageUrl={localStorageData.imageUrl} firstName={localStorageData.firstName} lastName={localStorageData.lastName} />
                <span className="ml-3 mr-4 text-white">USER</span>
              </Menu.Button>
            </div>
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {userNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <Link
                      to={item.href}
                      className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                      onClick={() => {
                        if (item.name === 'Sign Out') {
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
          </Menu>
        </div>
      </div>
    </div>
  );
}
