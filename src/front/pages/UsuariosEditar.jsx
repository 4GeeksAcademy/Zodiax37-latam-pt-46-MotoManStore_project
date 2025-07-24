import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerUsuario, actualizarUsuario } from '../api/usuarios';
import { obtenerEmpleados } from '../api/empleados';

export default function UsuariosEditar() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [empleados, setEmpleados] = useState([]);

    useEffect(() => {
        const cargarUsuario = async () => {
            try {
                const data = await obtenerUsuario(id);
                console.log('Usuario recibido del backend:', data); // DEBUG aquí
                setUsuario({
                    username: data.username || '',
                    rol: data.rol || '',
                    estado: data.estado ?? true,
                    empleadoId: data.empleado_id ? String(data.empleado_id) : '',
                    password: '', // para nueva contraseña
                });
            } catch (error) {
                console.error('Error al cargar usuario:', error);
                alert('Error al cargar usuario');
            }
        };

        const cargarEmpleados = async () => {
            try {
                const data = await obtenerEmpleados();
                console.log('Empleados recibidos:', data); // DEBUG aquí
                setEmpleados(data.map(emp => ({
                    id: String(emp.id),
                    nombre: emp.persona_nombre,
                })));
            } catch (error) {
                console.error('Error al cargar empleados:', error);
                alert('Error al cargar empleados');
            }
        };

        cargarUsuario();
        cargarEmpleados();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario((prev) => ({
            ...prev,
            [name]: name === 'estado' ? value === '1' : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                username: usuario.username,
                rol: usuario.rol,
                estado: usuario.estado,
                empleado_id: parseInt(usuario.empleadoId),
            };
            if (usuario.password?.trim()) {
                payload.password = usuario.password;
            }
            console.log('Payload a enviar para actualizar:', payload); // DEBUG aquí
            await actualizarUsuario(id, payload);
            alert('✅ Usuario actualizado correctamente');
            navigate('/usuarios');
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            alert('❌ Error al actualizar usuario');
        }
    };

    if (!usuario) return <p>Cargando...</p>;

    console.log('Estado usuario para render:', usuario); // DEBUG antes de renderizar

    return (
        <div className="container mt-4">
            <h2>Editar Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={usuario.username}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Rol</label>
                    <select
                        name="rol"
                        value={usuario.rol}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="">Seleccione un rol</option>
                        <option value="admin">Administrador</option>
                        <option value="ventas">Ventas</option>
                        <option value="inventario">Inventario</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label>Estado</label>
                    <select
                        name="estado"
                        value={usuario.estado ? '1' : '0'}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="1">Activo</option>
                        <option value="0">Inactivo</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label>Empleado</label>
                    <select
                        name="empleadoId"
                        value={usuario.empleadoId}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="">Seleccione un empleado</option>
                        {empleados.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                                {emp.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label>Nueva Contraseña (opcional)</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={usuario.password}
                        onChange={handleChange}
                        placeholder="Dejar en blanco para no cambiar"
                    />
                </div>

                <button className="btn btn-primary" type="submit">
                    Guardar Cambios
                </button>
            </form>
        </div>
    );
}
