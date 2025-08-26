import { z } from "zod";
import type { Rol } from "./types";

export type FieldType = "text" | "email" | "password" | "select";

export interface ModalField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[]; // Para campos 'select'
}

export interface ModalConfig {
  title: string;
  description: string;
  fields: ModalField[];
  schema: z.ZodObject<any>;
}

// Ejemplo de configuración para el modal de "Agregar Usuario"
export const userFormConfig = (roles: Rol[]): ModalConfig => ({
  title: "Agregar Nuevo Usuario",
  description: "Completa los datos para crear un nuevo usuario en el sistema.",
  fields: [
    { name: "nombre", label: "Nombre", type: "text", placeholder: "Juan" },
    { name: "apellido_p", label: "Apellido Paterno", type: "text", placeholder: "Pérez" },
    { name: "email", label: "Email", type: "email", placeholder: "juan.perez@ejemplo.com" },
    { name: "password", label: "Contraseña", type: "password" },
    { 
      name: "rolId", 
      label: "Rol", 
      type: "select", 
      options: roles.map(r => ({ value: String(r.id), label: r.nombre }))
    },
  ],
  schema: z.object({
    nombre: z.string().min(2, "El nombre es requerido."),
    apellido_p: z.string().min(2, "El apellido es requerido."),
    email: z.string().email("Email inválido."),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
    rolId: z.string().min(1, "Debes seleccionar un rol."),
  }),
});

// Aquí podrías agregar más configuraciones, como 'assignToolConfig', etc.