import express from 'express';
import cors from 'cors';
import { dbConnect, supabaseAdmin } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnect();

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de StudyQuest funcionando correctamente',
  });
});

/* =========================
   CLASES
========================= */

app.get('/api/clases', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('clases')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return res.status(500).json({
      mensaje: 'Error al obtener clases',
      error: error.message,
    });
  }

  res.json({
    mensaje: 'Clases obtenidas correctamente',
    clases: data,
  });
});

/* =========================
   RECOMPENSAS
========================= */

app.get('/api/recompensas', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('recompensas')
    .select('*')
    .order('costo', { ascending: true });

  if (error) {
    return res.status(500).json({
      mensaje: 'Error al obtener recompensas',
      error: error.message,
    });
  }

  res.json({
    mensaje: 'Recompensas obtenidas correctamente',
    recompensas: data,
  });
});

/* =========================
   USUARIOS
========================= */

app.post('/api/usuarios/registro', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({
      mensaje: 'Nombre, correo y contraseña son obligatorios',
    });
  }

  const { data: usuarioExistente, error: errorBusqueda } = await supabaseAdmin
    .from('usuarios')
    .select('*')
    .eq('correo', correo)
    .maybeSingle();

  if (errorBusqueda) {
    return res.status(500).json({
      mensaje: 'Error al verificar si el usuario ya existe',
      error: errorBusqueda.message,
    });
  }

  if (usuarioExistente) {
    return res.status(400).json({
      mensaje: 'El correo ya está registrado',
    });
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
    email: correo,
    password: contrasena,
    options: {
      data: { nombre },
      emailRedirectTo: 'http://localhost:5173/email-confirmado',
    },
  });

   if (authError) {
    return res.status(500).json({
      mensaje: 'Error al autenticar al usuario',
      error: authError.message,
    });
  }

  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .insert([
      {
        id: authData.user.id,
        nombre,
        correo,
        contrasena,
        xp: 1200,
        monedas: 350,
        nivel: 3,
      },
    ])
    .select()
    .single();


  if (error) {
    return res.status(500).json({
      mensaje: 'Error al registrar usuario',
      error: error.message,
    });
  }

  res.status(201).json({
    mensaje: 'Usuario registrado correctamente',
    usuario: data,
  });
});

app.post('/api/usuarios/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({
      mensaje: 'Correo y contraseña son obligatorios',
    });
  }

  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .select('*')
    .eq('correo', correo)
    .eq('contrasena', contrasena)
    .maybeSingle();

  if (error) {
    return res.status(500).json({
      mensaje: 'Error al iniciar sesión',
      error: error.message,
    });
  }

  if (!data) {
    return res.status(401).json({
      mensaje: 'Correo o contraseña incorrectos',
    });
  }

  res.json({
    mensaje: 'Inicio de sesión correcto',
    usuario: data,
  });
});

app.get('/api/usuarios/:id/perfil', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({
      mensaje: 'Error al obtener perfil',
      error: error.message,
    });
  }

  if (!data) {
    return res.status(404).json({
      mensaje: 'Usuario no encontrado',
    });
  }

  res.json({
    mensaje: 'Perfil obtenido correctamente',
    usuario: data,
  });
});

app.put('/api/usuarios/:id/perfil', async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({
      mensaje: 'El nombre es obligatorio',
    });
  }

  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .update({ nombre })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      mensaje: 'Error al actualizar perfil',
      error: error.message,
    });
  }

  res.json({
    mensaje: 'Perfil actualizado correctamente',
    usuario: data,
  });
});

/* =========================
   SESIONES DE ESTUDIO
========================= */

