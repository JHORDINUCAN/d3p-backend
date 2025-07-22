import { Request, Response, NextFunction } from 'express';
import AuthModel from '../models/auth';
import pool from '../database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyRecaptcha } from "../services/recaptchaService";

const JWT_SECRET = process.env.JWT_SECRET || 'secretoUltraSegurísimo';

// Registro de un nuevo usuario
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

// Login de un usuario
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { correo, contraseña, captchaToken } = req.body;

    // 1. Verifica que venga el captcha
    if (!captchaToken) {
      res.status(400).json({ success: false, message: "Falta captchaToken" });
      return;
    }

    // 2. Valida con Google
    const captchaOk = await verifyRecaptcha(captchaToken);
    if (!captchaOk) {
      res.status(403).json({ success: false, message: "Captcha inválido" });
      return;
    }

    // 3. Lógica de autenticación normal
    const usuario = await AuthModel.findByCorreo(correo);
    if (!usuario) {
      res.status(404).json({ success: false, message: "Usuario no encontrado" });
      return;
    }

    const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Contraseña incorrecta" });
      return;
    }

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      success: true,
      message: "Login exitoso",
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Actualización de contraseña
export const updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { correo, nuevaContraseña } = req.body;

  if (!correo || !nuevaContraseña) {
    res.status(400).json({ success: false, message: 'Correo y nueva contraseña son obligatorios' });
    return;
  }

  try {
    // Verificar si el correo existe
    const [user] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    
    if (!user || (user as any).length === 0) {
      res.status(404).json({ success: false, message: 'Correo no registrado' });
      return;
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

    // Actualizar la contraseña en la base de datos
    const [result] = await pool.query('UPDATE usuarios SET contraseña = ? WHERE correo = ?', [hashedPassword, correo]);

    if ((result as any).affectedRows === 0) {
      res.status(500).json({ success: false, message: 'Error al actualizar la contraseña' });
      return;
    }

    res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    next(error);
  }
};

export const obtenerUsuarios = async (req: Request, res: Response) => {
  try {
    // Remover el filtro WHERE rol != 'admin' para incluir a todos
    const [usuarios] = await pool.query("SELECT id_usuario, nombre, correo, direccion, rol, activo FROM usuarios ORDER BY nombre ASC");
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// Cambiar estado activo/inactivo de un usuario
export const toggleEstadoUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { activo } = req.body;

  if (typeof activo !== "boolean") {
    return res.status(400).json({ message: "El estado activo debe ser un valor booleano" });
  }

  try {
    const result = await AuthModel.toggleActivo(Number(id), activo);

    if (result) {
      return res.status(200).json({ message: `Usuario ${activo ? "activado" : "desactivado"}` });
    } else {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar el estado del usuario" });
  }
};

// Controlador: Cambiar el rol del usuario
export const cambiarRolUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;  // El ID del usuario
  const { rol } = req.body;   // El rol que se desea asignar (usuario o admin)

  // Validamos que el rol sea 'usuario' o 'admin'
  if (!rol || (rol !== "usuario" && rol !== "admin")) {
    return res.status(400).json({ message: "El rol debe ser 'usuario' o 'admin'" });
  }

  try {
    // Llamamos al método del modelo para cambiar el rol del usuario
    const result = await AuthModel.updateRol(Number(id), rol);

    if (result) {
      return res.status(200).json({ message: "Rol actualizado correctamente" });
    } else {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error al cambiar el rol del usuario" });
  }
};

