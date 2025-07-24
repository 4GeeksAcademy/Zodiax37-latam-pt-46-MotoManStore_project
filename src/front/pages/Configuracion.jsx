import { useState, useEffect } from 'react';

export default function Configuracion() {
  const [config, setConfig] = useState({
    tema: 'claro',
    alertasEmail: true,
    mostrarEstadisticas: true
  });

  useEffect(() => {
    const guardado = localStorage.getItem('configMotoMan');
    if (guardado) {
      setConfig(JSON.parse(guardado));
    }
  }, []);

  const manejarCambio = (e) => {
    const { name, type, value, checked } = e.target;
    setConfig({ ...config, [name]: type === 'checkbox' ? checked : value });
  };

  const guardar = () => {
    localStorage.setItem('configMotoMan', JSON.stringify(config));
    alert('Configuración guardada correctamente');
    window.location.reload(); // Aplicar tema si se cambia
  };

  return (
    <div className="container p-4">
      <h2>Configuración del Sistema</h2>
      <form className="row g-3 bg-light p-4 rounded shadow-sm">
        {/* Tema visual */}
        <div className="col-md-6">
          <label>Tema visual</label>
          <select
            className="form-select"
            name="tema"
            value={config.tema}
            onChange={manejarCambio}
          >
            <option value="claro">Claro</option>
            <option value="oscuro">Oscuro</option>
          </select>
        </div>

        {/* Checkboxes */}
        {localStorage.getItem('rol') === 'admin' && (
          <div className="col-md-6 d-flex flex-column justify-content-end">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                name="alertasEmail"
                checked={config.alertasEmail}
                onChange={manejarCambio}
              />
              <label className="form-check-label">Habilitar alertas por correo</label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="mostrarEstadisticas"
                checked={config.mostrarEstadisticas}
                onChange={manejarCambio}
              />
              <label className="form-check-label">Mostrar gráficas en dashboard</label>
            </div>
          </div>
        )}


        {/* Botón de guardar */}
        <div className="col-12 text-end">
          <button type="button" className="btn btn-primary" onClick={guardar}>
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}