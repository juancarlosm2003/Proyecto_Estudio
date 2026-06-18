import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

const dbConnect = async () => {
  try {
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.log('Faltan variables de entorno de Supabase.');
      return;
    }

    const { error } = await supabaseAdmin
      .from('clases')
      .select('id')
      .limit(1);

    if (error) {
      console.log('Supabase configurado, pero hubo un error consultando la tabla clases.');
      console.log(error.message);
      return;
    }

    console.log('Supabase conectado correctamente.');
  } catch (error) {
    console.log('Error al conectar con Supabase.');
    console.log(error.message);
  }
};

export { supabaseAdmin, dbConnect };