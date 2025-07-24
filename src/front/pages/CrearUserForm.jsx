import React, { useState, useEffect } from 'react';
import { crearUsuario } from '../api/usuarios';
import { obtenerEmpleados } from '../api/empleados';
import './CrearUserForm.css';

function CrearUsuario() {
  const [form, setForm] = useState({
    empleado_id: '',
    username: '',
    password: '',
    rol: '',
  });

  const [empleados, setEmpleados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [passwordValida, setPasswordValida] = useState(true);

  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        const data = await obtenerEmpleados();
        setEmpleados(data);
      } catch (err) {
        setError('Error al cargar empleados');
      }
    };
    cargarEmpleados();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'password') {
      validarPassword(value);
    }
  };

  const validarPassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    setPasswordValida(regex.test(password));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!passwordValida) {
      setError('La contraseña no cumple con los requisitos de seguridad.');
      return;
    }

    try {
      await crearUsuario({
        empleado_id: parseInt(form.empleado_id),
        username: form.username,
        password: form.password,
        rol: form.rol,
      });
      setMensaje('✅ Usuario creado correctamente');
      setForm({ empleado_id: '', username: '', password: '', rol: '' });
    } catch (err) {
      console.error(err);
      setError('❌ Error al crear usuario: ' + (err?.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Crear Usuario</h2>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="p-4 shadow bg-light rounded">
        <div className="mb-3">
          <label className="form-label">Empleado</label>
          <select
            name="empleado_id"
            className="form-select"
            value={form.empleado_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un empleado</option>
            {empleados.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.persona_nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Nombre de Usuario</label>
          <input
            name="username"
            type="text"
            className="form-control"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            name="password"
            type="password"
            className={`form-control ${
              !passwordValida && form.password ? 'is-invalid' : ''
            }`}
            value={form.password}
            onChange={handleChange}
            required
          />
          {!passwordValida && form.password && (
            <div className="invalid-feedback">
              Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Rol</label>
          <select
            name="rol"
            className="form-select"
            value={form.rol}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un rol</option>
            <option value="admin">Admin</option>
            <option value="ventas">Ventas</option>
            <option value="inventario">Inventario</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Crear Usuario
        </button>
      </form>
    </div>
  );
}

export default CrearUsuario;
