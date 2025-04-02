import { Request, Response, NextFunction } from 'express';
import PedidoModel from '../models/pedido';

export const crearPedido = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id_usuario, id_carrito } = req.body;

    if (!id_usuario || !id_carrito) {
      res.status(400).json({ success: false, message: 'Faltan datos' });
      return;
    }

    const result = await PedidoModel.crearPedido(id_usuario, id_carrito);
    res.status(201).json({
      success: true,
      data: { id_pedido: result.id },
      message: 'Pedido creado exitosamente'
    });
  } catch (err) {
    next(err);
  }
};

export const getPedidosByUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id_usuario = parseInt(req.params.id_usuario);
    if (isNaN(id_usuario)) {
      res.status(400).json({ success: false, message: 'ID de usuario inválido' });
      return;
    }

    const pedidos = await PedidoModel.getPedidosByUsuario(id_usuario);
    res.status(200).json({ success: true, data: pedidos });
  } catch (err) {
    next(err);
  }
};

export const getDetallesPedido = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id_pedido = parseInt(req.params.id_pedido);
    if (isNaN(id_pedido)) {
      res.status(400).json({ success: false, message: 'ID de pedido inválido' });
      return;
    }

    const detalles = await PedidoModel.getDetallesPedido(id_pedido);
    res.status(200).json({ success: true, data: detalles });
  } catch (err) {
    next(err);
  }
};
