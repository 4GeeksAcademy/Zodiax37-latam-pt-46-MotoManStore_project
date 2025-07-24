import React, { useState } from 'react';
import { crearProveedor } from '../api/proveedores';
import { useNavigate } from 'react-router-dom';

const RegistrarProveedorPage = () => {
    const [form, setForm] = useState({
        nombre: '',
        contacto: '',
        plataforma: '',
        email: '',
        direccion: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await crearProveedor(form);
            alert('Proveedor registrado correctamente');
            setForm({
                nombre: '',
                contacto: '',
                plataforma: '',
                email: '',
                direccion: '',
            });
        } catch (error) {
            console.error(error);
            alert('Error al registrar proveedor');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Registrar Proveedor</h2>
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
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">Registrar</button>
                <button
                    type="button"
                    className="btn btn-outline-secondary mt-3"
                    onClick={() => navigate('/proveedores/lista')}
                >
                    Ver Proveedores
                </button>
            </form>
        </div>
    );
};

export default RegistrarProveedorPage;
