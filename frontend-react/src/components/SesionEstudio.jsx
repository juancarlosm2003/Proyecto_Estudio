import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function SesionEstudio() {
  const DURACION_INICIAL = 45 * 60;

  const [estado, setEstado] = useState('Pendiente de iniciar');
  const [tiempoRestante, setTiempoRestante] = useState(DURACION_INICIAL);
  const [mensaje, setMensaje] = useState('');
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [sesionCompletada, setSesionCompletada] = useState(false);

  useEffect(() => {
    if (!sesionIniciada || sesionCompletada) return;

    const intervalo = setInterval(() => {
      setTiempoRestante((tiempoAnterior) => {
        if (tiempoAnterior <= 1) {
          clearInterval(intervalo);
          completarSesion();
          return 0;
        }

        return tiempoAnterior - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [sesionIniciada, sesionCompletada]);

  const iniciarSesion = () => {
    setSesionIniciada(true);
    setEstado('Sesión en progreso');
    setMensaje('La sesión de estudio ha iniciado. Mantén la concentración.');
  };

  const completarSesion = () => {
    if (sesionCompletada) return;

    setSesionCompletada(true);
    setSesionIniciada(false);
    setEstado('Sesión completada');
    setTiempoRestante(0);
    setMensaje('Sesión completada. Has ganado 100 XP y 30 monedas.');

    const xpActual = Number(localStorage.getItem('xp')) || 1200;
    const monedasActuales = Number(localStorage.getItem('monedas')) || 350;

    localStorage.setItem('xp', xpActual + 100);
    localStorage.setItem('monedas', monedasActuales + 30);
  };

  const reiniciarSesion = () => {
    setEstado('Pendiente de iniciar');
    setTiempoRestante(DURACION_INICIAL);
    setMensaje('');
    setSesionIniciada(false);
    setSesionCompletada(false);
  };

  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;

  const tiempoFormateado = `${minutos}:${segundos.toString().padStart(2, '0')}`;

  return (
    <div className="page">
      <Navbar />

      <main className="main-content">
        <section className="study-header">
          <div>
            <span className="eyebrow">Modo concentración</span>
            <h1>Sesión de estudio</h1>
            <p>
              Completa una sesión guiada para ganar experiencia y mantener tu racha.
            </p>
          </div>

          <Link to="/dashboard" className="secondary-action">
            Volver al dashboard
          </Link>
        </section>

        <section className="study-layout">
          <div className="study-card main-study-card">
            <span className="study-status">{estado}</span>

            <h2>Desarrollo de Aplicaciones de Vanguardia</h2>
            <p>Objetivo: repasar conceptos de frontend, backend y gamificación.</p>

            <div className="timer-box">
              <h3>{tiempoFormateado}</h3>
              <p>tiempo restante</p>
            </div>

            <div className="study-actions">
              <button
                className="start-button"
                onClick={iniciarSesion}
                disabled={sesionIniciada || sesionCompletada}
              >
                Iniciar sesión
              </button>

              <button
                onClick={completarSesion}
                className="finish-button"
                disabled={!sesionIniciada || sesionCompletada}
              >
                Finalizar sesión
              </button>

              {sesionCompletada && (
                <button onClick={reiniciarSesion} className="reset-button">
                  Nueva sesión
                </button>
              )}
            </div>

            {mensaje && <div className="study-message">{mensaje}</div>}
          </div>

          <aside className="study-card">
            <h3>Recompensa</h3>
            <p>Completa la sesión para recibir:</p>

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