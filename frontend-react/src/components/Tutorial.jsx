import { useState } from 'react';
import API_URL from '../services/api';

function Tutorial({ usuario, onCompletar }) {
    const [paso, setPaso] = useState(0);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const pasos = [
        {
            titulo: 'Bienvenido a StudyQuest',
            texto:
                'Esta aplicación te ayuda a estudiar mediante sesiones, quizzes, experiencia, monedas y recompensas.',
        },
        {
            titulo: 'Gana experiencia',
            texto:
                'Cada vez que estudies o completes actividades, ganarás XP. El XP te ayuda a subir de nivel.',
        },
        {
            titulo: 'Usa monedas',
            texto:
                'Las monedas se pueden usar para comprar recompensas, ayudas o ventajas dentro de la aplicación.',
        },
        {
            titulo: 'Completa quizzes',
            texto:
                'Los quizzes te permiten practicar lo aprendido y ganar recompensas según tu desempeño.',
        },
        {
            titulo: '¡Comenzemos!',
            texto:
                'Completa el tutorial para utilizar StudyQuest',
        },
    ];

    const esUltimoPaso = paso === pasos.length - 1;

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
        if (esUltimoPaso) {
            completarTutorial();
            return;
        }

        setPaso((pasoActual) => pasoActual + 1);
    };

    const retroceder = () => {
        if (paso > 0) {
            setPaso((pasoActual) => pasoActual - 1);
        }
    };

    return (
        <div className="tutorial-overlay">
            <div className="tutorial-modal">
                <span className="eyebrow">Tutorial inicial</span>

                <h1>{pasos[paso].titulo}</h1>

                <p>{pasos[paso].texto}</p>

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