
import { WarehouseManager } from "@/components/warehouse-manager";
import { getAlmacenes, getCoordenada } from "@/lib/data";

export default async function WarehousePage() {
  const warehouseData = await getAlmacenes();
  const coordenadaData = await getCoordenada();
  return (
    <WarehouseManager initialData={warehouseData} coordenadas={coordenadaData} />
  );
}
