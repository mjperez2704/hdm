
"use server";

import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import { query } from "@/lib/db";
import { getPool } from "@/lib/db";
import {
  customerSchema,
  type CustomerFormValues,
  providerSchema,
  type ProviderFormValues,
  brandSchema,
  type BrandFormValues,
  modelSchema,
  type ModelFormValues,
  toolSchema,
  type ToolFormValues,
} from "@/lib/schemas";
import type { Cliente, Herramienta, Producto, MovimientoInventario } from "@/lib/types";
import { suggestStockLevels } from "@/ai/flows/stock-level-suggestions";
import { getProductos } from "@/lib/data";
import mysql from 'mysql2/promise';

// ============================================================
//  Acciones del Servidor (Server Actions)
// ============================================================

type ActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function getAiSuggestionAction(
  itemId: string
): Promise<{ suggestedLevel: number; reasoning: string } | { error: string }> {
  const inventory = await getProductos();
  const item = inventory.find((i) => String(i.id) === itemId);

  if (!item) {
    return { error: "Artículo no encontrado." };
  }

  // TODO: Implementar la obtención de registros de auditoría reales
  const simulatedLogs: MovimientoInventario[] = [
    { id: 1, fecha: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'ENTRADA', referencia: 'OC-001', producto_id: item.id, cantidad: 50, costo_unit: item.costo_promedio, almacen_id: 1, usuario_id: 1},
    { id: 2, fecha: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'SALIDA', referencia: 'VTA-001', producto_id: item.id, cantidad: -5, costo_unit: item.costo_promedio, almacen_id: 1, usuario_id: 1 },
    { id: 3, fecha: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'SALIDA', referencia: 'VTA-002', producto_id: item.id, cantidad: -10, costo_unit: item.costo_promedio, almacen_id: 1, usuario_id: 1 },
    { id: 4, fecha: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'SALIDA', referencia: 'VTA-003', producto_id: item.id, cantidad: -8, costo_unit: item.costo_promedio, almacen_id: 1, usuario_id: 1 },
    { id: 5, fecha: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'ENTRADA', referencia: 'OC-002', producto_id: item.id, cantidad: 30, costo_unit: item.costo_promedio, almacen_id: 1, usuario_id: 1 },
    { id: 6, fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'SALIDA', referencia: 'VTA-004', producto_id: item.id, cantidad: -12, costo_unit: item.costo_promedio, almacen_id: 1, usuario_id: 1 },
  ];
  const itemLogs = simulatedLogs.filter((log) => log.producto_id === item.id);

  if (itemLogs.length < 2) {
    return {
      error: "No hay suficientes datos históricos para hacer una sugerencia.",
    };
  }

  const historicalData = itemLogs
    .map(
      (log) =>
        `Fecha: ${new Date(log.fecha).toISOString().split("T")[0]}, Cantidad: ${
          log.cantidad
        }, Tipo: ${log.tipo}`
    )
    .join("; ");

  try {
    const suggestion = await suggestStockLevels({
      location: "Almacén Principal", // TODO: Usar ubicación real
      objectType: item.sku,
      historicalData,
    });
    return suggestion;
  } catch (error) {
    console.error(error);
    return { error: "No se pudo obtener la sugerencia de la IA." };
  }
}

// --------------------
// CLIENTES
// --------------------
export async function saveCustomer(
  values: CustomerFormValues,
  customerId?: number
): Promise<ActionResult> {
  const validatedFields = customerSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Error de validación.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { razon_social, rfc, email, telefono, tipo_id } = validatedFields.data;

  try {
    if (customerId) {
      await query(
        `UPDATE clientes SET razon_social = ?, rfc = ?, email = ?, telefono = ?, tipo_id = ? WHERE id = ?`,
        [razon_social, rfc, email, telefono, tipo_id, customerId]
      );
    } else {
      await query(
        `INSERT INTO clientes (razon_social, rfc, email, telefono, tipo_id) VALUES (?, ?, ?, ?, ?)`,
        [razon_social, rfc, email, telefono, tipo_id]
      );
    }

    revalidatePath("/customers");

    return {
      success: true,
      message: `Cliente ${
        customerId ? "actualizado" : "creado"
      } correctamente.`,
    };
  } catch (error) {
    console.error("Error al guardar el cliente:", error);
    return {
      success: false,
      message: "Error en la base de datos. No se pudo guardar el cliente.",
    };
  }
}

