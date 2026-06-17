import { useEffect, useState } from 'react';
import Navbar from './Navbar';

function Logros() {
  const [xp, setXp] = useState(1200);
  const [monedas, setMonedas] = useState(350);
  const [historialSesiones, setHistorialSesiones] = useState([]);
  const [historialQuizzes, setHistorialQuizzes] = useState([]);
  const [inventario, setInventario] = useState([]);

  useEffect(() => {
    const xpGuardado = Number(localStorage.getItem('xp')) || 1200;
    const monedasGuardadas = Number(localStorage.getItem('monedas')) || 350;

    const sesionesGuardadas =
      JSON.parse(localStorage.getItem('historialSesiones')) || [];

    const quizzesGuardados =
      JSON.parse(localStorage.getItem('historialQuizzes')) || [];

    const inventarioGuardado =
      JSON.parse(localStorage.getItem('inventarioRecompensas')) || [];

    setXp(xpGuardado);
    setMonedas(monedasGuardadas);
    setHistorialSesiones(sesionesGuardadas);
    setHistorialQuizzes(quizzesGuardados);
    setInventario(inventarioGuardado);
  }, []);

  const xpPorNivel = 500;
  const nivel = Math.floor(xp / xpPorNivel) + 1;

  const totalActividades = historialSesiones.length + historialQuizzes.length;

  const aciertosTotales = historialQuizzes.reduce(
    (total, quiz) => total + quiz.aciertos,
    0
  );

  const preguntasTotales = historialQuizzes.reduce(
    (total, quiz) => total + quiz.preguntas,
    0
  );

  const porcentajeAciertos =
    preguntasTotales > 0
      ? Math.round((aciertosTotales / preguntasTotales) * 100)
      : 0;

  const clasesEstudiadas = [
    ...new Set([
      ...historialSesiones.map((item) => item.clase),
      ...historialQuizzes.map((item) => item.clase),
    ]),
  ];

  const calcularProgreso = (actual, meta) => {
    const progreso = Math.round((actual / meta) * 100);
    return progreso > 100 ? 100 : progreso;
  };

  const logros = [
    {
      nombre: 'Primer paso',
      descripcion: 'Completa tu primera sesión de estudio.',
      icono: '',
      actual: historialSesiones.length,
      meta: 1,
      desbloqueado: historialSesiones.length >= 1,
    },
    {
      nombre: 'Primer quiz',
      descripcion: 'Completa tu primer quiz de práctica.',
      icono: '',
      actual: historialQuizzes.length,
      meta: 1,
      desbloqueado: historialQuizzes.length >= 1,
    },
    {
      nombre: 'Aprendiz activo',
      descripcion: 'Completa 3 actividades entre sesiones y quizzes.',
      icono: '',
      actual: totalActividades,
      meta: 3,
      desbloqueado: totalActividades >= 3,
    },
    {
      nombre: 'Modo enfoque',
      descripcion: 'Completa 5 sesiones de estudio.',
      icono: '',
      actual: historialSesiones.length,
      meta: 5,
      desbloqueado: historialSesiones.length >= 5,
    },
    {
      nombre: 'Evaluador constante',
      descripcion: 'Completa 3 quizzes.',
      icono: '',
      actual: historialQuizzes.length,
      meta: 3,
      desbloqueado: historialQuizzes.length >= 3,
    },
    {
      nombre: 'Explorador académico',
      descripcion: 'Estudia al menos 3 clases diferentes.',
      icono: '',
      actual: clasesEstudiadas.length,
      meta: 3,
      desbloqueado: clasesEstudiadas.length >= 3,
    },
    {
      nombre: 'Buena precisión',
      descripcion: 'Alcanza 80% o más de aciertos en quizzes.',
      icono: '',
      actual: porcentajeAciertos,
      meta: 80,
      desbloqueado: porcentajeAciertos >= 80 && preguntasTotales > 0,
    },
    {
      nombre: 'Coleccionista',
      descripcion: 'Ten 3 recompensas en tu inventario.',
      icono: '',
      actual: inventario.length,
      meta: 3,
      desbloqueado: inventario.length >= 3,
    },
    {
      nombre: 'Nivel avanzado',
      descripcion: 'Alcanza el nivel 5.',
      icono: '',
      actual: nivel,
      meta: 5,
      desbloqueado: nivel >= 5,
    },
  ];

  const logrosDesbloqueados = logros.filter((logro) => logro.desbloqueado);
  const porcentajeLogros = Math.round(
    (logrosDesbloqueados.length / logros.length) * 100
  );

  return (
    <div className="page">
      <Navbar />

      <main className="main-content">
        <section className="achievements-header">
          <div>
            <span className="eyebrow">Gamificación</span>
            <h1>Logros e insignias</h1>
            <p>
              Desbloquea reconocimientos según tus sesiones, quizzes, nivel y
              rendimiento académico.
            </p>
          </div>

          <div className="achievements-resume">
            <span>Logros desbloqueados</span>
            <strong>
              {logrosDesbloqueados.length}/{logros.length}
            </strong>
          </div>
        </section>

        <section className="progress-section">
          <div className="section-title">
            <div>
              <h2>Progreso de logros</h2>
              <p>Has desbloqueado el {porcentajeLogros}% de los logros.</p>
            </div>

            <strong>{porcentajeLogros}%</strong>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: porcentajeLogros + '%' }}
            ></div>
          </div>
        </section>

        <section className="achievements-grid">
          {logros.map((logro) => {
            const progreso = calcularProgreso(logro.actual, logro.meta);

            return (
              <article
                className={
                  logro.desbloqueado
                    ? 'achievement-card unlocked'
                    : 'achievement-card locked'
                }
                key={logro.nombre}
              >
                <div className="achievement-top">
                  <div className="achievement-icon">
                    {logro.desbloqueado ? logro.icono : '🔒'}
                  </div>

                  <span>
                    {logro.desbloqueado ? 'Desbloqueado' : 'Bloqueado'}
                  </span>
                </div>

                <h3>{logro.nombre}</h3>
                <p>{logro.descripcion}</p>

                <div className="achievement-progress-info">
                  <span>
                    Progreso: {logro.actual}/{logro.meta}
                  </span>

                  <strong>{progreso}%</strong>
                </div>

                <div className="progress-bar small-progress">
                  <div
                    className="progress-fill"
                    style={{ width: progreso + '%' }}
                  ></div>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}

export default Logros;