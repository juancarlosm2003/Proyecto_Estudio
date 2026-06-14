import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import SesionEstudio from './components/SesionEstudio';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import Recompensas from './components/Recompensas';
import Progreso from './components/Progreso';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/recompensas" element={<Recompensas />} />
        <Route path="/progreso" element={<Progreso />} />
        <Route path="/sesion-estudio" element={<SesionEstudio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;