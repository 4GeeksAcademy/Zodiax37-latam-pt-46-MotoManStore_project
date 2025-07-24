import React, { useEffect, useState } from "react";
import { obtenerExistencias } from "../../api/existencias";

const ListaMovimientosInventario = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [filtrados, setFiltrados] = useState([]);

    const [busqueda, setBusqueda] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('Todos');

    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 10;

    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');




    useEffect(() => {
        const cargarMovimientos = async () => {
    try {
        const data = await obtenerExistencias();

        // Renombrar claves
        const transformados = data.map((m) => ({
            Id: m.id,
            NombreProducto: m.nombre_producto,
            Categoria: m.categoria || "Sin categoría",
            TipoMovimiento: m.tipo_movimiento,
            Cantidad: m.cantidad,
            Comentario: m.comentario,
            UsuarioId: m.usuario_id,
            FechaMovimiento: m.fecha_movimiento,
        }));

        setMovimientos(transformados);
        setFiltrados(transformados);
    } catch (error) {
        console.error("Error al cargar movimientos:", error);
    }
};

        cargarMovimientos();
    }, []);

    // En el useEffect que filtra:
    useEffect(() => {
        let resultado = movimientos;

        if (filtroTipo !== 'Todos') {
            resultado = resultado.filter(m => m.TipoMovimiento === filtroTipo);
        }

        if (busqueda.trim()) {
            resultado = resultado.filter(m =>
                m.NombreProducto.toLowerCase().includes(busqueda.toLowerCase()) ||
                m.Categoria.toLowerCase().includes(busqueda.toLowerCase())
            );
        }

        // Filtrar por fechas (solo si hay fechas seleccionadas)
        if (fechaDesde) {
            resultado = resultado.filter(m =>
                new Date(m.FechaMovimiento) >= new Date(`${fechaDesde}T00:00:00`)
            );
        }

        if (fechaHasta) {
            resultado = resultado.filter(m =>
                new Date(m.FechaMovimiento) <= new Date(`${fechaHasta}T23:59:59`)
            );
        }


        setFiltrados(resultado);
        setPaginaActual(1);
    }, [busqueda, filtroTipo, fechaDesde, fechaHasta, movimientos]);

    // Paginación
    const indexUltimo = paginaActual * elementosPorPagina;
    const indexPrimero = indexUltimo - elementosPorPagina;
    const movimientosPaginados = filtrados.slice(indexPrimero, indexUltimo);
    const totalPaginas = Math.ceil(filtrados.length / elementosPorPagina);

    const cambiarPagina = (nueva) => {
        if (nueva >= 1 && nueva <= totalPaginas) setPaginaActual(nueva);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Movimientos de Inventario</h2>

            {/* Búsqueda y filtro */}
            <div className="flex gap-4 mb-4">


                <input
                    type="date"
                    className="border border-gray-300 rounded px-3 py-2"
                    value={fechaDesde}
                    onChange={e => setFechaDesde(e.target.value)}
                    placeholder="Desde"
                />
                <input
                    type="date"
                    className="border border-gray-300 rounded px-3 py-2"
                    value={fechaHasta}
                    onChange={e => setFechaHasta(e.target.value)}
                    placeholder="Hasta"
                />
                <input
                    type="text"
                    className="border border-gray-300 rounded px-3 py-2"
                    placeholder="Buscar por producto o categoría"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                >
                    <option value="Todos">Todos</option>
                    <option value="Entrada">Entrada</option>
                    <option value="Salida">Salida</option>
                </select>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="w-full text-sm text-left border border-gray-300 bg-white rounded-lg">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 border">ID</th>
                            <th className="px-4 py-3 border">Producto</th>
                            <th className="px-4 py-3 border">Categoría</th>
                            <th className="px-4 py-3 border">Tipo</th>
                            <th className="px-4 py-3 border">Cantidad</th>
                            <th className="px-4 py-3 border">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movimientosPaginados.length > 0 ? (
                            movimientosPaginados.map((m, index) => (
                                <tr
                                    key={m.Id}
                                    className={`border-t text-gray-800 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                >
                                    <td className="px-4 py-2 border">{m.Id}</td>
                                    <td className="px-4 py-2 border">{m.NombreProducto}</td>
                                    <td className="px-4 py-2 border">{m.Categoria}</td>
                                    <td className={`px-4 py-2 border font-semibold ${m.TipoMovimiento === "Entrada" ? "text-green-600" : "text-red-600"}`}>
                                        {m.TipoMovimiento}
                                    </td>
                                    <td className="px-4 py-2 border">{m.Cantidad}</td>
                                    <td className="px-4 py-2 border">{new Date(m.FechaMovimiento).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    No hay movimientos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-center gap-2 mt-4">
                <button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="px-3 py-1 border rounded text-sm bg-gray-100"
                >
                    Anterior
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => (
                    <button
                        key={i + 1}
                        className={`px-3 py-1 border rounded text-sm ${paginaActual === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                        onClick={() => cambiarPagina(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="px-3 py-1 border rounded text-sm bg-gray-100"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default ListaMovimientosInventario;
