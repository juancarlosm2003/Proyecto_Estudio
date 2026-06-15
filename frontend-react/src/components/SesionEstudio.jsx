import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import contenidosEstudio from '../data/contenidosEstudio';

function SesionEstudio() {
  const DURACION_INICIAL = 25 * 60;

  const [claseSeleccionada, setClaseSeleccionada] = useState(0);
  const [temaSeleccionado, setTemaSeleccionado] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(DURACION_INICIAL);
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [sesionPausada, setSesionPausada] = useState(false);
  const [sesionCompletada, setSesionCompletada] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(false);
  const [preguntaRespondida, setPreguntaRespondida] = useState(false);
  const [checklistMarcado, setChecklistMarcado] = useState([]);

  const claseActual = contenidosEstudio[claseSeleccionada];
  const temaActual = claseActual.temas[temaSeleccionado];

  useEffect(() => {
    setTemaSeleccionado(0);
    setChecklistMarcado([]);
    setRespuesta('');
    setPreguntaRespondida(false);
    setRespuestaCorrecta(false);
    setMensaje('');
  }, [claseSeleccionada]);

  useEffect(() => {
    setChecklistMarcado([]);
    setRespuesta('');
    setPreguntaRespondida(false);
    setRespuestaCorrecta(false);
    setMensaje('');
  }, [temaSeleccionado]);

  useEffect(() => {
    if (!sesionIniciada || sesionPausada || sesionCompletada) return;

    const intervalo = setInterval(() => {
      setTiempoRestante((tiempoAnterior) => {
        if (tiempoAnterior <= 1) {
          clearInterval(intervalo);
          return 0;
        }

        return tiempoAnterior - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [sesionIniciada, sesionPausada, sesionCompletada]);

  const iniciarSesion = () => {
    setSesionIniciada(true);
    setSesionPausada(false);
    setSesionCompletada(false);
    setMensaje('Sesión iniciada. Lee el contenido y responde la mini pregunta.');
  };

  const pausarSesion = () => {
    setSesionPausada(true);
    setMensaje('Sesión pausada.');
  };

  const continuarSesion = () => {
    setSesionPausada(false);
    setMensaje('Sesión reanudada.');
  };

  const marcarChecklist = (index) => {
    if (checklistMarcado.includes(index)) {
      setChecklistMarcado(checklistMarcado.filter((item) => item !== index));
    } else {
      setChecklistMarcado([...checklistMarcado, index]);
    }
  };

  const responderPregunta = () => {
    if (respuesta === '') {
      setMensaje('Selecciona una respuesta antes de continuar.');
      return;
    }

    setPreguntaRespondida(true);

    if (respuesta === temaActual.correcta) {
      setRespuestaCorrecta(true);
      setMensaje('Respuesta correcta. Ya puedes completar la sesión.');
    } else {
      setRespuestaCorrecta(false);
      setMensaje(`Respuesta incorrecta. La respuesta correcta es: ${temaActual.correcta}.`);
    }
  };

  const completarSesion = () => {
    if (!preguntaRespondida) {
      setMensaje('Primero responde la mini pregunta para completar la sesión.');
      return;
    }

    if (!respuestaCorrecta) {
      setMensaje('Debes responder correctamente para ganar la recompensa.');
      return;
    }

    if (sesionCompletada) return;

    const xpGanado = 100;
    const monedasGanadas = 30;

    const xpActual = Number(localStorage.getItem('xp')) || 1200;
    const monedasActuales = Number(localStorage.getItem('monedas')) || 350;

    localStorage.setItem('xp', xpActual + xpGanado);
    localStorage.setItem('monedas', monedasActuales + monedasGanadas);

    const historialActual = JSON.parse(localStorage.getItem('historialSesiones')) || [];

    const nuevaSesion = {
      clase: claseActual.clase,
      tema: temaActual.titulo,
      xp: xpGanado,
      monedas: monedasGanadas,
      fecha: new Date().toLocaleDateString(),
    };

    localStorage.setItem(
      'historialSesiones',
      JSON.stringify([nuevaSesion, ...historialActual])
    );

    setSesionCompletada(true);
    setSesionIniciada(false);
    setSesionPausada(false);
    setMensaje('Sesión completada. Ganaste 100 XP y 30 monedas.');
  };

  const reiniciarSesion = () => {
    setTiempoRestante(DURACION_INICIAL);
    setSesionIniciada(false);
    setSesionPausada(false);
    setSesionCompletada(false);
    setMensaje('');
    setRespuesta('');
    setPreguntaRespondida(false);
    setRespuestaCorrecta(false);
    setChecklistMarcado([]);
  };

  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;
  const tiempoFormateado = `${minutos}:${segundos.toString().padStart(2, '0')}`;

  const progresoChecklist =
    (checklistMarcado.length / temaActual.checklist.length) * 100;

  return (
    <div className="page">
      <Navbar />

      <main className="main-content">
        <section className="study-header">
          <div>
            <span className="eyebrow">Lección guiada</span>
            <h1>Sesión de estudio</h1>
            <p>Selecciona una clase, estudia el contenido y completa la actividad.</p>
          </div>

          <Link to="/dashboard" className="secondary-action">
            Volver al dashboard
          </Link>
        </section>

        <section className="study-selector">
          <div>
            <label>Selecciona una clase</label>
            <select
              value={claseSeleccionada}
              onChange={(e) => setClaseSeleccionada(Number(e.target.value))}
              disabled={sesionIniciada}
            >
              {contenidosEstudio.map((clase, index) => (
                <option key={clase.clase} value={index}>
                  {clase.icono} {clase.clase}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Selecciona un tema</label>
            <select
              value={temaSeleccionado}
              onChange={(e) => setTemaSeleccionado(Number(e.target.value))}
              disabled={sesionIniciada}
            >
              {claseActual.temas.map((tema, index) => (
                <option key={tema.titulo} value={index}>
                  {tema.titulo}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="study-layout">
          <div className="study-card main-study-card">
            <span className="study-status">
              {sesionCompletada
                ? 'Sesión completada'
                : sesionIniciada
                ? sesionPausada
                  ? 'Sesión pausada'
                  : 'Sesión en progreso'
                : 'Pendiente de iniciar'}
            </span>

            <h2>
              {claseActual.icono} {temaActual.titulo}
            </h2>

            <div className="lesson-block">
              <h3>Concepto</h3>
              <p>{temaActual.concepto}</p>
            </div>

            <div className="lesson-block">
              <h3>Explicación</h3>
              <p>{temaActual.explicacion}</p>
            </div>

            <div className="lesson-block example-block">
              <h3>Ejemplo</h3>
              <p>{temaActual.ejemplo}</p>
            </div>

            <div className="checklist-box">
              <div className="section-title compact-title">
                <div>
                  <h2>Checklist de comprensión</h2>
                  <p>Marca lo que ya entendiste.</p>
                </div>

                <strong>{Math.round(progresoChecklist)}%</strong>
              </div>

              {temaActual.checklist.map((item, index) => (
                <label className="study-check" key={item}>
                  <input
                    type="checkbox"
                    checked={checklistMarcado.includes(index)}
                    onChange={() => marcarChecklist(index)}
                  />
                  {item}
                </label>
              ))}
            </div>

            <div className="mini-question">
              <h3>Mini pregunta</h3>
              <p>{temaActual.pregunta}</p>

              <div className="options-list">
                {temaActual.opciones.map((opcion) => (
                  <label
                    key={opcion}
                    className={`option-card ${respuesta === opcion ? 'selected-option' : ''}`}
                  >
                    <input
                      type="radio"
                      name="miniPregunta"
                      value={opcion}
                      checked={respuesta === opcion}
                      disabled={preguntaRespondida}
                      onChange={(e) => setRespuesta(e.target.value)}
                    />
                    {opcion}
                  </label>
                ))}
              </div>

              {!preguntaRespondida && (
                <button className="quiz-button" onClick={responderPregunta}>
                  Responder mini pregunta
                </button>
              )}
            </div>

            {mensaje && (
              <div className={respuestaCorrecta || sesionCompletada ? 'result-box success' : 'result-box error'}>
                {mensaje}
              </div>
            )}
          </div>

          <aside className="study-card">
            <h3>Control de sesión</h3>
            <p>Completa la lección para ganar recompensa.</p>

            <div className="timer-box">
              <h3>{tiempoFormateado}</h3>
              <p>tiempo restante</p>
            </div>

            <div className="study-actions vertical-actions">
              {!sesionIniciada && !sesionCompletada && (
                <button className="start-button" onClick={iniciarSesion}>
                  Iniciar sesión
                </button>
              )}

              {sesionIniciada && !sesionPausada && (
                <button className="finish-button" onClick={pausarSesion}>
                  Pausar
                </button>
              )}

              {sesionIniciada && sesionPausada && (
                <button className="start-button" onClick={continuarSesion}>
                  Continuar
                </button>
              )}

              <button
                className="finish-button"
                onClick={completarSesion}
                disabled={sesionCompletada}
              >
                Completar sesión
              </button>

              <button className="reset-button" onClick={reiniciarSesion}>
                Reiniciar
              </button>
            </div>

            <div className="reward-item">
              <span>XP</span>
              <strong>+100</strong>
            </div>

            <div className="reward-item">
              <span>Monedas</span>
              <strong>+30</strong>
            </div>

            <div className="reward-item">
              <span>Clase</span>
              <strong>{claseActual.clase}</strong>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default SesionEstudio;