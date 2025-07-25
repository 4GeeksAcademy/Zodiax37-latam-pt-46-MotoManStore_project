import { useEffect, useState } from 'react';
import ProductoCard from '../components/ProductoCard';
import { obtenerProductos } from '../api/productos';
import { useNavigate } from 'react-router-dom';

export default function CatalogoProductos() {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [criterioBusqueda, setCriterioBusqueda] = useState('Nombre'); // 'Nombre' o 'Categoria'
    const [filtrados, setFiltrados] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        obtenerProductos()
            .then(data => {
                setProductos(data);
                setFiltrados(data); // Mostrar todo inicialmente
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        const texto = busqueda.toLowerCase();

        const resultado = productos.filter(p => {
            if (criterioBusqueda === 'Nombre') {
                return p.nombre?.toLowerCase().includes(texto); // corregido
            } else if (criterioBusqueda === 'Categoria') {
                return p.categoria?.nombre?.toLowerCase().includes(texto); // corregido
            }
            return true;
        });

        setFiltrados(resultado);
    }, [busqueda, criterioBusqueda, productos]);

    return (
        <div className="container-fluid mt-4">
            <h2 className="mb-4">Catálogo de Productos</h2>

            <div className="row mb-4">
                <div className="col-md-8 mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder={`Buscar por ${criterioBusqueda.toLowerCase()}...`}
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={criterioBusqueda}
                        onChange={(e) => setCriterioBusqueda(e.target.value)}
                    >
                        <option value="Nombre">Nombre</option>
                        <option value="Categoria">Categoría</option>
                    </select>
                </div>
            </div>

            <div className="row">
                {filtrados.length > 0 ? (
                    filtrados.map((producto) => (
                        <div className="col-md-4 mb-4" key={producto.id}>
                            <ProductoCard producto={producto} />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-muted">No se encontraron productos.</p>
                )}
            </div>

            <div className="d-flex justify-content-center">
                <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => navigate('/preventa')}
                >
                    Ir a Carrito/Preventa
                </button>
            </div>
        </div>
    );
}
