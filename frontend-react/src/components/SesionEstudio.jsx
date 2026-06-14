import Navbar from './Navbar';
import { Link } from 'react-router-dom';

function SesionEstudio() {
  return (
    <div className="page">
      <header>
        <h1>StudyQuest - Sesión de Estudio</h1>
      </header>

      <main className="dashboard-container">
        <div className="card">
          <h2>Sesión activa</h2>
          <p><strong>Materia:</strong> Desarrollo de Aplicaciones de Vanguardia</p>
          <p><strong>Duración sugerida:</strong> 45 minutos</p>
          <p><strong>Recompensa:</strong> 100 XP y 30 monedas</p>

          <button>Iniciar Sesión</button>
        </div>

        <div className="card">
          <h2>Objetivo de estudio</h2>
          <p>Repasar conceptos del proyecto, frontend, backend y gamificación.</p>
        </div>

        <div className="card">
          <h2>Estado</h2>
          <p>Pendiente de iniciar</p>
        </div>

        <div className="card">
          <Link to="/dashboard">
            <button>Volver al Dashboard</button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default SesionEstudio;