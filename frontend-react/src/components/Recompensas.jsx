import Navbar from './Navbar';
import { Link } from 'react-router-dom';

function Recompensas() {
  return (
    <div className="page">
      <Navbar />
      <header>
        <h1>StudyQuest - Recompensas</h1>
      </header>

      <main className="dashboard-container">
        <div className="card">
          <h2>Monedas disponibles</h2>
          <p>350 monedas</p>
        </div>

        <div className="card">
          <h2>Pista</h2>
          <p>Recibe una ayuda durante una pregunta difícil.</p>
          <p><strong>Costo:</strong> 50 monedas</p>
          <button>Canjear</button>
        </div>

        <div className="card">
          <h2>Eliminar respuesta incorrecta</h2>
          <p>Elimina una opción incorrecta en preguntas de selección múltiple.</p>
          <p><strong>Costo:</strong> 100 monedas</p>
          <button>Canjear</button>
        </div>

        <div className="card">
          <h2>Reintento</h2>
          <p>Permite volver a responder una pregunta fallida.</p>
          <p><strong>Costo:</strong> 150 monedas</p>
          <button>Canjear</button>
        </div>

        <div className="card">
          <Link to="/dashboard"><button>Volver al Dashboard</button></Link>
        </div>
      </main>
    </div>
  );
}

export default Recompensas;