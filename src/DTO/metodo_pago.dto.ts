export interface MetodoPagoDTO {
  id_pago?: number;
  id_pedido: number;
  monto: number;
  metodo: string;
  estado?: 'pendiente' | 'pagado' | 'rechazado';
  fecha_pago?: Date;
}