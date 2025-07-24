import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerCategoria, actualizarCategoria } from '../api/categorias';

export default function CategoriaEditarPage() {
    const { id } = useParams(); // obtiene el ID de la categoría desde la URL
    const navigate = useNavigate();
    const [form, setForm] = useState({ nombre: '', descripcion: '' });

    useEffect(() => {
        const cargarCategoria = async () => {
            try {
                const data = await obtenerCategoria(id);
                setForm({
                    nombre: data.nombre || '',
                    descripcion: data.descripcion || ''
                });
            } catch (error) {
                console.error(error);
                alert('Error al cargar la categoría');
            }
        };
        cargarCategoria();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await actualizarCategoria(id, form);
            alert('Categoría actualizada correctamente');
            navigate('/categorias/lista');
        } catch (error) {
            console.error(error);
            alert('Error al actualizar la categoría');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Editar Categoría</h2>
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
                    <label className="form-label">Descripción</label>
                    <textarea
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <button type="submit" className="btn btn-primary me-2">Guardar Cambios</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/categorias/lista')}>Cancelar</button>
            </form>
        </div>
    );
}
