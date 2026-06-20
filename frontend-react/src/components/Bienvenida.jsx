import { useNavigate } from 'react-router-dom';
import './Bienvenida.css';

function EmailConfirmado() {
  const navigate = useNavigate();

  return (
    <div className="email-confirmado-container">
      <div className="email-confirmado-card">
        <div className="email-confirmado-icono">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p className="email-confirmado-marca">StudyQuest</p>
        <h1 className="email-confirmado-titulo">¡Bienvenido!</h1>

        <p className="email-confirmado-texto">
          Ahora sos integrante de la mejor app de estudio para
          universitarios: <strong>StudyQuest</strong>
        </p>



        <div className="email-confirmado-beneficios">
          <span>Gana monedas</span>
          <span>Sube de nivel</span>
          <span>Cumple retos</span>
        </div>
      </div>
    </div>
  );
}

export default EmailConfirmado;