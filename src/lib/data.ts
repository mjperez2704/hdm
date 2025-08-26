
// Importar el conector de la base de datos
import { query } from './db';

import type {
  Usuario,
  Rol,
  Permiso,
  Empleado,
  Proveedor,
  Cliente,
  OrdenCompra,
  OrdenServicio,
  Producto,
  Almacen,
  Seccion,
  Coordenada,
  Marca,
  Modelo,
  SolicitudInterna,
  Purchase,
  PurchaseItem,
  Bitacora,
  Gasto,
  Herramienta,
  Venta,
  Presupuesto,
} from "./types";

// ============================================================
// Funciones de Acceso a Datos
// ============================================================
export async function getProveedores(): Promise<Proveedor[]> {
    const results = await query<Proveedor[]>("SELECT * FROM proveedores WHERE deleted_at IS NULL");
    return results;
}

export async function getClientes(): Promise<Cliente[]> {
  const results = await query<Cliente[]>("SELECT * FROM clientes WHERE deleted_at IS NULL");
  return results;
}

export async function getClientName(): Promise<Cliente[]> {
    const results = await query<Cliente[]>("SELECT razon_social FROM clientes WHERE deleted_at IS NULL");
    return results;
}



export async function getMarcas(): Promise<Marca[]> {
  const results = await query<Marca[]>("SELECT * FROM marcas ORDER BY nombre ASC");
  return results;
}

export async function getModelos(): Promise<Modelo[]> {
  const results = await query<Modelo[]>("SELECT * FROM modelos ORDER BY nombre ASC");
  return results;
}

export async function getHerramientas(): Promise<Herramienta[]> {
    const results = await query<Herramienta[]>("SELECT * FROM herramientas WHERE deleted_at IS NULL ORDER BY nombre ASC");
    return results;
}

export async function getEmpleados(): Promise<Empleado[]> {
  const results = await query<Empleado[]>("SELECT * FROM empleados WHERE fecha_baja IS NULL");
  return results;
}

export async function getProductos(): Promise<Producto[]> {
  const results = await query<Producto[]>("SELECT * FROM productos WHERE activo = 1");
  return results;
}

export async function getAlmacenes(): Promise<Almacen[]> {
  const almacenes = await query<Almacen[]>("SELECT * FROM almacenes");
  const secciones = await query<Seccion[]>("SELECT * FROM secciones");

  return almacenes.map(almacen => ({
    ...almacen,
    secciones: secciones.filter(s => s.almacen_id === almacen.id)
  }));
}

export async function getCoordenadas(): Promise<Coordenada[]> {
  const results = await query<Coordenada[]>("SELECT * FROM coordenadas");
  return results;
}

export async function getUsuarios(): Promise<Usuario[]> {
  const usuarios = await query<Usuario[]>("SELECT * FROM usuarios WHERE activo = 1 AND deleted_at IS NULL");
  // Aquí se podrían popular los roles si fuera necesario
  return usuarios;
}

export async function getRoles(): Promise<Rol[]> {
  const results = await query<Rol[]>("SELECT * FROM roles");
  return results;
}

export async function getPurchases(): Promise<Purchase[]> {
  const ordenes = await query<OrdenCompra[]>("SELECT * FROM ordenes_compra WHERE estado != 'CANCELADA' ORDER BY fecha DESC");
  const proveedores = await getProveedores();

  return ordenes.map(orden => ({
    id: orden.folio,
    providerId: String(orden.proveedor_id),
    date: new Date(orden.fecha).toLocaleDateString(),
    total: orden.total,
    status: orden.estado === 'RECIBIDA' ? 'Recibida Completa' : orden.estado === 'PARCIAL' ? 'Recibida Parcial' : 'Pendiente',
    items: orden.items?.map(item => ({
        productId: item.producto_id,
        name: `Producto ID: ${item.producto_id}`, // Se necesitaría un join para el nombre
        quantity: item.cantidad,
        price: item.precio_unitario,
    })) || []
  }));
}


export async function getOrdenesServicio(): Promise<OrdenServicio[]> {
  const results = await query<OrdenServicio[]>("SELECT * FROM ordenes_servicio ORDER BY fecha DESC");
  return results;
}

export async function getVentas(): Promise<Venta[]> {
  const results = await query<Venta[]>("SELECT * FROM ventas ORDER BY fecha DESC");
  return results;
}

export async function getPresupuestos(): Promise<Presupuesto[]> {
  const results = await query<Presupuesto[]>("SELECT * FROM presupuestos ORDER BY fecha DESC");
  // Para un sistema real, los items se cargarían con una consulta separada o un JOIN
  return results;
}

export async function getSolicitudesInternas(): Promise<SolicitudInterna[]> {
  const results = await query<SolicitudInterna[]>("SELECT * FROM solicitudes_internas ORDER BY fecha_solicitud DESC");
  return results;
}

export async function getBitacora(): Promise<Bitacora[]> {
  const results = await query<Bitacora[]>("SELECT * FROM bitacora ORDER BY fecha DESC LIMIT 100");
  return results;
}

export async function getGastos(): Promise<Gasto[]> {
  const results = await query<Gasto[]>("SELECT * FROM gastos ORDER BY fecha DESC");
  return results;
}

// Helper para obtener todos los permisos (simulado)
export const getAllPermissions = (): Permiso[] => {
    // En una aplicación real, esto vendría de una tabla de permisos.
    // Aquí simulamos un conjunto de permisos posibles.
    const modulos = ['Usuarios', 'Roles', 'Clientes', 'Inventario', 'Ventas', 'Reparaciones', 'Compras', 'Reportes'];
    const acciones = ['ver', 'crear', 'editar', 'eliminar'];
    let permisos: Permiso[] = [];
    let id = 1;
    modulos.forEach(modulo => {
        acciones.forEach(accion => {
            permisos.push({
                id: id++,
                modulo: modulo,
                clave: `${modulo.toLowerCase()}.${accion}`,
                descripcion: `${accion.charAt(0).toUpperCase() + accion.slice(1)} ${modulo}`
            });
        });
    });
    return permisos;
};
