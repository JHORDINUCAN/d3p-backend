import { Request, Response, NextFunction } from 'express';
import ContactoModel from '../models/contacto';

export const getContactos = async (_: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await ContactoModel.getAll();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getContactoById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) res.status(400).json({ success: false, message: 'ID inválido' });

    const contacto = await ContactoModel.getById(id);
    if (!contacto) res.status(404).json({ success: false, message: 'No encontrado' });

    res.status(200).json({ success: true, data: contacto });
  } catch (err) {
    next(err);
  }
};

export const createContacto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { nombre_cliente, correo, mensaje, id_usuario } = req.body;

    if (!mensaje || (!nombre_cliente && !id_usuario)) {
      res.status(400).json({ success: false, message: 'Faltan datos para crear el mensaje' });
      return;
    }

    const result = await ContactoModel.create({
      nombre_cliente,
      correo,
      mensaje,
      id_usuario
    });

    res.status(201).json({ success: true, data: { id: result.id } });
  } catch (err) {
    next(err);
  }
};

export const updateContacto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) res.status(400).json({ success: false, message: 'ID inválido' });

    const success = await ContactoModel.update(id, req.body);
    if (!success) res.status(404).json({ success: false, message: 'No actualizado' });

    res.status(200).json({ success: true, message: 'Contacto actualizado correctamente' });
  } catch (err) {
    next(err);
  }
};

export const deleteContacto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) res.status(400).json({ success: false, message: 'ID inválido' });

    const success = await ContactoModel.delete(id);
    if (!success) res.status(404).json({ success: false, message: 'No eliminado' });

    res.status(200).json({ success: true, message: 'Contacto eliminado correctamente' });
  } catch (err) {
    next(err);
  }
};
