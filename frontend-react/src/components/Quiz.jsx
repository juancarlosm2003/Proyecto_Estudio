import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function Quiz() {
  const [respuesta, setRespuesta] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [respondido, setRespondido] = useState(false);
  const [correcta, setCorrecta] = useState(false);

  const responderQuiz = () => {
    if (respuesta === '') {
      setMensaje('Debes seleccionar una respuesta antes de continuar.');
      return;
    }

    if (respuesta === 'Tegucigalpa') {
      setMensaje('Respuesta correcta. Has ganado 100 XP y 25 monedas.');
      setCorrecta(true);

      const xpActual = Number(localStorage.getItem('xp')) || 1200;
      const monedasActuales = Number(localStorage.getItem('monedas')) || 350;

      localStorage.setItem('xp', xpActual + 100);
      localStorage.setItem('monedas', monedasActuales + 25);
    } else {
      setMensaje('Respuesta incorrecta. La respuesta correcta es Tegucigalpa.');
      setCorrecta(false);
    }

    setRespondido(true);
  };

  return (
    <div className="page">
      <Navbar />

      <main className="main-content">
        <section className="quiz-header">
          <div>
            <h1>Quiz de práctica</h1>
            <p>Responde correctamente para ganar experiencia y monedas.</p>
          </div>

          <Link to="/dashboard">
            <button className="secondary-action">Volver</button>
          </Link>
        </section>

        <section className="quiz-layout">
          <div className="quiz-panel">
            <span className="quiz-label">Pregunta 1 de 1</span>
            <h2>¿Cuál es la capital de Honduras?</h2>

            <div className="options-list">
              {['San Pedro Sula', 'Tegucigalpa', 'La Ceiba'].map((opcion) => (
                <label 
                  key={opcion}
                  className={`option-card ${respuesta === opcion ? 'selected-option' : ''}`}
                >
                  <input
                    type="radio"
                    name="p1"
                    value={opcion}
                    disabled={respondido}
                    onChange={(e) => setRespuesta(e.target.value)}
                  />
                  {opcion}
                </label>
              ))}
            </div>

            <button 
              className="quiz-button" 
              onClick={responderQuiz} 
              disabled={respondido}
            >
              Responder
            </button>

            {mensaje && (
              <div className={correcta ? 'result-box success' : 'result-box error'}>
                {mensaje}
              </div>
            )}
          </div>

          <aside className="reward-panel">
            <h3>Recompensa del quiz</h3>
            <p>Al responder correctamente obtendrás:</p>

            <div className="reward-item">
              <span>XP</span>
              <strong>+100</strong>
            </div>

            <div className="reward-item">
              <span>Monedas</span>
              <strong>+25</strong>
            </div>

            <div className="reward-item">
              <span>Dificultad</span>
              <strong>Básica</strong>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Quiz;