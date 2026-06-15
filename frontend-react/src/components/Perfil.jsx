import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function Perfil() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [nombre, setNombre] = useState('');
  const [xp, setXp] = useState(1200);
  const [monedas, setMonedas] = useState(350);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const usuarioGuardado =
      JSON.parse(localStorage.getItem('usuarioRegistrado')) || null;

    const xpGuardado = Number(localStorage.getItem('xp')) || 1200;
    const monedasGuardadas = Number(localStorage.getItem('monedas')) || 350;

    setUsuario(usuarioGuardado);
    setNombre(usuarioGuardado?.nombre || '');
    setXp(xpGuardado);
    setMonedas(monedasGuardadas);
  }, []);

  const xpPorNivel = 500;
  const nivel = Math.floor(xp / xpPorNivel) + 1;

  const guardarCambios = () => {
    if (nombre.trim() === '') {
      setMensaje('El nombre no puede estar vacío.');
      return;
    }

    const usuarioActualizado = {
      ...usuario,
      nombre,
    };

    localStorage.setItem('usuarioRegistrado', JSON.stringify(usuarioActualizado));
    setUsuario(usuarioActualizado);
    setMensaje('Perfil actualizado correctamente.');
  };

  const reiniciarProgreso = () => {
    const confirmar = window.confirm(
      '¿Seguro que quieres reiniciar tu progreso? Se borrarán XP, monedas, historial e inventario.'
    );

    if (!confirmar) return;

    localStorage.setItem('xp', 1200);
    localStorage.setItem('monedas', 350);
    localStorage.removeItem('historialSesiones');
    localStorage.removeItem('historialQuizzes');
    localStorage.removeItem('inventarioRecompensas');

    setXp(1200);
    setMonedas(350);
    setMensaje('Progreso reiniciado correctamente.');
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return (
    <div className="page">
      <Navbar />

      <main className="main-content">
        <section className="profile-header">
          <div>
            <span className="eyebrow">Cuenta del estudiante</span>
            <h1>Perfil y ajustes</h1>
            <p>Administra tu información, progreso y configuración de StudyQuest.</p>
          </div>
        </section>

        <section className="profile-grid">
          <div className="profile-card">
            <div className="profile-avatar">
              {nombre
                .split(' ')
                .map((palabra) => palabra[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <h2>{usuario?.nombre || 'Estudiante'}</h2>
            <p>{usuario?.correo || 'Sin correo registrado'}</p>

            <div className="profile-stats">
              <div>
                <span>Nivel</span>
                <strong>{nivel}</strong>
              </div>

              <div>
                <span>XP</span>
                <strong>{xp}</strong>
              </div>

              <div>
                <span>Monedas</span>
                <strong>{monedas}</strong>
              </div>
            </div>
          </div>

          <div className="settings-card">
            <h2>Editar perfil</h2>
            <p>Actualiza el nombre que aparece en tu dashboard y menú lateral.</p>

            <label htmlFor="nombre">Nombre del estudiante</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            {mensaje && <div className="store-message">{mensaje}</div>}

            <div className="settings-actions">
              <button className="save-button" onClick={guardarCambios}>
                Guardar cambios
              </button>

              <button className="danger-button" onClick={reiniciarProgreso}>
                Reiniciar progreso
              </button>

              <button className="logout-profile-button" onClick={cerrarSesion}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Perfil;