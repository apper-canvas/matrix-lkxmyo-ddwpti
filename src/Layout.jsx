import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  const backdropVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 z-40">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Sprout" size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-display font-bold text-gray-900">FarmFlow</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
              <ApperIcon name="MapPin" size={14} className="text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">Springfield Farm</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full">
              <ApperIcon name="Sun" size={14} className="text-orange-600" />
              <span className="text-sm text-orange-700 font-medium">24°C</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col z-40">
          <nav className="flex-1 p-4 space-y-2">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                  }`
                }
              >
                <ApperIcon name={route.icon} size={18} />
                {route.label}
              </NavLink>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">John Farmer</p>
                <p className="text-xs text-gray-500 truncate">john@farmflow.com</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={backdropVariants}
                transition={{ duration: 0.2 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.aside
                initial="closed"
                animate="open"
                exit="closed"
                variants={sidebarVariants}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl z-50 flex flex-col"
              >
                <div className="h-16 px-4 flex items-center border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <ApperIcon name="Sprout" size={18} className="text-white" />
                    </div>
                    <h2 className="text-lg font-display font-bold text-gray-900">FarmFlow</h2>
                  </div>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                  {routeArray.map((route) => (
                    <NavLink
                      key={route.id}
                      to={route.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                          isActive
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                        }`
                      }
                    >
                      <ApperIcon name={route.icon} size={18} />
                      {route.label}
                    </NavLink>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden flex-shrink-0 bg-white border-t border-gray-200 px-2 py-1">
        <div className="flex justify-around">
          {routeArray.slice(0, 5).map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-0 ${
                  isActive
                    ? 'text-primary bg-green-50'
                    : 'text-gray-500 hover:text-primary'
                }`
              }
            >
              <ApperIcon name={route.icon} size={18} />
              <span className="text-xs font-medium truncate">{route.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;