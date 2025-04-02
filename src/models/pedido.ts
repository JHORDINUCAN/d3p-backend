import pool from '../database';

export interface Pedido {
  id_pedido?: number;
  id_usuario: number;
  fecha_pedido?: Date;
  estado?: string;
  total: number;
}

export interface PedidoDetalle {
  id_detalle_pedido?: number;
  id_pedido: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
}

class PedidoModel {
  static async crearPedido(id_usuario: number, carrito_id: number): Promise<{ id: number }> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Obtener productos del carrito
      const [productos] = await connection.query(
        `SELECT cd.id_producto, cd.cantidad, p.precio
         FROM carrito_detalles cd
         JOIN productos p ON cd.id_producto = p.id_producto
         WHERE cd.id_carrito = ?`,
        [carrito_id]
      );

      if (!(productos as any[]).length) throw new Error('El carrito está vacío');

      // 2. Calcular total
      const total = (productos as any[]).reduce(
        (sum, p: any) => sum + p.cantidad * p.precio,
        0
      );

      // 3. Insertar pedido
      const [pedidoResult] = await connection.query(
        `INSERT INTO pedidos (id_usuario, estado, total)
         VALUES (?, 'pendiente', ?)`,
        [id_usuario, total]
      );
      const id_pedido = (pedidoResult as any).insertId;

      // 4. Insertar detalles
      for (const producto of productos as any[]) {
        await connection.query(
          `INSERT INTO pedido_detalles (id_pedido, id_producto, cantidad, precio_unitario)
           VALUES (?, ?, ?, ?)`,
          [id_pedido, producto.id_producto, producto.cantidad, producto.precio]
        );
      }

      // 5. Limpiar carrito
      await connection.query(
        `DELETE FROM carrito_detalles WHERE id_carrito = ?`,
        [carrito_id]
      );

      await connection.query(
        `UPDATE carrito SET estado = 'finalizado' WHERE id_carrito = ?`,
        [carrito_id]
      );

      await connection.commit();
      return { id: id_pedido };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getPedidosByUsuario(id_usuario: number): Promise<Pedido[]> {
    const [rows] = await pool.query(
      `SELECT * FROM pedidos WHERE id_usuario = ? ORDER BY fecha_pedido DESC`,
      [id_usuario]
    );
    return rows as Pedido[];
  }

  static async getDetallesPedido(id_pedido: number): Promise<PedidoDetalle[]> {
    const [rows] = await pool.query(
      `SELECT pd.*, p.nombre, p.imagen_url
       FROM pedido_detalles pd
       JOIN productos p ON pd.id_producto = p.id_producto
       WHERE pd.id_pedido = ?`,
      [id_pedido]
    );
    return rows as PedidoDetalle[];
  }
}

export default PedidoModel;
