import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../services/api';

function Registro() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const limpiarError = () => {
    if (error) {
      setError('');
    }
  };

  const registrarUsuario = async (e) => {
    e.preventDefault();

    const nombreIngresado = nombre.trim();
    const correoIngresado = correo.trim().toLowerCase();
    const contrasenaIngresada = contrasena;
    const confirmarContrasenaIngresada = confirmarContrasena;

    if (
      nombreIngresado === '' ||
      correoIngresado === '' ||
      contrasenaIngresada === '' ||
      confirmarContrasenaIngresada === ''
    ) {
      setError('Debes completar todos los campos.');
      return;
    }

    if (!correoIngresado.includes('@')) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    if (contrasenaIngresada.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    if (contrasenaIngresada !== confirmarContrasenaIngresada) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setCargando(true);
      setError('');

      const respuesta = await fetch(`${API_URL}/api/usuarios/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombreIngresado,
          correo: correoIngresado,
          contrasena: contrasenaIngresada,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(datos.mensaje || 'No se pudo crear la cuenta.');
        return;
      }

      const usuarioBackend = datos.usuario;

      const sesionUsuario = {
        id: usuarioBackend.id,
        nombre: usuarioBackend.nombre || 'Estudiante',
        correo: usuarioBackend.correo,
        xp: usuarioBackend.xp || 0,
        monedas: usuarioBackend.monedas || 0,
        nivel: usuarioBackend.nivel || 1,
        fechaInicio: new Date().toISOString(),
      };

      localStorage.setItem('usuario', JSON.stringify(sesionUsuario));
      localStorage.setItem('usuarioId', usuarioBackend.id);

      setNombre('');
      setCorreo('');
      setContrasena('');
      setConfirmarContrasena('');
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
          <span className="app-badge">Nuevo estudiante</span>

          <h1>StudyQuest</h1>

          <p>
            Crea tu cuenta para comenzar a estudiar, completar lecciones,
            ganar XP, monedas e insignias por tu progreso académico.
          </p>

          <div className="login-features">
            <div>
              <strong>Lecciones guiadas</strong>
              <span>Aprende por clase y tema.</span>
            </div>

            <div>
              <strong>Quizzes</strong>
              <span>Evalúa tus conocimientos.</span>
            </div>

            <div>
              <strong>Progreso</strong>
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
              onChange={(e) => {
                setNombre(e.target.value);
                limpiarError();
              }}
              autoComplete="name"
              required
            />

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
            <input
              id="contrasena"
              type="password"
              placeholder="Crea una contraseña"
              value={contrasena}
              onChange={(e) => {
                setContrasena(e.target.value);
                limpiarError();
              }}
              autoComplete="new-password"
              required
            />

            <label htmlFor="confirmarContrasena">Confirmar contraseña</label>
            <input
              id="confirmarContrasena"
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmarContrasena}
              onChange={(e) => {
                setConfirmarContrasena(e.target.value);
                limpiarError();
              }}
              autoComplete="new-password"
              required
            />

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="login-button" disabled={cargando}>
              {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
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