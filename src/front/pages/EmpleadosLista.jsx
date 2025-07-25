import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { obtenerEmpleados, eliminarEmpleado } from '../api/empleados';

export default function EmpleadosLista() {
    const navigate = useNavigate();
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarEmpleados = async () => {
        try {
            const data = await obtenerEmpleados();
            console.log("Datos empleados recibidos:", data);
            setEmpleados(data);
        } catch (error) {
            console.error('Error al cargar empleados:', error);
            alert('No se pudieron cargar los empleados');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarEmpleados();
    }, []);

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Deseas eliminar este empleado?')) return;
        try {
            await eliminarEmpleado(id);
            alert('Empleado eliminado correctamente');
            await cargarEmpleados();
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            alert('Error al eliminar empleado');
        }
    };

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-success" onClick={() => navigate('/empleados/crear')}>
                    Añadir Empleado
                </button>
            </div>

            <h2>Gestión de Empleados</h2>

            {loading ? (
                <p>Cargando empleados...</p>
            ) : (
                <table className="table table-hover table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>Área</th>
                            <th>Cargo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empleados.map((e) => (
                            <tr key={e.id}>
                                <td>{e.persona_nombre || 'Sin nombre'}</td>
                                <td>{e.area_de_trabajo}</td>
                                <td>{e.cargo}</td>
                                <td>{e.estado ? 'Activo' : 'Inactivo'}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => navigate(`/empleados/editar/${e.id}`)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleEliminar(e.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
