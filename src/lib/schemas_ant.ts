
import * as z from "zod";

// ============================================================
//  Esquemas de Validación Centralizados (Zod)
// ============================================================

// --------------------
// CLIENTES
// --------------------
export const customerSchema = z.object({
  razon_social: z.string().min(1, "La razón social es requerida."),
  rfc: z.string().max(13, "El RFC no puede tener más de 13 caracteres.").optional().or(z.literal('')),
  email: z.string().email("El correo no es válido.").optional().or(z.literal('')),
  telefono: z.string().optional(),
  tipo_id: z.coerce.number().min(1, "El tipo de cliente es requerido"),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;


// --------------------
// PROVEEDORES
// --------------------
export const providerSchema = z.object({
  razon_social: z.string().min(1, "La razón social es requerida."),
  rfc: z.string().optional(),
  email: z.string().email("El correo no es válido.").optional().or(z.literal('')),
  telefono: z.string().optional(),
  dias_credito: z.coerce.number().int().min(0).optional(),
  direccion: z.string().optional(),
  persona_contacto: z.string().optional(),
  tipo: z.enum(['PRODUCTOS', 'SERVICIOS', 'AMBOS']),
  origen: z.enum(['NACIONAL', 'EXTRANJERO']),
});

export type ProviderFormValues = z.infer<typeof providerSchema>;

// --------------------
// MARCAS
// --------------------
export const brandSchema = z.object({
  nombre: z.string().min(1, "El nombre de la marca es requerido."),
  pais_origen: z.string().optional(),
});

export type BrandFormValues = z.infer<typeof brandSchema>;


// --------------------
// MODELOS
// --------------------
export const modelSchema = z.object({
  nombre: z.string().min(1, "El nombre del modelo es requerido."),
  anio: z.coerce.number().optional(),
});

export type ModelFormValues = z.infer<typeof modelSchema>;


// --------------------
// HERRAMIENTAS
// --------------------
export const toolSchema = z.object({
  sku: z.string().min(1, "El SKU es requerido."),
  nombre: z.string().min(1, "El nombre es requerido."),
  descripcion: z.string().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  numero_serie: z.string().optional(),
  fecha_compra: z.date().optional(),
  costo: z.coerce.number().min(0).optional(),
});

export type ToolFormValues = z.infer<typeof toolSchema>;

    