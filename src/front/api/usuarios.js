// src/api/usuario.js
import API from "./axios";

// Obtener todos los usuario
export const obtenerUsuarios = async () => {
  const res = await API.get("/usuario");
  return res.data;
};

export const obtenerUsuario = async (id) => {
  const res = await API.get(`/usuario/${id}`);
  return res.data;
};

// Crear un nuevo usuario
export const crearUsuario = async (data) => {
  const res = await API.post("/usuario", data);
  return res.data;
};

// Actualizar un usuario por ID
export const actualizarUsuario = async (id, data) => {
  const res = await API.put(`/usuario/${id}`, data);
  return res.data;
};

// Eliminar (o desactivar) un usuario por ID
export const eliminarUsuario = async (id) => {
  const res = await API.delete(`/usuario/${id}`);
  return res.data;
};
