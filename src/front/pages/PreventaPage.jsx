import { useEffect, useState } from 'react';
import { obtenerProductosDePreventa, confirmarVenta, quitarProductoPreventa } from '../api/preventas';

export default function PreventaPage() {
    const [productos, setProductos] = useState([]);
    const [preventaId, setPreventaId] = useState(localStorage.getItem('preventaId'));
    const [metodoPago, setMetodoPago] = useState('');
    const [descuento, setDescuento] = useState(0);
    const [tipoFactura, setTipoFactura] = useState('');
    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!preventaId) return;
        const fetchData = async () => {
            try {
                const data = await obtenerProductosDePreventa(preventaId);
                setProductos(data);
            } catch (err) {
                alert('Error al cargar la preventa');
                console.error(err);
            }
        };
        fetchData();
    }, [preventaId]);

    const subtotal = productos.reduce((acc, p) => acc + (p.subtotal || 0), 0);
const totalFinal = subtotal - (parseFloat(descuento) || 0);


    const handleQuitarProducto = async (productoId) => {
        if (!window.confirm('¿Quitar este producto de la preventa?')) return;
        try {
            await quitarProductoPreventa({ preventaId, productoId });
            setProductos(productos.filter(p => p.producto_id !== productoId));

        } catch (err) {
            alert('Error al quitar producto');
            console.error(err);
        }
    };

    const handleConfirmarVenta = async () => {
        if (!metodoPago || !tipoFactura) {
            alert('Completa todos los campos para confirmar la venta');
            return;
        }
        setLoading(true);
        try {
            const res = await confirmarVenta({
                PreventaId: parseInt(preventaId),
                UsuarioId: parseInt(userId),
                MetodoPago: metodoPago,
                Descuento: parseFloat(descuento),
                TipoFactura: tipoFactura
            });

            if (res.notificaciones?.length > 0) {
                const mensajes = res.notificaciones.map(n => `⚠️ ${n}`).join('\n');

                alert(`Venta confirmada.\n\nNotificaciones:\n${mensajes}`);
            } else {
                alert('Venta confirmada exitosamente');
            }
            localStorage.removeItem('preventaId');
            setProductos([]);
        } catch (err) {
            alert(err.response?.data?.error || 'Error al confirmar venta');

            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!preventaId) return <p>No hay preventa activa.</p>;

    return (
        <div className="container mt-4">
            <h2>Carrito / Preventa</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(p => (
                        <tr key={p.preventa_detalle_id}>
                            <td>{p.nombre}</td>
                            <td>{p.cantidad}</td>
                            <td>${p.precio_venta.toFixed(2)}</td>
                            <td>${p.subtotal.toFixed(2)}</td>

                            <td>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleQuitarProducto(p.producto_id)}
                                >
                                    Quitar
                                </button>
                            </td>
                        </tr>
                    ))}
                    {productos.length === 0 && (
                        <tr>
                            <td colSpan="5" className="text-center">No hay productos en la preventa</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="mb-3">
                <strong>Subtotal:</strong> ${subtotal.toFixed(2)} <br />
                <strong>Descuento:</strong>{' '}
                <input
                    type="number"
                    min="0"
                    max={subtotal}
                    step="0.01"
                    value={descuento}
                    onChange={e => setDescuento(Number(e.target.value))}
                    className="form-control w-auto d-inline-block"
                    style={{ width: '100px' }}
                />
                <br />
                <strong>Total a pagar:</strong> ${totalFinal.toFixed(2)}
            </div>

            <div className="mb-3">
                <label>Método de pago:</label>
                <select
                    className="form-control"
                    value={metodoPago}
                    onChange={e => setMetodoPago(e.target.value)}
                >
                    <option value="">-- Selecciona un método de pago --</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia bancaria">Transferencia bancaria</option>
                </select>
            </div>

            <div className="mb-3">
                <label>Tipo de factura:</label>
                <select
                    className="form-control"
                    value={tipoFactura}
                    onChange={e => setTipoFactura(e.target.value)}
                >
                    <option value="">-- Selecciona tipo de factura --</option>
                    <option value="Digital">Digital</option>
                    <option value="Papel">Papel</option>
                </select>
            </div>

            <button
                className="btn btn-success"
                disabled={productos.length === 0 || loading}
                onClick={handleConfirmarVenta}
            >
                {loading ? 'Procesando...' : 'Confirmar Venta'}
            </button>
        </div>
    );
}
