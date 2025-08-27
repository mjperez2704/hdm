import * as z from "zod";

// ============================================================
//  Esquemas de Validación Centralizados (Zod)
// ============================================================

// --
// ADMINISTRACION
// --
export const admBitacoraSchema = z.object({
    id: z.coerce.number(),
    usuario_id: z.coerce.number().optional().nullable(),
    tipo: z.string().max(60),
    modulo: z.string().max(100),
    descripcion: z.string().optional().nullable(),
    ip: z.string().max(64).optional().nullable(),
    user_agent: z.string().max(255).optional().nullable(),
    created_at: z.coerce.date(),
});
export type AdmBitacoraFormValues = z.infer<typeof admBitacoraSchema>;



// --
// ALMACEN
// --
export const almAlmacenesSchema = z.object({
    id: z.coerce.number(),
    clave: z.string().max(30),
    nombre: z.string().max(150),
    direccion: z.string().max(300).optional().nullable(),
    tipo: z.enum(["PRINCIPAL", "SUCURSAL", "BODEGA", "TRANSITO"]),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    deleted_at: z.coerce.date().optional().nullable(),
});
export type AlmAlmacenesFormValues = z.infer<typeof almAlmacenesSchema>;

export const almCoordenadaSchema = z.object({
    id: z.coerce.number(),
    producto_id: z.coerce.number(),
    almacen_id: z.coerce.number(),
    seccion_id: z.coerce.number().optional().nullable(),
    codigo_coordenada: z.string().max(80),
    fecha_alta: z.coerce.date(),
    fecha_caducidad: z.coerce.date().optional().nullable(),
    cantidad: z.coerce.number().default(0.0),
});
export type almCoordenadaFormValues = z.infer<typeof almCoordenadaSchema>;

export const almSeccionesSchema = z.object({
    id: z.coerce.number(),
    almacen_id: z.coerce.number(),
    clave: z.string().max(30),
    nombre: z.string().max(150),
});
export type AlmSeccionesFormValues = z.infer<typeof almSeccionesSchema>;

export const almTrasladosSchema = z.object({
    id: z.coerce.number(),
    folio: z.string().max(30),
    fecha: z.coerce.date(),
    almacen_origen_id: z.coerce.number(),
    almacen_destino_id: z.coerce.number(),
    estado: z.enum(["BORRADOR", "EN_TRANSITO", "RECIBIDO", "CANCELADO"]),
    creado_por: z.coerce.number().optional().nullable(),
    recibido_por: z.coerce.number().optional().nullable(),
    notas: z.string().max(255).optional().nullable(),
});
export type AlmTrasladosFormValues = z.infer<typeof almTrasladosSchema>;

export const almTrasladosDetSchema = z.object({
    id: z.coerce.number(),
    traslado_id: z.coerce.number(),
    producto_id: z.coerce.number(),
    coordenada_id: z.coerce.number().optional().nullable(),
    cantidad: z.coerce.number(),
});
export type AlmTrasladosDetFormValues = z.infer<typeof almTrasladosDetSchema>;



// --
// CATALOGOS
// --
export const catCategoriasProductoSchema = z.object({
    id: z.coerce.number(),
    nombre: z.string().max(120),
    tipo: z.enum(["EQUIPO", "REFACCION", "ACCESORIO", "HERRAMIENTA", "SERVICIO"]),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    deleted_at: z.coerce.date().optional().nullable(),
});
export type CatCategoriasProductoFormValues = z.infer<typeof catCategoriasProductoSchema>;

export const catHerramientasSchema = z.object({
    id: z.coerce.number(),
    sku: z.string().max(80),
    nombre: z.string().max(150),
    descripcion: z.string().optional().nullable(),
    requiere_calibracion: z.boolean(),
    asignada_empleado_id: z.coerce.number().optional().nullable(),
    estado: z.enum(["DISPONIBLE", "VENDIDO", "ASIGNADO", "EN_SERVICIO", "BAJA"]),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    deleted_at: z.coerce.date().optional().nullable(),
});
export type CatHerramientasFormValues = z.infer<typeof catHerramientasSchema>;

