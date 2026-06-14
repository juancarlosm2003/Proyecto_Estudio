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

  const canjearRecompensa = (nombre, costo) => {
    if (monedas >= costo) {
      const nuevasMonedas = monedas - costo;
      setMonedas(nuevasMonedas);
      localStorage.setItem('monedas', nuevasMonedas);
      setMensaje(`Has canjeado: ${nombre}.`);
    } else {
      setMensaje('No tienes suficientes monedas para esta recompensa.');
    }
  };

  const recompensas = [
    {
      nombre: 'Pista',
      descripcion: 'Recibe una ayuda durante una pregunta difícil.',
      costo: 50,
      icono: '💡'
    },
    {
      nombre: 'Eliminar respuesta incorrecta',
      descripcion: 'Elimina una opción incorrecta en preguntas de selección múltiple.',
      costo: 100,
      icono: '❌'
    },
    {
      nombre: 'Reintento',
      descripcion: 'Permite volver a responder una pregunta fallida.',
      costo: 150,
      icono: '🔁'
    }
  ];

  return (
    <div className="page">
      <Navbar />

      <main className="main-content">
        <section className="store-header">
          <div>
            <h1>Tienda de recompensas</h1>
            <p>Canjea tus monedas por ayudas académicas.</p>
          </div>

          <div className="coin-box">
            <span>Monedas disponibles</span>
            <strong>{monedas}</strong>
          </div>
        </section>

        {mensaje && <div className="store-message">{mensaje}</div>}

        <section className="rewards-grid">
          {recompensas.map((recompensa) => (
            <div className="reward-card" key={recompensa.nombre}>
              <div className="reward-icon">{recompensa.icono}</div>

              <h2>{recompensa.nombre}</h2>
              <p>{recompensa.descripcion}</p>

              <div className="reward-price">
                <span>Costo</span>
                <strong>{recompensa.costo} monedas</strong>
              </div>

              <button onClick={() => canjearRecompensa(recompensa.nombre, recompensa.costo)}>
                Canjear recompensa
              </button>
            </div>
          ))}
        </section>

        <Link to="/dashboard">
          <button className="back-button">Volver al Dashboard</button>
        </Link>
      </main>
    </div>
  );
}

export default Recompensas;