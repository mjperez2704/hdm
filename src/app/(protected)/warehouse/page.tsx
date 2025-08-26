
import { WarehouseManager } from "@/components/warehouse-manager";
import { getAlmacenes, getCoordenadas } from "@/lib/data";

export default async function WarehousePage() {
  const warehouseData = await getAlmacenes();
  const coordenadasData = await getCoordenadas();
  return (
    <WarehouseManager initialData={warehouseData} coordenadas={coordenadasData} />
  );
}
