export interface ProductoDTO {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock?: number;
  categoria_id: number;
  imagen_url?: string;
  destacado?: boolean;
  created_at?: Date;
  updated_at?: Date;
  activo?: boolean;
}

export interface ProductoConCategoriaDTO extends ProductoDTO {
  categoria_nombre?: string;
}
