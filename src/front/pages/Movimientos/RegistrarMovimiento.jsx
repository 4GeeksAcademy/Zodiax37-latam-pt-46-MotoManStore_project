import React, { useEffect, useState } from "react";
import { RegistrarMovimiento } from "../../api/existencias";
import { obtenerProductos } from "../../api/productos";

const RegistrarMovimientoPage = () => {
    const [form, setForm] = useState({
        producto_id: "",
        tipo_movimiento: "Entrada",
        cantidad: "",
        comentario: "",
        usuario_id: localStorage.getItem("userId"),
    });

    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const data = await obtenerProductos();
                setProductos(data);
            } catch (error) {
                console.error("Error al cargar productos", error);
            }
        };
        cargarProductos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "cantidad" ? Number(value) : value,
        }));
    };

    const handleSelectProducto = (producto) => {
        setForm((prev) => ({ ...prev, producto_id: producto.id || producto.Id }));
        setProductoSeleccionado(producto);
        setBusqueda("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.producto_id) {
            alert("Por favor, selecciona un producto.");
            return;
        }
        if (!form.cantidad || form.cantidad <= 0) {
            alert("Ingresa una cantidad válida mayor que cero.");
            return;
        }

        try {
            const res = await RegistrarMovimiento(form);

            if (res.notificacion) {
                alert(`Movimiento registrado.\n⚠️ Alerta de stock bajo:\n${res.notificacion}`);
            } else {
                alert("Movimiento registrado correctamente.");
            }

            setForm({
                producto_id: "",
                tipo_movimiento: "Entrada",
                cantidad: "",
                comentario: "",
                usuario_id: localStorage.getItem("userId"),
            });
            setProductoSeleccionado(null);
        } catch (error) {
            alert("Error al registrar el movimiento");
            console.error(error);
        }
    };

    const productosFiltrados = productos.filter((p) =>
        (p.nombre || p.Nombre).toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="container mt-5">
            <h3 className="mb-4">Registrar Movimiento</h3>
            <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
                <div className="mb-3 position-relative">
                    <label className="form-label">Buscar Producto</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Escribe el nombre del producto..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    {busqueda && (
                        <ul
                            className="list-group position-absolute w-100 z-3 mt-1"
                            style={{ maxHeight: "200px", overflowY: "auto" }}
                        >
                            {productosFiltrados.length > 0 ? (
                                productosFiltrados.map((p) => (
                                    <li
                                        key={p.id || p.Id}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => handleSelectProducto(p)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {(p.nombre || p.Nombre)} —{" "}
                                        <small className="text-muted">
                                            {p.categoria ? p.categoria.nombre : ""}
                                        </small>
                                    </li>
                                ))
                            ) : (
                                <li className="list-group-item text-muted">No se encontró</li>
                            )}
                        </ul>
                    )}
                </div>

                {productoSeleccionado && (
                    <div className="mb-3">
                        <strong>Producto seleccionado:</strong>{" "}
                        <span className="badge bg-primary">
                            {productoSeleccionado.nombre || productoSeleccionado.Nombre}
                        </span>
                        <input type="hidden" name="producto_id" value={form.producto_id} />
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label">Tipo de Movimiento</label>
                    <select
                        name="tipo_movimiento"
                        value={form.tipo_movimiento}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="Entrada">Entrada</option>
                        <option value="Salida">Salida</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Cantidad</label>
                    <div className="input-group">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    cantidad: Math.max(0, (prev.cantidad || 0) - 1),
                                }))
                            }
                        >
                            -
                        </button>
                        <input
                            type="number"
                            name="cantidad"
                            value={form.cantidad}
                            onChange={handleChange}
                            className="form-control text-center"
                            min="0"
                            required
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    cantidad: (prev.cantidad || 0) + 1,
                                }))
                            }
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Comentario</label>
                    <textarea
                        name="comentario"
                        value={form.comentario}
                        onChange={handleChange}
                        className="form-control"
                        rows={2}
                    />
                </div>

                <button type="submit" className="btn btn-success w-100">
                    Registrar Movimiento
                </button>
            </form>
        </div>
    );
};

export default RegistrarMovimientoPage;
