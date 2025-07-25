import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearEmpleadoCompleto } from '../api/empleados';
import EmpleadoForm from '../components/EmpleadoForm';

function obtenerFechaNacimientoDesdeCedula(cedula) {
    const match = cedula.match(/^\d{3}-(\d{2})(\d{2})(\d{2})-\d{4}[A-Z]$/i);
    if (!match) return null;
    const [, dia, mes, anio] = match;
    const anioCorto = parseInt(anio, 10);
    const anioCompleto = anioCorto > 30 ? 1900 + anioCorto : 2000 + anioCorto;
    return new Date(`${anioCompleto}-${mes}-${dia}`);
}

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const m = hoy.getMonth() - fechaNacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }
    return edad;
}

export default function EmpleadoCrearPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [empleado, setEmpleado] = useState({
        Cedula: '',
        FechaNacimiento: '',
        Edad: '',
        Correo: '',
        Direccion: '',
        PrimerNombre: '',
        SegundoNombre: '',
        PrimerApellido: '',
        SegundoApellido: '',
        Telefono: '',
        AreaDeTrabajo: '',
        Cargo: '',
        FechaIngreso: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const nuevoEmpleado = { ...empleado, [name]: value };

        if (name === 'Cedula') {
            const fecha = obtenerFechaNacimientoDesdeCedula(value);
            if (fecha) {
                nuevoEmpleado.FechaNacimiento = fecha.toISOString().split('T')[0];
                nuevoEmpleado.Edad = calcularEdad(fecha);
            } else {
                nuevoEmpleado.FechaNacimiento = '';
                nuevoEmpleado.Edad = '';
            }
        }

        setEmpleado(nuevoEmpleado);
    };

    const handleCrear = async () => {
        setLoading(true);
        try {
            const fechaNacimiento = obtenerFechaNacimientoDesdeCedula(empleado.Cedula);
            if (!fechaNacimiento) {
                alert('❌ Cédula inválida. Formato esperado: XXX-DDMMAA-XXXXA');
                return;
            }

            const payload = {
                cedula: empleado.Cedula,
                fecha_nac: fechaNacimiento.toISOString().split('T')[0],
                edad: calcularEdad(fechaNacimiento),
                correo: empleado.Correo,
                direccion: empleado.Direccion,
                primer_nombre: empleado.PrimerNombre,
                segundo_nombre: empleado.SegundoNombre,
                primer_apellido: empleado.PrimerApellido,
                segundo_apellido: empleado.SegundoApellido,
                telefono: empleado.Telefono,
                area_de_trabajo: empleado.AreaDeTrabajo,
                cargo: empleado.Cargo,
                fecha_ingreso: empleado.FechaIngreso,
            };

            await crearEmpleadoCompleto(payload);

            alert('✅ Empleado creado correctamente');
            navigate('/empleados');
        } catch (error) {
            console.error('Error al crear empleado:', error);
            alert('❌ Error al crear empleado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid mt-4">
            <h2>Crear Empleado</h2>
            <EmpleadoForm
                empleado={empleado}
                onChange={handleChange}
                onSubmit={handleCrear}
                loading={loading}
            />
        </div>
    );
}