export async function deleteCustomer(customerId: number): Promise<ActionResult> {
  if (!customerId) {
    return { success: false, message: "ID de cliente inválido." };
  }
  try {
    await query(`UPDATE clientes SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`, [
      customerId,
    ]);
    revalidatePath("/customers");
    return { success: true, message: "Cliente eliminado correctamente." };
  } catch (error) {
    console.error("Error al eliminar el cliente:", error);
    return {
      success: false,
      message: "Error en la base de datos. No se pudo eliminar el cliente.",
    };
  }
}

// --------------------
// PROVEEDORES
// --------------------
export async function saveProvider(
  values: ProviderFormValues,
  providerId?: number
): Promise<ActionResult> {
  const validatedFields = providerSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Error de validación.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    razon_social,
    rfc,
    email,
    telefono,
    dias_credito,
    direccion,
    persona_contacto,
    tipo,
    origen,
  } = validatedFields.data;

  try {
    if (providerId) {
      await query(
        `UPDATE proveedores SET razon_social = ?, rfc = ?, email = ?, telefono = ?, dias_credito = ?, direccion = ?, persona_contacto = ?, tipo = ?, origen = ? WHERE id = ?`,
        [
          razon_social,
          rfc,
          email,
          telefono,
          dias_credito,
          direccion,
          persona_contacto,
          tipo,
          origen,
          providerId,
        ]
      );
    } else {
      await query(
        `INSERT INTO proveedores (razon_social, rfc, email, telefono, dias_credito, direccion, persona_contacto, tipo, origen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          razon_social,
          rfc,
          email,
          telefono,
          dias_credito,
          direccion,
          persona_contacto,
          tipo,
          origen,
        ]
      );
    }
    revalidatePath("/providers");
    return {
      success: true,
      message: `Proveedor ${
        providerId ? "actualizado" : "creado"
      } correctamente.`,
    };
  } catch (error) {
    console.error("Error al guardar el proveedor:", error);
    return {
      success: false,
      message: "Error en la base de datos. No se pudo guardar el proveedor.",
    };
  }
}

export async function deleteProvider(providerId: number): Promise<ActionResult> {
  if (!providerId) {
    return { success: false, message: "ID de proveedor inválido." };
  }
  try {
    await query(`UPDATE proveedores SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`, [
      providerId,
    ]);
    revalidatePath("/providers");
    return { success: true, message: "Proveedor eliminado correctamente." };
  } catch (error) {
    console.error("Error al eliminar el proveedor:", error);
    return {
      success: false,
      message: "Error en la base de datos. No se pudo eliminar el proveedor.",
    };
  }
}

// --------------------
// MARCAS Y MODELOS
// --------------------
export async function saveBrand(
  values: BrandFormValues,
  brandId?: number
): Promise<ActionResult> {
  const validatedFields = brandSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Error de validación.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { nombre, pais_origen } = validatedFields.data;

  try {
    if (brandId) {
      await query(`UPDATE marcas SET nombre = ?, pais_origen = ? WHERE id = ?`, [
        nombre,
        pais_origen,
        brandId,
      ]);
    } else {
      await query(`INSERT INTO marcas (nombre, pais_origen) VALUES (?, ?)`, [
        nombre,
        pais_origen,
      ]);
    }
    revalidatePath("/catalogs/brands");
    return {
      success: true,
      message: `Marca ${brandId ? "actualizada" : "creada"} correctamente.`,
    };
  } catch (error) {
    console.error("Error al guardar la marca:", error);
    return {
      success: false,
      message: "Error en la base de datos. No se pudo guardar la marca.",
    };
  }
}

export async function deleteBrand(brandId: number): Promise<ActionResult> {
  if (!brandId) return { success: false, message: "ID de marca inválido." };
  try {
    await query(`DELETE FROM modelos WHERE marca_id = ?`, [brandId]);
    await query(`DELETE FROM marcas WHERE id = ?`, [brandId]);
    revalidatePath("/catalogs/brands");
    return { success: true, message: "Marca eliminada correctamente." };
  } catch (error) {
    console.error("Error al eliminar la marca:", error);
    return {
      success: false,
      message: "Error en la base de datos. No se pudo eliminar la marca.",
    };
  }
}

export async function saveModel(
  values: ModelFormValues,
  brandId: number,
  modelId?: number
): Promise<ActionResult> {
  const validatedFields = modelSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Error de validación.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { nombre, anio } = validatedFields.data;

  try {
    if (modelId) {
      await query(`UPDATE modelos SET nombre = ?, anio = ? WHERE id = ?`, [
        nombre,
        anio,
        modelId,
      ]);
    } else {
      await query(
        `INSERT INTO modelos (nombre, anio, marca_id) VALUES (?, ?, ?)`,
        [nombre, anio, brandId]
      );
    }
    revalidatePath("/catalogs/brands");
    return {
      success: true,
      message: `Modelo ${modelId ? "actualizado" : "creado"} correctamente.`,
    };
  } catch (error) {
    console.error("Error al guardar el modelo:", error);
    return {
      success: false,
      message: "Error en la base de datos. No se pudo guardar el modelo.",
    };
  }
}

export async function deleteModel(modelId: number): Promise<ActionResult> {
  if (!modelId) return { success: false, message: "ID de modelo inválido." };
  try {
    await query(`DELETE FROM modelos WHERE id = ?`, [modelId]);
    revalidatePath("/catalogs/brands");
    return { success: true, message: "Modelo eliminado correctamente." };
  } catch (error) {
    console.error("Error al eliminar el modelo:", error);
    return {
      success: false,
      message: "Error en la base de datos. No se pudo eliminar el modelo.",
    };
  }
}

// --------------------
// HERRAMIENTAS
// --------------------
export async function saveTool(
  values: ToolFormValues,
  toolId?: number
): Promise<ActionResult> {
  const validatedFields = toolSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Error de validación.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const {
    sku,
    nombre,
    descripcion,
    marca,
    modelo,
    numero_serie,
    fecha_compra,
    costo,
  } = validatedFields.data;

  try {
    const params = [
      sku,
      nombre,
      descripcion,
      marca,
      modelo,
      numero_serie,
      fecha_compra,
      costo,
    ];
    if (toolId) {
      await query(
        `UPDATE herramientas SET sku = ?, nombre = ?, descripcion = ?, marca = ?, modelo = ?, numero_serie = ?, fecha_compra = ?, costo = ? WHERE id = ?`,
        [...params, toolId]
      );
    } else {
      await query(
        `INSERT INTO herramientas (sku, nombre, descripcion, marca, modelo, numero_serie, fecha_compra, costo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        params
      );
    }
    revalidatePath("/catalogs/tools");
    return {
      success: true,
      message: `Herramienta ${toolId ? "actualizada" : "creada"} correctamente.`,
    };
  } catch (error) {
    console.error("Error al guardar la herramienta:", error);
    return {
      success: false,
      message: "Error en la base de datos. No se pudo guardar la herramienta.",
    };
  }
}

