import { Request, Response } from 'express';
import pool from '../database';

// Obtener productos del carrito completo por ID de usuario
export const getCarritoCompleto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_usuario } = req.params;

    // Realizamos la consulta y tipamos los resultados como cualquier array de objetos
    const [rows]: any[] = await pool.query(`
      SELECT 
        c.id_carrito, -- Incluimos el id_carrito en la consulta
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio,
        p.imagen_url,
        p.stock,
        cd.cantidad
      FROM carrito c
      JOIN carrito_detalles cd ON c.id_carrito = cd.id_carrito
      JOIN productos p ON p.id_producto = cd.id_producto
      WHERE c.id_usuario = ? AND c.estado = 'activo'
    `, [id_usuario]);

    // Validamos si no hay resultados
    if (!rows || rows.length === 0) {
      res.status(404).json({ success: false, message: "No se encontró un carrito activo para este usuario" });
      return;
    }

    // Respondemos con los datos del carrito
    res.json({
      success: true,
      data: {
        id_carrito: rows[0].id_carrito, // Usamos el id_carrito del primer resultado
        productos: rows
      }
    });
  } catch (error) {
    console.error("Error al obtener productos del carrito:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// Cambiar cantidad de producto
export const cambiarCantidadProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_carrito, id_producto } = req.params;
    const { cantidad } = req.body;

    if (cantidad < 1) {
      res.status(400).json({ success: false, message: "Cantidad inválida" });
      return;
    }

    await pool.query(`
      UPDATE carrito_detalles 
      SET cantidad = ?
      WHERE id_carrito = ? AND id_producto = ?
    `, [cantidad, id_carrito, id_producto]);

    res.json({ success: true, message: "Cantidad actualizada" });
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// Eliminar producto del carrito
export const eliminarProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_carrito, id_producto } = req.params;

    await pool.query(`
      DELETE FROM carrito_detalles
      WHERE id_carrito = ? AND id_producto = ?
    `, [id_carrito, id_producto]);

    res.json({ success: true, message: "Producto eliminado del carrito" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// Vaciar carrito
export const vaciarCarrito = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_carrito } = req.params;

    await pool.query(`
      DELETE FROM carrito_detalles
      WHERE id_carrito = ?
    `, [id_carrito]);

    res.json({ success: true, message: "Carrito vaciado" });
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};