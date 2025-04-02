import pool from '../database';

export interface MetodoPago {
  id_pago?: number;
  id_pedido: number;
  monto: number;
  metodo: string;
  estado?: 'pendiente' | 'pagado' | 'rechazado';
  fecha_pago?: Date;
}

class MetodoPagoModel {
    static async create(metodo: MetodoPago): Promise<{ id: number }> {
        const [result] = await pool.query(
          `INSERT INTO metodos_de_pago (id_pedido, monto, metodo, estado, fecha_pago)
           VALUES (?, ?, ?, ?, NOW())`,
          [
            metodo.id_pedido,
            metodo.monto,
            metodo.metodo,
            metodo.estado || 'pendiente'
          ]
        );
        return { id: (result as any).insertId };
      }
      

  static async getByPedido(id_pedido: number): Promise<MetodoPago | null> {
    const [rows] = await pool.query(
      `SELECT * FROM metodos_de_pago WHERE id_pedido = ? LIMIT 1`,
      [id_pedido]
    );
    return (rows as MetodoPago[])[0] || null;
  }

  static async update(id_pago: number, datos: Partial<MetodoPago>): Promise<boolean> {
    const campos = Object.entries(datos)
      .filter(([_, v]) => v !== undefined)
      .map(([k]) => `${k} = ?`).join(', ');

    if (!campos) return false;

    const valores = Object.values(datos).filter(v => v !== undefined);

    const [result] = await pool.query(
      `UPDATE metodos_de_pago SET ${campos} WHERE id_pago = ?`,
      [...valores, id_pago]
    );

    return (result as any).affectedRows > 0;
  }

  static async delete(id_pago: number): Promise<boolean> {
    const [result] = await pool.query(
      `DELETE FROM metodos_de_pago WHERE id_pago = ?`,
      [id_pago]
    );
    return (result as any).affectedRows > 0;
  }
}

export default MetodoPagoModel;
