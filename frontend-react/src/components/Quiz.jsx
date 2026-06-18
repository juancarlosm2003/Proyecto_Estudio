import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import contenidosEstudio from '../data/contenidosEstudio';
import API_URL from '../services/api';

function Quiz() {
  const [claseSeleccionada, setClaseSeleccionada] = useState(0);
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [respuesta, setRespuesta] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mensajeAyuda, setMensajeAyuda] = useState('');
  const [respondido, setRespondido] = useState(false);
  const [correcta, setCorrecta] = useState(false);
  const [aciertos, setAciertos] = useState(0);
  const [quizFinalizado, setQuizFinalizado] = useState(false);
  const [inventario, setInventario] = useState([]);
  const [opcionesEliminadas, setOpcionesEliminadas] = useState([]);
  const [pistaActiva, setPistaActiva] = useState(false);
  const [guardandoResultado, setGuardandoResultado] = useState(false);

  const claseActual = contenidosEstudio[claseSeleccionada];

  const preguntas = claseActual.temas.map((tema) => ({
    tema: tema.titulo,
    concepto: tema.concepto,
    pregunta: tema.pregunta,
    opciones: tema.opciones,
    correcta: tema.correcta,
  }));

  const preguntaActual = preguntas[indicePregunta];

  const obtenerUsuarioActivo = () => {
    try {
      return JSON.parse(localStorage.getItem('usuario')) || null;
    } catch {
      return null;
    }
  };

  const obtenerUsuarioId = () => {
    const usuarioActivo = obtenerUsuarioActivo();
    return localStorage.getItem('usuarioId') || usuarioActivo?.id;
  };

  useEffect(() => {
    const cargarInventario = async () => {
      const usuarioId = obtenerUsuarioId();

      if (!usuarioId) {
        setMensajeAyuda('No se encontró el usuario activo. Inicia sesión nuevamente.');
        return;
      }

      try {
        const respuestaInventario = await fetch(`${API_URL}/api/inventario/${usuarioId}`);
        const datosInventario = await respuestaInventario.json();

        if (!respuestaInventario.ok) {
          setMensajeAyuda(datosInventario.mensaje || 'No se pudo cargar el inventario.');
          return;
        }

        const inventarioBackend = datosInventario.inventario || [];

        setInventario(inventarioBackend);
        localStorage.setItem('inventarioRecompensas', JSON.stringify(inventarioBackend));
      } catch {
        const inventarioGuardado =
          JSON.parse(localStorage.getItem('inventarioRecompensas')) || [];

        setInventario(inventarioGuardado);
        setMensajeAyuda('No se pudo conectar con el inventario del servidor.');
      }
    };

    cargarInventario();
  }, []);

  useEffect(() => {
    reiniciarQuiz();
  }, [claseSeleccionada]);

  const obtenerCantidad = (nombre) => {
    return inventario.filter((item) => item.nombre === nombre).length;
  };

  const consumirRecompensa = async (nombre) => {
    const recompensa = inventario.find((item) => item.nombre === nombre);

    if (!recompensa) {
      return false;
    }

    try {
      const respuestaBackend = await fetch(`${API_URL}/api/inventario/${recompensa.id}`, {
        method: 'DELETE',
      });

      const datos = await respuestaBackend.json();

      if (!respuestaBackend.ok) {
        setMensajeAyuda(datos.mensaje || 'No se pudo usar la recompensa.');
        return false;
      }

      const nuevoInventario = inventario.filter((item) => item.id !== recompensa.id);

      setInventario(nuevoInventario);
      localStorage.setItem('inventarioRecompensas', JSON.stringify(nuevoInventario));

      return true;
    } catch {
      setMensajeAyuda('No se pudo conectar con el servidor para usar la recompensa.');
      return false;
    }
  };

  const usarPista = async () => {
    if (pistaActiva) {
      setMensajeAyuda('Ya usaste una pista en esta pregunta.');
      return;
    }

    const usada = await consumirRecompensa('Pista');

    if (!usada) {
      setMensajeAyuda('No tienes pistas disponibles. Puedes comprar una en Recompensas.');
      return;
    }

    setPistaActiva(true);
    setMensajeAyuda(`Pista: ${preguntaActual.concepto}`);
  };

  const eliminarRespuestaIncorrecta = async () => {
    const incorrectasDisponibles = preguntaActual.opciones.filter(
      (opcion) =>
        opcion !== preguntaActual.correcta && !opcionesEliminadas.includes(opcion)
    );

    if (incorrectasDisponibles.length === 0) {
      setMensajeAyuda('Ya no hay respuestas incorrectas para eliminar.');
      return;
    }

    const usada = await consumirRecompensa('Eliminar respuesta incorrecta');

    if (!usada) {
      setMensajeAyuda(
        'No tienes esta recompensa disponible. Puedes comprarla en Recompensas.'
      );
      return;
    }

    const opcionEliminada = incorrectasDisponibles[0];

    setOpcionesEliminadas([...opcionesEliminadas, opcionEliminada]);
    setMensajeAyuda(`Se eliminó una respuesta incorrecta: ${opcionEliminada}.`);

    if (respuesta === opcionEliminada) {
      setRespuesta('');
    }
  };

  const usarReintento = async () => {
    if (!respondido || correcta) {
      setMensajeAyuda('El reintento solo se puede usar después de una respuesta incorrecta.');
      return;
    }

    const usada = await consumirRecompensa('Reintento');

    if (!usada) {
      setMensajeAyuda('No tienes reintentos disponibles. Puedes comprar uno en Recompensas.');
      return;
    }

    setRespuesta('');
    setMensaje('');
    setRespondido(false);
    setCorrecta(false);
    setMensajeAyuda('Reintento activado. Puedes responder nuevamente.');
  };

  const responderQuiz = () => {
    if (respuesta === '') {
      setMensaje('Debes seleccionar una respuesta antes de continuar.');
      setCorrecta(false);
      return;
    }

    if (respuesta === preguntaActual.correcta) {
      setMensaje('Respuesta correcta.');
      setCorrecta(true);
      setAciertos((valorActual) => valorActual + 1);
    } else {
      setMensaje(`Respuesta incorrecta. La respuesta correcta es: ${preguntaActual.correcta}.`);
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
      setMensajeAyuda('');
      setRespondido(false);
      setCorrecta(false);
      setOpcionesEliminadas([]);
      setPistaActiva(false);
    } else {
      finalizarQuiz();
    }
  };

  const finalizarQuiz = async () => {
    if (guardandoResultado || quizFinalizado) return;

    const usuarioActivo = obtenerUsuarioActivo();
    const usuarioId = obtenerUsuarioId();

    if (!usuarioId) {
      setMensaje('No se encontró el usuario activo. Inicia sesión nuevamente.');
      setCorrecta(false);
      return;
    }

    const xpGanado = aciertos * 100;
    const monedasGanadas = aciertos * 25;

    try {
      setGuardandoResultado(true);
      setMensaje('Guardando resultado del quiz...');

      const respuestaBackend = await fetch(`${API_URL}/api/quizzes/resultados`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: usuarioId,
          clase: claseActual.clase,
          preguntas: preguntas.length,
          aciertos,
          xp: xpGanado,
          monedas: monedasGanadas,
        }),
      });

      const datos = await respuestaBackend.json();

      if (!respuestaBackend.ok) {
        setMensaje(datos.mensaje || 'No se pudo guardar el resultado del quiz.');
        setCorrecta(false);
        return;
      }

      const nuevoQuiz = datos.resultado;

      const historialActual =
        JSON.parse(localStorage.getItem('historialQuizzes')) || [];

      localStorage.setItem(
        'historialQuizzes',
        JSON.stringify([nuevoQuiz, ...historialActual])
      );

      if (usuarioActivo) {
        const usuarioActualizado = {
          ...usuarioActivo,
          xp: (usuarioActivo.xp || 0) + xpGanado,
          monedas: (usuarioActivo.monedas || 0) + monedasGanadas,
        };

        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      }

      setQuizFinalizado(true);
      setMensaje(
        `Quiz finalizado. Obtuviste ${aciertos} de ${preguntas.length} respuestas correctas.`
      );
      setCorrecta(true);
    } catch {
      setMensaje('No se pudo conectar con el servidor. Revisa que el backend esté encendido.');
      setCorrecta(false);
    } finally {
      setGuardandoResultado(false);
    }
  };

  function reiniciarQuiz() {
    setIndicePregunta(0);
    setRespuesta('');
    setMensaje('');
    setMensajeAyuda('');
    setRespondido(false);
    setCorrecta(false);
    setAciertos(0);
    setQuizFinalizado(false);
    setOpcionesEliminadas([]);
    setPistaActiva(false);
    setGuardandoResultado(false);
  }

  const porcentajeResultado = Math.round((aciertos / preguntas.length) * 100);

  const opcionesVisibles = preguntaActual.opciones.filter(
    (opcion) => !opcionesEliminadas.includes(opcion)
  );

  return (
    <div className="page">
      <Navbar />

      <main className="main-content">
        <section className="quiz-header">
          <div>
            <span className="eyebrow">Evaluación rápida</span>
            <h1>Quiz de práctica</h1>
            <p>Usa tus recompensas para ayudarte durante la evaluación.</p>
          </div>

          <Link to="/dashboard" className="secondary-action">
            Volver al dashboard
          </Link>
        </section>

        <section className="quiz-selector">
          <div>
            <label>Selecciona una clase</label>
            <select
              value={claseSeleccionada}
              onChange={(e) => setClaseSeleccionada(Number(e.target.value))}
              disabled={respondido && !quizFinalizado}
            >
              {contenidosEstudio.map((clase, index) => (
                <option key={clase.clase} value={index}>
                  {clase.icono} {clase.clase}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="quiz-layout">
          <div className="quiz-panel">
            {!quizFinalizado ? (
              <>
                <span className="quiz-label">
                  Pregunta {indicePregunta + 1} de {preguntas.length}
                </span>

                <h2>{preguntaActual.pregunta}</h2>

                <p className="quiz-topic">
                  Tema: <strong>{preguntaActual.tema}</strong>
                </p>

                {mensajeAyuda && <div className="help-box">{mensajeAyuda}</div>}

                <div className="options-list">
                  {opcionesVisibles.map((opcion) => (
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
                  <button
                    className="quiz-button"
                    onClick={siguientePregunta}
                    disabled={guardandoResultado}
                  >
                    {guardandoResultado
                      ? 'Guardando...'
                      : indicePregunta + 1 === preguntas.length
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
              <div className="quiz-final-card">
                <span className="quiz-label">Resultado final</span>

                <h2>Quiz completado</h2>

                <div className="final-score">
                  <strong>{porcentajeResultado}%</strong>
                  <span>
                    {aciertos} de {preguntas.length} respuestas correctas
                  </span>
                </div>

                <div className="result-box success">
                  Ganaste {aciertos * 100} XP y {aciertos * 25} monedas.
                </div>

                <button className="quiz-button" onClick={reiniciarQuiz}>
                  Repetir quiz
                </button>
              </div>
            )}
          </div>

          <aside className="reward-panel">
            <h3>Herramientas del inventario</h3>
            <p>Usa recompensas compradas en la tienda.</p>

            <div className="quiz-tools">
              <button
                className="tool-button"
                onClick={usarPista}
                disabled={quizFinalizado || respondido || obtenerCantidad('Pista') === 0}
              >
                Usar pista
                <span>{obtenerCantidad('Pista')}</span>
              </button>

              <button
                className="tool-button"
                onClick={eliminarRespuestaIncorrecta}
                disabled={
                  quizFinalizado ||
                  respondido ||
                  obtenerCantidad('Eliminar respuesta incorrecta') === 0
                }
              >
                Eliminar incorrecta
                <span>{obtenerCantidad('Eliminar respuesta incorrecta')}</span>
              </button>

              <button
                className="tool-button"
                onClick={usarReintento}
                disabled={
                  quizFinalizado ||
                  !respondido ||
                  correcta ||
                  obtenerCantidad('Reintento') === 0
                }
              >
                Usar reintento
                <span>{obtenerCantidad('Reintento')}</span>
              </button>
            </div>

            <div className="reward-item">
              <span>Clase</span>
              <strong>{claseActual.clase}</strong>
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