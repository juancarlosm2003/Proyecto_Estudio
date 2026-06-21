import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import API_URL from '../services/api';
import { useAuth } from '../context/AuthContext';

function Recompensas() {
  const { usuario, actualizarUsuario } = useAuth();
  const [monedas, setMonedas] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [inventario, setInventario] = useState([]);
  const [recompensas, setRecompensas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [canjeandoId, setCanjeandoId] = useState(null);

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha';

    const fechaConvertida = new Date(fecha);

    if (Number.isNaN(fechaConvertida.getTime())) {
      return fecha;
    }

    return new Intl.DateTimeFormat('es-HN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(fechaConvertida);
  };

  useEffect(() => {
    const cargarDatos = async () => {
      const usuarioId = usuario?.id;

      if (usuario) {
        setMonedas(usuario.monedas || 0);
      }

      if (!usuarioId) {
        setMensaje('No se encontró el usuario activo. Inicia sesión nuevamente.');
        setTipoMensaje('error');
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        setMensaje('');
        setTipoMensaje('');

        const [respuestaRecompensas, respuestaProgreso, respuestaInventario] =
          await Promise.all([
            fetch(`${API_URL}/api/recompensas`),
            fetch(`${API_URL}/api/progreso/${usuarioId}`),
            fetch(`${API_URL}/api/inventario/${usuarioId}`),
          ]);

        const datosRecompensas = await respuestaRecompensas.json();
        const datosProgreso = await respuestaProgreso.json();
        const datosInventario = await respuestaInventario.json();

        if (!respuestaRecompensas.ok) {
          setMensaje(datosRecompensas.mensaje || 'No se pudieron cargar las recompensas.');
          setTipoMensaje('error');
          return;
        }

        if (!respuestaProgreso.ok) {
          setMensaje(datosProgreso.mensaje || 'No se pudo cargar el progreso.');
          setTipoMensaje('error');
          return;
        }

        if (!respuestaInventario.ok) {
          setMensaje(datosInventario.mensaje || 'No se pudo cargar el inventario.');
          setTipoMensaje('error');
          return;
        }

        setRecompensas(datosRecompensas.recompensas || []);
        setInventario(datosInventario.inventario || []);

        const usuarioBackend = datosProgreso.usuario;

        if (usuarioBackend) {
          setMonedas(usuarioBackend.monedas || 0);

          const usuarioActualizado = {
            id: usuarioBackend.id,
            nombre: usuarioBackend.nombre || 'Estudiante',
            correo: usuarioBackend.correo,
            xp: usuarioBackend.xp || 0,
            monedas: usuarioBackend.monedas || 0,
            nivel: usuarioBackend.nivel || 1,
            fechaInicio: new Date().toISOString(),
          };

          actualizarUsuario(usuarioActualizado);
        }

        localStorage.setItem(
          'inventarioRecompensas',
          JSON.stringify(datosInventario.inventario || [])
        );
      } catch {
        setMensaje('No se pudo conectar con el servidor. Revisa que el backend esté encendido.');
        setTipoMensaje('error');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [usuario?.id]);

  const canjearRecompensa = async (recompensa) => {
    const usuarioId = usuario?.id;

    if (!usuarioId) {
      setMensaje('No se encontró el usuario activo. Inicia sesión nuevamente.');
      setTipoMensaje('error');
      return;
    }

    if (monedas < recompensa.costo) {
      setMensaje('No tienes suficientes monedas para esta recompensa.');
      setTipoMensaje('error');
      return;
    }

    try {
      setCanjeandoId(recompensa.id);
      setMensaje('');
      setTipoMensaje('');

      const respuesta = await fetch(`${API_URL}/api/recompensas/canjear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: usuarioId,
          recompensa_id: recompensa.id,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje || 'No se pudo canjear la recompensa.');
        setTipoMensaje('error');
        return;
      }

      const usuarioActualizado = datos.usuario;
      const nuevaRecompensa = datos.inventario;

      setMonedas(usuarioActualizado.monedas || 0);
      setInventario((inventarioActual) => [nuevaRecompensa, ...inventarioActual]);

      if (usuarioActualizado) {
        const usuarioContextActualizado = {
          id: usuarioActualizado.id,
          nombre: usuarioActualizado.nombre || usuario?.nombre || 'Estudiante',
          correo: usuarioActualizado.correo || usuario?.correo,
          xp: usuarioActualizado.xp ?? usuario?.xp ?? 0,
          monedas: usuarioActualizado.monedas ?? 0,
          nivel: usuarioActualizado.nivel ?? usuario?.nivel ?? 1,
          fechaInicio: new Date().toISOString(),
        };

        actualizarUsuario(usuarioContextActualizado);
      }

      setMensaje(`Has canjeado: ${recompensa.nombre}. Ahora está en tu inventario.`);
      setTipoMensaje('success');
    } catch {
      setMensaje('No se pudo conectar con el servidor. Revisa que el backend esté encendido.');
      setTipoMensaje('error');
    } finally {
      setCanjeandoId(null);
    }
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

        {cargando && <div className="store-message">Cargando recompensas...</div>}

        {mensaje && (
          <div
            className={
              tipoMensaje === 'error'
                ? 'store-message result-box error'
                : tipoMensaje === 'success'
                  ? 'store-message result-box success'
                  : 'store-message'
            }
          >
            {mensaje}
          </div>
        )}

        <section className="rewards-grid">
          {recompensas.map((recompensa) => {
            const puedeCanjear = monedas >= recompensa.costo;
            const cantidadComprada = obtenerCantidad(recompensa.nombre);
            const estaCanjeando = canjeandoId === recompensa.id;

            return (
              <article className="reward-card" key={recompensa.id}>
                <div className="reward-icon">{recompensa.icono || 'RC'}</div>

                <span className="reward-type">{recompensa.tipo}</span>

                <h2>{recompensa.nombre}</h2>
                <p>
                  {recompensa.descripcion ||
                    'Recompensa académica disponible para canjear con monedas.'}
                </p>

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
                  disabled={!puedeCanjear || estaCanjeando}
                >
                  {estaCanjeando
                    ? 'Canjeando...'
                    : puedeCanjear
                      ? 'Canjear recompensa'
                      : 'Monedas insuficientes'}
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
                <span>IN</span>
                <p>Aún no tienes recompensas en tu inventario.</p>
              </div>
            ) : (
              inventario.map((item) => (
                <div className="inventory-item" key={item.id}>
                  <div>
                    <span className="inventory-icon">{item.icono || 'RC'}</span>

                    <div>
                      <strong>{item.nombre}</strong>
                      <p>
                        {item.tipo} · Comprado el {formatearFecha(item.fecha)}
                      </p>
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