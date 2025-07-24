import API from './axios';

// Obtener todos los proveedor
export const obtenerProveedores = async () => {
    const res = await API.get('/proveedor');
    return res.data;
};

// Obtener un proveedor por ID
export const obtenerProveedor = async (id) => {
    const res = await API.get(`/proveedor/${id}`);
    return res.data;
};

// Crear un nuevo proveedor
export const crearProveedor = async (data) => {
    const res = await API.post('/proveedor', data);
    return res.data;
};

// Actualizar un proveedor
export const actualizarProveedor = async (id, data) => {
    const res = await API.put(`/proveedor/${id}`, data);
    return res.data;
};

// Desactivar un proveedor
export const eliminarProveedor = async (id) => {
    const res = await API.delete(`/proveedor/${id}`);
    return res.data;
};
