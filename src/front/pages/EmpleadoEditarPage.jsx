import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerEmpleados_Personas, actualizarEmpleado } from '../api/empleados';
import { actualizarPersona } from '../api/persona'; // ← Importa esto
import EmpleadoForm from '../components/EmpleadoForm';

export default function EmpleadoEditarPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [empleado, setEmpleado] = useState(null);
    const [loading, setLoading] = useState(true);

    const cargarEmpleado = async () => {
        try {
            const data = await obtenerEmpleados_Personas(id);
            setEmpleado({
                Cedula: data.cedula,
                FechaNacimiento: data.fecha_nac,
                Edad: data.edad,
                Correo: data.correo,
                Direccion: data.direccion,
                PrimerNombre: data.primer_nombre,
                SegundoNombre: data.segundo_nombre,
                PrimerApellido: data.primer_apellido,
                SegundoApellido: data.segundo_apellido,
                Telefono: data.telefono,
                AreaDeTrabajo: data.area_de_trabajo,
                Cargo: data.cargo,
                FechaIngreso: data.fecha_ingreso,
                PersonaId: data.persona_id,
            });
        } catch (error) {
            console.error('Error al obtener empleado:', error);
            alert('No se pudo cargar el empleado');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarEmpleado();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmpleado((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            // 1. Actualizar persona
            await actualizarPersona(empleado.PersonaId, {
                cedula: empleado.Cedula,
                correo: empleado.Correo,
                direccion: empleado.Direccion,
                edad: empleado.Edad,
                fecha_nac: empleado.FechaNacimiento,
                primer_nombre: empleado.PrimerNombre,
                segundo_nombre: empleado.SegundoNombre,
                primer_apellido: empleado.PrimerApellido,
                segundo_apellido: empleado.SegundoApellido,
                telefono: empleado.Telefono,
            });

            // 2. Actualizar empleado
            await actualizarEmpleado(id, {
                area_de_trabajo: empleado.AreaDeTrabajo,
                cargo: empleado.Cargo,
                fecha_ingreso: empleado.FechaIngreso,
                persona_id: empleado.PersonaId,
            });

            alert('✅ Empleado actualizado correctamente');
            navigate('/empleados/Lista');
        } catch (error) {
            console.error('Error al actualizar:', error);
            alert('❌ Error al actualizar empleado');
        }
    };

    if (loading) return <p>Cargando empleado...</p>;
    if (!empleado) return <p>Empleado no encontrado</p>;

    return (
        <div className="container mt-4">
            <h2>Editar Empleado</h2>
            <EmpleadoForm
                empleado={empleado}
                onChange={handleChange}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
}
