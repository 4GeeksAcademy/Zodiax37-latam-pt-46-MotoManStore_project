import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { logout } from '../utils/auth';

export const Layout = ({ onLogout }) => {
  const navigate = useNavigate();
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [logueado, setLogueado] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('logueado');
    setLogueado(session === 'true');

    const sidebarState = localStorage.getItem('sidebarMotoMan');
    if (sidebarState !== null) {
      setSidebarAbierto(sidebarState === 'true');
    }

    const config = JSON.parse(localStorage.getItem('configMotoMan'));
    if (config?.tema === 'oscuro') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  const toggleSidebar = () => {
    const nuevoEstado = !sidebarAbierto;
    setSidebarAbierto(nuevoEstado);
    localStorage.setItem('sidebarMotoMan', nuevoEstado);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('sidebarMotoMan');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('preventaId');
    if (onLogout) onLogout();
    navigate('/login');
  };

  if (!logueado) return <Navigate to="/login" />;

  return (
    <div className="d-flex">
      <Sidebar rol={localStorage.getItem('rol')} isCollapsed={!sidebarAbierto} toggleSidebar={toggleSidebar} />
      <div
        className="flex-grow-1"
        style={{
          marginLeft: sidebarAbierto ? '220px' : '60px',
          transition: 'margin-left 0.3s',
        }}
      >
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={toggleSidebar}
              title={sidebarAbierto ? 'Ocultar menú' : 'Mostrar menú'}
            >
              <i className="bi bi-list fs-5"></i>
            </button>
            <h4 className="mb-0">MotoMan</h4>
          </div>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>

        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
