import Navbar from './Navbar';
import { Link } from 'react-router-dom';

function Progreso() {
  return (
    <div className="page">
      <header>
        <h1>StudyQuest - Progreso del Estudiante</h1>
      </header>

      <main className="dashboard-container">
        <div className="card">
          <h2>Resumen General</h2>
          <p><strong>Nivel:</strong> 5</p>
          <p><strong>Experiencia:</strong> 1200 XP</p>
          <p><strong>Monedas:</strong> 350</p>
          <p><strong>Racha de estudio:</strong> 7 días</p>
        </div>

        <div className="card">
          <h2>Insignias Obtenidas</h2>
          <p>🏅 Constancia - 7 días seguidos estudiando</p>
          <p>⭐ Quiz Experto - 5 quizzes completados</p>
          <p>🔥 Reto Rápido - Primer reto completado</p>
        </div>

        <div className="card">
          <h2>Actividades Completadas</h2>
          <p>Quizzes completados: 5</p>
          <p>Sesiones de estudio: 8</p>
          <p>Retos rápidos: 3</p>
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

export default Progreso;