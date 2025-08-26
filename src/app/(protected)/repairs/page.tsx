import { Repairs } from "@/components/repairs";
import { getClientes, getMarcas, getModelos, getOrdenesServicio } from "@/lib/data";
import type { OrdenServicio, Cliente, Marca, Modelo } from "@/lib/types";

export default async function RepairsPage() {
  const serviceOrders = await getOrdenesServicio();
  const clients = await getClientes();
  const brands = await getMarcas();
  const models = await getModelos();

  return (
    <Repairs 
      initialServiceOrders={serviceOrders}
      clients={clients}
      brands={brands}
      models={models}
    />
  );
}
