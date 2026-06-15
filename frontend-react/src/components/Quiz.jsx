import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function Quiz() {
  const preguntas = [
    {
      pregunta: '¿Cuál es la capital de Honduras?',
      opciones: ['San Pedro Sula', 'Tegucigalpa', 'La Ceiba'],
      correcta: 'Tegucigalpa',
    },
    {
      pregunta: '¿Qué se gana al completar actividades en StudyQuest?',
      opciones: ['XP y monedas', 'Solo puntos', 'Nada'],
      correcta: 'XP y monedas',
    },
    {
      pregunta: '¿Para qué sirven las monedas?',
      opciones: ['Para cerrar sesión', 'Para canjear recompensas', 'Para cambiar el nombre'],
      correcta: 'Para canjear recompensas',
    },
  ];

  const [indicePregunta, setIndicePregunta] = useState(0);
  const [respuesta, setRespuesta] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [respondido, setRespondido] = useState(false);
  const [correcta, setCorrecta] = useState(false);
  const [aciertos, setAciertos] = useState(0);
  const [quizFinalizado, setQuizFinalizado] = useState(false);

  const preguntaActual = preguntas[indicePregunta];

  const responderQuiz = () => {
    if (respuesta === '') {
      setMensaje('Debes seleccionar una respuesta antes de continuar.');
      setCorrecta(false);
      return;
    }

    if (respuesta === preguntaActual.correcta) {
      setMensaje('Respuesta correcta. Has ganado puntos para tu resultado final.');
      setCorrecta(true);
      setAciertos(aciertos + 1);
    } else {
      setMensaje(`Respuesta incorrecta. La respuesta correcta es ${preguntaActual.correcta}.`);
      setCorrecta(false);
    }

    setRespondido(true);
  };

  const siguientePregunta = () => {
    const siguiente = indicePregunta + 1;

    if (siguiente < preguntas.length) {
      setIndicePregunta(siguiente);
      setRespuesta('');
      setMensaje('');
      setRespondido(false);
      setCorrecta(false);
    } else {
      finalizarQuiz();
    }
  };

  const finalizarQuiz = () => {
    const xpGanado = aciertos * 100;
    const monedasGanadas = aciertos * 25;

    const xpActual = Number(localStorage.getItem('xp')) || 1200;
    const monedasActuales = Number(localStorage.getItem('monedas')) || 350;

    localStorage.setItem('xp', xpActual + xpGanado);
    localStorage.setItem('monedas', monedasActuales + monedasGanadas);

    setQuizFinalizado(true);
    setMensaje(`Quiz finalizado. Obtuviste ${aciertos} de ${preguntas.length} respuestas correctas.`);
  };

  const reiniciarQuiz = () => {
    setIndicePregunta(0);
    setRespuesta('');
    setMensaje('');
    setRespondido(false);
    setCorrecta(false);
    setAciertos(0);
    setQuizFinalizado(false);
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

          <Link to="/dashboard" className="secondary-action">
            Volver al dashboard
          </Link>
        </section>

        <section className="quiz-layout">
          <div className="quiz-panel">
            {!quizFinalizado ? (
              <>
                <span className="quiz-label">
                  Pregunta {indicePregunta + 1} de {preguntas.length}
                </span>

                <h2>{preguntaActual.pregunta}</h2>

                <div className="options-list">
                  {preguntaActual.opciones.map((opcion) => (
                    <label
                      key={opcion}
                      className={`option-card ${
                        respuesta === opcion ? 'selected-option' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="respuesta"
                        value={opcion}
                        checked={respuesta === opcion}
                        disabled={respondido}
                        onChange={(e) => setRespuesta(e.target.value)}
                      />

                      {opcion}
                    </label>
                  ))}
                </div>

                {!respondido ? (
                  <button className="quiz-button" onClick={responderQuiz}>
                    Responder
                  </button>
                ) : (
                  <button className="quiz-button" onClick={siguientePregunta}>
                    {indicePregunta + 1 === preguntas.length
                      ? 'Finalizar quiz'
                      : 'Siguiente pregunta'}
                  </button>
                )}

                {mensaje && (
                  <div className={correcta ? 'result-box success' : 'result-box error'}>
                    {mensaje}
                  </div>
                )}
              </>
            ) : (
              <>
                <span className="quiz-label">Resultado final</span>

                <h2>Quiz completado</h2>

                <div className="result-box success">
                  {mensaje}
                  <br />
                  Ganaste {aciertos * 100} XP y {aciertos * 25} monedas.
                </div>

                <button className="quiz-button" onClick={reiniciarQuiz}>
                  Repetir quiz
                </button>
              </>
            )}
          </div>

          <aside className="reward-panel">
            <h3>Progreso del quiz</h3>
            <p>Tu rendimiento actual:</p>

            <div className="reward-item">
              <span>Preguntas</span>
              <strong>{preguntas.length}</strong>
            </div>

            <div className="reward-item">
              <span>Aciertos</span>
              <strong>{aciertos}</strong>
            </div>

            <div className="reward-item">
              <span>XP posible</span>
              <strong>+{preguntas.length * 100}</strong>
            </div>

            <div className="reward-item">
              <span>Monedas posibles</span>
              <strong>+{preguntas.length * 25}</strong>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Quiz;