import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../services/api';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);

  const limpiarError = () => {
    if (error) {
      setError('');
    }
  };

  const iniciarSesion = async (e) => {
    e.preventDefault();

    const correoIngresado = correo.trim().toLowerCase();
    const contrasenaIngresada = contrasena;

    if (correoIngresado === '' || contrasenaIngresada === '') {
      setError('Debes ingresar correo y contraseña.');
      return;
    }

    try {
      setCargando(true);
      setError('');

      const respuesta = await fetch(`${API_URL}/api/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: correoIngresado,
          contrasena: contrasenaIngresada,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(datos.mensaje || 'No se pudo iniciar sesión.');
        return;
      }

      const usuarioBackend = datos.usuario;

      const sesionUsuario = {
        id: usuarioBackend.id,
        correo: usuarioBackend.correo,
        nombre: usuarioBackend.nombre || 'Estudiante',
        xp: usuarioBackend.xp || 0,
        monedas: usuarioBackend.monedas || 0,
        nivel: usuarioBackend.nivel || 1,
        fechaInicio: new Date().toISOString(),
      };

      login(sesionUsuario);

      setCorreo('');
      setContrasena('');
      setError('');

      navigate('/dashboard', { replace: true });
    } catch (error) {
      setError('No se pudo conectar con el servidor. Revisa que el backend esté encendido.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <section className="login-info">
          <span className="app-badge">Plataforma educativa</span>

          <h1>StudyQuest</h1>

          <p>
            Aprende de forma interactiva, completa actividades académicas,
            gana experiencia, monedas e insignias por tu progreso.
          </p>

          <div className="login-features">
            <div>
              <strong>Quizzes</strong>
              <span>Practica tus conocimientos.</span>
            </div>

            <div>
              <strong>Recompensas</strong>
              <span>Canjea monedas por ayudas.</span>
            </div>

            <div>
              <strong>Progreso</strong>
              <span>Visualiza tu avance académico.</span>
            </div>
          </div>
        </section>

        <section className="login-card modern-login-card">
          <h2>Iniciar sesión</h2>
          <p>Accede a tu panel de estudiante</p>

          <form onSubmit={iniciarSesion}>
            <label htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              type="email"
              placeholder="estudiante@correo.com"
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                limpiarError();
              }}
              autoComplete="email"
              required
            />

            <label htmlFor="contrasena">Contraseña</label>

            <div className="password-container">
              <input
                id="contrasena"
                type={mostrarContrasena ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña"
                value={contrasena}
                onChange={(e) => {
                  setContrasena(e.target.value);
                  limpiarError();
                }}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="show-password-button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
              >
                {mostrarContrasena ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="login-button" disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Entrar al sistema'}
            </button>
          </form>

          <p className="register">
            <Link to="/olvide-contrasena">¿Olvidaste tu contraseña?</Link>
          </p>

          <p className="register">
            ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;