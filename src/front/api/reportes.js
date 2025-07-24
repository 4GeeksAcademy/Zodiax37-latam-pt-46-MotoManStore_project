import API from './axios';

export const getVentasPorFecha = async (fechaInicio, fechaFin) => {
  const res = await API.get('/reportes/ventas-por-fecha', {
    params: { fechaInicio, fechaFin },
  });
  return res.data;
};

export const getProductosMasVendidos = async (fechaInicio, fechaFin) => {
  const res = await API.get('/reportes/mas-vendidos', {
    params: { fechaInicio, fechaFin },
  });
  return res.data;
};

export const getDetalleVenta = async (ventaId) => {
  const res = await API.get(`/reportes/detalle-venta/${ventaId}`);
  return res.data;
};



export const getResumenDashboard = async () => {
  const res = await API.get('/reportes/resumen-dash');
  return res.data;
};
