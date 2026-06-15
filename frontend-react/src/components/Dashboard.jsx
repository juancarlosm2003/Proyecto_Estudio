import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function Dashboard() {
  const [xp, setXp] = useState(1200);
  const [monedas, setMonedas] = useState(350);

  useEffect(() => {
    const xpGuardado = Number(localStorage.getItem('xp')) || 1200;
    const monedasGuardadas = Number(localStorage.getItem('monedas')) || 350;

    setXp(xpGuardado);
    setMonedas(monedasGuardadas);
  }, []);

  const xpPorNivel = 500;
  const nivel = Math.floor(xp / xpPorNivel) + 1;
  const progresoNivel = xp % xpPorNivel;
  const porcentajeProgreso = Math.round((progresoNivel / xpPorNivel) * 100);
  const xpRestante = xpPorNivel - progresoNivel;

  const progresoStyle = {
    width: porcentajeProgreso + '%',
  };

  const stats = [
    {
      titulo: 'Experiencia',
      valor: xp + ' XP',
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
      titulo: 'Racha',
      valor: '7 días',
      descripcion: 'Estudio constante',
      icono: '🔥',
    },
    {
      titulo: 'Nivel',
      valor: nivel,
      descripcion: 'Nivel actual',
      icono: '🏆',
    },
  ];

  const actividades = [
    {
      titulo: 'Quiz',
      descripcion: 'Responde preguntas y gana XP según tu resultado.',
      icono: '📝',
      ruta: '/quiz',
    },
    {
      titulo: 'Sesión de estudio',
      descripcion: 'Completa una sesión guiada para mantener tu racha.',
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
      descripcion: 'Consulta tus insignias, actividades y rendimiento.',
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
            <h1>Hola, estudiante 👋</h1>
            <p>
              Continúa aprendiendo, completa actividades y desbloquea recompensas.
            </p>
          </div>

          <Link to="/quiz" className="primary-action">
            Iniciar actividad
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
              <p>Te faltan {xpRestante} XP para subir al siguiente nivel.</p>
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
      </main>
    </div>
  );
}

export default Dashboard;