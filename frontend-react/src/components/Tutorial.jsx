import { useState } from 'react';
import API_URL from '../services/api';

function Tutorial({ usuario, onCompletar }) {
    const [paso, setPaso] = useState(0);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [respuestaDemo, setRespuestaDemo] = useState('');
    const [demoRespondida, setDemoRespondida] = useState(false);
    const [demoCorrecta, setDemoCorrecta] = useState(false);

    const pasos = [
        {
            tipo: 'texto',
            titulo: 'Bienvenido a StudyQuest',
            texto:
                'StudyQuest te ayuda a estudiar mediante sesiones guiadas, quizzes, experiencia, monedas, recompensas y progreso.',
        },
        {
            tipo: 'texto',
            titulo: 'Gana XP y sube de nivel',
            texto:
                'Cada actividad completada puede darte XP. El XP representa tu avance y te permite subir de nivel dentro de la plataforma.',
        },
        {
            tipo: 'sesion',
            titulo: 'Prueba de sesión de estudio',
            texto:
                'En una sesión real eliges una clase, estudias un tema, revisas una explicación y completas una mini pregunta para ganar XP y monedas.',
        },
        {
            tipo: 'quiz',
            titulo: 'Prueba rápida de quiz',
            texto:
                'Ahora responde una pregunta de práctica. Esta respuesta no se guardará en tu historial; solo sirve para mostrarte cómo funcionan los quizzes.',
        },
        {
            tipo: 'texto',
            titulo: 'Recompensas y progreso',
            texto:
                'Las monedas sirven para comprar ayudas en la tienda. Además, puedes revisar tu progreso, historial, logros e inventario desde el panel principal.',
        },
        {
            tipo: 'final',
            titulo: '¡Comencemos!',
            texto:
                'Ya conoces lo básico de StudyQuest. Al completar el tutorial recibirás tus primeros 100 XP y 50 monedas para empezar.',
        },
    ];

    const esUltimoPaso = paso === pasos.length - 1;
    const pasoActual = pasos[paso];

    const responderDemo = (opcion) => {
        setRespuestaDemo(opcion);
        setDemoRespondida(true);

        if (opcion === 'Ganar XP y monedas') {
            setDemoCorrecta(true);
            setError('');
        } else {
            setDemoCorrecta(false);
            setError('No pasa nada. Intenta de nuevo: las actividades sirven para ganar XP y monedas.');
        }
    };

    const completarTutorial = async () => {
        if (!usuario?.id) {
            setError('No se encontró el usuario activo.');
            return;
        }

        try {
            setCargando(true);
            setError('');

            const respuesta = await fetch(`${API_URL}/api/usuarios/${usuario.id}/tutorial`, {
                method: 'POST',
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudo completar el tutorial.');
            }

            onCompletar(datos.usuario);
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    };

    const avanzar = () => {
        if (pasoActual.tipo === 'quiz' && !demoCorrecta) {
            setError('Debes responder correctamente la pregunta de práctica para continuar.');
            return;
        }

        if (esUltimoPaso) {
            completarTutorial();
            return;
        }

        setError('');
        setPaso((pasoActual) => pasoActual + 1);
    };

    const retroceder = () => {
        if (paso > 0) {
            setError('');
            setPaso((pasoActual) => pasoActual - 1);
        }
    };

    return (
        <div className="tutorial-overlay">
            <div className="tutorial-modal">
                <span className="eyebrow">Tutorial inicial</span>

                <h1>{pasoActual.titulo}</h1>

                <p>{pasoActual.texto}</p>

                {pasoActual.tipo === 'sesion' && (
                    <div className="tutorial-demo-card">
                        <span className="quiz-label">Sesión de ejemplo</span>

                        <h2>Matemáticas - Fracciones</h2>

                        <div className="lesson-block">
                            <h3>Concepto</h3>
                            <p>
                                Una fracción representa una parte de un todo. Por ejemplo, 1/2
                                significa una de dos partes iguales.
                            </p>
                        </div>

                        <div className="reward-item">
                            <span>Recompensa de ejemplo</span>
                            <strong>+100 XP / +30 monedas</strong>
                        </div>
                    </div>
                )}

                {pasoActual.tipo === 'quiz' && (
                    <div className="tutorial-demo-card">
                        <span className="quiz-label">Pregunta de práctica</span>

                        <h2>¿Qué puedes ganar al completar actividades?</h2>

                        <div className="options-list">
                            {['Perder nivel', 'Ganar XP y monedas', 'Borrar tu progreso'].map(
                                (opcion) => (
                                    <label
                                        key={opcion}
                                        className={`option-card ${respuestaDemo === opcion ? 'selected-option' : ''
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="respuestaDemo"
                                            value={opcion}
                                            checked={respuestaDemo === opcion}
                                            onChange={() => responderDemo(opcion)}
                                        />

                                        {opcion}
                                    </label>
                                )
                            )}
                        </div>

                        {demoRespondida && demoCorrecta && (
                            <div className="result-box success">
                                Correcto. Las sesiones y quizzes te ayudan a ganar XP y monedas.
                            </div>
                        )}
                    </div>
                )}

                <div className="tutorial-progress">
                    {pasos.map((_, index) => (
                        <span
                            key={index}
                            className={index <= paso ? 'tutorial-dot active' : 'tutorial-dot'}
                        />
                    ))}
                </div>

                {error && (
                    <div className="login-error" role="alert">
                        {error}
                    </div>
                )}

                <div className="tutorial-actions">
                    <button
                        type="button"
                        className="secondary-action"
                        onClick={retroceder}
                        disabled={paso === 0 || cargando}
                    >
                        Atrás
                    </button>

                    <button
                        type="button"
                        className="primary-action"
                        onClick={avanzar}
                        disabled={cargando}
                    >
                        {cargando
                            ? 'Completando...'
                            : esUltimoPaso
                                ? 'Completar tutorial'
                                : 'Siguiente'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Tutorial;