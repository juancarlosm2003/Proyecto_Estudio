import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <aside className="sidebar">
      <h2>StudyQuest</h2>

      <nav>
        <Link to="/dashboard">🏠 Dashboard</Link>
        <Link to="/quiz">📝 Quiz</Link>
        <Link to="/sesion-estudio">📚 Sesión de Estudio</Link>
        <Link to="/recompensas">🎁 Recompensas</Link>
        <Link to="/progreso">📈 Progreso</Link>
        <Link to="/">🚪 Cerrar Sesión</Link>
      </nav>
    </aside>
  );
}

export default Navbar;