import React, { useState } from 'react';
import { crearCategoria } from '../api/categorias';
import { useNavigate } from 'react-router-dom';

const RegistrarCategoriaPage = () => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearCategoria(form);
      alert('Categoría registrada correctamente');
      setForm({ nombre: '', descripcion: '' });
    } catch (error) {
      console.error(error);
      alert('Error al registrar la categoría');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Registrar Categoría</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary me-2">Registrar</button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/categorias/lista')}
        >
          Ver Categorías
        </button>
      </form>
    </div>
  );
};

export default RegistrarCategoriaPage;
