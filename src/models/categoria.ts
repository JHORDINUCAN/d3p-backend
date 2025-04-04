import pool from "../database";

const CategoriaModel = {
  async getCategorias() {
    const [rows] = await pool.query("SELECT * FROM categorias");
    return rows;
  },
};

export default CategoriaModel;
