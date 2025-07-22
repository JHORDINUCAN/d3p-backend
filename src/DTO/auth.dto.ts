export interface UsuarioDTO {
  id_usuario?: number;
  nombre: string;
  correo: string;
  contraseña: string;
  direccion?: string;
  rol?: 'usuario' | 'admin';
  activo?: boolean;
}