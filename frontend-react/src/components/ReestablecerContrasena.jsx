import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

function ReestablecerContrasena() {
    const location = useLocation();
    const navigate = useNavigate();

    const estaRestableciendo =
        location.pathname === '/reestablecer-contrasena';

    const [correo, setCorreo] = useState('');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('');
    const [cargando, setCargando] = useState(false);

    const limpiarMensaje = () => {
        setMensaje('');
        setTipoMensaje('');
    };

    const enviarCorreoRecuperacion = async (e) => {
        e.preventDefault();

        const correoIngresado = correo.trim().toLowerCase();

        if (!correoIngresado) {
            setMensaje('Ingresa tu correo electrónico.');
            setTipoMensaje('error');
            return;
        }

        try {
            setCargando(true);
            limpiarMensaje();

            const { error } = await supabase.auth.resetPasswordForEmail(
                correoIngresado,
                {
                    redirectTo: 'http://localhost:5173/reestablecer-contrasena',
                }
            );

            if (error) {
                setMensaje(error.message || 'No se pudo enviar el correo de recuperación.');
                setTipoMensaje('error');
                return;
            }

            setMensaje(
                'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.'
            );
            setTipoMensaje('success');
            setCorreo('');
        } catch {
            setMensaje('No se pudo conectar con Supabase.');
            setTipoMensaje('error');
        } finally {
            setCargando(false);
        }
    };

    const actualizarContrasena = async (e) => {
        e.preventDefault();

        if (!nuevaContrasena || !confirmarContrasena) {
            setMensaje('Completa ambos campos.');
            setTipoMensaje('error');
            return;
        }

        if (nuevaContrasena.length < 6) {
            setMensaje('La contraseña debe tener al menos 6 caracteres.');
            setTipoMensaje('error');
            return;
        }

        if (nuevaContrasena !== confirmarContrasena) {
            setMensaje('Las contraseñas no coinciden.');
            setTipoMensaje('error');
            return;
        }

        try {
            setCargando(true);
            limpiarMensaje();

            const { error } = await supabase.auth.updateUser({
                password: nuevaContrasena,
            });

            if (error) {
                setMensaje(error.message || 'No se pudo actualizar la contraseña.');
                setTipoMensaje('error');
                return;
            }

            setMensaje('Contraseña actualizada correctamente. Ahora puedes iniciar sesión.');
            setTipoMensaje('success');

            setNuevaContrasena('');
            setConfirmarContrasena('');

            setTimeout(() => {
                navigate('/', { replace: true });
            }, 1800);
        } catch {
            setMensaje('No se pudo conectar con Supabase.');
            setTipoMensaje('error');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-wrapper">
                <section className="login-info">
                    <span className="app-badge">
                        {estaRestableciendo ? 'Nueva contraseña' : 'Recuperación de cuenta'}
                    </span>

                    <h1>
                        {estaRestableciendo
                            ? 'Crea una nueva contraseña'
                            : 'Restablecer contraseña'}
                    </h1>

                    <p>
                        {estaRestableciendo
                            ? 'Escribe una contraseña nueva para recuperar el acceso a tu cuenta.'
                            : 'Ingresa tu correo electrónico y te enviaremos un enlace para crear una nueva contraseña.'}
                    </p>
                </section>

                <section className="login-card modern-login-card">
                    <h2>
                        {estaRestableciendo
                            ? 'Actualizar contraseña'
                            : 'Olvidé mi contraseña'}
                    </h2>

                    <p>
                        {estaRestableciendo
                            ? 'Usa una contraseña segura y fácil de recordar'
                            : 'Recibe un enlace de recuperación en tu correo'}
                    </p>

                    {!estaRestableciendo ? (
                        <form onSubmit={enviarCorreoRecuperacion}>
                            <label htmlFor="correo">Correo electrónico</label>

                            <input
                                id="correo"
                                type="email"
                                placeholder="estudiante@correo.com"
                                value={correo}
                                onChange={(e) => {
                                    setCorreo(e.target.value);
                                    limpiarMensaje();
                                }}
                                autoComplete="email"
                                required
                            />

                            {mensaje && (
                                <div
                                    className={
                                        tipoMensaje === 'error'
                                            ? 'login-error'
                                            : 'store-message result-box success'
                                    }
                                >
                                    {mensaje}
                                </div>
                            )}

                            <button type="submit" className="login-button" disabled={cargando}>
                                {cargando ? 'Enviando...' : 'Enviar enlace'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={actualizarContrasena}>
                            <label htmlFor="nuevaContrasena">Nueva contraseña</label>

                            <input
                                id="nuevaContrasena"
                                type="password"
                                placeholder="Nueva contraseña"
                                value={nuevaContrasena}
                                onChange={(e) => {
                                    setNuevaContrasena(e.target.value);
                                    limpiarMensaje();
                                }}
                                autoComplete="new-password"
                                required
                            />

                            <label htmlFor="confirmarContrasena">Confirmar contraseña</label>

                            <input
                                id="confirmarContrasena"
                                type="password"
                                placeholder="Repite la nueva contraseña"
                                value={confirmarContrasena}
                                onChange={(e) => {
                                    setConfirmarContrasena(e.target.value);
                                    limpiarMensaje();
                                }}
                                autoComplete="new-password"
                                required
                            />

                            {mensaje && (
                                <div
                                    className={
                                        tipoMensaje === 'error'
                                            ? 'login-error'
                                            : 'store-message result-box success'
                                    }
                                >
                                    {mensaje}
                                </div>
                            )}

                            <button type="submit" className="login-button" disabled={cargando}>
                                {cargando ? 'Actualizando...' : 'Actualizar contraseña'}
                            </button>
                        </form>
                    )}

                    <p className="register">
                        <Link to="/">Volver al login</Link>
                    </p>
                </section>
            </div>
        </div>
    );
}

export default ReestablecerContrasena;