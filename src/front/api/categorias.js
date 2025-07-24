// src/api/categoria.js
import API from './axios';

// Obtener todas las categorías
export const obtenerCategorias = async () => {
    const res = await API.get('/categoria/categorias');
    return res.data;
};

// Obtener una categoría por ID (opcional si agregás esa ruta en backend)
export const obtenerCategoria = async (id) => {
    const res = await API.get(`/categoria/${id}`);
    return res.data;
};

// Crear una nueva categoría
export const crearCategoria = async (data) => {
    const res = await API.post('/categoria', data);
    return res.data;
};

// Actualizar una categoría
export const actualizarCategoria = async (id, data) => {
    const res = await API.put(`/categoria/${id}`, data);
    return res.data;
};

// Eliminar (desactivar) una categoría
export const eliminarCategoria = async (id) => {
    const res = await API.delete(`/categoria/${id}`);
    return res.data;
};
