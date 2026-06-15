import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const usuarioRegistrado =
    JSON.parse(localStorage.getItem('usuarioRegistrado')) || null;

  const nombreUsuario = usuarioRegistrado?.nombre || 'Estudiante';

  const obtenerIniciales = (nombre) => {
    return nombre
      .split(' ')
      .map((palabra) => palabra[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">SQ</div>

        <div>
          <h2>StudyQuest</h2>
          <span>Panel educativo</span>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">{obtenerIniciales(nombreUsuario)}</div>

        <div>
          <strong>{nombreUsuario}</strong>
          <span>Estudiante activo</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">
          <span>🏠</span>
          Dashboard
        </NavLink>

        <NavLink to="/quiz">
          <span>📝</span>
          Quiz
        </NavLink>

        <NavLink to="/sesion-estudio">
          <span>📚</span>
          Sesión de Estudio
        </NavLink>

        <NavLink to="/recompensas">
          <span>🎁</span>
          Recompensas
        </NavLink>

        <NavLink to="/progreso">
          <span>📈</span>
          Progreso
        </NavLink>

        <NavLink to="/perfil">
          <span>👤</span>
          Perfil
        </NavLink>
        <NavLink to="/logros">
          <span>🏅</span>
          Logros
        </NavLink>
      </nav>
      <button className="logout-button" onClick={cerrarSesion}>
        <span>🚪</span>
        Cerrar Sesión
      </button>
    </aside>
  );
}

export default Navbar;