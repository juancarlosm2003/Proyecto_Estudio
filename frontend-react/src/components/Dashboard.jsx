import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import API_URL from '../services/api';
import Tutorial from './Tutorial';
import { useAuth } from '../context/AuthContext';

const XP_POR_NIVEL = 500;

const ACTIVIDADES_DISPONIBLES = [
  {
    titulo: 'Quiz',
    icono: 'QZ',
    descripcion: 'Evalúa tus conocimientos por clase y gana recompensas.',
    ruta: '/quiz',
  },
  {
    titulo: 'Sesión de estudio',
    icono: 'SE',
    descripcion: 'Estudia conceptos, ejemplos y responde mini preguntas.',
    ruta: '/sesion-estudio',
  },
  {
    titulo: 'Recompensas',
    icono: 'RC',
    descripcion: 'Canjea tus monedas por pistas, reintentos y ayudas.',
    ruta: '/recompensas',
  },
  {
    titulo: 'Progreso',
    icono: 'PG',
    descripcion: 'Consulta tu historial, insignias y rendimiento.',
    ruta: '/progreso',
  },
];

function obtenerJSONLocalStorage(clave, valorInicial) {
  try {
    const valor = localStorage.getItem(clave);
    return valor ? JSON.parse(valor) : valorInicial;
  } catch {
    return valorInicial;
  }
}

