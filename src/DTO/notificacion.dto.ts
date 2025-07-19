export interface NotificacionDTO {
  id_notificacion?: number;
  id_usuario: number;
  titulo: string;
  mensaje: string;
  leida?: boolean;
  fecha_envio?: Date;
  fecha_lectura?: Date | null;
}