import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Sidebar.css';

export default function Sidebar({ isCollapsed, toggleSidebar, rol }) {
  const location = useLocation();
  const [openSections, setOpenSections] = useState({});

  const isDark = document.body.classList.contains('dark-mode');

  const toggleSection = (label) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const navItems = [
    {
      label: 'Inicio',
      icon: 'bi-house-door-fill',
      path: '/',
      roles: ['admin', 'ventas', 'inventario']
    },
    {
      label: 'Productos',
      icon: 'bi-box-seam',
      roles: ['admin', 'inventario'],
      children: [
        { label: 'Catálogo', path: '/productos/catalogo' },
        ...(rol === 'admin'
          ? [{ label: 'Registrar Producto', path: '/productos/registrar-producto' }]
          : []),
        { label: 'Registrar Movimiento', path: '/registrar-movimiento' },
        { label: 'Movimientos', path: '/movimientos' }
      ]
    },
    {
      label: 'Productos',
      icon: 'bi-box-seam',
      roles: ['ventas'],
      children: [
        { label: 'Catálogo', path: '/productos/catalogo' }
      ]
    },
    {
      label: 'Ventas',
      icon: 'bi-cart-fill',
      roles: ['admin', 'ventas'],
      children: [
        { label: 'Mis Preventas', path: '/seleccionar-preventa' },
        { label: 'Mis Ventas', path: '/ventas/listado' },
        { label: 'Facturación', path: '/preventa' }
      ]
    },
    {
      label: 'Reportes',
      icon: 'bi-bar-chart-line-fill',
      path: '/reportes',
      roles: ['admin']
    },
    {
      label: 'Usuarios y Roles',
      icon: 'bi-people-fill',
      roles: ['admin'],
      children: [
        { label: 'Usuarios', path: '/usuarios' },
        { label: 'Empleados', path: '/empleados/lista' }
      ]
    },
    {
      label: 'Configuración',
      icon: 'bi-gear-fill',
      path: '/configuracion',
      roles: ['admin']
    },
    {
      label: 'Configuración',
      icon: 'bi-gear-fill',
      path: '/configuracion',
      roles: ['ventas']
    },
    {
      label: 'Configuración',
      icon: 'bi-gear-fill',
      path: '/configuracion',
      roles: ['inventario']
    }
  ];

  return (
    <div
      className={`vh-100 border-end shadow-sm transition-all ${
        isDark ? 'bg-dark text-light' : 'bg-light'
      }`}
      style={{
        width: isCollapsed ? '60px' : '220px',
        position: 'fixed',
        overflowX: 'hidden',
        transition: 'width 0.3s ease',
        zIndex: 1000
      }}
    >
      <ul className="nav flex-column p-3">
        {navItems.map((item, index) => {
          if (!item.roles.includes(rol)) return null;

          const isOpen = openSections[item.label];

          if (item.children) {
            return (
              <li key={index} className="nav-item mb-2">
                <div
                  className={`nav-link d-flex align-items-center justify-content-between ${
                    isDark ? 'text-light' : 'text-dark'
                  } cursor-pointer`}
                  onClick={() => toggleSection(item.label)}
                >
                  <div className="d-flex align-items-center">
                    <i className={`bi ${item.icon} me-2 fs-5`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                  )}
                </div>

                <ul
                  className={`nav flex-column ms-2 submenu ${
                    isCollapsed ? 'closed' : isOpen ? 'open' : 'closed'
                  }`}
                >
                  {item.children.map((subItem, subIndex) => (
                    <li key={subIndex} className="sidebar-subitem">
                      <Link
                        to={subItem.path}
                        className={`nav-link ${
                          location.pathname === subItem.path
                            ? 'active text-primary fw-bold'
                            : isDark
                            ? 'text-light'
                            : 'text-dark'
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          } else {
            return (
              <li key={index} className="nav-item mb-2">
                <Link
                  to={item.path}
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === item.path
                      ? 'active text-primary fw-bold'
                      : isDark
                      ? 'text-light'
                      : 'text-dark'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <i className={`bi ${item.icon} me-2 fs-5`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
}