function formatearFecha(fecha) {
  if (!fecha) return 'Sin fecha';

  const fechaConvertida = new Date(fecha);

  if (Number.isNaN(fechaConvertida.getTime())) {
    return fecha;
  }

  return new Intl.DateTimeFormat('es-HN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(fechaConvertida);
}

function Dashboard() {
  const { usuario, actualizarUsuario } = useAuth();
  const [xp, setXp] = useState(0);
  const [monedas, setMonedas] = useState(0);
  const [nombreUsuario, setNombreUsuario] = useState('estudiante');
  const [historialSesiones, setHistorialSesiones] = useState([]);
  const [historialQuizzes, setHistorialQuizzes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorServidor, setErrorServidor] = useState('');

  useEffect(() => {
    const usuarioId = usuario?.id;

    if (usuario) {
      setNombreUsuario(usuario.nombre || 'estudiante');
      setXp(usuario.xp || 0);
      setMonedas(usuario.monedas || 0);
    }

    const cargarProgreso = async () => {
      if (!usuarioId) {
        setCargando(false);
        setErrorServidor('No se encontró el usuario activo.');
        return;
      }

      try {
        setCargando(true);
        setErrorServidor('');

        const respuesta = await fetch(`${API_URL}/api/progreso/${usuarioId}`);
        const datos = await respuesta.json();

        if (!respuesta.ok) {
          setErrorServidor(datos.mensaje || 'No se pudo cargar el progreso.');
          return;
        }

        const usuarioBackend = datos.usuario;

        if (usuarioBackend) {
          setNombreUsuario(usuarioBackend.nombre || 'estudiante');
          setXp(usuarioBackend.xp || 0);
          setMonedas(usuarioBackend.monedas || 0);

          const sesionActualizada = {
            id: usuarioBackend.id,
            nombre: usuarioBackend.nombre || 'Estudiante',
            correo: usuarioBackend.correo,
            xp: usuarioBackend.xp || 0,
            monedas: usuarioBackend.monedas || 0,
            nivel: usuarioBackend.nivel || 1,
            fechaInicio: new Date().toISOString(),
          };

          actualizarUsuario(sesionActualizada);
        }

        const sesiones = datos.sesiones || [];
        const quizzes = datos.quizzes || [];

        setHistorialSesiones(sesiones);
        setHistorialQuizzes(quizzes);

        localStorage.setItem('historialSesiones', JSON.stringify(sesiones));
        localStorage.setItem('historialQuizzes', JSON.stringify(quizzes));
      } catch {
        setErrorServidor(
          'No se pudo conectar con el servidor. Revisa que el backend esté encendido.'
        );
      } finally {
        setCargando(false);
      }
    };

    cargarProgreso();
  }, [usuario?.id]);

  const nivel = useMemo(() => {
    return Math.floor(xp / XP_POR_NIVEL) + 1;
  }, [xp]);

  const progresoNivel = xp % XP_POR_NIVEL;

  const porcentajeProgreso = useMemo(() => {
    return Math.round((progresoNivel / XP_POR_NIVEL) * 100);
  }, [progresoNivel]);

  const xpRestante =
    progresoNivel === 0 ? XP_POR_NIVEL : XP_POR_NIVEL - progresoNivel;

  const totalActividades = historialSesiones.length + historialQuizzes.length;

  const stats = useMemo(
    () => [
      {
        titulo: 'Experiencia',
        icono: 'XP',
        valor: `${xp} XP`,
        descripcion: 'Progreso acumulado',
      },
      {
        titulo: 'Monedas',
        icono: 'MN',
        valor: monedas,
        descripcion: 'Disponibles para recompensas',
      },
      {
        titulo: 'Nivel',
        icono: 'NV',
        valor: nivel,
        descripcion: 'Nivel actual',
      },
      {
        titulo: 'Actividades',
        icono: 'AC',
        valor: totalActividades,
        descripcion: 'Sesiones y quizzes',
      },
    ],
    [xp, monedas, nivel, totalActividades]
  );

  const actividadesRecientes = useMemo(() => {
    const sesiones = historialSesiones.map((item) => ({
      id: item.id || `sesion-${item.fecha}`,
      icono: 'SE',
      tipo: 'Sesión de estudio',
      descripcion: `${item.clase || 'Sin clase'} - ${item.tema || 'Sin tema'}`,
      recompensa: `+${item.xp || 0} XP / +${item.monedas || 0} monedas`,
      fecha: item.fecha,
      timestamp: new Date(item.fecha).getTime() || 0,
    }));

    const quizzes = historialQuizzes.map((item) => ({
      id: item.id || `quiz-${item.fecha}`,
      icono: 'QZ',
      tipo: 'Quiz completado',
      descripcion: `${item.clase || 'Sin clase'} - ${item.aciertos || 0}/${item.preguntas || 0
        } correctas`,
      recompensa: `+${item.xp || 0} XP / +${item.monedas || 0} monedas`,
      fecha: item.fecha,
      timestamp: new Date(item.fecha).getTime() || 0,
    }));

    return [...sesiones, ...quizzes]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 4);
  }, [historialSesiones, historialQuizzes]);

  const necesitaTutorial = !cargando && usuario && Number(xp) === 0;

  return (
    <div className="page">
      <Navbar />

      {necesitaTutorial && (
        <Tutorial
          usuario={usuario}
          onCompletar={(usuarioActualizado) => {
            actualizarUsuario(usuarioActualizado);
            setNombreUsuario(usuarioActualizado.nombre || 'estudiante');
            setXp(usuarioActualizado.xp || 0);
            setMonedas(usuarioActualizado.monedas || 0);
          }}
        />
      )}

      <main className="main-content">
        <section className="hero-card">
          <div className="hero-info">
            <span className="eyebrow">Panel principal</span>

            <h1>Hola, {nombreUsuario}</h1>

            <p>
              Continúa aprendiendo, completa actividades y desbloquea nuevas
              recompensas.
            </p>

            {cargando && <p>Cargando progreso...</p>}

            {errorServidor && (
              <div className="login-error" role="alert">
                {errorServidor}
              </div>
            )}
          </div>

          <div className="hero-actions">
            <Link to="/sesion-estudio" className="primary-action">
              Iniciar estudio
            </Link>

            <Link to="/quiz" className="secondary-action">
              Hacer quiz
            </Link>
          </div>
        </section>

        <section className="stats-grid">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.titulo}>
              <div className="stat-icon">{stat.icono}</div>

              <span>{stat.titulo}</span>

              <h2>{stat.valor}</h2>

              <p>{stat.descripcion}</p>
            </article>
          ))}
        </section>

        <section className="progress-section">
          <div className="section-title">
            <div>
              <h2>Progreso del nivel</h2>

              <p>
                Te faltan {xpRestante} XP para subir al nivel {nivel + 1}.
              </p>
            </div>

            <strong>{porcentajeProgreso}%</strong>
          </div>

          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={porcentajeProgreso}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              className="progress-fill"
              style={{ width: `${porcentajeProgreso}%` }}
            ></div>
          </div>
        </section>

        <section className="activities-section">
          <div className="section-title">
            <div>
              <h2>Actividades disponibles</h2>

              <p>Selecciona una actividad para continuar con tu aprendizaje.</p>
            </div>
          </div>

          <div className="activities-grid">
            {ACTIVIDADES_DISPONIBLES.map((actividad) => (
              <Link
                to={actividad.ruta}
                className="activity-card"
                key={actividad.titulo}
              >
                <div className="activity-icon">{actividad.icono}</div>

                <h3>{actividad.titulo}</h3>

                <p>{actividad.descripcion}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="history-section">
          <div className="section-title">
            <div>
              <h2>Actividad reciente</h2>

              <p>Últimas sesiones y quizzes completados.</p>
            </div>

            <Link to="/progreso" className="text-action">
              Ver progreso
            </Link>
          </div>

          <div className="history-list">
            {actividadesRecientes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">INICIO</div>

                <h3>Aún no tienes actividad registrada</h3>

                <p>
                  Empieza una sesión de estudio o completa un quiz para ganar XP
                  y monedas.
                </p>

                <Link to="/sesion-estudio" className="primary-action empty-action">
                  Empezar ahora
                </Link>
              </div>
            ) : (
              actividadesRecientes.map((item) => (
                <div className="history-item" key={item.id}>
                  <div className="history-content">
                    <span className="history-icon">{item.icono}</span>

                    <div>
                      <span>
                        {item.tipo}: {item.descripcion}
                      </span>

                      <small>{formatearFecha(item.fecha)}</small>
                    </div>
                  </div>

                  <strong>{item.recompensa}</strong>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;