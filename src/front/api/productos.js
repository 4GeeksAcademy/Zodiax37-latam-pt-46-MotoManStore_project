import API from './axios';

// Obtener todos los productos (solo activos)
export const obtenerProductos = async () => {
    const res = await API.get(`/producto/`);
    return res.data;
};

// Obtener un producto por ID
export const obtenerProducto = async (id) => {
    const res = await API.get(`/producto/${id}`);
    return res.data;
};

// Crear un nuevo producto
export const crearProducto = async (data) => {
    const res = await API.post('/producto/', data);
    return res.data;
};

// Actualizar un producto por ID
export const actualizarProducto = async (id, data) => {
    const res = await API.put(`/producto/${id}`, data);
    return res.data;
};

// Desactivar (eliminar lógico) un producto
export const eliminarProducto = async (id) => {
    const res = await API.delete(`/producto/${id}`);
    return res.data;
};
