import { useState } from 'react';

export default function RegistrarVenta() {
  const [formulario, setFormulario] = useState({
    producto: '',
    cantidad: '',
    metodoPago: '',
    cliente: ''
  });
  const [error, setError] = useState('');

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const { producto, cantidad, metodoPago } = formulario;

    if (!producto || !cantidad || !metodoPago) {
      setError('Todos los campos obligatorios deben completarse.');
      return;
    }

    if (cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0.');
      return;
    }

    setError('');
    alert('Venta registrada correctamente');
    console.log('Datos enviados:', formulario);
  };

  return (
    <div className="container p-4">
      <h2>Registrar Venta</h2>
      <form onSubmit={manejarEnvio} className="row g-3 bg-light p-4 rounded shadow-sm">
        <div className="col-md-6">
          <label>Producto</label>
          <input className="form-control" name="producto" value={formulario.producto} onChange={manejarCambio} />
        </div>
        <div className="col-md-3">
          <label>Cantidad</label>
          <input type="number" className="form-control" name="cantidad" value={formulario.cantidad} onChange={manejarCambio} />
        </div>
        <div className="col-md-3">
          <label>Método de Pago</label>
          <input className="form-control" name="metodoPago" value={formulario.metodoPago} onChange={manejarCambio} />
        </div>
        <div className="col-12">
          <label>Cliente (opcional)</label>
          <input className="form-control" name="cliente" value={formulario.cliente} onChange={manejarCambio} />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="col-12 text-end">
          <button className="btn btn-primary">Registrar</button>
        </div>
      </form>
    </div>
  );
}

