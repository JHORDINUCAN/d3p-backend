export interface CarritoDTO {
  id_carrito?: number;
  id_usuario: number;
  estado?: 'activo' | 'finalizado' | 'cancelado';
  fecha_creacion?: Date;
}

export interface CarritoDetalleDTO {
  id_detalle?: number;
  id_carrito: number;
  id_producto: number;
  cantidad: number;
}