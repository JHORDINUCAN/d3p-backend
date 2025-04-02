import { Request, Response, NextFunction } from 'express';
import ProductoModel from '../models/producto';
import pool from '../database';

// Tipos mejorados para TypeScript
interface ProductoQueryParams {
  page?: string;
  limit?: string;
  categoria_id?: string;
  destacado?: string;
  search?: string;
}

interface ProductoRequestBody {
  nombre?: string;
  descripcion?: string;
  precio?: string | number;
  stock?: string | number;
  categoria_id?: string | number;
  imagen_url?: string;
  destacado?: boolean | string;
}

interface ProductoParams {
  id: string; // Cambiado a obligatorio (no opcional)
}

// Helper para validación de IDs
const validarIdProducto = (idParam: string | undefined): { id?: number; error?: { status: number; message: string } } => {
  if (!idParam) {
    return { error: { status: 400, message: 'Se requiere el ID del producto' } };
  }

  const id = parseInt(idParam);
  if (isNaN(id) || id <= 0) {
    return { error: { status: 400, message: 'ID debe ser un número positivo' } };
  }

  return { id };
};

// Controlador completo con mejoras
export const getProductos = async (
  req: Request<{}, {}, {}, ProductoQueryParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(parseInt(req.query.limit || '10'), 100);
    const categoria_id = req.query.categoria_id ? parseInt(req.query.categoria_id) : undefined;
    const destacado = req.query.destacado ? req.query.destacado === 'true' : undefined;
    const search = req.query.search;

    const result = await ProductoModel.getAll({
      page,
      limit,
      categoria_id,
      destacado,
      search
    });

    res.status(200).json({
      success: true,
      data: result.productos,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
        hasNextPage: page * limit < result.total
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProductoById = async (
  req: Request<ProductoParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, error } = validarIdProducto(req.params.id);
    
    if (error) {
      res.status(error.status).json({ success: false, message: error.message });
      return;
    }

    if (!id) { // Esta validación es redundante pero TypeScript la pide
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const producto = await ProductoModel.getById(id);
    
    if (!producto) {
      res.status(404).json({ success: false, message: 'Producto no encontrado' });
      return;
    }

    res.status(200).json({ success: true, data: producto });
  } catch (error) {
    next(error);
  }
};

export const createProducto = async (
  req: Request<{}, {}, ProductoRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { nombre, descripcion, precio, stock, categoria_id, imagen_url, destacado } = req.body;

    // Validación mejorada
    if (!nombre?.trim()) {
      res.status(400).json({ success: false, message: 'Nombre es requerido' });
      return;
    }

    const precioNumber = Number(precio);
    if (isNaN(precioNumber)) {
      res.status(400).json({ success: false, message: 'Precio debe ser un número válido' });
      return;
    }

    if (precioNumber <= 0) {
      res.status(400).json({ success: false, message: 'Precio debe ser mayor a cero' });
      return;
    }

    if (!categoria_id) {
      res.status(400).json({ success: false, message: 'Categoría es requerida' });
      return;
    }

    const result = await ProductoModel.create({
      nombre: nombre.trim(),
      descripcion: descripcion?.trim(),
      precio: precioNumber,
      stock: stock ? Number(stock) : 0,
      categoria_id: Number(categoria_id),
      imagen_url,
      destacado: destacado === true || destacado === 'true'
    });

    await connection.commit();

    res.status(201).json({
      success: true,
      data: { id: result.id },
      message: 'Producto creado exitosamente'
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

export const updateProducto = async (
  req: Request<ProductoParams, {}, ProductoRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id: productId, error } = validarIdProducto(req.params.id);
    
    if (error) {
      res.status(error.status).json({ success: false, message: error.message });
      return;
    }

    if (!productId) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const productoExistente = await ProductoModel.getById(productId);
    if (!productoExistente) {
      res.status(404).json({ success: false, message: 'Producto no encontrado' });
      return;
    }

    const { nombre, descripcion, precio, stock, categoria_id, imagen_url, destacado } = req.body;
    const updates: Partial<{
      nombre: string;
      descripcion: string;
      precio: number;
      stock: number;
      categoria_id: number;
      imagen_url: string;
      destacado: boolean;
    }> = {};

    if (nombre !== undefined) updates.nombre = nombre.trim();
    if (descripcion !== undefined) updates.descripcion = descripcion?.trim();
    if (precio !== undefined) {
      const precioNumber = Number(precio);
      if (isNaN(precioNumber)) {
        res.status(400).json({ success: false, message: 'Precio debe ser un número válido' });
        return;
      }
      updates.precio = precioNumber;
    }
    if (stock !== undefined) updates.stock = Number(stock);
    if (categoria_id !== undefined) updates.categoria_id = Number(categoria_id);
    if (imagen_url !== undefined) updates.imagen_url = imagen_url;
    if (destacado !== undefined) {
      updates.destacado = destacado === true || destacado === 'true';
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ success: false, message: 'No se proporcionaron datos para actualizar' });
      return;
    }

    const success = await ProductoModel.update(productId, updates);
    
    if (!success) {
      res.status(500).json({ success: false, message: 'Error al actualizar producto' });
      return;
    }

    await connection.commit();
    res.status(200).json({ success: true, message: 'Producto actualizado exitosamente' });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

export const deleteProducto = async (
  req: Request<ProductoParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id, error } = validarIdProducto(req.params.id);
    
    if (error) {
      res.status(error.status).json({ success: false, message: error.message });
      return;
    }

    if (!id) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const productoExistente = await ProductoModel.getById(id);
    if (!productoExistente) {
      res.status(404).json({ success: false, message: 'Producto no encontrado' });
      return;
    }

    const success = await ProductoModel.delete(id);
    
    if (!success) {
      res.status(500).json({ success: false, message: 'Error al eliminar producto' });
      return;
    }

    await connection.commit();
    res.status(200).json({ success: true, message: 'Producto eliminado exitosamente' });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

export const getProductosDestacados = async (
  req: Request<{}, {}, {}, { limit?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '5'), 20);
    const productos = await ProductoModel.getDestacados(limit);
    
    res.status(200).json({ success: true, data: productos });
  } catch (error) {
    next(error);
  }
};