export async function assignTool(
  toolId: number,
  employeeId: number
): Promise<ActionResult> {
  try {
    await query(
      `UPDATE herramientas SET asignada_a_empleado_id = ?, estado = 'ASIGNADA' WHERE id = ?`,
      [employeeId, toolId]
    );
    revalidatePath("/catalogs/tools");
    return { success: true, message: "Herramienta asignada correctamente." };
  } catch (error) {
    console.error("Error al asignar la herramienta:", error);
    return {
      success: false,
      message: "Error en la base de datos. No se pudo asignar la herramienta.",
    };
  }
}

export async function updateToolStatus(
  toolId: number,
  newStatus: Herramienta["estado"]
): Promise<ActionResult> {
  try {
    const employeeId = newStatus === "DISPONIBLE" ? null : undefined;
    let queryString = `UPDATE herramientas SET estado = ?`;
    const params: (string | number | null)[] = [newStatus];

    if (employeeId === null) {
      queryString += `, asignada_a_empleado_id = ?`;
      params.push(employeeId);
    }
    queryString += ` WHERE id = ?`;
    params.push(toolId);

    await query(queryString, params);

    revalidatePath("/catalogs/tools");
    return { success: true, message: "Estado de la herramienta actualizado." };
  } catch (error) {
    console.error("Error al actualizar estado de la herramienta:", error);
    return { success: false, message: "Error en la base de datos." };
  }
}

