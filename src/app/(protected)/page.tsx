import { Dashboard } from "@/components/dashboard";
import { getProductos, getCoordenadas, getAlmacenes } from "@/lib/data";

export default async function HomePage() {
  const inventoryData = await getProductos();
  const coordenadasData = await getCoordenadas();
  const almacenesData = await getAlmacenes();

  // Calcular el stock total para cada producto
  const inventoryWithStock = inventoryData.map(producto => {
    const stock = coordenadasData
      .filter(coordenada => coordenada.producto_id === producto.id)
      .reduce((acc, coordenada) => acc + coordenada.cantidad, 0);
    return { ...producto, stock };
  });

  // TODO: Cargar registros de auditoría cuando estén disponibles
  const auditLogsData: any[] = []; 

  return (
    <Dashboard
      initialInventory={inventoryWithStock}
      initialAuditLogs={auditLogsData}
      coordenadas={coordenadasData}
      almacenes={almacenesData}
    />
  );
}
