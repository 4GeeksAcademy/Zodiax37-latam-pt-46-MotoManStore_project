// src/api/empleado.js
import API from './axios';

export const obtenerEmpleados = async () => {
  const res = await API.get('/empleado');
  return res.data;
};

export const obtenerEmpleado = async (id) => {
  const res = await API.get(`/empleado/${id}`);
  return res.data;
};

export const crearEmpleado = async (data) => {
  const res = await API.post('/empleado', data);
  return res.data;
};

export const actualizarEmpleado = async (id, data) => {
  const res = await API.put(`/empleado/${id}`, data);
  return res.data;
};

export const eliminarEmpleado = async (id) => {
  const res = await API.delete(`/empleado/${id}`);
  return res.data;
};



export const obtenerEmpleados_Personas = async (id) => {
  const res = await API.get(`/empleado/completo/${id}`);
  return res.data;
};

export const crearEmpleadoCompleto = async (data)=>{
  const res = await API.post('empleado/completo', data);
  return res.data
}