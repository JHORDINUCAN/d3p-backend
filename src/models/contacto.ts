import pool from '../database';

export interface Contacto {
  id_mensaje?: number;
  nombre_cliente?: string;
  correo?: string;
  mensaje: string;
  estado?: 'pendiente' | 'leido' | 'respondido';
  respuesta?: string;
  fecha_envio?: Date;
  fecha_respuesta?: Date | null;
  id_usuario?: number | null;
}

class ContactoModel {
  static async getAll(): Promise<Contacto[]> {
    const [rows] = await pool.query('SELECT * FROM contactos ORDER BY fecha_envio DESC');
    return rows as Contacto[];
  }

  static async getById(id: number): Promise<Contacto | null> {
    const [rows] = await pool.query('SELECT * FROM contactos WHERE id_mensaje = ?', [id]);
    return (rows as Contacto[])[0] || null;
  }

  static async create(data: Contacto): Promise<{ id: number }> {
    const [result] = await pool.query(
      `INSERT INTO contactos (nombre_cliente, correo, mensaje, estado, id_usuario)
       VALUES (?, ?, ?, ?, ?)`,
      [data.nombre_cliente, data.correo, data.mensaje, 'pendiente', data.id_usuario ?? null]
    );
    return { id: (result as any).insertId };
  }

  static async update(id: number, data: Partial<Contacto>): Promise<boolean> {
    const fields = Object.entries(data).filter(([_, value]) => value !== undefined);
    if (fields.length === 0) return false;

    const queryFields = fields.map(([key]) => `${key} = ?`).join(', ');
    const values = fields.map(([_, value]) => value);

    const [result] = await pool.query(
      `UPDATE contactos SET ${queryFields} WHERE id_mensaje = ?`,
      [...values, id]
    );

    return (result as any).affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM contactos WHERE id_mensaje = ?', [id]);
    return (result as any).affectedRows > 0;
  }
}

export default ContactoModel;
