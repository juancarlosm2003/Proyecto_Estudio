import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function Dashboard() {
  const [xp, setXp] = useState(1200);
  const [monedas, setMonedas] = useState(350);
  const [nombreUsuario, setNombreUsuario] = useState('estudiante');
  const [historialSesiones, setHistorialSesiones] = useState([]);
  const [historialQuizzes, setHistorialQuizzes] = useState([]);

  useEffect(() => {
    const xpGuardado = Number(localStorage.getItem('xp')) || 1200;
    const monedasGuardadas = Number(localStorage.getItem('monedas')) || 350;

    const usuarioRegistrado =
      JSON.parse(localStorage.getItem('usuarioRegistrado')) || null;

    const sesionesGuardadas =
      JSON.parse(localStorage.getItem('historialSesiones')) || [];

    const quizzesGuardados =
      JSON.parse(localStorage.getItem('historialQuizzes')) || [];

    setXp(xpGuardado);
    setMonedas(monedasGuardadas);
    setHistorialSesiones(sesionesGuardadas);
    setHistorialQuizzes(quizzesGuardados);

    if (usuarioRegistrado && usuarioRegistrado.nombre) {
      setNombreUsuario(usuarioRegistrado.nombre);
    }
  }, []);

  const xpPorNivel = 500;
  const nivel = Math.floor(xp / xpPorNivel) + 1;
  const progresoNivel = xp % xpPorNivel;
  const porcentajeProgreso = Math.round((progresoNivel / xpPorNivel) * 100);
  const xpRestante = xpPorNivel - progresoNivel;

  const progresoStyle = {
    width: porcentajeProgreso + '%',
  };

  const actividadesRecientes = [
    ...historialSesiones.map((item) => ({
      tipo: 'Sesión de estudio',
      descripcion: `${item.clase} - ${item.tema}`,
      recompensa: `+${item.xp} XP / +${item.monedas} monedas`,
      icono: '📚',
      fecha: item.fecha,
    })),
    ...historialQuizzes.map((item) => ({
      tipo: 'Quiz completado',
      descripcion: `${item.clase} - ${item.aciertos}/${item.preguntas} correctas`,
      recompensa: `+${item.xp} XP / +${item.monedas} monedas`,
      icono: '📝',
      fecha: item.fecha,
    })),
  ].slice(0, 4);

  const stats = [
    {
      titulo: 'Experiencia',
      valor: `${xp} XP`,
      descripcion: 'Progreso acumulado',
      icono: '⚡',
    },
    {
      titulo: 'Monedas',
      valor: monedas,
      descripcion: 'Disponibles para recompensas',
      icono: '🪙',
    },
    {
      titulo: 'Nivel',
      valor: nivel,
      descripcion: 'Nivel actual',
      icono: '🏆',
    },
    {
      titulo: 'Actividades',
      valor: historialSesiones.length + historialQuizzes.length,
      descripcion: 'Sesiones y quizzes',
      icono: '📚',
    },
  ];

  const actividades = [
    {
      titulo: 'Quiz',
      descripcion: 'Evalúa tus conocimientos por clase y gana recompensas.',
      icono: '📝',
      ruta: '/quiz',
    },
    {
      titulo: 'Sesión de estudio',
      descripcion: 'Estudia conceptos, ejemplos y responde mini preguntas.',
      icono: '📚',
      ruta: '/sesion-estudio',
    },
    {
      titulo: 'Recompensas',
      descripcion: 'Canjea tus monedas por pistas, reintentos y ayudas.',
      icono: '🎁',
      ruta: '/recompensas',
    },
    {
      titulo: 'Progreso',
      descripcion: 'Consulta tu historial, insignias y rendimiento.',
      icono: '📈',
      ruta: '/progreso',
    },
  ];

  return (
    <div className="page">
      <Navbar />

      <main className="main-content">
        <section className="hero-card">
          <div>
            <span className="eyebrow">Panel principal</span>
            <h1>Hola, {nombreUsuario} 👋</h1>
            <p>
              Continúa aprendiendo, completa actividades y desbloquea recompensas.
            </p>
          </div>

          <Link to="/sesion-estudio" className="primary-action">
            Iniciar estudio
          </Link>
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
              <p>Te faltan {xpRestante} XP para subir al nivel {nivel + 1}.</p>
            </div>

            <strong>{porcentajeProgreso}%</strong>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={progresoStyle}></div>
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
            {actividades.map((actividad) => (
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
          </div>

          <div className="history-list">
            {actividadesRecientes.length === 0 ? (
              <div className="history-item">
                <div>
                  <span className="history-icon">📭</span>
                  <span>Aún no tienes actividad registrada.</span>
                </div>

                <strong>Empieza una lección</strong>
              </div>
            ) : (
              actividadesRecientes.map((item, index) => (
                <div className="history-item" key={index}>
                  <div>
                    <span className="history-icon">{item.icono}</span>
                    <span>
                      {item.tipo}: {item.descripcion}
                    </span>
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