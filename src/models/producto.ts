import pool from '../database';

interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock?: number;
  categoria_id: number;
  imagen_url?: string;
  destacado?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface ProductoConCategoria extends Producto {
  categoria_nombre?: string;
}

class ProductoModel {
  static async getAll({
    page = 1,
    limit = 10,
    categoria_id,
    destacado,
    search
  }: {
    page?: number;
    limit?: number;
    categoria_id?: number;
    destacado?: boolean;
    search?: string;
  } = {}): Promise<{ productos: ProductoConCategoria[]; total: number }> {
    const offset = (page - 1) * limit;
    let query = `
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p
      JOIN categorias c ON p.categoria_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (categoria_id) {
      query += ' AND p.categoria_id = ?';
      params.push(categoria_id);
    }

    if (destacado !== undefined) {
      query += ' AND p.destacado = ?';
      params.push(destacado);
    }

    if (search) {
      query += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [productos] = await pool.query(query, params);

    // Consulta para el total
    let countQuery = 'SELECT COUNT(*) as total FROM productos WHERE 1=1';
    const countParams = params.slice(0, -2); // Excluir LIMIT y OFFSET

    if (categoria_id) {
      countQuery += ' AND categoria_id = ?';
    }

    if (destacado !== undefined) {
      countQuery += ' AND destacado = ?';
    }

    if (search) {
      countQuery += ' AND (nombre LIKE ? OR descripcion LIKE ?)';
    }

    const [totalRows] = await pool.query(countQuery, countParams);
    const total = (totalRows as any)[0].total;

    return {
      productos: productos as ProductoConCategoria[],
      total
    };
  }

  /**
   * Obtener producto por ID con información de categoría
   */
  static async getById(id: number): Promise<ProductoConCategoria | null> {
    const [rows] = await pool.query(
      `SELECT p.*, c.nombre as categoria_nombre 
       FROM productos p
       JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id_producto = ?`,
      [id]
    );
    return (rows as ProductoConCategoria[])[0] || null;
  }

  /**
   * Crear nuevo producto con validación de categoría
   */
  static async create(producto: Omit<Producto, 'id'>): Promise<{ id: number }> {
    // Verificar que la categoría exista
    const [categoria] = await pool.query(
      'SELECT id FROM categorias WHERE id = ?',
      [producto.categoria_id]
    );

    if (!(categoria as any).length) {
      throw new Error('La categoría especificada no existe');
    }

    const [result] = await pool.query(
      `INSERT INTO productos 
       (nombre, descripcion, precio, stock, categoria_id, imagen_url, destacado)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.stock || 0,
        producto.categoria_id,
        producto.imagen_url || null,
        producto.destacado || false
      ]
    );

    return { id: (result as any).insertId };
  }

  /**
   * Actualizar producto
   */
  static async update(
    id: number,
    producto: Partial<Omit<Producto, 'id'>>
  ): Promise<boolean> {
    if (producto.categoria_id) {
      // Verificar que la nueva categoría exista
      const [categoria] = await pool.query(
        'SELECT id FROM categorias WHERE id = ?',
        [producto.categoria_id]
      );

      if (!(categoria as any).length) {
        throw new Error('La categoría especificada no existe');
      }
    }

    const fieldsToUpdate = Object.entries(producto)
      .filter(([_, value]) => value !== undefined)
      .map(([key]) => `${key} = ?`)
      .join(', ');

    if (!fieldsToUpdate) return false;

    const values = Object.values(producto).filter(value => value !== undefined);

    const [result] = await pool.query(
      `UPDATE productos SET ${fieldsToUpdate} WHERE id_producto = ?`,
      [...values, id]
    );

    return (result as any).affectedRows > 0;
  }

  /**
   * Eliminar producto
   */
  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM productos WHERE id_producto = ?', [id]);
    return (result as any).affectedRows > 0;
  }

  /**
   * Obtener productos destacados
   */
  static async getDestacados(limit = 5): Promise<ProductoConCategoria[]> {
    const [rows] = await pool.query(
      `SELECT p.*, c.nombre as categoria_nombre 
       FROM productos p
       JOIN categorias c ON p.categoria_id = c.id
       WHERE p.destacado = true
       LIMIT ?`,
      [limit]
    );
    return rows as ProductoConCategoria[];
  }
}

export default ProductoModel;