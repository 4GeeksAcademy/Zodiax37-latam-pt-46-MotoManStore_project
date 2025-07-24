import { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/ProductoCard.css';

import {
    crearPreventa,
    agregarProductoPreventa,
} from '../api/preventas';

import { eliminarProducto } from '../api/productos';

export default function ProductoCard({ producto }) {
    const [cantidad, setCantidad] = useState(1);

    const rol = localStorage.getItem('rol');
    const userId = parseInt(localStorage.getItem('userId'), 10);

    const stock = producto.existencia?.cantidad_actual ?? 0;
    const umbral = producto.existencia?.umbral_minimo ?? 5;
    const esBajoMinimo = stock <= umbral;

    const handleDarDeBaja = async () => {
        if (!window.confirm('¿Estás seguro de dar de baja este producto?')) return;
        try {
            await eliminarProducto(producto.id);
            alert('Producto dado de baja');
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Error al dar de baja');
        }
    };

    const handleAgregarPreventa = async () => {
        try {
            let preventaId = localStorage.getItem('preventaId');

            if (!preventaId) {
                const res = await crearPreventa(userId);
                console.log(res.preventa_id)
                preventaId = res.preventa_id; // ⚠️ asegúrate que esto sea `preventa_id` como en el backend
                localStorage.setItem('preventaId', preventaId);
            }



            console.log("Agregando preventa:", {
                preventa_id: parseInt(preventaId),
                producto_id: producto.id,
                cantidad: parseInt(cantidad),
            });
            
            await agregarProductoPreventa({
                preventaId: parseInt(preventaId),
                productoId: producto.id,
                cantidad: parseInt(cantidad),
            });


            alert('Producto añadido a preventa');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Error al añadir a preventa');
        }
    };


    return (
        <div className="card shadow-sm h-100 border-0">
            <img
                src={producto.imagen_url || 'https://placehold.co/300x200?text=Sin+Imagen'}
                className="card-img-top"
                alt={producto.nombre}
                style={{ height: '200px', objectFit: 'contain' }}
            />
            <div className="card-body">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text text-muted">{producto.descripcion?.slice(0, 80)}...</p>

                {!producto.estado && (
                    <span className="badge bg-danger">No disponible</span>
                )}

                <ul className="list-unstyled small">
                    <li><strong>Precio:</strong> ${parseFloat(producto.precio_venta).toFixed(2)}</li>
                    <li><strong>Costo:</strong> ${parseFloat(producto.costo).toFixed(2)}</li>
                    <li><strong>Categoría:</strong> {producto.categoria?.nombre || 'Sin categoría'}</li>
                    <li>
                        <strong>Stock:</strong>{' '}
                        <span className={esBajoMinimo ? 'text-danger fw-bold' : 'text-success'}>
                            {stock}
                        </span>
                    </li>
                </ul>

                {(rol === 'admin' || rol === 'inventario') && (
                    <div className="d-flex justify-content-between mt-3 flex-wrap gap-2">
                        <Link to={`/productos/editar-producto/${producto.id}`} className="btn btn-outline-primary btn-sm">
                            Editar
                        </Link>
                        <button className="btn btn-outline-danger btn-sm" onClick={handleDarDeBaja}>
                            Dar de baja
                        </button>
                    </div>
                )}

                {(rol === 'admin' || rol === 'ventas') && (
                    <div className="mt-3 d-flex align-items-center gap-2">
                        <input
                            type="number"
                            min={1}
                            max={stock}
                            className="form-control form-control-sm"
                            style={{ width: '70px' }}
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                            disabled={!producto.estado}
                        />
                        <button
                            className="btn btn-sm btn-success"
                            onClick={handleAgregarPreventa}
                            disabled={
                                cantidad <= 0 ||
                                cantidad > stock ||
                                !producto.estado
                            }
                        >
                            <i className="bi bi-cart-plus me-1" />
                            Añadir
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