export async function deleteTool(toolId: number): Promise<ActionResult> {
  if (!toolId)
    return { success: false, message: "ID de herramienta inválido." };
  try {
    await query(
      `UPDATE herramientas SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [toolId]
    );
    revalidatePath("/catalogs/tools");
    return { success: true, message: "Herramienta eliminada correctamente." };
  } catch (error) {
    console.error("Error al eliminar la herramienta:", error);
    return { success: false, message: "Error en la base de datos." };
  }
}

// --------------------
// CONFIGURACIÓN
// --------------------
export async function testNewDatabaseConnection(formData: FormData): Promise<ActionResult> {
    let connection;
    const config: mysql.ConnectionOptions = {
        host: formData.get('DB_HOST') as string,
        user: formData.get('DB_USER') as string,
        password: formData.get('DB_PASSWORD') as string,
        database: formData.get('DB_DATABASE') as string,
        port: Number(formData.get('DB_PORT')) || 3306,
    };

    try {
        connection = await mysql.createConnection(config);
        await connection.ping();
        return { success: true, message: "¡Conexión exitosa!" };
    } catch (error: any) {
        console.error("Error en la prueba de conexión:", error);
        let message = `Falló la conexión: ${error.message}`;
        if (error.code === 'ETIMEDOUT') {
            message = 'Falló la conexión: El tiempo de espera se agotó. Verifica la red y las variables de entorno.';
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            message = 'Falló la conexión: Usuario o contraseña incorrectos.';
        } else if (error.code === 'ENOENT') {
            message = `Falló la conexión: No se pudo conectar al host. Verifica que el host '${config.host}' sea accesible.`;
        }
        return { success: false, message };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

export async function saveDatabaseSettings(formData: FormData): Promise<ActionResult> {
  const envContent = `
DB_HOST=${formData.get('DB_HOST') || ''}
DB_USER=${formData.get('DB_USER')}
DB_PASSWORD=${formData.get('DB_PASSWORD')}
DB_DATABASE=${formData.get('DB_DATABASE')}
DB_PORT=${formData.get('DB_PORT') || 3306}
`.trim();

  try {
    await writeFile('.env', envContent);
    
    // Forzar el reinicio de la aplicación para tomar el nuevo .env. 
    // En un entorno real, esto se manejaría de forma más elegante.
    // Para App Hosting, el próximo despliegue o reinicio tomará el nuevo .env.
    // La revalidación no es suficiente para las variables de entorno.
    
    return {
      success: true,
      message: "¡Configuración guardada! La aplicación utilizará los nuevos ajustes en el próximo reinicio o despliegue.",
    };
  } catch (error: any) {
    console.error("Error al escribir el archivo .env:", error);
    return { success: false, message: "No se pudo guardar el archivo .env." };
  }
}
