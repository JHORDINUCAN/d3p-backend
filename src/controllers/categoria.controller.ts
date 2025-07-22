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

// Actualizar una categoría
export const updateCategoria = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const [result]: any = await pool.query(
      "UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?",
      [nombre, descripcion, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: "Categoría no encontrada" });
      return;
    }

    res.json({ success: true, message: "Categoría actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

export const crearCategoria = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
      return res.status(400).json({ success: false, message: "Faltan campos" });
    }

    const result = await pool.query(
      `INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)`,
      [nombre, descripcion]
    );

    res.status(201).json({ success: true, message: "Categoría creada correctamente" });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};


