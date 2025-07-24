import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import InfoCard from '../components/InfoCard';

export default function Home() {
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const res = await API.get('/reportes/resumen-dash');
        setResumen(res.data);
      } catch (err) {
        console.error("Error al cargar resumen:", err);
      }
    };

    fetchResumen();
  }, []);

  const username = localStorage.getItem('username') || 'Usuario';

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h3 className="mb-0">Bienvenido, {username}</h3>
        <span className="text-muted fs-6">Panel de control - MotoMan</span>
      </div>

      {resumen ? (
        <>
          <section aria-label="Estadísticas del sistema">
            <div className="row g-3 mb-4">
              <div className="col-md-4 col-lg-3">
                <InfoCard title="Productos en stock" value={resumen.ProductosStock} icon="bi-box-seam" />
              </div>
              <div className="col-md-4 col-lg-3">
                <InfoCard title="Productos bajo stock mínimo" value={resumen.ProductosBajoMinimo} icon="bi-exclamation-triangle" />
              </div>
              <div className="col-md-4 col-lg-3">
                <InfoCard title="Ventas del día" value={`C$ ${resumen.VentasDia}`} icon="bi-cash-stack" />
              </div>
              <div className="col-md-4 col-lg-3">
                <InfoCard title="Última venta registrada" value={new Date(resumen.UltimaVenta).toLocaleDateString()} icon="bi-clock-history" />
              </div>
              <div className="col-md-4 col-lg-3">
                <InfoCard title="Total usuarios activos" value={resumen.UsuariosActivos} icon="bi-people" />
              </div>
              <div className="col-md-4 col-lg-3">
                <InfoCard title="Alertas recientes" value={resumen.Alertas} icon="bi-bell-fill" />
              </div>
            </div>
          </section>

          {/* Acciones rápidas */}
          <section aria-label="Acciones rápidas">
            <div className="d-flex flex-wrap gap-2">

              <Link to="/productos/catalogo" className="btn btn-outline-secondary">
                <i className="bi bi-box-seam me-2"></i>Ver catálogo de productos
              </Link>

              <Link to="/registrar-producto" className="btn btn-primary">
                <i className="bi bi-box-seam me-2"></i>Registrar producto
              </Link>
              <Link to="/registrar-venta" className="btn btn-success">
                <i className="bi bi-receipt me-2"></i>Registrar venta
              </Link>
              <Link to="/ingresar-inventario" className="btn btn-success">
                <i className="bi bi-box-arrow-in-down me-2"></i>Ingresar inventario
              </Link>
              <Link to="/reportes" className="btn btn-info">
                <i className="bi bi-bar-chart-line me-2"></i>Ver reportes
              </Link>
            </div>
          </section>
        </>
      ) : (
        <p>Cargando resumen...</p>
      )}
    </div>
  );
}