export const catManualesSchema = z.object({
    id: z.coerce.number(),
    producto_id: z.coerce.number().optional().nullable(),
    titulo: z.string().max(200),
    url_pdf: z.string().max(500).optional().nullable(),
    descripcion: z.string().optional().nullable(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    deleted_at: z.coerce.date().optional().nullable(),
});
export type CatManualesFormValues = z.infer<typeof catManualesSchema>;

export const catMarcasSchema = z.object({
    id: z.coerce.number(),
    nombre: z.string().max(120),
    pais_origen: z.string().max(120).optional().nullable(),
    sitio_web: z.string().max(255).optional().nullable(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    deleted_at: z.coerce.date().optional().nullable(),
});
export type CatMarcasFormValues = z.infer<typeof catMarcasSchema>;

export const catModelosSchema = z.object({
    id: z.coerce.number(),
    marca_id: z.coerce.number(),
    nombre: z.string().max(120),
    anio: z.coerce.number().optional().nullable(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    deleted_at: z.coerce.date().optional().nullable(),
});
export type CatModelosFormValues = z.infer<typeof catModelosSchema>;

export const catProductosSchema = z.object({
    id: z.coerce.number(),
    sku: z.string().max(80),
    nombre: z.string().max(200),
    descripcion: z.string().optional().nullable(),
    categoria_id: z.coerce.number(),
    marca_id: z.coerce.number().optional().nullable(),
    modelo_id: z.coerce.number().optional().nullable(),
    version_id: z.coerce.number().optional().nullable(),
    unidad: z.string().max(20),
    activo: z.boolean(),
    es_serie: z.boolean(),
    precio_lista: z.coerce.number().default(0.0),
    costo_promedio: z.coerce.number().default(0.0),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    deleted_at: z.coerce.date().optional().nullable(),
});
export type CatProductosFormValues = z.infer<typeof catProductosSchema>;

export const catProductosSeriesSchema = z.object({
    id: z.coerce.number(),
    producto_id: z.coerce.number(),
    numero_serie: z.string().max(120),
    estado: z.enum(["DISPONIBLE", "VENDIDO", "ASIGNADO", "EN_SERVICIO", "BAJA"]),
    created_at: z.coerce.date(),
});
export type CatProductosSeriesFormValues = z.infer<typeof catProductosSeriesSchema>;

export const catVersionesSchema = z.object({
    id: z.coerce.number(),
    modelo_id: z.coerce.number(),
    nombre: z.string().max(120),
    notas: z.string().max(255).optional().nullable(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    deleted_at: z.coerce.date().optional().nullable(),
});
export type CatVersionesFormValues = z.infer<typeof catVersionesSchema>;



// --
// CLIENTES
// --
export const cliClientesSchema = z.object({
    id: z.coerce.number(),
    tipo_id: z.coerce.number(),
    razon_social: z.string().max(200),
    rfc: z.string().max(20).optional().nullable(),
    curp: z.string().max(18).optional().nullable(),
    email: z.string().max(200).optional().nullable(),
    telefono: z.string().max(40).optional().nullable(),
    whatsapp: z.string().max(40).optional().nullable(),
    direccion: z.string().max(300).optional().nullable(),
    ciudad: z.string().max(120).optional().nullable(),
    estado: z.string().max(120).optional().nullable(),
    pais: z.string().max(120),
    cp: z.string().max(10).optional().nullable(),
    fecha_registro: z.coerce.date(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    deleted_at: z.coerce.date().optional().nullable(),
});
export type CliClientesFormValues = z.infer<typeof cliClientesSchema>;

export const cliContactosSchema = z.object({
    id: z.coerce.number(),
    cliente_id: z.coerce.number(),
    nombre: z.string().max(150),
    email: z.string().max(200).optional().nullable(),
    telefono: z.string().max(40).optional().nullable(),
    puesto: z.string().max(120).optional().nullable(),
    principal: z.boolean(),
});
export type CliContactosFormValues = z.infer<typeof cliContactosSchema>;

export const cliTiposSchema = z.object({
    id: z.coerce.number(),
    clave: z.enum(["FINAL", "EMPRESA"]),
    etiqueta: z.string().max(60),
});
export type CliTiposFormValues = z.infer<typeof cliTiposSchema>;



// --
// COMUNICACIONES
// --
export const commAvisosSchema = z.object({
    id: z.coerce.number(),
    titulo: z.string().max(200),
    mensaje: z.string(),
    prioridad: z.enum(["BAJA", "MEDIA", "ALTA", "CRITICA"]),
    publico: z.boolean(),
    creado_por: z.coerce.number(),
    created_at: z.coerce.date(),
});
export type CommAvisosFormValues = z.infer<typeof commAvisosSchema>;

export const commAvisosDestinatariosSchema = z.object({
    id: z.coerce.number(),
    aviso_id: z.coerce.number(),
    usuario_id: z.coerce.number(),
    leido_en: z.coerce.date().optional().nullable(),
});
export type CommAvisosDestinatariosFormValues = z.infer<typeof commAvisosDestinatariosSchema>;

export const commSolicitudesSchema = z.object({
    id: z.coerce.number(),
    folio: z.string().max(30),
    solicitante_id: z.coerce.number(),
    asignado_id: z.coerce.number().optional().nullable(),
    categoria: z.string().max(100),
    asunto: z.string().max(200),
    descripcion: z.string().optional().nullable(),
    estado: z.enum(["ABIERTA", "EN_PROGRESO", "EN_ESPERA", "CERRADA", "CANCELADA"]),
    prioridad: z.enum(["BAJA", "MEDIA", "ALTA", "CRITICA"]),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});
export type CommSolicitudesFormValues = z.infer<typeof commSolicitudesSchema>;



// --
// COMPRAS
// --
export const comEleComprobantesSchema = z.object({
    id: z.coerce.number(),
    tipo: z.enum(["FACTURA", "NOTA_CREDITO", "NOTA_CARGO", "RECIBO", "OTRO"]),
    uuid: z.string().length(36).optional().nullable(),
    folio: z.string().max(30).optional().nullable(),
    fecha_emision: z.coerce.date(),
    receptor_rfc: z.string().max(20).optional().nullable(),
    emisor_rfc: z.string().max(20).optional().nullable(),
    total: z.coerce.number().optional().nullable(),
    xml_url: z.string().max(500).optional().nullable(),
    pdf_url: z.string().max(500).optional().nullable(),
    venta_id: z.coerce.number().optional().nullable(),
    orden_compra_id: z.coerce.number().optional().nullable(),
});
export type ComEleComprobantesFormValues = z.infer<typeof comEleComprobantesSchema>;

export const comOrdenesCompraSchema = z.object({
    id: z.coerce.number(),
    folio: z.string().max(30),
    fecha: z.coerce.date(),
    proveedor_id: z.coerce.number(),
    estado: z.enum(["BORRADOR", "ENVIADA", "PARCIAL", "RECIBIDA", "CANCELADA"]),
    moneda: z.string().max(10),
    tipo_cambio: z.coerce.number(),
    subtotal: z.coerce.number(),
    impuestos: z.coerce.number(),
    total: z.coerce.number(),
    notas: z.string().max(255).optional().nullable(),
});
export type ComOrdenesCompraFormValues = z.infer<typeof comOrdenesCompraSchema>;

export const comOrdenesCompraDetSchema = z.object({
    id: z.coerce.number(),
    orden_compra_id: z.coerce.number(),
    producto_id: z.coerce.number(),
    cantidad: z.coerce.number(),
    precio_unitario: z.coerce.number(),
    descuento_pct: z.coerce.number().optional().nullable(),
    impuestos_pct: z.coerce.number().optional().nullable(),
});
export type ComOrdenesCompraDetFormValues = z.infer<typeof comOrdenesCompraDetSchema>;

export const comRequisicionesSchema = z.object({
    id: z.coerce.number(),
    folio: z.string().max(30),
    fecha: z.coerce.date(),
    solicitante_id: z.coerce.number(),
    estado: z.enum(["BORRADOR", "ENVIADA", "APROBADA", "RECHAZADA", "CERRADA"]),
    notas: z.string().max(255).optional().nullable(),
});
export type ComRequisicionesFormValues = z.infer<typeof comRequisicionesSchema>;

export const comRequisicionesDetSchema = z.object({
    id: z.coerce.number(),
    requisicion_id: z.coerce.number(),
    producto_id: z.coerce.number(),
    cantidad: z.coerce.number(),
});
export type ComRequisicionesDetFormValues = z.infer<typeof comRequisicionesDetSchema>;



// --
// CONVENIOS
// --
export const convConveniosSchema = z.object({
    id: z.coerce.number(),
    nombre: z.string().max(150),
    descripcion: z.string().optional().nullable(),
    cliente_id: z.coerce.number().optional().nullable(),
    proveedor_id: z.coerce.number().optional().nullable(),
    fecha_inicio: z.coerce.date(),
    fecha_fin: z.coerce.date().optional().nullable(),
    descuento_pct: z.coerce.number().optional().nullable(),
    condiciones: z.string().optional().nullable(),
    activo: z.boolean(),
});
export type ConvConveniosFormValues = z.infer<typeof convConveniosSchema>;



// --
// CRM
// --
export const crmActividadesSchema = z.object({
    id: z.coerce.number(),
    oportunidad_id: z.coerce.number().optional().nullable(),
    cliente_id: z.coerce.number().optional().nullable(),
    tipo: z.enum(["LLAMADA", "REUNION", "EMAIL", "WHATSAPP", "OTRO"]),
    asunto: z.string().max(200),
    descripcion: z.string().optional().nullable(),
    programada_el: z.coerce.date().optional().nullable(),
    realizada_el: z.coerce.date().optional().nullable(),
    realizado_por: z.coerce.number().optional().nullable(),
});
export type CrmActividadesFormValues = z.infer<typeof crmActividadesSchema>;

export const crmCampanasSchema = z.object({
    id: z.coerce.number(),
    nombre: z.string().max(200),
    canal: z.enum(["EMAIL", "SMS", "WHATSAPP", "FACEBOOK", "INSTAGRAM", "TIKTOK", "OTRO"]),
    fecha_inicio: z.coerce.date().optional().nullable(),
    fecha_fin: z.coerce.date().optional().nullable(),
    presupuesto: z.coerce.number().optional().nullable(),
    objetivo: z.string().max(255).optional().nullable(),
    notas: z.string().optional().nullable(),
});
export type CrmCampanasFormValues = z.infer<typeof crmCampanasSchema>;

export const crmCampanasSegmentosSchema = z.object({
    id: z.coerce.number(),
    campana_id: z.coerce.number(),
    nombre: z.string().max(200),
    criterio: z.string(),
});
export type CrmCampanasSegmentosFormValues = z.infer<typeof crmCampanasSegmentosSchema>;

export const crmEnviosSchema = z.object({
    id: z.coerce.number(),
    campana_id: z.coerce.number(),
    cliente_id: z.coerce.number(),
    medio: z.enum(["EMAIL", "SMS", "WHATSAPP", "OTRO"]),
    enviado_el: z.coerce.date().optional().nullable(),
    abierto: z.boolean().optional().nullable(),
    clics: z.number().int().optional().nullable(),
});
export type CrmEnviosFormValues = z.infer<typeof crmEnviosSchema>;

export const crmEtapasOportunidadSchema = z.object({
    id: z.coerce.number(),
    nombre: z.string().max(100),
    orden: z.number().int(),
});
export type CrmEtapasOportunidadFormValues = z.infer<typeof crmEtapasOportunidadSchema>;

export const crmLealtadClientesSchema = z.object({
    id: z.coerce.number(),
    programa_id: z.coerce.number(),
    cliente_id: z.coerce.number(),
    puntos: z.coerce.number(),
});
export type CrmLealtadClientesFormValues = z.infer<typeof crmLealtadClientesSchema>;

export const crmLealtadMovimientosSchema = z.object({
    id: z.coerce.number(),
    lealtad_id: z.coerce.number(),
    fecha: z.coerce.date(),
    tipo: z.enum(["ACUMULACION", "REDENCION", "AJUSTE"]),
    puntos: z.coerce.number(),
    referencia: z.string().max(120).optional().nullable(),
});
export type CrmLealtadMovimientosFormValues = z.infer<typeof crmLealtadMovimientosSchema>;

export const crmLealtadProgramasSchema = z.object({
    id: z.coerce.number(),
    nombre: z.string().max(200),
    descripcion: z.string().optional().nullable(),
    puntos_por_peso: z.coerce.number().optional().nullable(),
    activo: z.boolean(),
});
export type CrmLealtadProgramasFormValues = z.infer<typeof crmLealtadProgramasSchema>;

export const crmOportunidadesSchema = z.object({
    id: z.coerce.number(),
    cliente_id: z.coerce.number(),
    nombre: z.string().max(200),
    valor_estimado: z.coerce.number().optional().nullable(),
    probabilidad: z.coerce.number().optional().nullable(),
    etapa_id: z.coerce.number(),
    fecha_cierre_esperada: z.coerce.date().optional().nullable(),
    responsable_id: z.coerce.number().optional().nullable(),
    notas: z.string().optional().nullable(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});
export type CrmOportunidadesFormValues = z.infer<typeof crmOportunidadesSchema>;

export const crmPromocionesSchema = z.object({
    id: z.coerce.number(),
    nombre: z.string().max(200),
    descripcion: z.string().optional().nullable(),
    tipo: z.enum(["DESCUENTO_PORCENTAJE", "DESCUENTO_FIJO", "2X1", "ENVIO_GRATIS", "OTRO"]),
    valor: z.coerce.number(),
    fecha_inicio: z.coerce.date().optional().nullable(),
    fecha_fin: z.coerce.date().optional().nullable(),
    activo: z.boolean(),
});
export type CrmPromocionesFormValues = z.infer<typeof crmPromocionesSchema>;

export const crmPromocionesProductosSchema = z.object({
    id: z.coerce.number(),
    promocion_id: z.coerce.number(),
    producto_id: z.coerce.number(),
});
export type CrmPromocionesProductosFormValues = z.infer<typeof crmPromocionesProductosSchema>;

export const crmTicketsSchema = z.object({
    id: z.coerce.number(),
    folio: z.string().max(30),
    cliente_id: z.coerce.number(),
    asunto: z.string().max(200),
    descripcion: z.string().optional().nullable(),
    estado: z.enum(["ABIERTO", "EN_PROCESO", "EN_ESPERA", "RESUELTO", "CERRADO"]),
    prioridad: z.enum(["BAJA", "MEDIA", "ALTA", "CRITICA"]),
    canal: z.enum(["WEB", "APP", "WHATSAPP", "TELEFONO", "EMAIL", "OTRO"]),
    creado_el: z.coerce.date(),
    asignado_id: z.coerce.number().optional().nullable(),
});
export type CrmTicketsFormValues = z.infer<typeof crmTicketsSchema>;

export const crmTicketsMensajesSchema = z.object({
    id: z.coerce.number(),
    ticket_id: z.coerce.number(),
    autor_tipo: z.enum(["CLIENTE", "AGENTE"]),
    autor_id: z.coerce.number().optional().nullable(),
    mensaje: z.string(),
    enviado_el: z.coerce.date(),
});
export type CrmTicketsMensajesFormValues = z.infer<typeof crmTicketsMensajesSchema>;

export const crmWhatsappMensajesSchema = z.object({
    id: z.coerce.number(),
    cliente_id: z.coerce.number().optional().nullable(),
    numero: z.string().max(40),
    direccion: z.enum(["ENTRANTE", "SALIENTE"]),
    mensaje: z.string(),
    enviado_el: z.coerce.date(),
    usuario_id: z.coerce.number().optional().nullable(),
});
export type CrmWhatsappMensajesFormValues = z.infer<typeof crmWhatsappMensajesSchema>;



// --
// DEVOLUCIONES
// --
export const devDevolucionesSchema = z.object({
    id: z.coerce.number(),
    folio: z.string().max(30),
    fecha: z.coerce.date(),
    tipo: z.enum(["A_PROVEEDOR", "DE_CLIENTE"]),
    proveedor_id: z.coerce.number().optional().nullable(),
    cliente_id: z.coerce.number().optional().nullable(),
    motivo: z.string().max(255),
    estado: z.enum(["BORRADOR", "ENVIADA", "CERRADA", "CANCELADA"]),
});
export type DevDevolucionesFormValues = z.infer<typeof devDevolucionesSchema>;

export const devDevolucionesDetSchema = z.object({
    id: z.coerce.number(),
    devolucion_id: z.coerce.number(),
    producto_id: z.coerce.number(),
    cantidad: z.coerce.number(),
    precio_unitario: z.coerce.number(),
});
export type DevDevolucionesDetFormValues = z.infer<typeof devDevolucionesDetSchema>;



// --
// EMPLEADOS
// --
export const empAsistenciasSchema = z.object({
    id: z.coerce.number(),
    empleado_id: z.coerce.number(),
    fecha: z.coerce.date(),
    hora_entrada: z.string().optional().nullable(),
    hora_salida: z.string().optional().nullable(),
    notas: z.string().max(255).optional().nullable(),
});
export type EmpAsistenciasFormValues = z.infer<typeof empAsistenciasSchema>;

export const empEmpleadosSchema = z.object({
    id: z.coerce.number(),
    codigo: z.string().max(30).optional().nullable(),
    nombre: z.string().max(150),
    apellido_p: z.string().max(150),
    apellido_m: z.string().max(150).optional().nullable(),
    curp: z.string().max(18).optional().nullable(),
    rfc: z.string().max(13).optional().nullable(),
    nss: z.string().max(15).optional().nullable(),
    email: z.string().max(200).optional().nullable(),
    telefono: z.string().max(30).optional().nullable(),
    puesto: z.string().max(120).optional().nullable(),
    fecha_ingreso: z.coerce.date().optional().nullable(),
    fecha_baja: z.coerce.date().optional().nullable(),
    salario_diario: z.coerce.number().optional().nullable(),
    usuario_id: z.coerce.number().optional().nullable(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    deleted_at: z.coerce.date().optional().nullable(),
});
export type EmpEmpleadosFormValues = z.infer<typeof empEmpleadosSchema>;

export const empIncapacidadesPermisosSchema = z.object({
    id: z.coerce.number(),
    empleado_id: z.coerce.number(),
    tipo: z.enum(["INCAPACIDAD", "PERMISO"]),
    motivo: z.string().max(255).optional().nullable(),
    fecha_inicio: z.coerce.date(),
    fecha_fin: z.coerce.date(),
    comprobante_url: z.string().max(500).optional().nullable(),
});
export type EmpIncapacidadesPermisosFormValues = z.infer<typeof empIncapacidadesPermisosSchema>;

export const empNominasSchema = z.object({
    id: z.coerce.number(),
    empleado_id: z.coerce.number(),
    periodo_del: z.coerce.date(),
    periodo_al: z.coerce.date(),
    percepciones: z.coerce.number(),
    deducciones: z.coerce.number(),
    neto: z.coerce.number(),
    pagado_en: z.coerce.date().optional().nullable(),
});
export type EmpNominasFormValues = z.infer<typeof empNominasSchema>;

export const empVacacionesSchema = z.object({
    id: z.coerce.number(),
    empleado_id: z.coerce.number(),
    periodo_inicio: z.coerce.date(),
    periodo_fin: z.coerce.date(),
    dias: z.number().int(),
    estado: z.enum(["SOLICITADA", "APROBADA", "RECHAZADA", "GOZADA"]),
});
export type EmpVacacionesFormValues = z.infer<typeof empVacacionesSchema>;



// --
// FINANZAS
// --
export const finCuentasContablesSchema = z.object({
    id: z.coerce.number(),
    codigo: z.string().max(30),
    nombre: z.string().max(200),
    naturaleza: z.enum(["DEUDORA", "ACREEDORA"]),
});
export type FinCuentasContablesFormValues = z.infer<typeof finCuentasContablesSchema>;

export const finCxcSchema = z.object({
    id: z.coerce.number(),
    cliente_id: z.coerce.number(),
    venta_id: z.coerce.number(),
    fecha_emision: z.coerce.date(),
    fecha_venc: z.coerce.date().optional().nullable(),
    saldo: z.coerce.number(),
    estado: z.enum(["ABIERTA", "PARCIAL", "CERRADA", "VENCIDA"]),
});
export type FinCxcFormValues = z.infer<typeof finCxcSchema>;

export const finCxpSchema = z.object({
    id: z.coerce.number(),
    proveedor_id: z.coerce.number(),
    orden_compra_id: z.coerce.number(),
    fecha_emision: z.coerce.date(),
    fecha_venc: z.coerce.date().optional().nullable(),
    saldo: z.coerce.number(),
    estado: z.enum(["ABIERTA", "PARCIAL", "CERRADA", "VENCIDA"]),
});
export type FinCxpFormValues = z.infer<typeof finCxpSchema>;

export const finGastosSchema = z.object({
    id: z.coerce.number(),
    fecha: z.coerce.date(),
    categoria: z.string().max(120),
    descripcion: z.string().max(255).optional().nullable(),
    monto: z.coerce.number(),
    pagado_con: z.enum(["CAJA", "BANCO", "TARJETA", "OTRO"]),
    comprobante_url: z.string().max(500).optional().nullable(),
    usuario_id: z.coerce.number().optional().nullable(),
});
export type FinGastosFormValues = z.infer<typeof finGastosSchema>;

export const finPagosSchema = z.object({
    id: z.coerce.number(),
    fecha: z.coerce.date(),
    cliente_id: z.coerce.number().optional().nullable(),
    proveedor_id: z.coerce.number().optional().nullable(),
    venta_id: z.coerce.number().optional().nullable(),
    orden_compra_id: z.coerce.number().optional().nullable(),
    metodo: z.enum(["EFECTIVO", "TARJETA", "TRANSFERENCIA", "MERCADO_PAGO", "PAYPAL", "OTRO"]),
    referencia: z.string().max(120).optional().nullable(),
    monto: z.coerce.number(),
    es_anticipo: z.boolean(),
    notas: z.string().max(255).optional().nullable(),
});
export type FinPagosFormValues = z.infer<typeof finPagosSchema>;

export const finPolizasSchema = z.object({
    id: z.coerce.number(),
    folio: z.string().max(30),
    fecha: z.coerce.date(),
    tipo: z.enum(["INGRESO", "EGRESO", "DIARIO"]),
    concepto: z.string().max(255).optional().nullable(),
});
export type FinPolizasFormValues = z.infer<typeof finPolizasSchema>;

export const finPolizasMovSchema = z.object({
    id: z.coerce.number(),
    poliza_id: z.coerce.number(),
    cuenta_id: z.coerce.number(),
    tipo: z.enum(["DEBE", "HABER"]),
    monto: z.coerce.number(),
    descripcion: z.string().max(255).optional().nullable(),
});
export type FinPolizasMovFormValues = z.infer<typeof finPolizasMovSchema>;



// --
// INVENTARIO
// --
export const invAjustesSchema = z.object({
    id: z.coerce.number(),
    folio: z.string().max(30),
    fecha: z.coerce.date(),
    motivo: z.string().max(200),
    usuario_id: z.coerce.number(),
});
export type InvAjustesFormValues = z.infer<typeof invAjustesSchema>;

export const invAjustesDetSchema = z.object({
    id: z.coerce.number(),
    ajuste_id: z.coerce.number(),
    producto_id: z.coerce.number(),
    coordenada_id: z.coerce.number().optional().nullable(),
    almacen_id: z.coerce.number(),
    cantidad: z.coerce.number(),
    tipo: z.enum(["POSITIVO", "NEGATIVO"]),
});
export type InvAjustesDetFormValues = z.infer<typeof invAjustesDetSchema>;

export const invMovimientosSchema = z.object({
    id: z.coerce.number(),
    fecha: z.coerce.date(),
    tipo: z.enum(["ENTRADA", "SALIDA", "AJUSTE_POSITIVO", "AJUSTE_NEGATIVO", "TRASLADO_SALIDA", "TRASLADO_ENTRADA", "DEVOLUCION_ENTRADA", "DEVOLUCION_SALIDA"]),
    referencia: z.string().max(60),
    producto_id: z.coerce.number(),
    coordenada_id: z.coerce.number().optional().nullable(),
    almacen_id: z.coerce.number(),
    seccion_id: z.coerce.number().optional().nullable(),
    cantidad: z.coerce.number(),
    costo_unit: z.coerce.number(),
    usuario_id: z.coerce.number().optional().nullable(),
    notas: z.string().max(255).optional().nullable(),
});
export type InvMovimientosFormValues = z.infer<typeof invMovimientosSchema>;



// --
// LOGISTICA
// --
export const logRecepcionesSchema = z.object({
    id: z.coerce.number(),
    folio: z.string().max(30),
    fecha: z.coerce.date(),
    orden_compra_id: z.coerce.number().optional().nullable(),
    proveedor_id: z.coerce.number(),
    almacen_id: z.coerce.number(),
    estado: z.enum(["BORRADOR", "PARCIAL", "COMPLETA", "CANCELADA"]),
});
export type LogRecepcionesFormValues = z.infer<typeof logRecepcionesSchema>;

export const logRecepcionesDetSchema = z.object({
    id: z.coerce.number(),
    recepcion_id: z.coerce.number(),
    producto_id: z.coerce.number(),
    coordenada_id: z.coerce.number().optional().nullable(),
    cantidad: z.coerce.number(),
    costo_unitario: z.coerce.number(),
});
export type LogRecepcionesDetFormValues = z.infer<typeof logRecepcionesDetSchema>;



// --
// PROVEEDORES
// --
export const prvContactosSchema = z.object({
    id: z.coerce.number(),
    proveedor_id: z.coerce.number(),
    nombre: z.string().max(150),
    email: z.string().max(200).optional().nullable(),
    telefono: z.string().max(40).optional().nullable(),
    puesto: z.string().max(120).optional().nullable(),
    principal: z.boolean(),
});
export type PrvContactosFormValues = z.infer<typeof prvContactosSchema>;

export const prvProveedoresSchema = z.object({
    id: z.coerce.number(),
    razon_social: z.string().max(200),
    rfc: z.string().max(20).optional().nullable(),
    email: z.string().max(200).optional().nullable(),
    telefono: z.string().max(40).optional().nullable(),
    whatsapp: z.string().max(40).optional().nullable(),
    direccion: z.string().max(300).optional().nullable(),
    ciudad: z.string().max(120).optional().nullable(),
    estado: z.string().max(120).optional().nullable(),
    pais: z.string().max(120),
    cp: z.string().max(10).optional().nullable(),
    dias_credito: z.number().int().optional().nullable(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    deleted_at: z.coerce.date().optional().nullable(),
});
export type PrvProveedoresFormValues = z.infer<typeof prvProveedoresSchema>;



// --
// REGLAS
// --
export const rnReglasSchema = z.object({
    id: z.coerce.number(),
    ambito: z.enum(["ALMACEN", "ADMINISTRACION", "TECNICAS"]),
    clave: z.string().max(120),
    descripcion: z.string().optional().nullable(),
    valor_json: z.string(),
    activo: z.boolean(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});
export type RnReglasFormValues = z.infer<typeof rnReglasSchema>;



// --
// SEGURIDAD
// --
export const segPermisosSchema = z.object({
    id: z.coerce.number(),
    clave: z.string().max(150),
    modulo: z.string().max(100),
    descripcion: z.string().max(255).optional().nullable(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    deleted_at: z.coerce.date().optional().nullable(),
});
export type SegPermisosFormValues = z.infer<typeof segPermisosSchema>;

export const segRolesSchema = z.object({
    id: z.coerce.number(),
    nombre: z.string().max(100),
    descripcion: z.string().max(255).optional().nullable(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    deleted_at: z.coerce.date().optional().nullable(),
});
export type SegRolesFormValues = z.infer<typeof segRolesSchema>;

export const segRolPermisoSchema = z.object({
    id: z.coerce.number(),
    rol_id: z.coerce.number(),
    permiso_id: z.coerce.number(),
    created_at: z.coerce.date(),
});
export type SegRolPermisoFormValues = z.infer<typeof segRolPermisoSchema>;

export const segTokensApiSchema = z.object({
    id: z.coerce.number(),
    usuario_id: z.coerce.number(),
    token_hash: z.string().length(64),
    vence_el: z.coerce.date().optional().nullable(),
    creado_el: z.coerce.date(),
    activo: z.boolean(),
});
export type SegTokensApiFormValues = z.infer<typeof segTokensApiSchema>;

export const segUsuariosSchema = z.object({
    id: z.coerce.number(),
    username: z.string().max(100),
    email: z.string().email().max(255),
    telefono: z.string().max(30).optional().nullable(),
    password_hash: z.string().max(255),
    nombre: z.string().max(150),
    apellido_p: z.string().max(150).optional().nullable(),
    apellido_m: z.string().max(150).optional().nullable(),
    avatar_url: z.string().max(500).optional().nullable(),
    activo: z.boolean(),
    ultimo_acceso: z.coerce.date().optional().nullable(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    deleted_at: z.coerce.date().optional().nullable(),
});
export type SegUsuariosFormValues = z.infer<typeof segUsuariosSchema>;

export const segUsuarioRolSchema = z.object({
    id: z.coerce.number(),
    usuario_id: z.coerce.number(),
    rol_id: z.coerce.number(),
    created_at: z.coerce.date(),
});
export type SegUsuarioRolFormValues = z.infer<typeof segUsuarioRolSchema>;



// --
// SERVICIOS
// --
export const srvEquiposSchema = z.object({
    id: z.coerce.number(),
    cliente_id: z.coerce.number(),
    marca_id: z.coerce.number().optional().nullable(),
    modelo_id: z.coerce.number().optional().nullable(),
    version_id: z.coerce.number().optional().nullable(),
    imei: z.string().max(50).optional().nullable(),
    numero_serie: z.string().max(120).optional().nullable(),
    color: z.string().max(80).optional().nullable(),
    accesorios: z.string().max(255).optional().nullable(),
    condicion: z.string().max(255).optional().nullable(),
    notas: z.string().optional().nullable(),
    created_at: z.coerce.date(),
});
export type SrvEquiposFormValues = z.infer<typeof srvEquiposSchema>;

export const srvOrdenesSchema = z.object({
    id: z.coerce.number(),
    folio: z.string().max(30),
    fecha: z.coerce.date(),
    cliente_id: z.coerce.number(),
    equipo_id: z.coerce.number(),
    diagnostico_ini: z.string().max(255).optional().nullable(),
    estado: z.enum(["RECEPCION", "DIAGNOSTICO", "AUTORIZACION", "EN_REPARACION", "PRUEBAS", "LISTO", "ENTREGADO", "CANCELADO"]),
    prioridad: z.enum(["BAJA", "MEDIA", "ALTA", "CRITICA"]),
    tecnico_id: z.coerce.number().optional().nullable(),
    fecha_promesa: z.coerce.date().optional().nullable(),
    notas: z.string().optional().nullable(),
});
export type SrvOrdenesFormValues = z.infer<typeof srvOrdenesSchema>;

export const srvOrdenesMaterialesSchema = z.object({
    id: z.coerce.number(),
    orden_id: z.coerce.number(),
    producto_id: z.coerce.number(),
    cantidad: z.coerce.number(),
    costo_unitario: z.coerce.number(),
});
export type SrvOrdenesMaterialesFormValues = z.infer<typeof srvOrdenesMaterialesSchema>;

export const srvOrdenesTrabajosSchema = z.object({
    id: z.coerce.number(),
    orden_id: z.coerce.number(),
    descripcion: z.string().max(255),
    horas_estimadas: z.coerce.number().optional().nullable(),
    horas_reales: z.coerce.number().optional().nullable(),
    mano_obra: z.coerce.number().optional().nullable(),
    estado: z.enum(["PENDIENTE", "EN_PROCESO", "COMPLETADO", "CANCELADO"]),
    tecnico_id: z.coerce.number().optional().nullable(),
});
export type SrvOrdenesTrabajosFormValues = z.infer<typeof srvOrdenesTrabajosSchema>;



// --
// VENTAS
// --
export const venPresupuestosSchema = z.object({
    id: z.coerce.number(),
    folio: z.string().max(30),
    fecha: z.coerce.date(),
    cliente_id: z.coerce.number(),
    moneda: z.string().max(10),
    tipo_cambio: z.coerce.number(),
    subtotal: z.coerce.number(),
    impuestos: z.coerce.number(),
    total: z.coerce.number(),
    estado: z.enum(["BORRADOR", "ENVIADO", "ACEPTADO", "RECHAZADO", "VENCIDO"]),
    vigencia_al: z.coerce.date().optional().nullable(),
    notas: z.string().max(255).optional().nullable(),
});
export type VenPresupuestosFormValues = z.infer<typeof venPresupuestosSchema>;

export const venPresupuestosDetSchema = z.object({
    id: z.coerce.number(),
    presupuesto_id: z.coerce.number(),
    producto_id: z.coerce.number(),
    descripcion: z.string().max(255).optional().nullable(),
    cantidad: z.coerce.number(),
    precio_unitario: z.coerce.number(),
    descuento_pct: z.coerce.number().optional().nullable(),
    impuestos_pct: z.coerce.number().optional().nullable(),
});
export type VenPresupuestosDetFormValues = z.infer<typeof venPresupuestosDetSchema>;

export const venVentasSchema = z.object({
    id: z.coerce.number(),
    folio: z.string().max(30),
    fecha: z.coerce.date(),
    cliente_id: z.coerce.number(),
    orden_id: z.coerce.number().optional().nullable(),
    moneda: z.string().max(10),
    tipo_cambio: z.coerce.number(),
    subtotal: z.coerce.number(),
    impuestos: z.coerce.number(),
    total: z.coerce.number(),
    estado: z.enum(["BORRADOR", "PAGADA", "PARCIAL", "CANCELADA"]),
    notas: z.string().max(255).optional().nullable(),
});
export type VenVentasFormValues = z.infer<typeof venVentasSchema>;

export const venVentasDetSchema = z.object({
    id: z.coerce.number(),
    venta_id: z.coerce.number(),
    producto_id: z.coerce.number().optional().nullable(),
    descripcion: z.string().max(255).optional().nullable(),
    cantidad: z.coerce.number(),
    precio_unitario: z.coerce.number(),
    descuento_pct: z.coerce.number().optional().nullable(),
    impuestos_pct: z.coerce.number().optional().nullable(),
});
export type VenVentasDetFormValues = z.infer<typeof venVentasDetSchema>;
