import { Customers } from "@/components/customers";
import { getClientes } from "@/lib/data";

export default async function CustomersPage() {
  const customers = await getClientes();
  return (
    <Customers initialCustomers={customers} />
  );
}
