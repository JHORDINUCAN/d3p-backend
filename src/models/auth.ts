import pool from '../database';

export interface Usuario {
  id_usuario?: number;
  nombre: string;
  correo: string;
  contraseña: string;
  direccion?: string;
  rol?: 'usuario' | 'admin';
}

class AuthModel {
  static async findByCorreo(correo: string): Promise<Usuario | null> {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return (rows as Usuario[])[0] || null;
  }

  static async create(usuario: Usuario): Promise<{ id: number }> {
    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre, correo, contraseña, direccion, rol)
       VALUES (?, ?, ?, ?, ?)`,
      [
        usuario.nombre,
        usuario.correo,
        usuario.contraseña,
        usuario.direccion || null,
        usuario.rol || 'usuario'
      ]
    );
    return { id: (result as any).insertId };
  }
}

export default AuthModel;
