// Este archivo contiene los scripts SQL para crear las tablas de la base de datos.
// Esto permite que la aplicación las cree automáticamente si no existen.

const tableScripts: Record<string, string> = {
  clientes: `
    CREATE TABLE \`clientes\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`tipo_id\` int NOT NULL DEFAULT '1',
      \`razon_social\` varchar(255) NOT NULL,
      \`rfc\` varchar(13) DEFAULT NULL,
      \`email\` varchar(255) DEFAULT NULL,
      \`telefono\` varchar(50) DEFAULT NULL,
      \`whatsapp\` varchar(50) DEFAULT NULL,
      \`direccion\` text,
      \`ciudad\` varchar(100) DEFAULT NULL,
      \`estado\` varchar(100) DEFAULT NULL,
      \`pais\` varchar(100) DEFAULT NULL,
      \`cp\` varchar(10) DEFAULT NULL,
      \`fecha_registro\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      \`deleted_at\` timestamp NULL DEFAULT NULL,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `,
  proveedores: `
    CREATE TABLE \`proveedores\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`razon_social\` varchar(255) NOT NULL,
      \`rfc\` varchar(20) DEFAULT NULL,
      \`email\` varchar(255) DEFAULT NULL,
      \`telefono\` varchar(50) DEFAULT NULL,
      \`dias_credito\` int DEFAULT '0',
      \`direccion\` text,
      \`persona_contacto\` varchar(255) DEFAULT NULL,
      \`tipo\` enum('PRODUCTOS','SERVICIOS','AMBOS') DEFAULT 'PRODUCTOS',
      \`origen\` enum('NACIONAL','EXTRANJERO') DEFAULT 'NACIONAL',
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      \`deleted_at\` timestamp NULL DEFAULT NULL,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `,
  marcas: `
    CREATE TABLE \`marcas\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`nombre\` varchar(255) NOT NULL,
      \`pais_origen\` varchar(100) DEFAULT NULL,
      \`sitio_web\` varchar(255) DEFAULT NULL,
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `,
  modelos: `
    CREATE TABLE \`modelos\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`marca_id\` int NOT NULL,
      \`nombre\` varchar(255) NOT NULL,
      \`anio\` int DEFAULT NULL,
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      KEY \`marca_id\` (\`marca_id\`),
      CONSTRAINT \`modelos_ibfk_1\` FOREIGN KEY (\`marca_id\`) REFERENCES \`marcas\` (\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `,
  herramientas: `
    CREATE TABLE \`herramientas\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`sku\` varchar(50) NOT NULL,
      \`nombre\` varchar(255) NOT NULL,
      \`descripcion\` text,
      \`marca\` varchar(100) DEFAULT NULL,
      \`modelo\` varchar(100) DEFAULT NULL,
      \`numero_serie\` varchar(255) DEFAULT NULL,
      \`estado\` enum('DISPONIBLE','ASIGNADA','EN_MANTENIMIENTO','DE_BAJA') NOT NULL DEFAULT 'DISPONIBLE',
      \`asignada_a_empleado_id\` int DEFAULT NULL,
      \`fecha_compra\` date DEFAULT NULL,
      \`costo\` decimal(10,2) DEFAULT NULL,
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      \`deleted_at\` timestamp NULL DEFAULT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`sku\` (\`sku\`),
      UNIQUE KEY \`numero_serie\` (\`numero_serie\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `,
  empleados: `
    CREATE TABLE \`empleados\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`codigo\` varchar(20) DEFAULT NULL,
      \`nombre\` varchar(100) NOT NULL,
      \`apellido_p\` varchar(100) NOT NULL,
      \`apellido_m\` varchar(100) DEFAULT NULL,
      \`curp\` varchar(18) DEFAULT NULL,
      \`rfc\` varchar(13) DEFAULT NULL,
      \`nss\` varchar(11) DEFAULT NULL,
      \`email\` varchar(255) DEFAULT NULL,
      \`telefono\` varchar(20) DEFAULT NULL,
      \`puesto\` varchar(100) DEFAULT NULL,
      \`fecha_ingreso\` date DEFAULT NULL,
      \`fecha_baja\` date DEFAULT NULL,
      \`salario_diario\` decimal(10,2) DEFAULT NULL,
      \`usuario_id\` int DEFAULT NULL,
      \`slug_vendedor\` varchar(20) DEFAULT NULL,
      \`meta_venta_mensual\` decimal(12,2) DEFAULT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`email\` (\`email\`),
      UNIQUE KEY \`slug_vendedor\` (\`slug_vendedor\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `,
  productos: `
    CREATE TABLE \`productos\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`sku\` varchar(100) NOT NULL,
        \`nombre\` varchar(255) NOT NULL,
        \`descripcion\` text,
        \`categoria_id\` int NOT NULL,
        \`marca_id\` int DEFAULT NULL,
        \`modelo_id\` int DEFAULT NULL,
        \`version_id\` int DEFAULT NULL,
        \`unidad\` varchar(10) NOT NULL,
        \`activo\` tinyint(1) NOT NULL DEFAULT '1',
        \`es_serie\` tinyint(1) NOT NULL DEFAULT '0',
        \`precio_lista\` decimal(12,2) NOT NULL DEFAULT '0.00',
        \`costo_promedio\` decimal(12,2) NOT NULL DEFAULT '0.00',
        \`proveedor_id\` int DEFAULT NULL,
        \`backorder\` int DEFAULT '0',
        \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`sku\` (\`sku\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `,
  coordenadas: `
    CREATE TABLE \`coordenadas\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`producto_id\` int NOT NULL,
      \`almacen_id\` int NOT NULL,
      \`seccion_id\` int DEFAULT NULL,
      \`codigo_coordenada\` varchar(100) NOT NULL,
      \`fecha_caducidad\` date DEFAULT NULL,
      \`cantidad\` int NOT NULL DEFAULT '0',
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      KEY \`producto_id\` (\`producto_id\`),
      KEY \`almacen_id\` (\`almacen_id\`),
      KEY \`seccion_id\` (\`seccion_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `,
  almacenes: `
    CREATE TABLE \`almacenes\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`clave\` varchar(50) NOT NULL,
      \`nombre\` varchar(255) NOT NULL,
      \`direccion\` text,
      \`tipo\` enum('PRINCIPAL','SUCURSAL','BODEGA','TRANSITO') NOT NULL DEFAULT 'SUCURSAL',
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`clave\` (\`clave\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `,
  secciones: `
    CREATE TABLE \`secciones\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`almacen_id\` int NOT NULL,
      \`clave\` varchar(50) NOT NULL,
      \`nombre\` varchar(255) NOT NULL,
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      KEY \`almacen_id\` (\`almacen_id\`),
      CONSTRAINT \`secciones_ibfk_1\` FOREIGN KEY (\`almacen_id\`) REFERENCES \`almacenes\` (\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `,
  bitacora: `
    CREATE TABLE \`bitacora\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`fecha\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`usuario_id\` int NOT NULL,
      \`accion\` varchar(255) NOT NULL,
      \`descripcion\` text NOT NULL,
      \`referencia_id\` int DEFAULT NULL,
      \`modulo\` varchar(100) DEFAULT NULL,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `,
  usuarios: `
    CREATE TABLE \`usuarios\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`username\` varchar(255) DEFAULT NULL,
      \`email\` varchar(255) NOT NULL,
      \`telefono\` varchar(50) DEFAULT NULL,
      \`password_hash\` varchar(255) NOT NULL,
      \`nombre\` varchar(255) NOT NULL,
      \`apellido_p\` varchar(255) DEFAULT NULL,
      \`apellido_m\` varchar(255) DEFAULT NULL,
      \`avatar_url\` varchar(255) DEFAULT NULL,
      \`activo\` tinyint(1) NOT NULL DEFAULT '1',
      \`ultimo_acceso\` timestamp NULL DEFAULT NULL,
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      \`deleted_at\` timestamp NULL DEFAULT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`email\` (\`email\`),
      UNIQUE KEY \`username\` (\`username\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `,
  roles: `
    CREATE TABLE \`roles\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`nombre\` varchar(255) NOT NULL,
      \`descripcion\` text,
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`nombre\` (\`nombre\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `,
  ventas: `
    CREATE TABLE \`ventas\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`folio\` varchar(50) NOT NULL,
      \`fecha\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`cliente_id\` int NOT NULL,
      \`orden_id\` int DEFAULT NULL,
      \`total\` decimal(12,2) NOT NULL,
      \`estado\` enum('BORRADOR','PAGADA','PARCIAL','CANCELADA') NOT NULL DEFAULT 'BORRADOR',
      \`items\` JSON DEFAULT NULL,
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`folio\` (\`folio\`),
      KEY \`cliente_id\` (\`cliente_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `,
  presupuestos: `
    CREATE TABLE \`presupuestos\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`folio\` varchar(50) NOT NULL,
      \`fecha\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`fecha_vencimiento\` timestamp NULL DEFAULT NULL,
      \`cliente_id\` int NOT NULL,
      \`total\` decimal(12,2) NOT NULL,
      \`estado\` enum('BORRADOR','ENVIADO','ACEPTADO','RECHAZADO','VENCIDO') NOT NULL DEFAULT 'BORRADOR',
      \`items\` json DEFAULT NULL,
      \`observaciones\` text,
      \`descuento_concepto\` varchar(255) DEFAULT NULL,
      \`descuento_monto\` decimal(12,2) DEFAULT '0.00',
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`folio\` (\`folio\`),
      KEY \`cliente_id\` (\`cliente_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `,
  ordenes_compra: `
    CREATE TABLE \`ordenes_compra\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`folio\` varchar(50) NOT NULL,
      \`fecha\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`proveedor_id\` int NOT NULL,
      \`estado\` enum('BORRADOR','ENVIADA','PARCIAL','RECIBIDA','CANCELADA') NOT NULL DEFAULT 'BORRADOR',
      \`moneda\` varchar(10) NOT NULL DEFAULT 'MXN',
      \`subtotal\` decimal(12,2) NOT NULL,
      \`impuestos\` decimal(12,2) NOT NULL,
      \`total\` decimal(12,2) NOT NULL,
      \`items\` json,
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`folio\` (\`folio\`),
      KEY \`proveedor_id\` (\`proveedor_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `,
   ordenes_servicio: `
    CREATE TABLE \`ordenes_servicio\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`folio\` varchar(50) NOT NULL,
      \`fecha\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`cliente_id\` int NOT NULL,
      \`equipo_id\` int NOT NULL,
      \`marca_id\` int DEFAULT NULL,
      \`modelo_id\` int DEFAULT NULL,
      \`diagnostico_ini\` text,
      \`estado\` enum('RECEPCION','DIAGNOSTICO','AUTORIZACION','EN_REPARACION','PRUEBAS','LISTO','ENTREGADO','CANCELADO') NOT NULL DEFAULT 'RECEPCION',
      \`tecnico_id\` int DEFAULT NULL,
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`folio\` (\`folio\`),
      KEY \`cliente_id\` (\`cliente_id\`),
      KEY \`tecnico_id\` (\`tecnico_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `,
  gastos: `
    CREATE TABLE \`gastos\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`fecha\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`categoria\` varchar(100) NOT NULL,
      \`descripcion\` text,
      \`monto\` decimal(12,2) NOT NULL,
      \`empleado_id\` int NOT NULL,
      \`autorizador_id\` int DEFAULT NULL,
      \`estado\` enum('PENDIENTE','APROBADO','RECHAZADO') NOT NULL DEFAULT 'PENDIENTE',
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      KEY \`empleado_id\` (\`empleado_id\`),
      KEY \`autorizador_id\` (\`autorizador_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `,
  solicitudes_internas: `
    CREATE TABLE \`solicitudes_internas\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`folio\` varchar(50) NOT NULL,
      \`solicitante_id\` int NOT NULL,
      \`aprobador_id\` int DEFAULT NULL,
      \`fecha_solicitud\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`fecha_respuesta\` timestamp NULL DEFAULT NULL,
      \`tipo\` enum('COMPRA','GASTO','VACACIONES','PERMISO','BAJA_PRODUCTO','OTRO') NOT NULL,
      \`descripcion\` text NOT NULL,
      \`estado\` enum('PENDIENTE','APROBADA','RECHAZADA','CANCELADA') NOT NULL DEFAULT 'PENDIENTE',
      \`monto\` decimal(12,2) DEFAULT NULL,
      \`comentarios\` text,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`folio\` (\`folio\`),
      KEY \`solicitante_id\` (\`solicitante_id\`),
      KEY \`aprobador_id\` (\`aprobador_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `,
  rol_permisos: `
    CREATE TABLE \`rol_permisos\` (
      \`rol_id\` int NOT NULL,
      \`permiso_id\` int NOT NULL,
      PRIMARY KEY (\`rol_id\`,\`permiso_id\`),
      KEY \`permiso_id\` (\`permiso_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `
};

export function getCreateTableScript(tableName: string): string | undefined {
  return tableScripts[tableName];
}
