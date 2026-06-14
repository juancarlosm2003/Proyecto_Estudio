import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function SesionEstudio() {
  const [estado, setEstado] = useState('Pendiente de iniciar');
  const [tiempo, setTiempo] = useState(45);
  const [mensaje, setMensaje] = useState('');

  const iniciarSesion = () => {
    setEstado('Sesión en progreso');
    setMensaje('La sesión de estudio ha iniciado. Mantén la concentración.');
  };

  const finalizarSesion = () => {
    setEstado('Sesión completada');
    setTiempo(0);
    setMensaje('Sesión completada. Has ganado 100 XP y 30 monedas.');

    const xpActual = Number(localStorage.getItem('xp')) || 1200;
    const monedasActuales = Number(localStorage.getItem('monedas')) || 350;

    localStorage.setItem('xp', xpActual + 100);
    localStorage.setItem('monedas', monedasActuales + 30);
  };

  return (
    <div className="page">
      <Navbar />

      <main className="main-content">
        <section className="study-header">
          <div>
            <h1>Sesión de estudio</h1>
            <p>Completa una sesión guiada para ganar experiencia y mantener tu racha.</p>
          </div>

          <Link to="/dashboard">
            <button className="secondary-action">Volver</button>
          </Link>
        </section>

        <section className="study-layout">
          <div className="study-card main-study-card">
            <span className="study-status">{estado}</span>

            <h2>Desarrollo de Aplicaciones de Vanguardia</h2>
            <p>Objetivo: repasar conceptos de frontend, backend y gamificación.</p>

            <div className="timer-box">
              <h3>{tiempo}:00</h3>
              <p>minutos restantes</p>
            </div>

            <div className="study-actions">
              <button onClick={iniciarSesion}>Iniciar sesión</button>
              <button onClick={finalizarSesion} className="finish-button">
                Finalizar sesión
              </button>
            </div>

            {mensaje && <div className="study-message">{mensaje}</div>}
          </div>

          <aside className="study-card">
            <h3>Recompensa</h3>

            <div className="reward-item">
              <span>XP</span>
              <strong>+100</strong>
            </div>

            <div className="reward-item">
              <span>Monedas</span>
              <strong>+30</strong>
            </div>

            <div className="reward-item">
              <span>Racha</span>
              <strong>+1 día</strong>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default SesionEstudio;