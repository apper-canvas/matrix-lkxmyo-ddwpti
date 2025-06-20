import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import { routes, routeArray } from './config/routes';
import NotFound from '@/components/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen bg-gray-50 overflow-hidden">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<routes.dashboard.component />} />
            {routeArray.map((route) => (
              <Route
                key={route.id}
                path={route.path}
                element={<route.component />}
              />
            ))}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
          toastClassName="rounded-lg shadow-lg"
          bodyClassName="text-sm font-medium"
          progressClassName="bg-primary"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;