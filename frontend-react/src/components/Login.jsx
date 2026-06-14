import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>StudyQuest</h1>
        <p>Inicia sesión para continuar</p>

        <input type="email" placeholder="Correo electrónico" />
        <input type="password" placeholder="Contraseña" />

        <Link to="/dashboard">
          <button>Iniciar Sesión</button>
        </Link>

        <p className="register">
          ¿No tienes cuenta? <a href="#">Regístrate</a>
        </p>
      </div>
    </div>
  );
}

export default Login;