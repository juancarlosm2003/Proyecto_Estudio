import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Registro from './components/Registro';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import SesionEstudio from './components/SesionEstudio';
import Recompensas from './components/Recompensas';
import Progreso from './components/Progreso';
import Perfil from './components/Perfil';
import Logros from './components/Logros';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    const temaGuardado = localStorage.getItem('tema');

    if (temaGuardado === 'oscuro') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quiz"
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sesion-estudio"
        element={
          <ProtectedRoute>
            <SesionEstudio />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recompensas"
        element={
          <ProtectedRoute>
            <Recompensas />
          </ProtectedRoute>
        }
      />

      <Route
        path="/progreso"
        element={
          <ProtectedRoute>
            <Progreso />
          </ProtectedRoute>
        }
      />

      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        }
      />

      <Route
        path="/logros"
        element={
          <ProtectedRoute>
            <Logros />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;