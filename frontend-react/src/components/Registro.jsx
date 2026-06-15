import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Registro() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');

  const registrarUsuario = (e) => {
    e.preventDefault();

    if (
      nombre.trim() === '' ||
      correo.trim() === '' ||
      contrasena.trim() === '' ||
      confirmarContrasena.trim() === ''
    ) {
      setError('Debes completar todos los campos.');
      return;
    }

    if (!correo.includes('@')) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    if (contrasena.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const usuario = {
      nombre,
      correo,
      contrasena,
    };

    localStorage.setItem('usuarioRegistrado', JSON.stringify(usuario));
    localStorage.setItem('usuario', correo);

    if (!localStorage.getItem('xp')) {
      localStorage.setItem('xp', 1200);
    }

    if (!localStorage.getItem('monedas')) {
      localStorage.setItem('monedas', 350);
    }

    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <section className="login-info">
          <span className="app-badge">Nuevo estudiante</span>

          <h1>StudyQuest</h1>

          <p>
            Crea tu cuenta para comenzar a estudiar, completar lecciones,
            ganar XP, monedas e insignias por tu progreso académico.
          </p>

          <div className="login-features">
            <div>
              <strong>📚 Lecciones guiadas</strong>
              <span>Aprende por clase y tema.</span>
            </div>

            <div>
              <strong>📝 Quizzes</strong>
              <span>Evalúa tus conocimientos.</span>
            </div>

            <div>
              <strong>🏆 Progreso</strong>
              <span>Visualiza tu avance académico.</span>
            </div>
          </div>
        </section>

        <section className="login-card modern-login-card">
          <h2>Crear cuenta</h2>
          <p>Registra tus datos para acceder a la plataforma</p>

          <form onSubmit={registrarUsuario}>
            <label htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              type="text"
              placeholder="Ej. Juan Carlos"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <label htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              type="email"
              placeholder="estudiante@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />

            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              placeholder="Crea una contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />

            <label htmlFor="confirmarContrasena">Confirmar contraseña</label>
            <input
              id="confirmarContrasena"
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
            />

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-button">
              Crear cuenta
            </button>
          </form>

          <p className="register">
            ¿Ya tienes cuenta? <Link to="/">Iniciar sesión</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Registro;