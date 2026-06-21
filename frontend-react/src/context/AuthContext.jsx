import { createContext, useContext, useEffect, useState } from 'react';
import API_URL from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [cargandoUsuario, setCargandoUsuario] = useState(true);

    const cargarUsuario = async () => {
        const usuarioId = localStorage.getItem('usuarioId');

        if (!usuarioId) {
            setUsuario(null);
            setCargandoUsuario(false);
            return;
        }

        try {
            setCargandoUsuario(true);

            const respuesta = await fetch(`${API_URL}/api/usuarios/${usuarioId}/perfil`);
            const datos = await respuesta.json();

            if (!respuesta.ok) {
                localStorage.removeItem('usuarioId');
                localStorage.removeItem('usuario');
                setUsuario(null);
                return;
            }

            setUsuario(datos.usuario);
        } catch (error) {
            console.error('Error al cargar usuario:', error);
            setUsuario(null);
        } finally {
            setCargandoUsuario(false);
        }
    };

    useEffect(() => {
        cargarUsuario();
    }, []);

    const login = (usuarioAutenticado) => {
        localStorage.setItem('usuarioId', usuarioAutenticado.id);
        localStorage.setItem('usuario', JSON.stringify(usuarioAutenticado));
        setUsuario(usuarioAutenticado);
    };

    const logout = () => {
        localStorage.removeItem('usuarioId');
        localStorage.removeItem('usuario');
        setUsuario(null);
    };

    const actualizarUsuario = (usuarioActualizado) => {
        localStorage.setItem('usuarioId', usuarioActualizado.id);
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
        setUsuario(usuarioActualizado);
    };

    return (
        <AuthContext.Provider
            value={{
                usuario,
                setUsuario,
                cargandoUsuario,
                cargarUsuario,
                login,
                logout,
                actualizarUsuario,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}