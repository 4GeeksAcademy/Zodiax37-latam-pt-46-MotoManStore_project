import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerProveedor, actualizarProveedor } from '../api/proveedores';

export default function ProveedorEditarPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombre: '',
        contacto: '',
        plataforma: '',
        email: '',
        direccion: ''
    });

    useEffect(() => {
        const cargarProveedor = async () => {
            try {
                const data = await obtenerProveedor(id);
                setForm(data);
            } catch (error) {
                console.error(error);
                alert('Error al cargar proveedor');
            }
        };
        cargarProveedor();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await actualizarProveedor(id, form);
            alert('Proveedor actualizado correctamente');
            navigate('/proveedores/lista');
        } catch (error) {
            console.error(error);
            alert('Error al actualizar proveedor');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Editar Proveedor</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Contacto</label>
                    <input
                        type="text"
                        name="contacto"
                        value={form.contacto}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Plataforma</label>
                    <input
                        type="text"
                        name="plataforma"
                        value={form.plataforma}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <textarea
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <button type="submit" className="btn btn-primary me-2">Guardar Cambios</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/proveedores/lista')}>Cancelar</button>
            </form>
        </div>
    );
}
