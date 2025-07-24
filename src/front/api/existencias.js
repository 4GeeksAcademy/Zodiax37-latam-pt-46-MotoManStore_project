// src/api/existencias.js
import API from './axios';

// Obtener todos los movimientos de inventario
export const obtenerExistencias = async () => {
    const res = await API.get('/existencia/movimientos');
    return res.data;
};

// Obtener un movimiento de inventario específico por ID
export const obtenerExistencia = async (id) => {
    const res = await API.get(`/existencia/movimientos/${id}`);
    return res.data;
};

export async function CrearExistencia(data) {
    const res = await API.post("/existencia", data);
    return res.data;
}

// Registrar un movimiento (Entrada o Salida)
export async function RegistrarMovimiento(data) {
    const res = await API.post("/existencia/movimientos", data);
    return res.data;
}
