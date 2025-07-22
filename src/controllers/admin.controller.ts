import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../database";

const JWT_SECRET = process.env.JWT_SECRET || "secretoUltraSegurísimo";

// 🧠 Login para administradores
export const loginAdmin = async (req: Request, res: Response) => {
  const { correo, contraseña } = req.body;

  try {
    const [rows]: any = await pool.query("SELECT * FROM usuarios WHERE correo = ?", [correo]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    if (usuario.rol !== "admin") {
      return res.status(403).json({ success: false, message: "Acceso restringido solo para administradores" });
    }

    const match = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!match) {
      return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      success: true,
      message: "Login exitoso",
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error("Error en login admin:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};
