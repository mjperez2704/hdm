
import { Dashboard } from "@/components/dashboard";
import { getProductos, getCoordenadas, getAlmacenes, getVentas, getGastos, getClientes, getOrdenesServicio, getMarcas } from "@/lib/data";
import type { ProductoConStock } from "@/lib/types";

export default async function InventoryPage() {
  const [
    inventoryData, 
    coordenadasData, 
    almacenesData, 
    ventas, 
    gastos, 
    clientes, 
    ordenesServicio, 
    marcas
  ] = await Promise.all([
    getProductos(),
    getCoordenadas(),
    getAlmacenes(),
    getVentas(),
    getGastos(),
    getClientes(),
    getOrdenesServicio(),
    getMarcas()
  ]);

  // Calcular el stock total para cada producto
  const productsWithStock: ProductoConStock[] = inventoryData.map(producto => {
    const stock = coordenadasData
      .filter(coordenada => coordenada.producto_id === producto.id)
      .reduce((acc, coordenada) => acc + coordenada.cantidad, 0);
    return { ...producto, stock };
  });

  return (
    <Dashboard
      ventas={ventas}
      gastos={gastos}
      clientes={clientes}
      productos={productsWithStock}
      ordenesServicio={ordenesServicio}
      marcas={marcas}
    />
  );
}
