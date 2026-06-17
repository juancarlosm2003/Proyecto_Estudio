import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const obtenerUsuarioRegistrado = () => {
    try {
      return JSON.parse(localStorage.getItem('usuarioRegistrado')) || null;
    } catch {
      return null;
    }
  };

  const limpiarError = () => {
    if (error) {
      setError('');
    }
  };

  const iniciarSesion = (e) => {
    e.preventDefault();

    const correoIngresado = correo.trim().toLowerCase();
    const contrasenaIngresada = contrasena;

    if (correoIngresado === '' || contrasenaIngresada === '') {
      setError('Debes ingresar correo y contraseña.');
      return;
    }

    const usuarioRegistrado = obtenerUsuarioRegistrado();

    if (!usuarioRegistrado) {
      setError('No hay una cuenta registrada. Primero debes crear una cuenta.');
      return;
    }

    const correoRegistrado = usuarioRegistrado.correo.trim().toLowerCase();

    if (
      correoIngresado !== correoRegistrado ||
      contrasenaIngresada !== usuarioRegistrado.contrasena
    ) {
      setError('Correo o contraseña incorrectos.');
      return;
    }

    const sesionUsuario = {
      correo: usuarioRegistrado.correo,
      nombre: usuarioRegistrado.nombre || 'Estudiante',
      fechaInicio: new Date().toISOString()
    };

    localStorage.setItem('usuario', JSON.stringify(sesionUsuario));

    setError('');
    navigate('/dashboard', { replace: true });
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
              <strong>📝 Quizzes</strong>
              <span>Practica tus conocimientos.</span>
            </div>

            <div>
              <strong>🎁 Recompensas</strong>
              <span>Canjea monedas por ayudas.</span>
            </div>

            <div>
              <strong>📈 Progreso</strong>
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

            <button type="submit" className="login-button">
              Entrar al sistema
            </button>
          </form>

          <p className="register">
            ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;