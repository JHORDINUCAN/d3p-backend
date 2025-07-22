import pool from '../database';
import { UsuarioDTO } from '../DTO/auth.dto';

class AuthModel {
  // Buscar un usuario por correo
  static async findByCorreo(correo: string): Promise<UsuarioDTO | null> {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return (rows as UsuarioDTO[])[0] || null;
  }

  // Crear un nuevo usuario
  static async create(usuario: UsuarioDTO): Promise<{ id: number }> {
    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre, correo, contraseña, direccion, rol, activo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        usuario.nombre,
        usuario.correo,
        usuario.contraseña,
        usuario.direccion || null,
        usuario.rol || 'usuario',
        1  // Asumimos que el usuario es activo al crearlo
      ]
    );
    return { id: (result as any).insertId };
  }

  // Actualizar estado activo de un usuario
  static async toggleActivo(id: number, activo: boolean): Promise<boolean> {
    const [result] = await pool.query(
      "UPDATE usuarios SET activo = ? WHERE id_usuario = ?",
      [activo ? 1 : 0, id]  // Convertir booleano a 1 o 0
    );
    return (result as any).affectedRows > 0;
  }

  // Obtener todos los usuarios
  static async getAll(): Promise<UsuarioDTO[]> {
    const result = await pool.query('SELECT * FROM usuarios');
    
    const usuarios = result[0]; // Los resultados deben estar en result[0]

    if (Array.isArray(usuarios)) {
      return usuarios.map((usuario: any) => ({
        ...usuario,
        activo: usuario.activo === 1,  // Convertir 1 a true y 0 a false
      }));
    }

    return [];
  }

  // Obtener usuario por ID
  static async getById(id: number): Promise<UsuarioDTO | null> {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
    return (rows as UsuarioDTO[])[0] || null;
  }

    static async updateRol(id: number, nuevoRol: "usuario" | "admin"): Promise<boolean> {
    const [result] = await pool.query(
      "UPDATE usuarios SET rol = ? WHERE id_usuario = ?",
      [nuevoRol, id]
    );
    return (result as any).affectedRows > 0;  // Si se actualizó correctamente
  }
}

export default AuthModel;
