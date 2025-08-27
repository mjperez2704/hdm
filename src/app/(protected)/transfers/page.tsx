import { TransferForm } from "@/components/transfer-form";
import { getAlmacenes, getProductos, getCoordenada } from "@/lib/data";

export default async function TransfersPage() {
  const almacenes = await getAlmacenes();
  const productos = await getProductos();
  const coordenadas = await getCoordenada();

  return <TransferForm almacenes={almacenes} productos={productos} coordenadas={coordenadas} />;
}
