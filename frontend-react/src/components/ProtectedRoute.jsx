import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const usuarioActivo = localStorage.getItem('usuario');

  if (!usuarioActivo) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;