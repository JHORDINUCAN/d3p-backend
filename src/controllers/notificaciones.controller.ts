import { Request, Response, NextFunction } from 'express';
import NotificacionModel from '../models/notificacion';

export const getNotificaciones = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const data = await NotificacionModel.getAll();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getNotificacionById = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) res.status(400).json({ success: false, message: 'ID inválido' });

    const noti = await NotificacionModel.getById(id);
    if (!noti) res.status(404).json({ success: false, message: 'No encontrada' });

    res.status(200).json({ success: true, data: noti });
  } catch (err) {
    next(err);
  }
};

export const createNotificacion = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id_usuario, titulo, mensaje } = req.body;
      if (!id_usuario || !titulo || !mensaje) {
        res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
        return;
      }
  
      const result = await NotificacionModel.create({ id_usuario, titulo, mensaje });
      res.status(201).json({ success: true, data: { id: result.id } });
    } catch (err) {
      next(err);
    }
  };
  

export const updateNotificacion = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) res.status(400).json({ success: false, message: 'ID inválido' });

    const success = await NotificacionModel.update(id, req.body);
    if (!success) res.status(404).json({ success: false, message: 'No actualizada' });

    res.status(200).json({ success: true, message: 'Actualizada correctamente' });
  } catch (err) {
    next(err);
  }
};

export const deleteNotificacion = async (
    req: Request, 
    res: Response, 
    next: NextFunction
):Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) res.status(400).json({ success: false, message: 'ID inválido' });

    const success = await NotificacionModel.delete(id);
    if (!success) res.status(404).json({ success: false, message: 'No eliminada' });

    res.status(200).json({ success: true, message: 'Eliminada correctamente' });
  } catch (err) {
    next(err);
  }
};
