import { Link } from 'react-router-dom';

function Quiz() {
  return (
    <div className="page">
      <header>
        <h1>StudyQuest - Quiz</h1>
      </header>

      <main className="dashboard-container">
        <div className="card">
          <h2>Pregunta 1</h2>
          <p>¿Cuál es la capital de Honduras?</p>

          <label><input type="radio" name="p1" /> San Pedro Sula</label>
          <label><input type="radio" name="p1" /> Tegucigalpa</label>
          <label><input type="radio" name="p1" /> La Ceiba</label>

          <button>Responder</button>
        </div>

        <div className="card">
          <Link to="/dashboard"><button>Volver al Dashboard</button></Link>
        </div>
      </main>
    </div>
  );
}

export default Quiz;