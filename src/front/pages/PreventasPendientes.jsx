import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerPreventasPendientes, eliminarPreventa } from '../api/preventas';

export default function SeleccionarPreventaPage() {
    const [preventas, setPreventas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPreventas = async () => {
            try {
                const userId = parseInt(localStorage.getItem('userId'), 10);
                if (!userId) return;

                const data = await obtenerPreventasPendientes(userId);
                setPreventas(Array.isArray(data) ? data : []);
            } catch (err) {
                alert('Error al obtener preventas pendientes');
                console.error(err);
            }
        };
        fetchPreventas();
    }, []);

    const handleEliminarPreventa = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta preventa?')) return;

        try {
            await eliminarPreventa(id);
            setPreventas(prev => prev.filter(p => p.id !== id));
            alert('Preventa eliminada correctamente');
            localStorage.removeItem('preventaId');
        } catch (err) {
            console.error('Error al eliminar preventa:', err);
            alert('No se pudo eliminar la preventa');
        }
    };

    const seleccionarPreventa = (id) => {
        localStorage.setItem('preventaId', id);
        navigate('/preventa'); // Redirigir a PreventaPage
    };

    return (
        <div className="container-fluid me-5 mt-4">
            <h2>Seleccionar Preventa Pendiente</h2>

            {preventas.length === 0 ? (
                <p>No hay preventas pendientes.</p>
            ) : (
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha de creación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {preventas.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.fecha
                                    ? new Date(p.fecha).toLocaleString()
                                    : 'Sin fecha'}</td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-sm me-2"
                                        onClick={() => seleccionarPreventa(p.id)}
                                    >
                                        Continuar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleEliminarPreventa(p.id)}
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
