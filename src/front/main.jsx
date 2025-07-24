import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { StoreProvider } from './hooks/useGlobalReducer';
import { BackendURL } from './components/BackendURL';

import { privateRoutes, publicRoutes } from './routes';

function Main() {
  const [logueado, setLogueado] = useState(false);

  useEffect(() => {
    const sesion = localStorage.getItem('logueado');
    setLogueado(sesion === 'true');
  }, []);

  const handleLogin = () => {
    setLogueado(true);
  };

  const handleLogout = () => {
    setLogueado(false);
    localStorage.clear(); // Opcional: limpia todo para asegurar que no quede info
  };

  // Creamos los routers inyectando props onLogin/onLogout
  const privateRouter = createBrowserRouter(
    privateRoutes.map(route => {
      if (route.element && route.element.type.name === 'Layout') {
        return {
          ...route,
          element: React.cloneElement(route.element, { onLogout: handleLogout }),
        };
      }
      return route;
    })
  );

  const publicRouter = createBrowserRouter(
    publicRoutes.map(route => {
      if (route.element && route.element.type.name === 'Login') {
        return {
          ...route,
          element: React.cloneElement(route.element, { onLogin: handleLogin }),
        };
      }
      return route;
    })
  );

  if (!import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL === '') {
    return (
      <React.StrictMode>
        <BackendURL />
      </React.StrictMode>
    );
  }

  return (
    <React.StrictMode>
      <StoreProvider>
        <RouterProvider router={logueado ? privateRouter : publicRouter} />
      </StoreProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
