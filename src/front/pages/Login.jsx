import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './Login.css';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [intentos, setIntentos] = useState(0);
  const [error, setError] = useState('');
  const [bloqueado, setBloqueado] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay bloqueo guardado en localStorage
    const bloqueo = localStorage.getItem('bloqueoLogin');
    if (bloqueo) {
      const tiempoExpiracion = parseInt(bloqueo, 10);
      const ahora = Date.now();
      if (ahora < tiempoExpiracion) {
        setBloqueado(true);
        setTiempoRestante(Math.floor((tiempoExpiracion - ahora) / 1000));
      } else {
        localStorage.removeItem('bloqueoLogin');
        setIntentos(0);
        setBloqueado(false);
      }
    }
  }, []);

  useEffect(() => {
    let timer;
    if (bloqueado && tiempoRestante > 0) {
      timer = setInterval(() => {
        setTiempoRestante((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setBloqueado(false);
            setIntentos(0);
            localStorage.removeItem('bloqueoLogin');
            setError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [bloqueado, tiempoRestante]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (bloqueado) return; // evita envío si está bloqueado

    try {
      const res = await API.post('/login', {
        userName: username,
        pass: password
      });

      const { token } = res.data;
      const payload = JSON.parse(atob(token.split('.')[1]));

      console.log("Token recibido:", token);
      console.log("Payload:", payload);

      localStorage.removeItem('token');//temp

      localStorage.setItem('token', token);
      localStorage.setItem('logueado', 'true');
      localStorage.setItem('rol', payload.rol);
      localStorage.setItem('username', payload.username);
      localStorage.setItem('userId', payload.id);

      setIntentos(0);
      setError('');
      onLogin();
      navigate('/', { replace: true });
    } catch (err) {
      const nuevosIntentos = intentos + 1;
      setIntentos(nuevosIntentos);

      if (nuevosIntentos >= 3) {
        const tiempoDesbloqueo = Date.now() + 5 * 60 * 1000; // 5 minutos bloqueo
        // localStorage.setItem('bloqueoLogin', tiempoDesbloqueo.toString());
        // setBloqueado(true);
        setTiempoRestante(5 * 60);
        setError('Demasiados intentos fallidos. Intenta de nuevo en 5 minutos.');
      } else if (err.response?.status === 403) {
        setError('Usuario bloqueado temporalmente');
      } else if (err.response?.status === 401) {
        setError('Usuario o contraseña incorrecta');
      } else {
        setError('Error al iniciar sesión');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="left-panel">
          <h2>MotoMan</h2>
          <p>Gestión moderna de inventario y ventas</p>
        </div>

        <div className="right-panel">
          <div className="d-flex justify-content-center mb-2">
            <h4 className="h2">Iniciar sesión</h4>
          </div>
          <form className="gap-3" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Usuario"
              className="form-control border border-dark mb-4"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={bloqueado}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="form-control border border-dark mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={bloqueado}
              required
            />
            {error && <small className="text-danger">{error}</small>}
            {bloqueado && (
              <div className="text-warning mt-2">
                Espera {Math.floor(tiempoRestante / 60)}:{('0' + (tiempoRestante % 60)).slice(-2)} minutos para reintentar.
              </div>
            )}
            <button
              type="submit"
              className="btn btn-primary w-100 mt-2"
              disabled={bloqueado}
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
