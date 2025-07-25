import React, { useEffect, useState } from 'react';
import { crearProducto } from '../api/productos';
import { CrearExistencia } from '../api/existencias';
import { obtenerCategorias } from '../api/categorias';
import { obtenerProveedores } from '../api/proveedores';
import { useNavigate } from 'react-router-dom';

const RegistrarProductoPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    costo: '',
    precio_venta: '',
    imagen_url: '',
    categoria_id: '',
    proveedor_id: '',
    CantidadInicial: '',
    UmbralMinimo: ''
  });

  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cat = await obtenerCategorias();
        const prov = await obtenerProveedores();
        console.log(cat);
        console.log(prov);


        setCategorias(cat);
        setProveedores(prov);
      } catch (e) {
        console.error('Error cargando categorías/proveedores:', e);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await crearProducto(form); // 👈 asegúrate que devuelva { id: 123 }
      const productoId = res.id;

      const nuevaExistencia = {
        producto_id: productoId,
        cantidad_inicial: form.CantidadInicial,
        umbral_minimo: form.UmbralMinimo
      };

      await CrearExistencia(nuevaExistencia);


      alert('Producto registrado correctamente');
      navigate('/productos/catalogo');
    } catch (error) {
      console.error(error);
      alert('Error al registrar producto');
    }
  };

  return (
    <div className="container-fluid mt-4 m-">
      <h2 className="mb-4">Registrar Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Nombre */}
          <div className="col-md-4 mb-3">
            <label className="form-label">Nombre</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className="form-control" required />
          </div>

          {/* Costo */}
          <div className="col-md-2 mb-3">
            <label className="form-label">Costo</label>
            <input type="number" step="0.01" name="costo" value={form.costo} onChange={handleChange} className="form-control" required />
          </div>

          {/* Precio Venta */}
          <div className="col-md-2 mb-3">
            <label className="form-label">Precio Venta</label>
            <input type="number" step="0.01" name="precio_venta" value={form.precio_venta} onChange={handleChange} className="form-control" required />
          </div>

          {/* Descripción */}
          <div className="col-5 mb-3">
            <label className="form-label">Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="form-control" rows={2} />
          </div>



        
          {/* Categoría */}
          <div className="col-md-2 mb-3">
            <label className="form-label d-flex justify-content-between">
              <span>Categoría</span>
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => navigate('/categorias/registrar')}>
                + Añadir
              </button>
            </label>
            <select name="categoria_id" value={form.categoria_id} onChange={handleChange} className="form-select" required>
              <option value="">Selecciona una</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          {/* Proveedor */}
          <div className="col-md-2 mb-3">
            <label className="form-label d-flex justify-content-between">
              <span>Proveedor</span>
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => navigate('/proveedores/registrar')}>
                + Añadir
              </button>
            </label>
            <select name="proveedor_id" value={form.proveedor_id} onChange={handleChange} className="form-select" required>
              <option value="">Selecciona uno</option>
              {proveedores.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          {/* Imagen URL */}
          <div className="col-md-6 mb-3">
            <label className="form-label">URL de Imagen</label>
            <input type="text" name="imagen_url" value={form.imagen_url} onChange={handleChange} className="form-control" />
            {form.imagen_url && (
              <div className="mt-2">
                <img
                  src={form.imagen_url}
                  alt="Preview"
                  style={{ maxHeight: '150px', objectFit: 'contain' }}
                  className="img-fluid border rounded"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
            )}
          </div>


          {/* Cantidad Inicial */}
         
            <div className="col-md-2 mb-3">
              <label className="form-label">Cantidad Inicial</label>
              <input type="number" name="CantidadInicial" value={form.CantidadInicial} onChange={handleChange} className="form-control" required />
            </div>

            {/* Umbral Mínimo */}
            <div className="col-md-2 mb-3">
              <label className="form-label">Umbral Mínimo</label>
              <input type="number" name="UmbralMinimo" value={form.UmbralMinimo} onChange={handleChange} className="form-control" required />
            </div>
          



        </div>

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-success">Registrar Producto</button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarProductoPage;
