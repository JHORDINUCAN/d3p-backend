import pool from '../database';

export interface Carrito {
  id_carrito?: number;
  id_usuario: number;
  estado?: 'activo' | 'finalizado' | 'cancelado';
  fecha_creacion?: Date;
}

export interface CarritoDetalle {
  id_detalle?: number;
  id_carrito: number;
  id_producto: number;
  cantidad: number;
}

class CarritoModel {
  static async crearCarrito(id_usuario: number): Promise<{ id: number }> {
    const [result] = await pool.query(
      `INSERT INTO carrito (id_usuario, estado) VALUES (?, 'activo')`,
      [id_usuario]
    );
    return { id: (result as any).insertId };
  }

  static async getCarritoUsuario(id_usuario: number): Promise<Carrito | null> {
    const [rows] = await pool.query(
      `SELECT * FROM carrito WHERE id_usuario = ? AND estado = 'activo' LIMIT 1`,
      [id_usuario]
    );
    return (rows as Carrito[])[0] || null;
  }

  static async agregarProducto(detalle: CarritoDetalle): Promise<void> {
    await pool.query(
      `INSERT INTO carrito_detalles (id_carrito, id_producto, cantidad)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)`,
      [detalle.id_carrito, detalle.id_producto, detalle.cantidad]
    );
  }

  static async getProductosCarrito(id_carrito: number): Promise<{ productos: any[], total: number }> {
    const [rows] = await pool.query(
      `SELECT cd.id_producto, cd.cantidad, p.nombre, p.precio, p.imagen_url,
              (cd.cantidad * p.precio) AS subtotal
       FROM carrito_detalles cd
       JOIN productos p ON cd.id_producto = p.id_producto
       WHERE cd.id_carrito = ?`,
      [id_carrito]
    );

    const productos = (rows as any[]).map(p => ({
      ...p,
      precio: parseFloat(p.precio),
      subtotal: parseFloat(p.subtotal)
    }));

    const total = productos.reduce((sum, p) => sum + p.subtotal, 0);

    return { productos, total };
  }

  static async eliminarProducto(id_carrito: number, id_producto: number): Promise<boolean> {
    const [result] = await pool.query(
      `DELETE FROM carrito_detalles WHERE id_carrito = ? AND id_producto = ?`,
      [id_carrito, id_producto]
    );
    return (result as any).affectedRows > 0;
  }

  static async actualizarEstado(id_carrito: number, estado: string): Promise<boolean> {
    const [result] = await pool.query(
      `UPDATE carrito SET estado = ? WHERE id_carrito = ?`,
      [estado, id_carrito]
    );
    return (result as any).affectedRows > 0;
  }

  // 🆕 NUEVO MÉTODO: agregarProducto (reutilizamos el existente)
  // Ya está cubierto arriba con `static async agregarProducto(...)` así que no necesitas duplicarlo.
}

export default CarritoModel;
