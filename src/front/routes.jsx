// src/routes.jsx
import { Navigate } from 'react-router-dom';
import { Layout } from './pages/Layout';
import Login from './pages/Login';

import Home from './pages/Home';
import RegistroProducto from './pages/RegistroProducto';
import EditarProductoPage from './pages/EditarProductoPage';
import IngresoInventario from './pages/IngresoInventario';
import RegistrarVenta from './pages/RegistrarVenta';
import GenerarReporte from './pages/GenerarReporte';
import Usuarios from './pages/Usuarios';
import Configuracion from './pages/Configuracion';
import CrearUserForm from './pages/CrearUserForm';
import CatalogoProductos from './pages/CatalogoProducto';
import PreventaPage from './pages/PreventaPage';
import PreventasPendientes from "./pages/PreventasPendientes";
import ListaMovimientosInventario from './pages/Movimientos/ListaMovimientosInventario';
import RegistrarMovimientoPage from './pages/Movimientos/RegistrarMovimiento';
import RegistrarCategoriaPage from './pages/RegistrarCategoriaPage';
import RegistrarProveedorPage from './pages/RegistrarProveedorPage';
import UsuariosEditar from './pages/UsuariosEditar';
import CategoriasLista from './pages/CategoriaLista';
import ListaVentas from './pages/ListaVentas';
import EmpleadoEditarPage from './pages/EmpleadoEditarPage';
import EmpleadosLista from './pages/EmpleadosLista';
import EmpleadoCrearPage from './pages/EmpleadoCrearpage';
import ProveedorEditarPage from './pages/ProveedorEditarPage';
import ProveedorListaPage from './pages/ProveedorListapage';
import CategoriaEditarPage from './pages/CategoriaEditarPage';

export const privateRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/productos/registrar-producto', element: <RegistroProducto /> },
      { path: '/productos/editar-producto/:id', element: <EditarProductoPage /> },
      { path: '/ingresar-inventario', element: <IngresoInventario /> },
      { path: '/registrar-venta', element: <RegistrarVenta /> },
      { path: '/reportes', element: <GenerarReporte /> },
      { path: '/usuarios', element: <Usuarios /> },
      { path: '/crear-usuario', element: <CrearUserForm /> },
      { path: '/usuarios/editar/:id', element: <UsuariosEditar /> },
      { path: '/configuracion', element: <Configuracion /> },
      { path: '/productos/catalogo', element: <CatalogoProductos /> },
      { path: '/seleccionar-preventa', element: <PreventasPendientes /> },
      { path: '/movimientos', element: <ListaMovimientosInventario /> },
      { path: '/registrar-movimiento', element: <RegistrarMovimientoPage /> },
      { path: '/ventas/listado', element: <ListaVentas /> },
      { path: '/preventa', element: <PreventaPage /> },
      { path: '/categorias/lista', element: <CategoriasLista /> },
      { path: '/categorias/editar/:id', element: <CategoriaEditarPage /> },
      { path: '/categorias/registrar', element: <RegistrarCategoriaPage /> },
      { path: '/proveedores/registrar', element: <RegistrarProveedorPage /> },
      { path: '/proveedores/lista', element: <ProveedorListaPage /> },
      { path: '/proveedores/editar/:id', element: <ProveedorEditarPage /> },
      { path: '/empleados/lista', element: <EmpleadosLista /> },
      { path: '/empleados/crear', element: <EmpleadoCrearPage /> },
      { path: '/empleados/editar/:id', element: <EmpleadoEditarPage /> },
      { path: '*', element: <Navigate to="/" replace /> }, // fallback privado
    ],
  },
];

export const publicRoutes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />, // fallback público
  },
];
