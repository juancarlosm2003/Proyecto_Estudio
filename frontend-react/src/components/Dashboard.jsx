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

  return (
    <div className="page">
      <Navbar />

      <main className="main-content">
        <section className="welcome-section">
          <div>
            <h1>Hola, estudiante 👋</h1>
            <p>Continúa aprendiendo, completa actividades y gana recompensas.</p>
          </div>

          <Link to="/quiz">
            <button className="primary-action">Iniciar actividad</button>
          </Link>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Experiencia</span>
            <h2>{xp} XP</h2>
            <p>Progreso acumulado</p>
          </div>

          <div className="stat-card">
            <span>Monedas</span>
            <h2>{monedas}</h2>
            <p>Disponibles para recompensas</p>
          </div>

          <div className="stat-card">
            <span>Racha</span>
            <h2>7 días</h2>
            <p>Estudio constante</p>
          </div>

          <div className="stat-card">
            <span>Nivel</span>
            <h2>5</h2>
            <p>Estudiante avanzado</p>
          </div>
        </section>

        <section className="progress-section">
          <div className="section-title">
            <h2>Progreso del nivel</h2>
            <p>Te faltan 700 XP para subir al siguiente nivel.</p>
          </div>

          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </section>

        <section className="activities-section">
          <div className="section-title">
            <h2>Actividades disponibles</h2>
            <p>Selecciona una actividad para continuar con tu aprendizaje.</p>
          </div>

          <div className="activities-grid">
            <Link to="/quiz" className="activity-card">
              <h3>📝 Quiz</h3>
              <p>Responde preguntas y gana XP según tu resultado.</p>
            </Link>

            <Link to="/sesion-estudio" className="activity-card">
              <h3>📚 Sesión de estudio</h3>
              <p>Completa una sesión guiada para mantener tu racha.</p>
            </Link>

            <Link to="/recompensas" className="activity-card">
              <h3>🎁 Recompensas</h3>
              <p>Canjea tus monedas por pistas, reintentos y ayudas.</p>
            </Link>

            <Link to="/progreso" className="activity-card">
              <h3>📈 Progreso</h3>
              <p>Consulta tus insignias, actividades y rendimiento.</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;