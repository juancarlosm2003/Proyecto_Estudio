import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import API_URL from '../services/api';
import { useAuth } from '../context/AuthContext';

function Perfil() {
  const navigate = useNavigate();
  const { usuario, actualizarUsuario, logout } = useAuth();
  const [nombre, setNombre] = useState('');
  const [xp, setXp] = useState(0);
  const [monedas, setMonedas] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [modoOscuro, setModoOscuro] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const usuarioId = usuario?.id;
    const temaGuardado = localStorage.getItem('tema');

    if (temaGuardado === 'oscuro') {
      setModoOscuro(true);
      document.body.classList.add('dark-mode');
    } else {
      setModoOscuro(false);
      document.body.classList.remove('dark-mode');
    }

    const cargarPerfil = async () => {
      if (!usuarioId) {
        setMensaje('No se encontró el usuario activo. Inicia sesión nuevamente.');
        setTipoMensaje('error');
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        setMensaje('');
        setTipoMensaje('');

        const respuesta = await fetch(`${API_URL}/api/usuarios/${usuarioId}/perfil`);
        const datos = await respuesta.json();

        if (!respuesta.ok) {
          setMensaje(datos.mensaje || 'No se pudo cargar el perfil.');
          setTipoMensaje('error');
          return;
        }

        const usuarioBackend = datos.usuario;

        setNombre(usuarioBackend.nombre || '');
        setXp(usuarioBackend.xp || 0);
        setMonedas(usuarioBackend.monedas || 0);

        const usuarioActualizado = {
          id: usuarioBackend.id,
          nombre: usuarioBackend.nombre || 'Estudiante',
          correo: usuarioBackend.correo,
          xp: usuarioBackend.xp || 0,
          monedas: usuarioBackend.monedas || 0,
          nivel: usuarioBackend.nivel || 1,
          fechaInicio: new Date().toISOString(),
        };

        actualizarUsuario(usuarioActualizado);
      } catch {
        setMensaje('No se pudo conectar con el servidor. Revisa que el backend esté encendido.');
        setTipoMensaje('error');
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, [usuario?.id]);

  const xpPorNivel = 500;
  const nivel = Math.floor(xp / xpPorNivel) + 1;

  const obtenerIniciales = () => {
    if (!nombre.trim()) return 'E';

    return nombre
      .trim()
      .split(' ')
      .map((palabra) => palabra[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const guardarCambios = async () => {
    const usuarioId = usuario?.id;

    if (nombre.trim() === '') {
      setMensaje('El nombre no puede estar vacío.');
      setTipoMensaje('error');
      return;
    }

    if (!usuarioId) {
      setMensaje('No se encontró el usuario activo. Inicia sesión nuevamente.');
      setTipoMensaje('error');
      return;
    }

    try {
      setGuardando(true);
      setMensaje('');
      setTipoMensaje('');

      const respuesta = await fetch(`${API_URL}/api/usuarios/${usuarioId}/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje || 'No se pudo actualizar el perfil.');
        setTipoMensaje('error');
        return;
      }

      const usuarioBackend = datos.usuario;

      setNombre(usuarioBackend.nombre || '');
      setXp(usuarioBackend.xp || 0);
      setMonedas(usuarioBackend.monedas || 0);

      const usuarioActualizado = {
        id: usuarioBackend.id,
        nombre: usuarioBackend.nombre || 'Estudiante',
        correo: usuarioBackend.correo,
        xp: usuarioBackend.xp || 0,
        monedas: usuarioBackend.monedas || 0,
        nivel: usuarioBackend.nivel || 1,
        fechaInicio: new Date().toISOString(),
      };

      actualizarUsuario(usuarioActualizado);

      setMensaje('Perfil actualizado correctamente.');
      setTipoMensaje('success');
    } catch {
      setMensaje('No se pudo conectar con el servidor. Revisa que el backend esté encendido.');
      setTipoMensaje('error');
    } finally {
      setGuardando(false);
    }
  };

  const cambiarTema = () => {
    const nuevoModo = !modoOscuro;

    setModoOscuro(nuevoModo);

    if (nuevoModo) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('tema', 'oscuro');
      setMensaje('Modo oscuro activado.');
      setTipoMensaje('success');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('tema', 'claro');
      setMensaje('Modo claro activado.');
      setTipoMensaje('success');
    }
  };

  const reiniciarProgreso = () => {
    setMensaje('Para reiniciar progreso en la versión con backend, conviene crear un endpoint específico.');
    setTipoMensaje('error');
  };

  const cerrarSesion = () => {
    logout();
    localStorage.removeItem('historialSesiones');
    localStorage.removeItem('historialQuizzes');
    localStorage.removeItem('inventarioRecompensas');
    navigate('/');
  };

  return (
    <div className="page">
      <Navbar />

      <main className="main-content">
        <section className="profile-header">
          <div>
            <span className="eyebrow">Cuenta del estudiante</span>
            <h1>Perfil y ajustes</h1>
            <p>
              Administra tu información, progreso y configuración de StudyQuest.
            </p>

            {cargando && <p>Cargando perfil...</p>}
          </div>
        </section>

        <section className="profile-grid">
          <div className="profile-card">
            <div className="profile-avatar">{obtenerIniciales()}</div>

            <h2>{usuario?.nombre || 'Estudiante'}</h2>
            <p>{usuario?.correo || 'Sin correo registrado'}</p>

            <div className="profile-stats">
              <div>
                <span>Nivel</span>
                <strong>{nivel}</strong>
              </div>

              <div>
                <span>XP</span>
                <strong>{xp}</strong>
              </div>

              <div>
                <span>Monedas</span>
                <strong>{monedas}</strong>
              </div>
            </div>
          </div>

          <div className="settings-card">
            <h2>Editar perfil</h2>
            <p>
              Actualiza el nombre que aparece en tu dashboard y menú lateral.
            </p>

            <label htmlFor="nombre">Nombre del estudiante</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setMensaje('');
                setTipoMensaje('');
              }}
            />

            {mensaje && (
              <div
                className={
                  tipoMensaje === 'error'
                    ? 'store-message result-box error'
                    : tipoMensaje === 'success'
                      ? 'store-message result-box success'
                      : 'store-message'
                }
              >
                {mensaje}
              </div>
            )}

            <div className="settings-actions">
              <button
                className="save-button"
                onClick={guardarCambios}
                disabled={guardando}
              >
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>

              <button className="theme-button" onClick={cambiarTema}>
                {modoOscuro
                  ? 'Cambiar a modo claro'
                  : 'Cambiar a modo oscuro'}
              </button>

              <button className="danger-button" onClick={reiniciarProgreso}>
                Reiniciar progreso
              </button>

              <button className="logout-profile-button" onClick={cerrarSesion}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Perfil;