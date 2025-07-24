import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { obtenerUsuarios, eliminarUsuario } from '../api/usuarios'; // ← IMPORTAR eliminarUsuario

export default function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarUsuarios = async () => {
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Deseas desactivar este usuario?')) return;
    try {
      await eliminarUsuario(id);
      alert('Usuario desactivado correctamente');
      await cargarUsuarios(); // recarga lista
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar usuario');
    }
  };

  return (
    <div className="container p-4">
      <div className="d-flex align-items-end flex-column bd-highlight mb-3">
        <button className="btn btn-success" onClick={() => navigate('/crear-usuario')}>
          Añadir Usuario
        </button>
      </div>

      <h2>Gestión de Usuarios</h2>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.nombre}</td>
                <td>{u.apellido}</td>
                <td>{u.correo}</td>
                <td>{u.rol}</td>
                <td>{u.estado ? 'Activo' : 'Inactivo'}</td>

                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => navigate(`/usuarios/editar/${u.id}`)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleEliminar(u.id)}
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