app.post('/api/sesiones', async (req, res) => {
  const { usuario_id, clase, tema, xp, monedas } = req.body;

  if (!usuario_id || !clase || !tema) {
    return res.status(400).json({
      mensaje: 'usuario_id, clase y tema son obligatorios',
    });
  }

  const xpGanado = xp || 100;
  const monedasGanadas = monedas || 30;

  const { data: sesion, error: errorSesion } = await supabaseAdmin
    .from('sesiones_estudio')
    .insert([
      {
        usuario_id,
        clase,
        tema,
        xp: xpGanado,
        monedas: monedasGanadas,
      },
    ])
    .select()
    .single();

  if (errorSesion) {
    return res.status(500).json({
      mensaje: 'Error al guardar sesión de estudio',
      error: errorSesion.message,
    });
  }

  const { data: usuarioActual } = await supabaseAdmin
    .from('usuarios')
    .select('xp, monedas')
    .eq('id', usuario_id)
    .maybeSingle();

  if (usuarioActual) {
    await supabaseAdmin
      .from('usuarios')
      .update({
        xp: usuarioActual.xp + xpGanado,
        monedas: usuarioActual.monedas + monedasGanadas,
      })
      .eq('id', usuario_id);
  }

  res.status(201).json({
    mensaje: 'Sesión de estudio guardada correctamente',
    sesion,
  });
});

app.get('/api/sesiones/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  const { data, error } = await supabaseAdmin
    .from('sesiones_estudio')
    .select('*')
    .eq('usuario_id', usuarioId)
    .order('fecha', { ascending: false });

  if (error) {
    return res.status(500).json({
      mensaje: 'Error al obtener sesiones',
      error: error.message,
    });
  }

  res.json({
    mensaje: 'Sesiones obtenidas correctamente',
    sesiones: data,
  });
});

/* =========================
   QUIZZES
========================= */

app.post('/api/quizzes/resultados', async (req, res) => {
  const { usuario_id, clase, preguntas, aciertos, xp, monedas } = req.body;

  if (!usuario_id || !clase) {
    return res.status(400).json({
      mensaje: 'usuario_id y clase son obligatorios',
    });
  }

  const xpGanado = xp || 0;
  const monedasGanadas = monedas || 0;

  const { data: resultado, error } = await supabaseAdmin
    .from('resultados_quizzes')
    .insert([
      {
        usuario_id,
        clase,
        preguntas: preguntas || 10,
        aciertos: aciertos || 0,
        xp: xpGanado,
        monedas: monedasGanadas,
      },
    ])
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      mensaje: 'Error al guardar resultado de quiz',
      error: error.message,
    });
  }

  const { data: usuarioActual } = await supabaseAdmin
    .from('usuarios')
    .select('xp, monedas')
    .eq('id', usuario_id)
    .maybeSingle();

  if (usuarioActual) {
    await supabaseAdmin
      .from('usuarios')
      .update({
        xp: usuarioActual.xp + xpGanado,
        monedas: usuarioActual.monedas + monedasGanadas,
      })
      .eq('id', usuario_id);
  }

  res.status(201).json({
    mensaje: 'Resultado de quiz guardado correctamente',
    resultado,
  });
});

app.get('/api/quizzes/resultados/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  const { data, error } = await supabaseAdmin
    .from('resultados_quizzes')
    .select('*')
    .eq('usuario_id', usuarioId)
    .order('fecha', { ascending: false });

  if (error) {
    return res.status(500).json({
      mensaje: 'Error al obtener resultados de quizzes',
      error: error.message,
    });
  }

  res.json({
    mensaje: 'Resultados obtenidos correctamente',
    resultados: data,
  });
});

/* =========================
   PROGRESO
========================= */

app.get('/api/progreso/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  const { data: usuario, error: errorUsuario } = await supabaseAdmin
    .from('usuarios')
    .select('*')
    .eq('id', usuarioId)
    .maybeSingle();

  if (errorUsuario) {
    return res.status(500).json({
      mensaje: 'Error al obtener usuario',
      error: errorUsuario.message,
    });
  }

  const { data: sesiones, error: errorSesiones } = await supabaseAdmin
    .from('sesiones_estudio')
    .select('*')
    .eq('usuario_id', usuarioId)
    .order('fecha', { ascending: false });

  if (errorSesiones) {
    return res.status(500).json({
      mensaje: 'Error al obtener sesiones',
      error: errorSesiones.message,
    });
  }

  const { data: quizzes, error: errorQuizzes } = await supabaseAdmin
    .from('resultados_quizzes')
    .select('*')
    .eq('usuario_id', usuarioId)
    .order('fecha', { ascending: false });

  if (errorQuizzes) {
    return res.status(500).json({
      mensaje: 'Error al obtener quizzes',
      error: errorQuizzes.message,
    });
  }

  res.json({
    mensaje: 'Progreso obtenido correctamente',
    usuario,
    totalSesiones: sesiones.length,
    totalQuizzes: quizzes.length,
    sesiones,
    quizzes,
  });
});

