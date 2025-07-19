export interface PedidoDTO {
  id_pedido?: number;
  id_usuario: number;
  fecha_pedido?: Date;
  estado?: string;
  total: number;
}

export interface PedidoDetalleDTO {
  id_detalle_pedido?: number;
  id_pedido: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
}