import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function Progreso() {
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
      titulo: 'Racha',
      valor: '7 días',
      descripcion: 'Estudio constante',
      icono: '🔥',
    },
  ];

  const insignias = [
    {
      nombre: 'Constancia',
      descripcion: '7 días seguidos estudiando.',
      icono: '🏅',
    },
    {
      nombre: 'Quiz Experto',
      descripcion: '5 quizzes completados.',
      icono: '⭐',
    },
    {
      nombre: 'Reto Rápido',
      descripcion: 'Primer reto completado.',
      icono: '🔥',
    },
  ];

  const historial = [
    {
      actividad: 'Quiz completado',
      recompensa: '+100 XP / +25 monedas',
      icono: '📝',
    },
    {
      actividad: 'Sesión de estudio',
      recompensa: '+100 XP / +30 monedas',
      icono: '📚',
    },
    {
      actividad: 'Recompensa canjeada',
      recompensa: '-50 monedas',
      icono: '🎁',
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
            <p>Consulta tu rendimiento, recompensas e insignias obtenidas.</p>
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
              <p>
                Te faltan {xpRestante} XP para subir al nivel {nivel + 1}.
              </p>
            </div>

            <strong>{porcentajeProgreso}%</strong>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={progresoStyle}></div>
          </div>
        </section>

        <section className="badges-section">
          <div className="section-title">
            <div>
              <h2>Insignias obtenidas</h2>
              <p>Reconocimientos ganados por tu desempeño académico.</p>
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
              <h2>Historial de actividades</h2>
              <p>Resumen de actividades realizadas recientemente.</p>
            </div>
          </div>

          <div className="history-list">
            {historial.map((item) => (
              <div className="history-item" key={item.actividad}>
                <div>
                  <span className="history-icon">{item.icono}</span>
                  <span>{item.actividad}</span>
                </div>

                <strong>{item.recompensa}</strong>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Progreso;