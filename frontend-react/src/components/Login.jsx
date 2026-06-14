import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const iniciarSesion = (e) => {
    e.preventDefault();

    if (correo.trim() === '' || contrasena.trim() === '') {
      setError('Debes ingresar correo y contraseña.');
      return;
    }

    setError('');
    navigate('/dashboard');
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
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="estudiante@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />

            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-button">
              Entrar al sistema
            </button>
          </form>

          <p className="register">
            ¿No tienes cuenta? <a href="#">Crear cuenta</a>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;