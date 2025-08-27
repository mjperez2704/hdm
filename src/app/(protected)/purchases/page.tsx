import { Purchases } from "@/components/purchases";
import { getPurchases, getProveedores, getAlmacenes, getCoordenada, getProductos } from "@/lib/data";

export default async function PurchasesPage() {
  const purchases = await getPurchases();
  const providers = await getProveedores();
  const almacenes = await getAlmacenes();
  const coordenadas = await getCoordenada();
  const productos = await getProductos();
  
  return (
    <Purchases 
        initialPurchases={purchases} 
        initialProviders={providers}
        almacenes={almacenes}
        coordenadas={coordenadas}
        productos={productos}
    />
  );
}
