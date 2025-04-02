import pool from '../database';

export interface Notificacion {
  id_notificacion?: number;
  id_usuario: number;
  titulo: string;
  mensaje: string;
  leida?: boolean;
  fecha_envio?: Date;
  fecha_lectura?: Date | null;
}

class NotificacionModel {
  static async getAll(): Promise<Notificacion[]> {
    const [rows] = await pool.query('SELECT * FROM notificaciones ORDER BY fecha_envio DESC');
    return rows as Notificacion[];
  }

  static async getById(id: number): Promise<Notificacion | null> {
    const [rows] = await pool.query('SELECT * FROM notificaciones WHERE id_notificacion = ?', [id]);
    return (rows as Notificacion[])[0] || null;
  }

  static async create(data: Notificacion): Promise<{ id: number }> {
    const [result] = await pool.query(
      `INSERT INTO notificaciones (id_usuario, titulo, mensaje, leida, fecha_lectura)
       VALUES (?, ?, ?, ?, ?)`,
      [data.id_usuario, data.titulo, data.mensaje, data.leida ?? false, data.fecha_lectura ?? null]
    );
    return { id: (result as any).insertId };
  }

  static async update(id: number, data: Partial<Notificacion>): Promise<boolean> {
    const fields = Object.entries(data).filter(([_, value]) => value !== undefined);
    if (fields.length === 0) return false;

    const queryFields = fields.map(([key]) => `${key} = ?`).join(', ');
    const values = fields.map(([_, value]) => value);

    const [result] = await pool.query(
      `UPDATE notificaciones SET ${queryFields} WHERE id_notificacion = ?`,
      [...values, id]
    );

    return (result as any).affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM notificaciones WHERE id_notificacion = ?', [id]);
    return (result as any).affectedRows > 0;
  }
}

export default NotificacionModel;
