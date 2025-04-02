import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secretoUltraSegurísimo';

export interface JwtPayload {
  id_usuario: number;
  rol: 'usuario' | 'admin';
}

declare module 'express-serve-static-core' {
  interface Request {
    usuario?: JwtPayload;
  }
}

export const verificarToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Token no proporcionado' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Token inválido' });
  }
};

export const soloAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.usuario?.rol !== 'admin') {
    res.status(403).json({ success: false, message: 'Acceso restringido a administradores' });
    return;
  }
  next();
};
