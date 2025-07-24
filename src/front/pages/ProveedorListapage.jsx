import React, { useEffect, useState } from 'react';
import { obtenerProveedores, eliminarProveedor } from '../api/proveedores';
import { useNavigate } from 'react-router-dom';

export default function ProveedorListaPage() {
    const [proveedores, setProveedores] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        cargarProveedores();
    }, []);

    const cargarProveedores = async () => {
        try {
            const data = await obtenerProveedores();
            setProveedores(data);
        } catch (error) {
            console.error(error);
            alert('Error al cargar proveedores');
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este proveedor?')) return;
        try {
            await eliminarProveedor(id);
            alert('Proveedor eliminado correctamente');
            cargarProveedores(); // Recargar lista
        } catch (error) {
            console.error(error);
            alert('Error al eliminar proveedor');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Proveedores</h2>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Contacto</th>
                        <th>Plataforma</th>
                        <th>Email</th>
                        <th>Dirección</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {proveedores.map((p) => (
                        <tr key={p.id}>
                            <td>{p.nombre}</td>
                            <td>{p.contacto}</td>
                            <td>{p.plataforma}</td>
                            <td>{p.email}</td>
                            <td>{p.direccion}</td>
                            <td>{p.estado ? 'Activo' : 'Inactivo'}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => navigate(`/proveedores/editar/${p.id}`)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleEliminar(p.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