/* =========================
   INVENTARIO Y CANJE DE RECOMPENSAS
========================= */

app.get('/api/inventario/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  const { data, error } = await supabaseAdmin
    .from('inventario_recompensas')
    .select('*')
    .eq('usuario_id', usuarioId)
    .order('fecha', { ascending: false });

  if (error) {
    return res.status(500).json({
      mensaje: 'Error al obtener inventario',
      error: error.message,
    });
  }

  res.json({
    mensaje: 'Inventario obtenido correctamente',
    inventario: data,
  });
});

app.post('/api/recompensas/canjear', async (req, res) => {
  const { usuario_id, recompensa_id } = req.body;

  if (!usuario_id || !recompensa_id) {
    return res.status(400).json({
      mensaje: 'usuario_id y recompensa_id son obligatorios',
    });
  }

  const { data: recompensa, error: errorRecompensa } = await supabaseAdmin
    .from('recompensas')
    .select('*')
    .eq('id', recompensa_id)
    .maybeSingle();

  if (errorRecompensa) {
    return res.status(500).json({
      mensaje: 'Error al buscar recompensa',
      error: errorRecompensa.message,
    });
  }

  if (!recompensa) {
    return res.status(404).json({
      mensaje: 'Recompensa no encontrada',
    });
  }

  const { data: usuario, error: errorUsuario } = await supabaseAdmin
    .from('usuarios')
    .select('id, monedas')
    .eq('id', usuario_id)
    .maybeSingle();

  if (errorUsuario) {
    return res.status(500).json({
      mensaje: 'Error al buscar usuario',
      error: errorUsuario.message,
    });
  }

  if (!usuario) {
    return res.status(404).json({
      mensaje: 'Usuario no encontrado',
    });
  }

  if (usuario.monedas < recompensa.costo) {
    return res.status(400).json({
      mensaje: 'No tienes suficientes monedas para esta recompensa',
    });
  }

  const nuevasMonedas = usuario.monedas - recompensa.costo;

  const { data: inventario, error: errorInventario } = await supabaseAdmin
    .from('inventario_recompensas')
    .insert([
      {
        usuario_id,
        recompensa_id,
        nombre: recompensa.nombre,
        tipo: recompensa.tipo,
        costo: recompensa.costo,
        icono: recompensa.icono,
      },
    ])
    .select()
    .single();

  if (errorInventario) {
    return res.status(500).json({
      mensaje: 'Error al guardar recompensa en inventario',
      error: errorInventario.message,
    });
  }

  const { data: usuarioActualizado, error: errorActualizarUsuario } =
    await supabaseAdmin
      .from('usuarios')
      .update({ monedas: nuevasMonedas })
      .eq('id', usuario_id)
      .select()
      .single();

  if (errorActualizarUsuario) {
    return res.status(500).json({
      mensaje: 'Error al actualizar monedas del usuario',
      error: errorActualizarUsuario.message,
    });
  }

  res.status(201).json({
    mensaje: 'Recompensa canjeada correctamente',
    inventario,
    usuario: usuarioActualizado,
  });
});

app.delete('/api/inventario/:inventarioId', async (req, res) => {
  const { inventarioId } = req.params;

  const { data, error } = await supabaseAdmin
    .from('inventario_recompensas')
    .delete()
    .eq('id', inventarioId)
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      mensaje: 'Error al usar la recompensa del inventario',
      error: error.message,
    });
  }

  res.json({
    mensaje: 'Recompensa usada correctamente',
    recompensaUsada: data,
  });
});

/* =========================
   SERVIDOR
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});