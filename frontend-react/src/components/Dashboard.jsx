import Navbar from './Navbar';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="page">
      <Navbar />
      <header>
        <h1>StudyQuest</h1>
        <p>Panel principal del estudiante</p>
      </header>

      <main className="dashboard-container">
        <div className="card">
          <h2>Experiencia</h2>
          <p>1200 XP</p>
        </div>

        <div className="card">
          <h2>Monedas</h2>
          <p>350</p>
        </div>

        <div className="card">
          <h2>Racha de estudio</h2>
          <p>7 días</p>
        </div>

        <div className="card">
          <h2>Actividades</h2>
          <Link to="/quiz"><button>Quiz</button></Link>
          <Link to="/recompensas"><button>Recompensas</button></Link>
          <Link to="/progreso"><button>Progreso</button></Link>
          <Link to="/sesion-estudio"><button>Sesión de Estudio</button></Link>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;