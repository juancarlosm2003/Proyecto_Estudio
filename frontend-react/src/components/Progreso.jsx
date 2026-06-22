import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import contenidosEstudio from '../data/contenidosEstudio';
import API_URL from '../services/api';
import { useAuth } from '../context/AuthContext';

function Progreso() {
  const { usuario, actualizarUsuario } = useAuth();
  const [xp, setXp] = useState(0);
  const [monedas, setMonedas] = useState(0);
  const [historialSesiones, setHistorialSesiones] = useState([]);
  const [historialQuizzes, setHistorialQuizzes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorServidor, setErrorServidor] = useState('');

  useEffect(() => {
    const cargarProgreso = async () => {
      const usuarioId = usuario?.id;

      if (!usuarioId) {
        setErrorServidor('No se encontró el usuario activo. Inicia sesión nuevamente.');
        setCargando(false);
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

  const formatearFecha = (fecha) => {
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
  };

  const xpPorNivel = 500;
  const nivel = Math.floor(xp / xpPorNivel) + 1;
  const progresoNivel = xp % xpPorNivel;
  const porcentajeProgreso = Math.round((progresoNivel / xpPorNivel) * 100);
  const xpRestante = progresoNivel === 0 ? xpPorNivel : xpPorNivel - progresoNivel;

  const progresoStyle = {
    width: porcentajeProgreso + '%',
  };

  const totalActividades = historialSesiones.length + historialQuizzes.length;

  const progresoPorClase = contenidosEstudio.map((clase) => {
    const sesionesClase = historialSesiones.filter(
      (item) => item.clase === clase.clase
    );

    const quizzesClase = historialQuizzes.filter(
      (item) => item.clase === clase.clase
    );

    const xpSesiones = sesionesClase.reduce(
      (total, item) => total + (item.xp || 0),
      0
    );

    const xpQuizzes = quizzesClase.reduce(
      (total, item) => total + (item.xp || 0),
      0
    );

    const monedasSesiones = sesionesClase.reduce(
      (total, item) => total + (item.monedas || 0),
      0
    );

    const monedasQuizzes = quizzesClase.reduce(
      (total, item) => total + (item.monedas || 0),
      0
    );

    const aciertos = quizzesClase.reduce(
      (total, item) => total + (item.aciertos || 0),
      0
    );

    const preguntas = quizzesClase.reduce(
      (total, item) => total + (item.preguntas || 0),
      0
    );

    const porcentaje =
      preguntas > 0 ? Math.round((aciertos / preguntas) * 100) : 0;

    return {
      clase: clase.clase,
      icono: clase.icono,
      sesiones: sesionesClase.length,
      quizzes: quizzesClase.length,
      xp: xpSesiones + xpQuizzes,
      monedas: monedasSesiones + monedasQuizzes,
      aciertos,
      preguntas,
      porcentaje,
    };
  });

  const resumen = [
    {
      titulo: 'Nivel actual',
      valor: nivel,
      descripcion: 'Nivel del estudiante',
      icono: 'NV',
    },
    {
      titulo: 'Experiencia total',
      valor: xp + ' XP',
      descripcion: 'Acumulada por actividades',
      icono: 'XP',
    },
    {
      titulo: 'Monedas',
      valor: monedas,
      descripcion: 'Disponibles para canjear',
      icono: 'MN',
    },
    {
      titulo: 'Actividades',
      valor: totalActividades,
      descripcion: 'Sesiones y quizzes completados',
      icono: 'AC',
    },
  ];

  const insignias = [
    {
      nombre: 'Modo enfoque',
      descripcion:
        historialSesiones.length > 0
          ? 'Has completado al menos una sesión de estudio.'
          : 'Completa una sesión para desbloquearla.',
      icono: historialSesiones.length > 0 ? 'OK' : 'BL',
    },
    {
      nombre: 'Quiz inicial',
      descripcion:
        historialQuizzes.length > 0
          ? 'Has completado al menos un quiz.'
          : 'Completa un quiz para desbloquearla.',
      icono: historialQuizzes.length > 0 ? 'OK' : 'BL',
    },
    {
      nombre: 'Aprendiz activo',
      descripcion:
        totalActividades >= 3
          ? 'Has completado 3 o más actividades.'
          : 'Completa 3 actividades para desbloquearla.',
      icono: totalActividades >= 3 ? 'OK' : 'BL',
    },
  ];

  return (
    <div className="page">
      <Navbar />

      <main className="main-content">
        <section className="progress-header">
          <div>
            <span className="eyebrow">Rendimiento académico</span>
            <h1>Progreso del estudiante</h1>
            <p>Consulta tu rendimiento, recompensas e historial de estudio.</p>

            {cargando && <p>Cargando progreso...</p>}

            {errorServidor && (
              <div className="login-error" role="alert">
                {errorServidor}
              </div>
            )}
          </div>

          <Link to="/dashboard" className="secondary-action">
            Volver al dashboard
          </Link>
        </section>

        <section className="progress-summary-grid">
          {resumen.map((item) => (
            <article className="stat-card" key={item.titulo}>
              <div className="stat-icon">{item.icono}</div>
              <span>{item.titulo}</span>
              <h2>{item.valor}</h2>
              <p>{item.descripcion}</p>
            </article>
          ))}
        </section>

        <section className="progress-section">
          <div className="section-title">
            <div>
              <h2>Avance al siguiente nivel</h2>
              <p>Te faltan {xpRestante} XP para subir al nivel {nivel + 1}.</p>
            </div>

            <strong>{porcentajeProgreso}%</strong>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={progresoStyle}></div>
          </div>
        </section>

        <section className="class-progress-section">
          <div className="section-title">
            <div>
              <h2>Progreso por clase</h2>
              <p>Resumen de sesiones, quizzes y rendimiento por asignatura.</p>
            </div>
          </div>

          <div className="class-progress-grid">
            {progresoPorClase.map((item) => (
              <article className="class-progress-card" key={item.clase}>
                <div className="class-progress-header">
                  <h3>
                    {item.icono} {item.clase}
                  </h3>

                  <span>{item.porcentaje}%</span>
                </div>

                <div className="progress-bar small-progress">
                  <div
                    className="progress-fill"
                    style={{ width: item.porcentaje + '%' }}
                  ></div>
                </div>

                <div className="class-progress-stats">
                  <div>
                    <span>Sesiones</span>
                    <strong>{item.sesiones}</strong>
                  </div>

                  <div>
                    <span>Quizzes</span>
                    <strong>{item.quizzes}</strong>
                  </div>

                  <div>
                    <span>Aciertos</span>
                    <strong>
                      {item.aciertos}/{item.preguntas}
                    </strong>
                  </div>

                  <div>
                    <span>XP</span>
                    <strong>{item.xp}</strong>
                  </div>

                  <div>
                    <span>Monedas</span>
                    <strong>{item.monedas}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="badges-section">
          <div className="section-title">
            <div>
              <h2>Insignias</h2>
              <p>Reconocimientos desbloqueados según tu actividad.</p>
            </div>
          </div>

          <div className="badges-grid">
            {insignias.map((insignia) => (
              <article className="badge-card" key={insignia.nombre}>
                <div className="badge-icon">{insignia.icono}</div>
                <h3>{insignia.nombre}</h3>
                <p>{insignia.descripcion}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="history-section">
          <div className="section-title">
            <div>
              <h2>Historial de sesiones</h2>
              <p>Lecciones completadas recientemente.</p>
            </div>
          </div>

          <div className="history-list">
            {historialSesiones.length === 0 ? (
              <div className="history-item">
                <div>
                  <span className="history-icon">SN</span>
                  <span>No hay sesiones completadas todavía.</span>
                </div>

                <strong>Sin datos</strong>
              </div>
            ) : (
              historialSesiones.map((item) => (
                <div className="history-item" key={item.id}>
                  <div>
                    <span className="history-icon">SE</span>
                    <span>
                      {item.clase} - {item.tema}
                    </span>
                    <small>{formatearFecha(item.fecha)}</small>
                  </div>

                  <strong>
                    +{item.xp} XP / +{item.monedas} monedas
                  </strong>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="history-section">
          <div className="section-title">
            <div>
              <h2>Historial de quizzes</h2>
              <p>Evaluaciones realizadas por clase.</p>
            </div>
          </div>

          <div className="history-list">
            {historialQuizzes.length === 0 ? (
              <div className="history-item">
                <div>
                  <span className="history-icon">SN</span>
                  <span>No hay quizzes completados todavía.</span>
                </div>

                <strong>Sin datos</strong>
              </div>
            ) : (
              historialQuizzes.map((item) => (
                <div className="history-item" key={item.id}>
                  <div>
                    <span className="history-icon">QZ</span>
                    <span>
                      {item.clase} - {item.aciertos}/{item.preguntas} correctas
                    </span>
                    <small>{formatearFecha(item.fecha)}</small>
                  </div>

                  <strong>
                    +{item.xp} XP / +{item.monedas} monedas
                  </strong>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Progreso;