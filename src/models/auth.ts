import pool from '../database';
import { UsuarioDTO } from '../DTO/auth.dto';

class AuthModel {
  static async findByCorreo(correo: string): Promise<UsuarioDTO | null> {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return (rows as UsuarioDTO[])[0] || null;
  }

  static async create(usuario: UsuarioDTO): Promise<{ id: number }> {
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
