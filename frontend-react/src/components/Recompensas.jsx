import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function Recompensas() {
  const [monedas, setMonedas] = useState(350);
  const [mensaje, setMensaje] = useState('');
  const [inventario, setInventario] = useState([]);

  const recompensas = [
    {
      id: 1,
      nombre: 'Pista',
      descripcion: 'Recibe una ayuda durante una pregunta difícil.',
      costo: 50,
      icono: '💡',
      tipo: 'Ayuda rápida',
    },
    {
      id: 2,
      nombre: 'Eliminar respuesta incorrecta',
      descripcion: 'Elimina una opción incorrecta en preguntas de selección múltiple.',
      costo: 100,
      icono: '❌',
      tipo: 'Ventaja académica',
    },
    {
      id: 3,
      nombre: 'Reintento',
      descripcion: 'Permite volver a responder una pregunta fallida.',
      costo: 150,
      icono: '🔁',
      tipo: 'Segunda oportunidad',
    },
  ];

  useEffect(() => {
    const monedasGuardadas = Number(localStorage.getItem('monedas')) || 350;
    const inventarioGuardado =
      JSON.parse(localStorage.getItem('inventarioRecompensas')) || [];

    setMonedas(monedasGuardadas);
    setInventario(inventarioGuardado);
  }, []);

  const canjearRecompensa = (recompensa) => {
    if (monedas < recompensa.costo) {
      setMensaje('No tienes suficientes monedas para esta recompensa.');
      return;
    }

    const nuevasMonedas = monedas - recompensa.costo;

    const nuevaRecompensa = {
      id: Date.now(),
      nombre: recompensa.nombre,
      icono: recompensa.icono,
      tipo: recompensa.tipo,
      costo: recompensa.costo,
      fecha: new Date().toLocaleDateString(),
    };

    const nuevoInventario = [nuevaRecompensa, ...inventario];

    setMonedas(nuevasMonedas);
    setInventario(nuevoInventario);

    localStorage.setItem('monedas', nuevasMonedas);
    localStorage.setItem('inventarioRecompensas', JSON.stringify(nuevoInventario));

    setMensaje(`Has canjeado: ${recompensa.nombre}. Ahora está en tu inventario.`);
  };

  const obtenerCantidad = (nombre) => {
    return inventario.filter((item) => item.nombre === nombre).length;
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
            const cantidadComprada = obtenerCantidad(recompensa.nombre);

            return (
              <article className="reward-card" key={recompensa.id}>
                <div className="reward-icon">{recompensa.icono}</div>

                <span className="reward-type">{recompensa.tipo}</span>

                <h2>{recompensa.nombre}</h2>
                <p>{recompensa.descripcion}</p>

                <div className="reward-price">
                  <span>Costo</span>
                  <strong>{recompensa.costo} monedas</strong>
                </div>

                <div className="reward-owned">
                  <span>En inventario</span>
                  <strong>{cantidadComprada}</strong>
                </div>

                <button
                  className={puedeCanjear ? 'reward-button' : 'reward-button disabled'}
                  onClick={() => canjearRecompensa(recompensa)}
                  disabled={!puedeCanjear}
                >
                  {puedeCanjear ? 'Canjear recompensa' : 'Monedas insuficientes'}
                </button>
              </article>
            );
          })}
        </section>

        <section className="inventory-section">
          <div className="section-title">
            <div>
              <h2>Inventario de recompensas</h2>
              <p>Recompensas que has comprado y puedes usar después.</p>
            </div>
          </div>

          <div className="inventory-list">
            {inventario.length === 0 ? (
              <div className="inventory-empty">
                <span>🎒</span>
                <p>Aún no tienes recompensas en tu inventario.</p>
              </div>
            ) : (
              inventario.map((item) => (
                <div className="inventory-item" key={item.id}>
                  <div>
                    <span className="inventory-icon">{item.icono}</span>

                    <div>
                      <strong>{item.nombre}</strong>
                      <p>{item.tipo} · Comprado el {item.fecha}</p>
                    </div>
                  </div>

                  <span className="inventory-status">Disponible</span>
                </div>
              ))
            )}
          </div>
        </section>

        <Link to="/dashboard" className="back-button">
          Volver al Dashboard
        </Link>
      </main>
    </div>
  );
}

export default Recompensas;