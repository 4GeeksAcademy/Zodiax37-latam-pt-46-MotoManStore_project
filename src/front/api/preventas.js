// src/api/preventas.js
import API from './axios';

// Crear una nueva preventa
export const crearPreventa = async (usuarioId) => {
    const res = await API.post('/preventa/crear', { usuario_id: usuarioId });
    return res.data;
};

// Agregar un producto a la preventa
export const agregarProductoPreventa = async ({ preventaId, productoId, cantidad }) => {
    const res = await API.post('/preventa/agregar-producto', {
        preventa_id: preventaId,
        producto_id: productoId,
        cantidad: cantidad,
    });
    return res.data;
};

// Quitar un producto de la preventa
export const quitarProductoPreventa = async ({ preventaId, productoId }) => {
    const res = await API.delete('/preventa/quitar-producto', {
        data: {
            preventa_id: preventaId,
            producto_id: productoId,
        },
    });
    return res.data;
};

// Obtener los productos de una preventa
export const obtenerProductosDePreventa = async (preventaId) => {
    const res = await API.get(`/preventa/listar-productos/${preventaId}`);
    return res.data;
};

// Obtener preventas pendientes de un usuario
export const obtenerPreventasPendientes = async (usuarioId) => {
    const res = await API.get(`/preventa/listar-pendientes/${usuarioId}`);
    return res.data;
};

// Eliminar (cancelar) preventa
export const eliminarPreventa = async (id) => {
    const res = await API.delete(`/preventa/eliminar/${id}`);
    return res.data;
};


export const obtenerVentas = async (usuarioId) => {
    const res = await API.get(`/preventa/ventas/${usuarioId}`);
    return res.data;
};

// Confirmar una preventa y generar la venta + factura
export const confirmarVenta = async (data) => {
    const res = await API.post('/preventa/confirmar', data);
    return res.data;
};
