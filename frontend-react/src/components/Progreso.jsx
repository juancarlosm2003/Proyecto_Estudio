import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import contenidosEstudio from '../data/contenidosEstudio';

function Progreso() {
  const [xp, setXp] = useState(1200);
  const [monedas, setMonedas] = useState(350);
  const [historialSesiones, setHistorialSesiones] = useState([]);
  const [historialQuizzes, setHistorialQuizzes] = useState([]);

  useEffect(() => {
    const xpGuardado = Number(localStorage.getItem('xp')) || 1200;
    const monedasGuardadas = Number(localStorage.getItem('monedas')) || 350;

    const sesionesGuardadas =
      JSON.parse(localStorage.getItem('historialSesiones')) || [];

    const quizzesGuardados =
      JSON.parse(localStorage.getItem('historialQuizzes')) || [];

    setXp(xpGuardado);
    setMonedas(monedasGuardadas);
    setHistorialSesiones(sesionesGuardadas);
    setHistorialQuizzes(quizzesGuardados);
  }, []);

  const xpPorNivel = 500;
  const nivel = Math.floor(xp / xpPorNivel) + 1;
  const progresoNivel = xp % xpPorNivel;
  const porcentajeProgreso = Math.round((progresoNivel / xpPorNivel) * 100);
  const xpRestante = xpPorNivel - progresoNivel;

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
      (total, item) => total + item.xp,
      0
    );

    const xpQuizzes = quizzesClase.reduce(
      (total, item) => total + item.xp,
      0
    );

    const monedasSesiones = sesionesClase.reduce(
      (total, item) => total + item.monedas,
      0
    );

    const monedasQuizzes = quizzesClase.reduce(
      (total, item) => total + item.monedas,
      0
    );

    const aciertos = quizzesClase.reduce(
      (total, item) => total + item.aciertos,
      0
    );

    const preguntas = quizzesClase.reduce(
      (total, item) => total + item.preguntas,
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
      icono: '🏆',
    },
    {
      titulo: 'Experiencia total',
      valor: xp + ' XP',
      descripcion: 'Acumulada por actividades',
      icono: '⚡',
    },
    {
      titulo: 'Monedas',
      valor: monedas,
      descripcion: 'Disponibles para canjear',
      icono: '🪙',
    },
    {
      titulo: 'Actividades',
      valor: totalActividades,
      descripcion: 'Sesiones y quizzes completados',
      icono: '📚',
    },
  ];

  const insignias = [
    {
      nombre: 'Modo enfoque',
      descripcion:
        historialSesiones.length > 0
          ? 'Has completado al menos una sesión de estudio.'
          : 'Completa una sesión para desbloquearla.',
      icono: historialSesiones.length > 0 ? '🔥' : '🔒',
    },
    {
      nombre: 'Quiz inicial',
      descripcion:
        historialQuizzes.length > 0
          ? 'Has completado al menos un quiz.'
          : 'Completa un quiz para desbloquearla.',
      icono: historialQuizzes.length > 0 ? '⭐' : '🔒',
    },
    {
      nombre: 'Aprendiz activo',
      descripcion:
        totalActividades >= 3
          ? 'Has completado 3 o más actividades.'
          : 'Completa 3 actividades para desbloquearla.',
      icono: totalActividades >= 3 ? '🏅' : '🔒',
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
                  <span className="history-icon">📭</span>
                  <span>No hay sesiones completadas todavía.</span>
                </div>

                <strong>Sin datos</strong>
              </div>
            ) : (
              historialSesiones.map((item, index) => (
                <div className="history-item" key={index}>
                  <div>
                    <span className="history-icon">📚</span>
                    <span>
                      {item.clase} - {item.tema}
                    </span>
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
                  <span className="history-icon">📭</span>
                  <span>No hay quizzes completados todavía.</span>
                </div>

                <strong>Sin datos</strong>
              </div>
            ) : (
              historialQuizzes.map((item, index) => (
                <div className="history-item" key={index}>
                  <div>
                    <span className="history-icon">📝</span>
                    <span>
                      {item.clase} - {item.aciertos}/{item.preguntas} correctas
                    </span>
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