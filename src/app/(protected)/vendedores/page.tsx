import { Vendedores } from "@/components/vendedores";
import { getEmpleados, getUsuarios } from "@/lib/data";

export default async function VendedoresPage() {
  const employees = await getEmpleados();
  const users = await getUsuarios();
  return (
    <Vendedores initialVendedores={employees} systemUsers={users} />
  );
}
