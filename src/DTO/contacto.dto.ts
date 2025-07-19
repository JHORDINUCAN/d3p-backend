export interface ContactoDTO {
  id_mensaje?: number;
  nombre_cliente?: string;
  correo?: string;
  mensaje: string;
  estado?: 'pendiente' | 'leido' | 'respondido';
  respuesta?: string;
  fecha_envio?: Date;
  fecha_respuesta?: Date | null;
  id_usuario?: number | null;
}