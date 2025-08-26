import { Dashboard } from "@/components/dashboard";
import { getVentas, getGastos, getClientes, getProductos, getCoordenadas, getOrdenesServicio, getMarcas } from "@/lib/data";
import type { ProductoConStock } from "@/lib/types";

export default async function DashboardPage() {
  const ventas = await getVentas();
  const gastos = await getGastos();
  const clientes = await getClientes();
  const productos = await getProductos();
  const coordenadas = await getCoordenadas();
  const ordenesServicio = await getOrdenesServicio();
  const marcas = await getMarcas();

  const productsWithStock: ProductoConStock[] = productos.map(producto => {
    const stock = coordenadas
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
