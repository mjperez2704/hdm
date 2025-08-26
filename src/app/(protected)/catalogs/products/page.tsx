import { ProductCatalog } from "@/components/product-catalog";
import { getProductos, getProveedores, getMarcas, getCoordenadas } from "@/lib/data";
import type { ProductoConStock } from "@/lib/types";

export default async function ProductsCatalogPage() {
  const products = await getProductos();
  const providers = await getProveedores();
  const brands = await getMarcas();
  const coordenadas = await getCoordenadas();

  // Similar to dashboard, we calculate stock for AI suggestions
  const productsWithStock: ProductoConStock[] = products.map(producto => {
    const stock = coordenadas
      .filter(coordenada => coordenada.producto_id === producto.id)
      .reduce((acc, coordenada) => acc + coordenada.cantidad, 0);
    return { ...producto, stock };
  });
  
  return (
    <ProductCatalog 
      initialProducts={productsWithStock} 
      providers={providers}
      brands={brands}
    />
  );
}
