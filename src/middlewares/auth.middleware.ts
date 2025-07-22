import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretoUltraSegurísimo";

export interface JwtPayload {
  id_usuario: number;
  rol: "usuario" | "admin";
}

// Extendemos el objeto Request de Express para que reconozca `usuario`
declare module "express-serve-static-core" {
  interface Request {
    usuario?: JwtPayload;
  }
}

/**
 * Middleware para verificar que el token JWT es válido.
 * Si es válido, agrega los datos del usuario al objeto `req`.
 */
export const verificarToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ success: false, message: "Token no proporcionado o malformado" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") {
      throw new Error("Token inválido");
    }

    req.usuario = decoded as JwtPayload;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: "Token inválido" });
  }
};

/**
 * Middleware para permitir solo usuarios con rol "admin".
 */
export const soloAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.usuario?.rol !== "admin") {
    res.status(403).json({
      success: false,
      message: "Acceso restringido a administradores",
    });
    return;
  }

  next();
};
