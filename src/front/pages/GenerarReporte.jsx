import { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  getVentasPorFecha,
  getProductosMasVendidos,
  getResumenDashboard,
} from '../api/reportes';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function GenerarReporte() {
  const [tipo, setTipo] = useState('Ventas');
  const [mostrar, setMostrar] = useState(false);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [dataGrafico, setDataGrafico] = useState(null);
  const [error, setError] = useState('');

  const exportarPDF = async () => {
    const input = document.getElementById('reporte-contenedor');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`reporte_${tipo}.pdf`);
  };

  const exportarExcel = () => {
    let rows = [];

    if (dataGrafico.type === 'bar' || dataGrafico.type === 'pie') {
      const labels = dataGrafico.data.labels;
      const values = dataGrafico.data.datasets[0].data;

      rows = labels.map((label, i) => ({
        Nombre: label,
        Valor: values[i],
      }));
    } else if (dataGrafico.type === 'info') {
      rows = [{ Descripción: 'Productos bajo mínimo', Total: dataGrafico.data }];
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, `reporte_${tipo}.xlsx`);
  };

  const handleGenerar = async (e) => {
    e.preventDefault();
    setMostrar(false);
    setError('');
    setDataGrafico(null);

    try {
      if (tipo === 'Ventas') {
        const datos = await getVentasPorFecha(fechaInicio, fechaFin);
        const fechas = datos.map((d) => new Date(d.Fecha).toLocaleDateString());
        const montos = datos.map((d) => d.TotalFinalVentas);

        setDataGrafico({
          type: 'bar',
          data: {
            labels: fechas,
            datasets: [
              {
                label: 'Total vendido (C$)',
                data: montos,
                backgroundColor: '#0d6efd',
              },
            ],
          },
        });
      } else if (tipo === 'Productos más vendidos') {
        const datos = await getProductosMasVendidos(fechaInicio, fechaFin);
        const nombres = datos.map((p) => p.Producto);
        const cantidades = datos.map((p) => p.CantidadVendida);

        setDataGrafico({
          type: 'pie',
          data: {
            labels: nombres,
            datasets: [
              {
                label: 'Cantidad vendida',
                data: cantidades,
                backgroundColor: ['#0d6efd', '#198754', '#dc3545', '#ffc107', '#6f42c1'],
              },
            ],
          },
        });
      } else if (tipo === 'Inventario bajo') {
        const datos = await getResumenDashboard();
        const total = datos.ProductosBajoMinimo;

        setDataGrafico({
          type: 'info',
          data: total,
        });
      }

      setMostrar(true);
    } catch (err) {
      console.error(err);
      setError('Error al obtener los datos del reporte.');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">📊 Reporte del Sistema</h2>

      <form className="row g-3 shadow-sm bg-white p-4 rounded border" onSubmit={handleGenerar}>
        <div className="col-md-6">
          <label className="form-label">Fecha inicio</label>
          <input
            type="date"
            className="form-control"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Fecha fin</label>
          <input
            type="date"
            className="form-control"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            required={tipo !== 'Inventario bajo'}
            disabled={tipo === 'Inventario bajo'}
          />
        </div>

        <div className="col-12">
          <label className="form-label">Tipo de reporte</label>
          <select
            className="form-select"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option>Ventas</option>
            <option>Productos más vendidos</option>
            <option>Inventario bajo</option>
          </select>
        </div>

        <div className="col-12 text-end">
          <button type="submit" className="btn btn-info">
            📈 Generar
          </button>
        </div>
      </form>

      {error && <div className="alert alert-danger mt-4">{error}</div>}

      {mostrar && dataGrafico && (
        <div className="mt-5">
          <div className="text-end mb-3">
            <button className="btn btn-outline-primary me-2" onClick={exportarPDF}>
              📄 Exportar PDF
            </button>
            <button className="btn btn-outline-success" onClick={exportarExcel}>
              📊 Exportar Excel
            </button>
          </div>

          <div id="reporte-contenedor" className="d-flex justify-content-center">
            <div
              className="shadow-sm p-4 border rounded bg-light"
              style={{ maxWidth: '600px', width: '100%', height: '350px' }}
            >
              <h5 className="text-center mb-3">📋 Reporte: {tipo}</h5>
              {dataGrafico.type === 'bar' && (
                <div style={{ height: '250px' }}>
                  <Bar
                    data={dataGrafico.data}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              )}
              {dataGrafico.type === 'pie' && (
                <div style={{ height: '250px' }}>
                  <Pie
                    data={dataGrafico.data}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              )}
              {dataGrafico.type === 'info' && (
                <div className="alert alert-warning text-center fs-5 mt-4">
                  Productos con inventario bajo mínimo:{' '}
                  <strong>{dataGrafico.data}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
