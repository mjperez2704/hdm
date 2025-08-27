import { AdjustmentManager } from "@/components/adjustment-manager";
import { getAlmacenes, getProductos, getCoordenada } from "@/lib/data";

export default async function AdjustmentsPage() {
  const almacenes = await getAlmacenes();
  const productos = await getProductos();
  const coordenadas = await getCoordenada();

  return <AdjustmentManager almacenes={almacenes} productos={productos} coordenadas={coordenadas} />;
}
