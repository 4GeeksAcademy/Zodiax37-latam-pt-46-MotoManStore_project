import { useState } from 'react';

export default function IngresoInventario() {
  const [formulario, setFormulario] = useState({
    producto: '',
    cantidad: '',
    comentario: ''
  });
  const [error, setError] = useState('');

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const { producto, cantidad } = formulario;

    if (!producto || !cantidad) {
      setError('Debe seleccionar un producto y cantidad');
      return;
    }

    if (cantidad <= 0) {
      setError('Cantidad inválida');
      return;
    }

    setError('');
    alert('Inventario actualizado');
    console.log('Datos:', formulario);
  };

  return (
    <div className="container p-4">
      <h2>Ingreso de Inventario</h2>
      <form onSubmit={manejarEnvio} className="row g-3 bg-light p-4 rounded shadow-sm">
        <div className="col-md-6">
          <label>Producto</label>
          <input className="form-control" name="producto" value={formulario.producto} onChange={manejarCambio} />
        </div>
        <div className="col-md-3">
          <label>Cantidad</label>
          <input type="number" className="form-control" name="cantidad" value={formulario.cantidad} onChange={manejarCambio} />
        </div>
        <div className="col-12">
          <label>Comentario (opcional)</label>
          <textarea className="form-control" name="comentario" value={formulario.comentario} onChange={manejarCambio}></textarea>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="col-12 text-end">
          <button className="btn btn-success">Guardar</button>
        </div>
      </form>
    </div>
  );
}
