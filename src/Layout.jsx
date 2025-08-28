import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { AuthContext } from './App';
import { routes, routeArray } from './config/routes';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Layout = () => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  const navigation = [
    { 
      ...routes.dashboard, 
      href: '/', 
      current: window.location.pathname === '/' 
    },
...routeArray.filter(route => route.id !== 'dashboard').map(route => ({
      ...route,
      href: route.path,
      current: window.location.pathname === route.path
    }))
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r border-gray-200">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">FarmFlow</span>
          </div>
          
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <ApperIcon
                    name={item.icon}
                    size={20}
                    className={`mr-3 flex-shrink-0 ${
                      item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
}`}
                  />
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          
          {/* User info and logout */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-500 truncate">{user?.emailAddress}</p>
              </div>
              <div className="ml-3">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="LogOut"
                  onClick={logout}
                  className="text-gray-400 hover:text-gray-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;