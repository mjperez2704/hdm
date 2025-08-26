import { TransferForm } from "@/components/transfer-form";
import { getAlmacenes, getProductos, getCoordenadas } from "@/lib/data";

export default async function TransfersPage() {
  const almacenes = await getAlmacenes();
  const productos = await getProductos();
  const coordenadas = await getCoordenadas();

  return <TransferForm almacenes={almacenes} productos={productos} coordenadas={coordenadas} />;
}
