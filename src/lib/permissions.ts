
import type { Permiso } from './types';

// ============================================================
// Catálogo Central de Permisos
// ============================================================

export const allPermissions: Permiso[] = [
  // Usuarios
  { id: 1, modulo: 'Usuarios', clave: 'usuarios.ver', descripcion: 'Ver lista de usuarios' },
  { id: 2, modulo: 'Usuarios', clave: 'usuarios.crear', descripcion: 'Crear nuevos usuarios' },
  { id: 3, modulo: 'Usuarios', clave: 'usuarios.editar', descripcion: 'Editar usuarios existentes' },
  { id: 4, modulo: 'Usuarios', clave: 'usuarios.eliminar', descripcion: 'Eliminar usuarios' },
  { id: 5, modulo: 'Usuarios', clave: 'usuarios.asignar_roles', descripcion: 'Asignar roles a usuarios' },

  // Roles
  { id: 6, modulo: 'Roles', clave: 'roles.ver', descripcion: 'Ver lista de roles' },
  { id: 7, modulo: 'Roles', clave: 'roles.crear', descripcion: 'Crear nuevos roles' },
  { id: 8, modulo: 'Roles', clave: 'roles.editar', descripcion: 'Editar roles y sus permisos' },
  { id: 9, modulo: 'Roles', clave: 'roles.eliminar', descripcion: 'Eliminar roles' },

  // Clientes
  { id: 10, modulo: 'Clientes', clave: 'clientes.ver', descripcion: 'Ver lista de clientes' },
  { id: 11, modulo: 'Clientes', clave: 'clientes.crear', descripcion: 'Crear nuevos clientes' },
  { id: 12, modulo: 'Clientes', clave: 'clientes.editar', descripcion: 'Editar clientes existentes' },
  { id: 13, modulo: 'Clientes', clave: 'clientes.eliminar', descripcion: 'Eliminar clientes' },

  // Inventario
  { id: 14, modulo: 'Inventario', clave: 'inventario.ver', descripcion: 'Ver inventario' },
  { id: 15, modulo: 'Inventario', clave: 'inventario.ajustar', descripcion: 'Realizar ajustes de stock' },
  { id: 16, modulo: 'Inventario', clave: 'inventario.transferir', descripcion: 'Realizar traslados entre almacenes' },
  { id: 17, modulo: 'Inventario', clave: 'inventario.ver_costos', descripcion: 'Ver costos de los productos' },

  // Ventas
  { id: 18, modulo: 'Ventas', clave: 'ventas.crear', descripcion: 'Crear nuevas ventas y cotizaciones' },
  { id: 19, modulo: 'Ventas', clave: 'ventas.ver_todas', descripcion: 'Ver ventas de todos los vendedores' },
  { id: 20, modulo: 'Ventas', clave: 'ventas.cancelar', descripcion: 'Cancelar ventas' },
  { id: 21, modulo: 'Ventas', clave: 'ventas.aplicar_descuentos', descripcion: 'Aplicar descuentos especiales' },
  
  // Reparaciones
  { id: 22, modulo: 'Reparaciones', clave: 'reparaciones.ver', descripcion: 'Ver órdenes de servicio' },
  { id: 23, modulo: 'Reparaciones', clave: 'reparaciones.crear', descripcion: 'Crear nuevas órdenes de servicio' },
  { id: 24, modulo: 'Reparaciones', clave: 'reparaciones.asignar', descripcion: 'Asignar técnico a una orden' },
  { id: 25, modulo: 'Reparaciones', clave: 'reparaciones.actualizar_estado', descripcion: 'Actualizar estado de una reparación' },

  // Compras
  { id: 26, modulo: 'Compras', clave: 'compras.ver', descripcion: 'Ver órdenes de compra' },
  { id: 27, modulo: 'Compras', clave: 'compras.crear', descripcion: 'Crear nuevas órdenes de compra' },
  { id: 28, modulo: 'Compras', clave: 'compras.aprobar', descripcion: 'Aprobar órdenes de compra' },
  { id: 29, modulo: 'Compras', clave: 'compras.recibir', descripcion: 'Recibir mercancía' },

  // Reportes
  { id: 30, modulo: 'Reportes', clave: 'reportes.ver_todos', descripcion: 'Ver todos los reportes del sistema' },
  { id: 31, modulo: 'Reportes', clave: 'reportes.financieros', descripcion: 'Ver reportes financieros' },
];

export const getAllPermissions = (): Permiso[] => allPermissions;

    