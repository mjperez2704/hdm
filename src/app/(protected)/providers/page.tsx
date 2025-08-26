import { Providers } from "@/components/providers";
import { getProveedores } from "@/lib/data";

export default async function ProvidersPage() {
  const providers = await getProveedores();
  return (
    <Providers initialProviders={providers} />
  );
}
