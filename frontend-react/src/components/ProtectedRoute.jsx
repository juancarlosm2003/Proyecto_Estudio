import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { usuario, cargandoUsuario } = useAuth();

  if (cargandoUsuario) {
    return <p>Cargando usuario...</p>;
  }

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;