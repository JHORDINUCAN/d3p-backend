import { Request, Response, NextFunction } from 'express';
import MetodoPagoModel from '../models/metodo_pago';

export const crearMetodoPago = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id_pedido, monto, metodo, estado } = req.body;
  
      if (!id_pedido || !monto || !metodo) {
        res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
        return;
      }
  
      // 🔍 Validar si ya existe un método de pago para ese pedido
      const existente = await MetodoPagoModel.getByPedido(id_pedido);
      if (existente) {
        res.status(409).json({
          success: false,
          message: 'Ya existe un método de pago para este pedido. Puedes actualizarlo si es necesario.'
        });
        return;
      }
  
      const result = await MetodoPagoModel.create({ id_pedido, monto, metodo, estado });
      res.status(201).json({ success: true, data: { id_pago: result.id } });
    } catch (err) {
      next(err);
    }
  };
  

export const getMetodoPorPedido = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id_pedido = parseInt(req.params.id_pedido);
    const metodo = await MetodoPagoModel.getByPedido(id_pedido);

    if (!metodo) {
      res.status(404).json({ success: false, message: 'Método de pago no encontrado' });
      return;
    }

    res.status(200).json({ success: true, data: metodo });
  } catch (err) {
    next(err);
  }
};

export const updateMetodoPago = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id_pago = parseInt(req.params.id_pago);
    const success = await MetodoPagoModel.update(id_pago, req.body);

    if (!success) {
      res.status(404).json({ success: false, message: 'No actualizado' });
      return;
    }

    res.status(200).json({ success: true, message: 'Método actualizado correctamente' });
  } catch (err) {
    next(err);
  }
};

export const deleteMetodoPago = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id_pago = parseInt(req.params.id_pago);
    const success = await MetodoPagoModel.delete(id_pago);

    if (!success) {
      res.status(404).json({ success: false, message: 'No eliminado' });
      return;
    }

    res.status(200).json({ success: true, message: 'Método de pago eliminado' });
  } catch (err) {
    next(err);
  }
};
