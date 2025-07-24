import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerProducto, actualizarProducto } from '../api/productos';
import { obtenerCategorias } from '../api/categorias';
import { obtenerProveedores } from '../api/proveedores';

export default function EditarProductoPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    costo: '',
    precio_venta: '',
    imagen_url: '',
    estado: true,
    categoria_id: '',
    proveedor_id: '',
    existencia: {
      cantidad_actual: 0,
      umbral_minimo: 0
    }
  });

  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const data = await obtenerProducto(id);
        // Mapear datos para el form, extraer IDs y existencia
        setForm({
          nombre: data.nombre || '',
          descripcion: data.descripcion || '',
          costo: data.costo || '',
          precio_venta: data.precio_venta || '',
          imagen_url: data.imagen_url || '',
          estado: data.estado ?? true,
          categoria_id: data.categoria?.id || '',
          proveedor_id: data.proveedor?.id || '',
          existencia: {
            cantidad_actual: data.existencia?.cantidad_actual || 0,
            umbral_minimo: data.existencia?.umbral_minimo || 0
          }
        });
      } catch (error) {
        console.error(error);
        alert('Error al cargar el producto');
      }
    };

    const cargarListas = async () => {
      try {
        const [cats, provs] = await Promise.all([
          obtenerCategorias(),
          obtenerProveedores()
        ]);
        setCategorias(cats);
        setProveedores(provs);
      } catch (error) {
        console.error(error);
        alert('Error al cargar categorías o proveedores');
      }
    };

    cargarProducto();
    cargarListas();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Para existencia.umbral_minimo y existencia.cantidad_actual (si agregas inputs para estos)
    if (name === 'umbral_minimo' || name === 'cantidad_actual') {
      setForm(prev => ({
        ...prev,
        existencia: {
          ...prev.existencia,
          [name]: type === 'number' ? Number(value) : value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Preparar objeto para enviar al backend
      const dataEnviar = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        costo: Number(form.costo),
        precio_venta: Number(form.precio_venta),
        imagen_url: form.imagen_url,
        categoria_id: form.categoria_id,
        proveedor_id: form.proveedor_id,
        // Si tienes que actualizar existencia, deberías hacer aparte o extender backend
      };
      await actualizarProducto(id, dataEnviar);
      alert('Producto actualizado');
      navigate('/productos/catalogo');
    } catch (err) {
      console.error(err);
      alert('Error al actualizar el producto');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Editar Producto</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Precio Venta</label>
          <input
            name="precio_venta"
            type="number"
            value={form.precio_venta}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Costo</label>
          <input
            name="costo"
            type="number"
            value={form.costo}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Umbral Mínimo</label>
          <input
            name="umbral_minimo"
            type="number"
            value={form.existencia.umbral_minimo}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Categoría</label>
          <select
            name="categoria_id"
            value={form.categoria_id}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccione...</option>
            {categorias.map((cat) => (
              <option key={cat.id ?? cat.Id} value={cat.id ?? cat.Id}>
                {cat.nombre ?? cat.Nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Proveedor</label>
          <select
            name="proveedor_id"
            value={form.proveedor_id}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccione...</option>
            {proveedores.map((prov) => (
              <option key={prov.id ?? prov.Id} value={prov.id ?? prov.Id}>
                {prov.nombre ?? prov.Nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <label className="form-label">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">URL Imagen</label>
          <input
            name="imagen_url"
            value={form.imagen_url}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6 d-flex align-items-center">
          {form.imagen_url && (
            <img
              src={form.imagen_url}
              alt="Vista previa"
              className="img-thumbnail"
              style={{ maxWidth: '120px', maxHeight: '120px' }}
            />
          )}
        </div>

        <div className="col-md-6 d-flex align-items-center">
          <div className="form-check mt-4">
            <input
              type="checkbox"
              name="estado"
              checked={form.estado}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, estado: e.target.checked }))
              }
              className="form-check-input"
              id="estadoCheck"
            />
            <label className="form-check-label" htmlFor="estadoCheck">
              Activo
            </label>
          </div>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
