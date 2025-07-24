// src/api/personas.js
import API from './axios';

export const crearPersona = async (data) => {
  const res = await API.post('/persona', data);
  return res.data;
};

export const actualizarPersona = async (id, data) => {
  const res = await API.put(`/persona/${id}`, data);
  return res.data;
};

export const obtenerPersona = async (id) => {
  const res = await API.get(`/persona/${id}`);
  return res.data;
};

export const eliminarPersona = async (id) => {
  const res = await API.delete(`/persona/${id}`);
  return res.data;
};
