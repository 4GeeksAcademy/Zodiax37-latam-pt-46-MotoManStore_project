import React from 'react';

export default function EmpleadoForm({ empleado, onChange, onSubmit, loading }) {
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="row g-3">
            {/* Cédula */}
            <div className="col-md-4">
                <label className="form-label">Cédula</label>
                <input
                    type="text"
                    className="form-control"
                    name="Cedula"
                    value={empleado.Cedula || ''}
                    onChange={onChange}
                    required
                    placeholder="XXX-DDMMAA-XXXXA"
                />
            </div>

            {/* Correo */}
            <div className="col-md-3">
                <label className="form-label">Correo</label>
                <input
                    type="email"
                    className="form-control"
                    name="Correo"
                    value={empleado.Correo || ''}
                    onChange={onChange}
                    required
                />
            </div>

            {/* Dirección */}
            <div className="col-md-6">
                <label className="form-label">Dirección</label>
                <input
                    type="text"
                    className="form-control"
                    name="Direccion"
                    value={empleado.Direccion || ''}
                    onChange={onChange}
                />
            </div>

            <div className="row mt-3">

                <div className="col-md-2">
                    <label className="form-label">Edad</label>
                    <input
                        type="number"
                        className="form-control"
                        name="Edad"
                        value={empleado.Edad || ''}
                        readOnly
                        placeholder="Edad calculada"
                    />
                </div>

                {/* Fecha de nacimiento */}
                <div className="col-md-4">
                    <label className="form-label">Fecha de Nacimiento</label>
                    <input
                        type="date"
                        className="form-control"
                        name="FechaNacimiento"
                        value={empleado.FechaNacimiento ? empleado.FechaNacimiento.substring(0, 10) : ''}
                        readOnly
                    />
                </div>

            </div>
            {/* Edad */}

            <div className="row mt-3">

                {/* Nombres y apellidos */}
                <div className="col-md-3">
                    <label className="form-label">Primer Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        name="PrimerNombre"
                        value={empleado.PrimerNombre || ''}
                        onChange={onChange}
                        required
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label">Segundo Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        name="SegundoNombre"
                        value={empleado.SegundoNombre || ''}
                        onChange={onChange}
                    />
                </div>

            </div>


            <div className="row mt-3">


                <div className="col-md-3">
                    <label className="form-label">Primer Apellido</label>
                    <input
                        type="text"
                        className="form-control"
                        name="PrimerApellido"
                        value={empleado.PrimerApellido || ''}
                        onChange={onChange}
                        required
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label">Segundo Apellido</label>
                    <input
                        type="text"
                        className="form-control"
                        name="SegundoApellido"
                        value={empleado.SegundoApellido || ''}
                        onChange={onChange}
                    />
                </div>



                <div className="row mt-3">


                </div>
                {/* Teléfono */}
                <div className="col-md-3">
                    <label className="form-label">Teléfono</label>
                    <input
                        type="text"
                        className="form-control"
                        name="Telefono"
                        value={empleado.Telefono || ''}
                        onChange={onChange}
                    />
                </div>

                {/* Área y cargo */}
                <div className="col-md-3">
                    <label className="form-label">Área de Trabajo</label>
                    <input
                        type="text"
                        className="form-control"
                        name="AreaDeTrabajo"
                        value={empleado.AreaDeTrabajo || ''}
                        onChange={onChange}
                    />
                </div>


            </div>

            <div className="row mt-3">
                <div className="col-md-3">
                    <label className="form-label">Cargo</label>
                    <input
                        type="text"
                        className="form-control"
                        name="Cargo"
                        value={empleado.Cargo || ''}
                        onChange={onChange}
                    />
                </div>

                {/* Fecha de ingreso */}
                <div className="col-md-3">
                    <label className="form-label">Fecha de Ingreso</label>
                    <input
                        type="date"
                        className="form-control"
                        name="FechaIngreso"
                        value={empleado.FechaIngreso ? empleado.FechaIngreso.substring(0, 10) : ''}
                        onChange={onChange}
                    />
                </div>
            </div>


            {/* Botón guardar */}
            <div className="col-6 d-flex justify-content-center mt-4">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </form>
    );
}
