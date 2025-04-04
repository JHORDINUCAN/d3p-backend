// controlador: categoria.controller.ts
import { Request, Response } from "express";
import CategoriaModel from "../models/categoria";
import pool from "../database";

// Obtener todas las categorías
export const getCategorias = async (req: Request, res: Response): Promise<void> => {
  try {
    const categorias = await CategoriaModel.getCategorias();
    res.json({ success: true, data: categorias });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// Obtener productos por categoría (con fix de campo)
export const getProductosPorCategoria = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_categoria } = req.params;

    const [rows]: any[] = await pool.query(
      `SELECT * FROM productos WHERE categoria_id = ?`,
      [id_categoria]
    );

    if (rows.length === 0) {
      res.status(404).json({ success: false, message: "No se encontraron productos para esta categoría" });
      return;
    }

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};
