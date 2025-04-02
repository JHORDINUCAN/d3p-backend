import { Request, Response, NextFunction } from 'express';
import AuthModel from '../models/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secretoUltraSegurísimo';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { nombre, correo, contraseña, direccion, rol } = req.body;

    if (!nombre || !correo || !contraseña) {
      res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
      return;
    }

    const userExist = await AuthModel.findByCorreo(correo);
    if (userExist) {
      res.status(409).json({ success: false, message: 'El correo ya está registrado' });
      return;
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const nuevoUsuario = {
      nombre,
      correo,
      contraseña: hashedPassword,
      direccion,
      rol
    };

    const result = await AuthModel.create(nuevoUsuario);

    res.status(201).json({ success: true, data: { id: result.id }, message: 'Usuario registrado' });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { correo, contraseña } = req.body;

    const usuario = await AuthModel.findByCorreo(correo);
    if (!usuario) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }

    const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
      return;
    }

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        rol: usuario.rol
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });
  } catch (err) {
    next(err);
  }
};
