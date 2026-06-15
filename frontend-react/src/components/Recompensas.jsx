import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function Recompensas() {
  const [monedas, setMonedas] = useState(350);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const monedasGuardadas = Number(localStorage.getItem('monedas')) || 350;
    setMonedas(monedasGuardadas);
  }, []);

  const recompensas = [
    {
      nombre: 'Pista',
      descripcion: 'Recibe una ayuda durante una pregunta difícil.',
      costo: 50,
      icono: '💡',
      tipo: 'Ayuda rápida',
    },
    {
      nombre: 'Eliminar respuesta incorrecta',
      descripcion: 'Elimina una opción incorrecta en preguntas de selección múltiple.',
      costo: 100,
      icono: '❌',
      tipo: 'Ventaja académica',
    },
    {
      nombre: 'Reintento',
      descripcion: 'Permite volver a responder una pregunta fallida.',
      costo: 150,
      icono: '🔁',
      tipo: 'Segunda oportunidad',
    },
  ];

  const canjearRecompensa = (nombre, costo) => {
    if (monedas < costo) {
      setMensaje('No tienes suficientes monedas para esta recompensa.');
      return;
    }

    const nuevasMonedas = monedas - costo;

    setMonedas(nuevasMonedas);
    localStorage.setItem('monedas', nuevasMonedas);
    setMensaje(`Has canjeado: ${nombre}.`);
  };

  return (
    <div className="page">
      <Navbar />

      <main className="main-content">
        <section className="store-header">
          <div>
            <span className="eyebrow">Tienda académica</span>
            <h1>Tienda de recompensas</h1>
            <p>Canjea tus monedas por ayudas para mejorar tu rendimiento.</p>
          </div>

          <div className="coin-box">
            <span>Monedas disponibles</span>
            <strong>{monedas}</strong>
          </div>
        </section>

        {mensaje && <div className="store-message">{mensaje}</div>}

        <section className="rewards-grid">
          {recompensas.map((recompensa) => {
            const puedeCanjear = monedas >= recompensa.costo;

            return (
              <article className="reward-card" key={recompensa.nombre}>
                <div className="reward-icon">{recompensa.icono}</div>

                <span className="reward-type">{recompensa.tipo}</span>

                <h2>{recompensa.nombre}</h2>
                <p>{recompensa.descripcion}</p>

                <div className="reward-price">
                  <span>Costo</span>
                  <strong>{recompensa.costo} monedas</strong>
                </div>

                <button
                  className={puedeCanjear ? 'reward-button' : 'reward-button disabled'}
                  onClick={() =>
                    canjearRecompensa(recompensa.nombre, recompensa.costo)
                  }
                  disabled={!puedeCanjear}
                >
                  {puedeCanjear ? 'Canjear recompensa' : 'Monedas insuficientes'}
                </button>
              </article>
            );
          })}
        </section>

        <Link to="/dashboard" className="back-button">
          Volver al Dashboard
        </Link>
      </main>
    </div>
  );
}

export default Recompensas;