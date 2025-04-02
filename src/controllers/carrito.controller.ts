import { Request, Response, NextFunction } from 'express';
import CarritoModel from '../models/carrito';

export const crearCarrito = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id_usuario } = req.body;
    if (!id_usuario) res.status(400).json({ success: false, message: 'Falta el ID del usuario' });

    const result = await CarritoModel.crearCarrito(id_usuario);
    res.status(201).json({ success: true, data: { id: result.id } });
  } catch (err) {
    next(err);
  }
};

export const getCarritoUsuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id_usuario = parseInt(req.params.id_usuario);
    const carrito = await CarritoModel.getCarritoUsuario(id_usuario);

    if (!carrito) res.status(404).json({ success: false, message: 'No se encontró carrito activo' });
    res.status(200).json({ success: true, data: carrito });
  } catch (err) {
    next(err);
  }
};

export const agregarProducto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id_carrito = parseInt(req.params.id_carrito);
    const { id_producto, cantidad } = req.body;

    await CarritoModel.agregarProducto({ id_carrito, id_producto, cantidad });
    res.status(200).json({ success: true, message: 'Producto agregado al carrito' });
  } catch (err) {
    next(err);
  }
};

export const getProductosCarrito = async (
    req: Request, 
    res: Response, 
    next: NextFunction
  ): Promise<void> => {
    try {
      const id_carrito = parseInt(req.params.id_carrito);
      const { productos, total } = await CarritoModel.getProductosCarrito(id_carrito);
  
      res.status(200).json({
        success: true,
        data: productos,
        total
      });
    } catch (err) {
      next(err);
    }
  };
  

export const eliminarProducto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id_carrito = parseInt(req.params.id_carrito);
    const id_producto = parseInt(req.params.id_producto);

    const success = await CarritoModel.eliminarProducto(id_carrito, id_producto);
    if (!success) res.status(404).json({ success: false, message: 'No se encontró el producto' });

    res.status(200).json({ success: true, message: 'Producto eliminado del carrito' });
  } catch (err) {
    next(err);
  }
};

export const actualizarEstadoCarrito = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id_carrito = parseInt(req.params.id_carrito);
    const { estado } = req.body;

    const success = await CarritoModel.actualizarEstado(id_carrito, estado);
    if (!success) res.status(404).json({ success: false, message: 'Carrito no encontrado' });

    res.status(200).json({ success: true, message: 'Estado actualizado' });
  } catch (err) {
    next(err);
  }
};
