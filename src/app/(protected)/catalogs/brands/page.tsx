import { BrandsManager } from "@/components/brands-manager";
import { getMarcas, getModelos } from "@/lib/data";

export default async function BrandsCatalogPage() {
  const brands = await getMarcas();
  const models = await getModelos();

  return (
    <BrandsManager initialBrands={brands} initialModels={models} />
  );
}
