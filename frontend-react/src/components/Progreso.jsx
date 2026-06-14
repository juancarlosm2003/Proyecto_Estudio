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

  return (
    <div className="page">
      <Navbar />

      <main className="main-content">
        <section className="progress-header">
          <div>
            <h1>Progreso del estudiante</h1>
            <p>Consulta tu rendimiento, recompensas e insignias obtenidas.</p>
          </div>

          <Link to="/dashboard">
            <button className="secondary-action">Volver</button>
          </Link>
        </section>

        <section className="progress-summary-grid">
          <div className="stat-card">
            <span>Nivel actual</span>
            <h2>5</h2>
            <p>Estudiante avanzado</p>
          </div>

          <div className="stat-card">
            <span>Experiencia total</span>
            <h2>{xp} XP</h2>
            <p>Acumulada por actividades</p>
          </div>

          <div className="stat-card">
            <span>Monedas</span>
            <h2>{monedas}</h2>
            <p>Disponibles para canjear</p>
          </div>

          <div className="stat-card">
            <span>Racha</span>
            <h2>7 días</h2>
            <p>Estudio constante</p>
          </div>
        </section>

        <section className="progress-section">
          <div className="section-title">
            <h2>Avance al siguiente nivel</h2>
            <p>Has completado aproximadamente el 65% del nivel actual.</p>
          </div>

          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </section>

        <section className="badges-section">
          <div className="section-title">
            <h2>Insignias obtenidas</h2>
            <p>Reconocimientos ganados por tu desempeño académico.</p>
          </div>

          <div className="badges-grid">
            <div className="badge-card">
              <div className="badge-icon">🏅</div>
              <h3>Constancia</h3>
              <p>7 días seguidos estudiando.</p>
            </div>

            <div className="badge-card">
              <div className="badge-icon">⭐</div>
              <h3>Quiz Experto</h3>
              <p>5 quizzes completados.</p>
            </div>

            <div className="badge-card">
              <div className="badge-icon">🔥</div>
              <h3>Reto Rápido</h3>
              <p>Primer reto completado.</p>
            </div>
          </div>
        </section>

        <section className="history-section">
          <div className="section-title">
            <h2>Historial de actividades</h2>
            <p>Resumen de actividades realizadas recientemente.</p>
          </div>

          <div className="history-list">
            <div className="history-item">
              <span>Quiz completado</span>
              <strong>+100 XP / +25 monedas</strong>
            </div>

            <div className="history-item">
              <span>Sesión de estudio</span>
              <strong>+100 XP / +30 monedas</strong>
            </div>

            <div className="history-item">
              <span>Recompensa canjeada</span>
              <strong>-50 monedas</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Progreso;